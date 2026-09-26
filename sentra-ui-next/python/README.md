# SENTRA WhatsApp Python Sidecar

This Python microservice enables SENTRA to execute real WhatsApp Web messaging automation from the desktop application using `pywhatkit`.

## Prerequisites & One-Time Setup

1. **Python 3.10+**: Ensure Python is installed and available in your system PATH (`python --version`).
2. **Install Dependencies**:
   Open a terminal in this directory (`sentra-ui-next/python`) and run:
   ```bash
   pip install -r requirements.txt
   ```
3. **WhatsApp Web Authentication (One-time)**:
   - On the first run, `pywhatkit` will open your default browser to `https://web.whatsapp.com`.
   - Ensure you are already logged in to WhatsApp Web by scanning the QR code with your phone.
   - Once logged in, your session remains persistent in the browser, allowing SENTRA to automatically dispatch future messages.

## API Endpoints

- `GET /health`
  Returns service status: `{"status": "ok"}`
- `POST /send-whatsapp`
  Body: `{"phone": "+91XXXXXXXXXX", "message": "Your text message"}`
  Returns: `{"success": true, "message": "..."}`
