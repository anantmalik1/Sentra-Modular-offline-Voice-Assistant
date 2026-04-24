import smtplib
from email.mime.text import MIMEText
from voice import speak
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# 🔐 CONFIG
EMAIL = "anantmalik124@gmail.com"
PASSWORD = "eqcq ucnp zfss yswl"  # ⚠️ yaha app password daalo

# 🔐 Mistral API
api_key = "mistral-2y4WEa1BPzA8vovhKsbDY3eiLnXf20oz"
client = MistralClient(api_key=api_key)


def generate_email(prompt):

    response = client.chat(
        model="mistral-small",
        messages=[ChatMessage(role="user", content=f"Write a professional email: {prompt}")]
    )

    return response.choices[0].message.content


def send_email(task):
    try:
        # ✅ correct keys
        to_email = task.get("email")
        message = task.get("message")

        if not to_email or not message:
            speak("Email or message missing")
            return

        # 🔥 AI generate email
        ai_message = generate_email(message)

        msg = MIMEText(ai_message)
        msg["Subject"] = "AI Generated Email"
        msg["From"] = EMAIL
        msg["To"] = to_email

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, to_email, msg.as_string())
        server.quit()

        speak("Email sent successfully")

    except Exception as e:
        print(e)
        speak("Failed to send email")