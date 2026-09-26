import os
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def send_whatsapp_async(phone, message):
    try:
        import pywhatkit
        print(f"[SENTRA WhatsApp Sidecar] Sending message to {phone}: '{message}'")
        # sendwhatmsg_instantly opens WhatsApp Web, types message, waits wait_time seconds, presses enter
        pywhatkit.sendwhatmsg_instantly(phone, message, wait_time=15, tab_close=True)
        print(f"[SENTRA WhatsApp Sidecar] Successfully initiated send for {phone}")
    except Exception as e:
        print(f"[SENTRA WhatsApp Sidecar Error] Failed to send via pywhatkit: {e}")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "SENTRA Python WhatsApp Sidecar",
        "version": "1.0.0"
    })

@app.route('/send-whatsapp', methods=['POST'])
def send_whatsapp():
    try:
        data = request.get_json(force=True, silent=True) or {}
        phone = data.get('phone', '').strip()
        message = data.get('message', '').strip()

        if not phone or not message:
            return jsonify({
                "success": False,
                "error": "Missing phone number or message parameter"
            }), 400

        # Launch in background thread so Flask returns immediately to the caller
        worker_thread = threading.Thread(
            target=send_whatsapp_async,
            args=(phone, message),
            daemon=True
        )
        worker_thread.start()

        return jsonify({
            "success": True,
            "message": f"WhatsApp dispatch initiated in background for {phone}"
        }), 200

    except Exception as err:
        return jsonify({
            "success": False,
            "error": str(err)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"[SENTRA WhatsApp Sidecar] Starting Flask server on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=False)
