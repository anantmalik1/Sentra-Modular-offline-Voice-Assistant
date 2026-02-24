import speech_recognition as sr
import pyttsx3

# Initialize speech engine once
engine = pyttsx3.init()
engine.setProperty('rate', 170)   # speaking speed
engine.setProperty('volume', 1)   # max volume


def speak(text):
    print("Sentra:", text)
    engine.say(text)
    engine.runAndWait()


def take_command():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        audio = recognizer.listen(source)

    try:
        command = recognizer.recognize_google(audio)
        print("You:", command)
        return command.lower()

    except sr.UnknownValueError:
        return ""

    except sr.RequestError:
        speak("Speech service is unavailable")
        return ""