import os
import threading
import time
from dotenv import load_dotenv

load_dotenv()


# =========================================================
# OPTIONAL DEPENDENCIES
# =========================================================

has_sr = False
has_tts = False

try:
    import speech_recognition as sr
    has_sr = True
except ImportError:
    sr = None
    print("⚠️ SpeechRecognition is not installed.")


try:
    import pyttsx3
    has_tts = True
except ImportError:
    pyttsx3 = None
    print("⚠️ pyttsx3 is not installed.")


# =========================================================
# TEXT TO SPEECH
# =========================================================

engine = None
_tts_lock = threading.Lock()


def initialize_tts():
    """Initialize pyttsx3 safely."""

    global engine

    if not has_tts:
        return False

    try:
        engine = pyttsx3.init()

        # Speech speed
        rate = int(os.getenv("SPEECH_RATE", "170"))
        engine.setProperty("rate", rate)

        # Volume
        volume = float(os.getenv("SPEECH_VOLUME", "1.0"))
        engine.setProperty("volume", volume)

        # Select first available voice
        voices = engine.getProperty("voices")

        if voices:
            preferred_voice = os.getenv("TTS_VOICE", "").strip()

            if preferred_voice:
                for voice in voices:
                    if preferred_voice.lower() in str(voice.id).lower():
                        engine.setProperty("voice", voice.id)
                        break
            else:
                engine.setProperty("voice", voices[0].id)

        try:
            print("[Sentra Voice] TTS: READY")
        except Exception:
            pass
        return True

    except Exception as e:
        try:
            print(f"[Sentra Voice] TTS initialization warning: {e}")
        except Exception:
            pass
        engine = None
        return False


initialize_tts()


def speak(text):
    """
    Non-blocking text-to-speech.
    SENTRA can continue processing while speech plays.
    """

    if not text:
        return

    clean_text = str(text).strip()

    if not clean_text:
        return

    try:
        print(f"[SENTRA Voice] {clean_text}")
    except Exception:
        pass

    if not engine:
        return

    def _speak_worker():
        with _tts_lock:
            try:
                engine.stop()

                # Prevent extremely long speech
                speech_text = clean_text[:500]

                engine.say(speech_text)
                engine.runAndWait()

            except Exception as e:
                try:
                    print(f"[Sentra Voice] TTS error: {e}")
                except Exception:
                    pass

    threading.Thread(
        target=_speak_worker,
        daemon=True
    ).start()


def speak_sync(text):
    """
    Synchronous TTS.
    Use this when SENTRA must finish speaking before continuing.
    """

    if not text:
        return

    clean_text = str(text).strip()

    try:
        print(f"[SENTRA Voice] {clean_text}")
    except Exception:
        pass

    if not engine:
        return

    with _tts_lock:
        try:
            engine.stop()
            engine.say(clean_text[:500])
            engine.runAndWait()

        except Exception as e:
            print(f"⚠️ TTS sync error: {e}")


# =========================================================
# SPEECH RECOGNITION
# =========================================================

recognizer = None

if has_sr:

    recognizer = sr.Recognizer()

    # Initial energy threshold
    recognizer.energy_threshold = int(
        os.getenv("MIC_ENERGY_THRESHOLD", "300")
    )

    # Automatically adapt to background noise
    recognizer.dynamic_energy_threshold = True

    # How aggressively it adapts
    recognizer.dynamic_energy_adjustment_damping = 0.15

    # Minimum non-speaking audio before threshold changes
    recognizer.dynamic_energy_adjustment_ratio = 1.5

    # Pause after speech
    recognizer.pause_threshold = 0.8

    # Minimum audio considered speech
    recognizer.phrase_threshold = 0.3

    # Amount of silence to keep around speech
    recognizer.non_speaking_duration = 0.5


# =========================================================
# MICROPHONE FUNCTIONS
# =========================================================

def list_microphones():
    """
    Display all microphones available on the system.
    Useful for debugging microphone problems.
    """

    if not has_sr:
        print("❌ SpeechRecognition is not installed.")
        return []

    try:
        microphones = sr.Microphone.list_microphone_names()

        print("\n🎤 AVAILABLE MICROPHONES")
        print("-" * 50)

        for index, name in enumerate(microphones):
            print(f"[{index}] {name}")

        print("-" * 50)

        return microphones

    except Exception as e:
        print(f"❌ Could not list microphones: {e}")
        return []


def get_default_microphone():
    """
    Select microphone.

    Priority:
    1. DEFAULT_MIC_INDEX from .env
    2. Windows default microphone
    3. Search for likely microphone names
    """

    if not has_sr:
        return None

    # -----------------------------------------------------
    # 1. User configured microphone index
    # -----------------------------------------------------

    configured_index = os.getenv(
        "DEFAULT_MIC_INDEX",
        ""
    ).strip()

    if configured_index.isdigit():

        index = int(configured_index)

        try:
            microphones = sr.Microphone.list_microphone_names()

            if 0 <= index < len(microphones):

                print(
                    f"🎤 Using configured microphone "
                    f"[{index}]: {microphones[index]}"
                )

                return sr.Microphone(
                    device_index=index
                )

            else:
                print(
                    f"⚠️ DEFAULT_MIC_INDEX {index} "
                    f"is outside available microphone list."
                )

        except Exception as e:
            print(f"⚠️ Configured microphone error: {e}")

    # -----------------------------------------------------
    # 2. Windows/system default microphone
    # -----------------------------------------------------

    try:

        mic = sr.Microphone()

        print("🎤 Using Windows default microphone.")

        return mic

    except Exception as e:

        print(
            f"⚠️ Default microphone unavailable: {e}"
        )

    # -----------------------------------------------------
    # 3. Search available microphones
    # -----------------------------------------------------

    try:

        microphones = sr.Microphone.list_microphone_names()

        keywords = [
            "microphone",
            "mic",
            "input",
            "array",
            "headset",
            "headphone"
        ]

        for index, name in enumerate(microphones):

            name_lower = name.lower()

            if any(
                keyword in name_lower
                for keyword in keywords
            ):

                print(
                    f"🎤 Found microphone "
                    f"[{index}]: {name}"
                )

                return sr.Microphone(
                    device_index=index
                )

    except Exception as e:

        print(
            f"⚠️ Microphone search failed: {e}"
        )

    return None


# =========================================================
# MICROPHONE TEST
# =========================================================

def test_microphone():
    """
    Test microphone availability without performing speech recognition.
    """

    if not has_sr:
        print("❌ SpeechRecognition not installed.")
        return False

    mic = get_default_microphone()

    if mic is None:
        print("❌ No microphone found.")
        return False

    try:

        with mic as source:

            print("\n🎤 MICROPHONE TEST")
            print("Speak something for 3 seconds...")

            recognizer.adjust_for_ambient_noise(
                source,
                duration=1
            )

            audio = recognizer.listen(
                source,
                timeout=5,
                phrase_time_limit=3
            )

        if audio:

            print("✅ Microphone captured audio.")
            return True

    except sr.WaitTimeoutError:

        print("⚠️ No speech detected.")

    except Exception as e:

        print(f"❌ Microphone test failed: {e}")

    return False


# =========================================================
# SPEECH TO TEXT
# =========================================================

def take_command():
    """
    Capture voice from microphone and convert it to text.

    Uses Google Speech Recognition.
    Internet connection is required for STT.

    Returns:
        str: recognized command
        "" : if speech was not recognized
    """

    if not has_sr:

        print(
            "❌ SpeechRecognition is not installed."
        )

        return ""

    if recognizer is None:

        print(
            "❌ Speech recognizer is not initialized."
        )

        return ""

    mic = get_default_microphone()

    if mic is None:

        print(
            "❌ No microphone available."
        )

        return ""

    try:

        with mic as source:

            print("\n" + "=" * 55)
            print("🎤 SENTRA IS LISTENING...")
            print("🗣️ Speak your command now")
            print("=" * 55)

            # ------------------------------------------------
            # Ambient noise calibration
            # ------------------------------------------------

            calibration_time = float(
                os.getenv(
                    "MIC_CALIBRATION_TIME",
                    "0.8"
                )
            )

            print(
                f"🔧 Calibrating microphone "
                f"({calibration_time}s)..."
            )

            recognizer.adjust_for_ambient_noise(
                source,
                duration=calibration_time
            )

            print(
                f"🎚️ Energy threshold: "
                f"{recognizer.energy_threshold:.0f}"
            )

            # ------------------------------------------------
            # Listen
            # ------------------------------------------------

            timeout = float(
                os.getenv(
                    "MIC_TIMEOUT",
                    "6"
                )
            )

            phrase_limit = float(
                os.getenv(
                    "MIC_PHRASE_LIMIT",
                    "10"
                )
            )

            print("🎤 Listening for speech...")

            audio = recognizer.listen(
                source,
                timeout=timeout,
                phrase_time_limit=phrase_limit
            )

        print("\n🧠 Processing your voice...")

        # ----------------------------------------------------
        # Language
        # ----------------------------------------------------

        language = os.getenv(
            "LANGUAGE",
            "en-IN"
        ).strip()

        print(
            f"🌐 Recognition language: {language}"
        )

        # ----------------------------------------------------
        # Google Speech Recognition
        # ----------------------------------------------------

        command = recognizer.recognize_google(
            audio,
            language=language
        )

        command = str(command).strip()

        if not command:

            print(
                "⚠️ Empty voice command."
            )

            return ""

        print(
            f"🗣️ YOU SAID: {command}"
        )

        return command.lower()

    # ========================================================
    # TIMEOUT
    # ========================================================

    except sr.WaitTimeoutError:

        print(
            "⏱️ Listening timeout: "
            "No speech detected."
        )

        return ""

    # ========================================================
    # SPEECH NOT UNDERSTOOD
    # ========================================================

    except sr.UnknownValueError:

        print(
            "⚠️ Could not understand the audio."
        )

        return ""

    # ========================================================
    # GOOGLE / INTERNET ERROR
    # ========================================================

    except sr.RequestError as e:

        print(
            f"🌐 Speech recognition service error: {e}"
        )

        return ""

    # ========================================================
    # MICROPHONE ERROR
    # ========================================================

    except OSError as e:

        print(
            f"🎤 Microphone/Audio device error: {e}"
        )

        return ""

    # ========================================================
    # OTHER ERROR
    # ========================================================

    except Exception as e:

        print(
            f"❌ Voice input error: "
            f"{type(e).__name__}: {e}"
        )

        return ""


# =========================================================
# MODULE STATUS
# =========================================================

def get_voice_status():
    """
    Return current voice module status.
    """

    return {
        "speech_recognition": has_sr,
        "tts": has_tts,
        "tts_engine": engine is not None,
        "recognizer": recognizer is not None,
    }


# =========================================================
# DIRECT TEST
# =========================================================

if __name__ == "__main__":

    print("\n")
    print("=" * 60)
    print("        SENTRA VOICE MODULE TEST")
    print("=" * 60)

    print("\n📊 Voice Status:")
    print(get_voice_status())

    print("\n")

    # Show microphones
    list_microphones()

    print("\n")

    # Speak test
    speak_sync(
        "Hello Anant. Sentra voice system is ready."
    )

    time.sleep(1)

    # Listen test
    command = take_command()

    print("\n" + "=" * 60)

    if command:

        print(
            f"✅ SUCCESS! Recognized command: {command}"
        )

    else:

        print(
            "❌ No command was recognized."
        )

    print("=" * 60)