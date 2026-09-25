import os
import shutil
import subprocess
import webbrowser
import datetime
import urllib.parse
from voice import speak

def tell_time():
    """Returns current formatted time and speaks it."""
    current_time = datetime.datetime.now().strftime("%I:%M %p")
    msg = f"The time is {current_time}"
    speak(msg)
    return {
        "success": True,
        "action": "tell_time",
        "time": current_time,
        "message": msg
    }


def play_youtube(song):
    """Search and play query directly on YouTube."""
    if not song or not song.strip():
        song = "relaxing ambient music"
    song_clean = song.strip()
    encoded_query = urllib.parse.quote_plus(song_clean)
    url = f"https://www.youtube.com/results?search_query={encoded_query}"
    
    speak(f"Playing {song_clean} on YouTube")
    webbrowser.open(url)
    
    return {
        "success": True,
        "action": "play_youtube",
        "song": song_clean,
        "url": url,
        "message": f"Opened YouTube search for '{song_clean}'"
    }


def open_app(app_name):
    """
    Open system apps, popular websites, or local executables with dynamic resolution.
    Avoids brittle absolute hardcoded user paths.
    """
    if not app_name:
        return {"success": False, "message": "No application specified"}

    app = app_name.lower().strip()
    speak(f"Opening {app}")

    # 1. Web shortcuts
    web_shortcuts = {
        "youtube": "https://www.youtube.com",
        "instagram": "https://www.instagram.com",
        "linkedin": "https://www.linkedin.com",
        "google": "https://www.google.com",
        "github": "https://www.github.com",
        "twitter": "https://twitter.com",
        "x": "https://x.com",
        "reddit": "https://reddit.com"
    }
    if app in web_shortcuts:
        webbrowser.open(web_shortcuts[app])
        return {"success": True, "action": "open_app", "target": web_shortcuts[app], "message": f"Opened {app} in browser"}

    # 2. Native Windows commands & URIs
    native_apps = {
        "calculator": "calc",
        "calc": "calc",
        "notepad": "notepad",
        "cmd": "start cmd",
        "terminal": "wt",
        "explorer": "explorer",
        "whatsapp": "start whatsapp:",
        "spotify": "start spotify:"
    }

    if app in native_apps:
        try:
            os.system(native_apps[app])
            return {"success": True, "action": "open_app", "target": native_apps[app], "message": f"Launched {app}"}
        except Exception as e:
            return {"success": False, "error": str(e), "message": f"Failed to launch {app}"}

    # 3. Dynamic browser detection
    if "chrome" in app:
        chrome_path = shutil.which("chrome") or shutil.which("google-chrome")
        if chrome_path:
            subprocess.Popen([chrome_path])
            return {"success": True, "action": "open_app", "target": "chrome", "message": "Launched Google Chrome"}
        else:
            os.system("start chrome")
            return {"success": True, "action": "open_app", "target": "chrome", "message": "Launched Chrome"}

    if "edge" in app:
        os.system("start msedge")
        return {"success": True, "action": "open_app", "target": "msedge", "message": "Launched Microsoft Edge"}

    if "vscode" in app or "vs code" in app or "code" in app:
        code_bin = shutil.which("code")
        if code_bin:
            subprocess.Popen([code_bin], shell=True)
            return {"success": True, "action": "open_app", "target": "vscode", "message": "Launched VS Code"}
        else:
            # Try standard AppData
            app_data_code = os.path.expandvars(r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe")
            if os.path.exists(app_data_code):
                subprocess.Popen([app_data_code])
                return {"success": True, "action": "open_app", "target": "vscode", "message": "Launched VS Code"}
            os.system("start code")
            return {"success": True, "action": "open_app", "target": "vscode", "message": "Initiated VS Code launch"}

    # 4. Fallback: Search on Google or start query
    search_url = f"https://www.google.com/search?q={urllib.parse.quote_plus(app)}"
    webbrowser.open(search_url)
    return {
        "success": True,
        "action": "open_app_fallback",
        "target": search_url,
        "message": f"Searched for '{app}' in browser"
    }


def execute_system_action(action):
    """Execute local system actions like volume, mute, lock."""
    action = action.lower().strip()
    try:
        if "lock" in action:
            import ctypes
            ctypes.windll.user32.LockWorkStation()
            msg = "System workstation locked"
            speak(msg)
            return {"success": True, "action": action, "message": msg}
        elif "volume" in action or "mute" in action:
            # Using pyautogui volume keys if available
            import pyautogui
            if "up" in action:
                pyautogui.press("volumeup", presses=5)
                msg = "Volume increased"
            elif "down" in action:
                pyautogui.press("volumedown", presses=5)
                msg = "Volume decreased"
            elif "mute" in action:
                pyautogui.press("volumemute")
                msg = "Volume muted/unmuted"
            else:
                msg = "Volume adjusted"
            return {"success": True, "action": action, "message": msg}
        return {"success": False, "message": f"Unknown system action: {action}"}
    except Exception as e:
        return {"success": False, "error": str(e), "message": f"Failed system action: {action}"}