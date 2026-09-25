import smtplib
import os
from email.mime.text import MIMEText
from dotenv import load_dotenv
from voice import speak

load_dotenv()

EMAIL = os.getenv("EMAIL_USER", "")
PASSWORD = os.getenv("EMAIL_PASS", "")

def generate_email_text(prompt):
    """Generate professional email draft using Mistral if available or clean template."""
    api_key = os.getenv("MISTRAL_API_KEY", "")
    if api_key:
        try:
            from mistralai.client import Mistral
            client = Mistral(api_key=api_key)
            model_name = os.getenv("MISTRAL_MODEL", "mistral-small-latest")
            resp = client.chat.complete(
                model=model_name,
                messages=[{"role": "user", "content": f"Write a concise professional email body for: {prompt}. Output body text only."}]
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            print(f"Mistral email generation error: {e}")

    return f"Hello,\n\nI am contacting you regarding: {prompt}.\n\nBest regards,\nSentra AI"


def send_email(task):
    """
    Send email via SMTP with credentials loaded from environment variables.
    """
    to_email = task.get("email") or task.get("to")
    message = task.get("message") or task.get("body") or task.get("content")

    if not to_email:
        speak("Recipient email address is missing.")
        return {
            "success": False,
            "message": "Recipient email address is missing."
        }

    if not EMAIL or not PASSWORD:
        msg = "Email service credentials not configured in .env file."
        speak(msg)
        return {
            "success": False,
            "message": msg,
            "error": "EMAIL_USER or EMAIL_PASS not set"
        }

    try:
        email_body = generate_email_text(message or "Sentra notification")
        msg = MIMEText(email_body)
        msg["Subject"] = task.get("subject", "Message from Sentra AI")
        msg["From"] = EMAIL
        msg["To"] = to_email

        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, to_email, msg.as_string())
        server.quit()

        success_msg = f"Email sent successfully to {to_email}"
        speak(success_msg)
        return {
            "success": True,
            "message": success_msg,
            "to": to_email,
            "body": email_body
        }

    except Exception as e:
        err_msg = f"Failed to send email: {str(e)}"
        print(err_msg)
        speak("Failed to send email")
        return {
            "success": False,
            "message": "Failed to send email",
            "error": str(e)
        }