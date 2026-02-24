import json
import datetime
import pywhatkit
import os
import webbrowser
import pyautogui
import time
from voice import speak
import webbrowser
from voice import speak


def open_app(app_name):

    app_name = app_name.lower()
     
    # 📱 WhatsApp
    if "whatsapp" in app_name:
        speak("Opening WhatsApp")
        os.system("start whatsapp:")

    # 🎬 YouTube
    elif "youtube" in app_name:
        speak("Opening YouTube")
        webbrowser.open("https://www.youtube.com")

    # 🌐 Chrome
    elif "chrome" in app_name:
        speak("Opening Google Chrome")
        os.system("start chrome")

    # 🌐 Edge
    elif "edge" in app_name:
        speak("Opening Microsoft Edge")
        os.system("start msedge")

    # 💻 VS Code
    elif "code" in app_name or "vs code" in app_name:
        speak("Opening Visual Studio Code")
        os.system("code")

    # 📝 Notepad
    elif "notepad" in app_name:
        speak("Opening Notepad")
        os.system("notepad")

    # 🧮 Calculator
    elif "calculator" in app_name or "calc" in app_name:
        speak("Opening Calculator")
        os.system("calc")

    # 🎵 Spotify
    elif "spotify" in app_name:
        speak("Opening Spotify")
        os.system("start spotify:")

    # 📁 File Explorer
    elif "file" in app_name or "explorer" in app_name:
        speak("Opening File Explorer")
        os.system("explorer")

    # 📧 Gmail
    elif "gmail" in app_name:
        speak("Opening Gmail")
        webbrowser.open("https://mail.google.com")

    elif "linkedin" in app_name:
        speak("Opening LinkedIn")
        webbrowser.open("https://www.linkedin.com")


    # 🤖 ChatGPT
    elif "chatgpt" in app_name:
        speak("Opening ChatGPT")
        webbrowser.open("https://chat.openai.com")

    # ⚙ Settings
    elif "settings" in app_name:
        speak("Opening Settings")
        os.system("start ms-settings:")

    # 📷 Camera
    elif "camera" in app_name:
        speak("Opening Camera")
        os.system("start microsoft.windows.camera:")

    else:
        speak("I don't know that app yet")


# 🔹 Tell Time
def tell_time():
    time_now = datetime.datetime.now().strftime("%I:%M %p")
    speak(f"The time is {time_now}")


# 🔹 Open Apps
import webbrowser
import urllib.parse
from voice import speak


def open_app(command):

    # 🎵 YouTube Song Play Mode
    if "youtube" in command or "gana" in command or "song" in command:

        # Extract song name
        song_name = command.replace("youtube", "")
        song_name = song_name.replace("gana", "")
        song_name = song_name.replace("song", "")
        song_name = song_name.replace("chalao", "")
        song_name = song_name.strip()

        if song_name == "":
            speak("Which song should I play?")
            return

        speak(f"Playing {song_name} on YouTube")

        query = urllib.parse.quote(song_name)
        url = f"https://www.youtube.com/results?search_query={query}"

        webbrowser.open(url)

    # 🌐 Google
    elif "google" in command:
        webbrowser.open("https://google.com")
        speak("Opening Google")

    # 📝 Notepad
    elif "notepad" in command:
        import os
        os.system("notepad")
        speak("Opening Notepad")

    else:
        speak("I don't know that app yet")
# 🔹 Send WhatsApp Message
import pyautogui
import time
import os
import json
from voice import speak


def send_message(command):

    try:
        with open("contacts.json", "r") as f:
            contacts = json.load(f)
    except:
        speak("Contacts file not found")
        return

    # 🔹 Find contact
    name_found = None
    for name in contacts:
        if name.lower() in command.lower():
            name_found = name
            break

    if not name_found:
        speak("I don't know that contact")
        return

    # 🔹 Extract message
    message = None

    if "ki" in command:
        message = command.split("ki", 1)[1].strip()

    elif "karo" in command:
        message = command.split("karo", 1)[1].strip()

    elif "bhejo" in command:
        message = command.split("bhejo", 1)[1].strip()

    if not message:
        speak("What message should I send?")
        return

    speak(f"Sending message to {name_found}")

    # 🔥 Open WhatsApp Desktop
    os.system("start whatsapp:")
    time.sleep(5)

    # 🔥 Search contact
    pyautogui.hotkey("ctrl", "f")
    time.sleep(1)

    pyautogui.write(name_found)
    time.sleep(2)

    pyautogui.press("enter")
    time.sleep(2)

    # 🔥 Type message
    pyautogui.write(message)
    time.sleep(1)

    pyautogui.press("enter")
import webbrowser
import urllib.parse
from voice import speak


def play_youtube(task):
    query = task.get("query", "")

    if not query:
        speak("What should I play?")
        return

    speak(f"Playing {query} on YouTube")

    url = "https://www.youtube.com/results?search_query=" + urllib.parse.quote(query)
    webbrowser.open(url)