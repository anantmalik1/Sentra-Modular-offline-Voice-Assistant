import speech_recognition as sr
import pyttsx3

# 🔊 TTS
engine = pyttsx3.init()
engine.setProperty('rate', 170)

def speak(text):
    if not text or len(text.strip()) == 0:
        print("⚠️ Empty text, not speaking")
        return

    print("Sentra:", text)

    engine.stop()   # 🔥 fix stuck speech
    engine.say(text[:200])  # 🔥 limit length
    engine.runAndWait()


# 🎤 SETUP
recognizer = sr.Recognizer()

# 🔥 IMPORTANT FIX
recognizer.energy_threshold = 300   # 👈 sensitivity
recognizer.dynamic_energy_threshold = True


def take_command():
    try:
        with sr.Microphone(device_index=1) as source:   # 👈 apna mic index
            print("🎤 Listening...")

            recognizer.adjust_for_ambient_noise(source, duration=1)

            print("🎧 Speak now...")
            audio = recognizer.listen(
                source,
                timeout=5,
                phrase_time_limit=5
            )

        print("🧠 Recognizing...")

        command = recognizer.recognize_google(audio, language="en-IN")

        print("You:", command)
        return command.lower()

    except sr.WaitTimeoutError:
        print("⏳ No speech detected")
        return ""

    except sr.UnknownValueError:
        print("❌ Not understood (speak louder)")
        return ""

    except Exception as e:
        print("Error:", e)
        return ""


# 🧪 TEST
if __name__ == "__main__":
    while True:
        cmd = take_command()
        if cmd:
            speak(cmd)