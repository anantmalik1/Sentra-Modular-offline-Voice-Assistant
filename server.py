import os
import time
import logging
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import psutil

# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# SENTRA CORE MODULES
# ============================================================

from ai_brain import analyze_command
from router import route_task
from normalizer import normalize_command
from voice import speak, take_command, has_sr, has_tts
from memory import load_memory


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)

# Allow React/Vite frontend to communicate with Flask backend
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=False
)


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

logger = logging.getLogger("SentraServer")


# ============================================================
# GLOBAL STATE
# ============================================================

COMMAND_HISTORY = []
MAX_HISTORY = 50

# Possible states:
# IDLE
# LISTENING
# PROCESSING
# THINKING
# EXECUTING
# SPEAKING
# ERROR
# OFFLINE

CURRENT_STATE = "IDLE"


def update_state(state):
    """Update Sentra's current system state."""
    global CURRENT_STATE

    CURRENT_STATE = state

    logger.info(
        f"Sentra state changed -> {state}"
    )


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def add_history(command_text, task, result):
    """Store a command execution in history."""

    if not isinstance(task, dict):
        task = {}

    if not isinstance(result, dict):
        result = {
            "success": True,
            "message": str(result)
        }

    history_item = {
        "id": int(time.time() * 1000),
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "command": command_text,
        "intent": task.get("intent", "unknown"),
        "action": result.get("action", "unknown"),
        "status": (
            "SUCCESS"
            if result.get("success", True)
            else "FAILED"
        ),
        "message": result.get("message", ""),
        "data": result.get("data", {})
    }

    COMMAND_HISTORY.insert(0, history_item)

    if len(COMMAND_HISTORY) > MAX_HISTORY:
        COMMAND_HISTORY.pop()

    return history_item


def execute_command_pipeline(command_text):
    """
    Main Sentra pipeline:

    Voice/Text
        ↓
    Normalize
        ↓
    AI Brain
        ↓
    Router
        ↓
    Action
        ↓
    Result
    """

    if not command_text:
        raise ValueError("Empty command")

    # --------------------------------------------------------
    # PROCESSING
    # --------------------------------------------------------

    update_state("PROCESSING")

    normalized_text = normalize_command(command_text)

    logger.info(
        f"Command: {command_text}"
    )

    logger.info(
        f"Normalized: {normalized_text}"
    )

    # --------------------------------------------------------
    # AI THINKING
    # --------------------------------------------------------

    update_state("THINKING")

    task = analyze_command(normalized_text)

    logger.info(
        f"AI Task: {task}"
    )

    # --------------------------------------------------------
    # EXECUTION
    # --------------------------------------------------------

    update_state("EXECUTING")

    result = route_task(task)

    logger.info(
        f"Execution Result: {result}"
    )

    # --------------------------------------------------------
    # HISTORY
    # --------------------------------------------------------

    history_item = add_history(
        command_text,
        task,
        result
    )

    # --------------------------------------------------------
    # IDLE
    # --------------------------------------------------------

    update_state("IDLE")

    return {
        "success": (
            result.get("success", True)
            if isinstance(result, dict)
            else True
        ),
        "command": command_text,
        "normalized_command": normalized_text,
        "intent": (
            task.get("intent")
            if isinstance(task, dict)
            else None
        ),
        "task": task,
        "result": result,
        "state": "IDLE",
        "history_item": history_item
    }


# ============================================================
# 1. ROOT / HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "name": "SENTRA AI 2.0",
        "status": "online",
        "message": "Sentra AI Backend is running successfully.",
        "version": "2.0",
        "backend": "Flask",
        "frontend": "React + Vite",
        "api": {
            "health": "/health",
            "command": "/command",
            "voice_listen": "/voice/listen",
            "voice_speak": "/voice/speak",
            "system_status": "/system/status",
            "history": "/history"
        }
    })


# ============================================================
# 2. HEALTH CHECK
# ============================================================

@app.route("/health", methods=["GET"])
def health_check():

    api_key_present = bool(
        os.getenv("MISTRAL_API_KEY", "").strip()
    )

    return jsonify({
        "status": "online",

        "timestamp": datetime.now().isoformat(),

        "mode": os.getenv(
            "SENTRA_MODE",
            "hybrid"
        ),

        "modules": {

            "ai_brain": (
                "ONLINE"
                if api_key_present
                else "OFFLINE_FALLBACK"
            ),

            "voice_stt": (
                "READY"
                if has_sr
                else "UNAVAILABLE"
            ),

            "voice_tts": (
                "READY"
                if has_tts
                else "UNAVAILABLE"
            ),

            "code_engine": "READY",

            "memory_system": "READY",

            "backend": "CONNECTED"
        },

        "state": CURRENT_STATE
    })


# ============================================================
# 3. SYSTEM STATUS / TELEMETRY
# ============================================================

@app.route("/system/status", methods=["GET"])
def system_status():

    try:

        cpu_usage = psutil.cpu_percent(
            interval=None
        )

        ram_usage = psutil.virtual_memory().percent

    except Exception:

        cpu_usage = 0
        ram_usage = 0

    try:

        memories = load_memory()

        if memories is None:
            memories = []

    except Exception:

        memories = []

    return jsonify({

        "status": "healthy",

        "state": CURRENT_STATE,

        "mode": os.getenv(
            "SENTRA_MODE",
            "hybrid"
        ).upper(),

        "telemetry": {

            "cpu_percent": cpu_usage,

            "ram_percent": ram_usage,

            "stored_memories": len(memories),

            "command_count": len(COMMAND_HISTORY),

            "voice_active": has_sr,

            "tts_available": has_tts
        }
    })


# ============================================================
# 4. TEXT COMMAND
# ============================================================

@app.route("/command", methods=["POST"])
def process_command():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        raw_text = data.get(
            "text",
            ""
        )

        if not isinstance(raw_text, str):
            return jsonify({
                "success": False,
                "message": "Command must be text.",
                "state": "ERROR"
            }), 400

        raw_text = raw_text.strip()

        if not raw_text:

            return jsonify({
                "success": False,
                "message": "Empty command provided.",
                "state": "IDLE"
            }), 400

        logger.info(
            f"Received text command: {raw_text}"
        )

        response = execute_command_pipeline(
            raw_text
        )

        return jsonify(response), 200

    except Exception as e:

        update_state("ERROR")

        logger.exception(
            "Command processing error"
        )

        return jsonify({

            "success": False,

            "message": "Internal error processing command.",

            "error": str(e),

            "state": "ERROR"
        }), 500


# ============================================================
# 5. VOICE LISTEN
# ============================================================

@app.route("/voice/listen", methods=["POST"])
def voice_listen():

    try:

        if not has_sr:

            return jsonify({

                "success": False,

                "message": (
                    "SpeechRecognition is not available."
                ),

                "state": "ERROR"

            }), 503

        # ----------------------------------------------------
        # LISTENING
        # ----------------------------------------------------

        update_state("LISTENING")

        logger.info(
            "Waiting for voice command..."
        )

        command_text = take_command()

        if not command_text:

            update_state("IDLE")

            return jsonify({

                "success": False,

                "message": (
                    "I could not understand the voice command."
                ),

                "state": "IDLE"

            }), 200

        logger.info(
            f"Voice command received: {command_text}"
        )

        # ----------------------------------------------------
        # PROCESS COMMAND
        # ----------------------------------------------------

        response = execute_command_pipeline(
            command_text
        )

        return jsonify({

            "success": response["success"],

            "voice_command": command_text,

            "normalized_command": response[
                "normalized_command"
            ],

            "intent": response["intent"],

            "task": response["task"],

            "result": response["result"],

            "state": "IDLE",

            "history_item": response[
                "history_item"
            ]

        }), 200

    except Exception as e:

        update_state("ERROR")

        logger.exception(
            "Voice processing error"
        )

        return jsonify({

            "success": False,

            "message": "Voice processing failed.",

            "error": str(e),

            "state": "ERROR"

        }), 500


# ============================================================
# 6. TEXT TO SPEECH
# ============================================================

@app.route("/voice/speak", methods=["POST"])
def voice_speak():

    try:

        if not has_tts:

            return jsonify({

                "success": False,

                "message": (
                    "Text-to-speech engine is unavailable."
                )

            }), 503

        data = request.get_json(
            silent=True
        ) or {}

        text = data.get(
            "text",
            ""
        )

        if not isinstance(text, str):

            return jsonify({

                "success": False,

                "message": "Text must be a string."

            }), 400

        text = text.strip()

        if not text:

            return jsonify({

                "success": False,

                "message": "No text provided."

            }), 400

        update_state("SPEAKING")

        speak(text)

        update_state("IDLE")

        return jsonify({

            "success": True,

            "spoken": text,

            "state": "IDLE"

        })

    except Exception as e:

        update_state("ERROR")

        logger.exception(
            "TTS error"
        )

        return jsonify({

            "success": False,

            "error": str(e),

            "state": "ERROR"

        }), 500


# ============================================================
# 7. COMMAND HISTORY - GET
# ============================================================

@app.route("/history", methods=["GET"])
def get_history():

    return jsonify({

        "success": True,

        "count": len(COMMAND_HISTORY),

        "history": COMMAND_HISTORY

    })


# ============================================================
# 8. COMMAND HISTORY - DELETE
# ============================================================

@app.route("/history", methods=["DELETE"])
def clear_history():

    global COMMAND_HISTORY

    COMMAND_HISTORY = []

    return jsonify({

        "success": True,

        "message": "Command history cleared.",

        "count": 0

    })


# ============================================================
# 9. ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({

        "success": False,

        "error": "Endpoint not found.",

        "available_endpoints": [

            "/",

            "/health",

            "/command",

            "/voice/listen",

            "/voice/speak",

            "/system/status",

            "/history"

        ]

    }), 404


@app.errorhandler(500)
def internal_error(error):

    return jsonify({

        "success": False,

        "error": "Internal server error."

    }), 500


# ============================================================
# 10. SERVER START
# ============================================================

if __name__ == "__main__":

    host = os.getenv(
        "SENTRA_HOST",
        "0.0.0.0"
    )

    port = int(
        os.getenv(
            "SENTRA_PORT",
            "5000"
        )
    )

    debug = (
        os.getenv(
            "SENTRA_DEBUG",
            "False"
        ).lower() == "true"
    )

    print()
    print("=" * 60)
    print("             SENTRA AI 2.0")
    print("=" * 60)
    print()
    print("Backend       : Flask")
    print(f"Host          : {host}")
    print(f"Port          : {port}")
    print(f"Mode          : {os.getenv('SENTRA_MODE', 'hybrid')}")
    print()
    print("Health        : http://localhost:5000/health")
    print("System Status : http://localhost:5000/system/status")
    print("Frontend      : http://localhost:5173")
    print()
    print("Voice STT     :", "READY" if has_sr else "UNAVAILABLE")
    print("Voice TTS     :", "READY" if has_tts else "UNAVAILABLE")
    print()
    print("=" * 60)
    print("        SENTRA BACKEND IS READY")
    print("=" * 60)
    print()

    app.run(
        host=host,
        port=port,
        debug=debug,
        threaded=True
    )