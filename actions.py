import webbrowser
import os
import pyautogui
import time


import datetime
from voice import speak

def tell_time():
    current_time = datetime.datetime.now().strftime("%H:%M")
    speak(f"The time is {current_time}")


# 🌐 OPEN ANY WEBSITE / APP
def open_app(app):

    app = app.lower()

    # COMMON APPS
    if "chrome" in app:
        os.system("start chrome")

    elif "edge" in app:
        os.system("start msedge")

    elif "notepad" in app:
        os.system("start notepad")

    elif "calculator" in app:
        os.system("start calc")

    # 🌍 WEBSITES (AUTO HANDLE)
    else:
        speak(f"Opening {app}")

        if "youtube" in app:
            webbrowser.open("https://www.youtube.com")

        elif "instagram" in app:
            webbrowser.open("https://www.instagram.com")

        elif "linkedin" in app:
            webbrowser.open("https://www.linkedin.com")

        elif "google" in app:
            webbrowser.open("https://www.google.com")

        else:
            # ANY UNKNOWN → GOOGLE SEARCH
            webbrowser.open(f"https://www.google.com/search?q={app}")

import webbrowser
import pyautogui
import time
from voice import speak


def play_youtube(song):

    speak(f"Playing {song}")

    # direct search URL (BEST FIX 🔥)
    query = song.replace(" ", "+")

    url = f"https://www.youtube.com/results?search_query={query}"

    webbrowser.open(url)

    time.sleep(5)

    # first video open
    pyautogui.press("tab")
    pyautogui.press("tab")
    pyautogui.press("enter")
import os
import subprocess

def open_app(app_name):

    app_name = app_name.lower()

    # 🔥 COMMON APPS PATH
    apps = {
        "youtube": "start youtube:",  # opens YouTube app (if PWA)
        "chrome": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "vs code": "C:\\Users\\anant\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe",
        "whatsapp": "start whatsapp:",
        "notepad": "notepad",
        "calculator": "calc"
    }

    try:
        if app_name in apps:

            path = apps[app_name]

            # 🔥 URL based apps
            if path.startswith("start"):
                os.system(path)
            else:
                subprocess.Popen(path)

        else:
            # 🔥 fallback → open via Windows search
            os.system(f"start {app_name}")

    except Exception as e:
        print("App open error:", e)