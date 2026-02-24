from voice import take_command, speak
from actions import tell_time
import webbrowser
import os


def run_sentra():

    speak("Sentra is online")

    while True:
        print("Listening...")
        command = take_command()

        if not command:
            continue

        command = command.lower().strip()
        print("User:", command)

        # -------------------------
        # OPEN ANY APP / WEBSITE
        # -------------------------
        if "open" in command:

            app_name = command.replace("open", "").strip()

            if not app_name:
                speak("Please tell me what to open")
                continue

            speak(f"Opening {app_name}")

            # 🌐 Websites
            websites = [
                "youtube",
                "linkedin",
                "instagram",
                "facebook",
                "amazon",
                "netflix",
                "twitter",
                "github"
            ]

            if app_name in websites:
                webbrowser.open(f"https://www.{app_name}.com")

            elif app_name == "whatsapp":
                webbrowser.open("https://web.whatsapp.com")

            # 💻 System apps
            elif app_name in ["chrome", "calc", "calculator", "notepad"]:
                if app_name == "calculator":
                    os.system("calc")
                else:
                    os.system(f"start {app_name}")

            else:
                speak("I don't know that application yet")

        # -------------------------
        # PLAY SONG ON YOUTUBE
        # -------------------------
        elif "play" in command or "song" in command:

            search_query = command.replace("play", "").strip()
            speak(f"Playing {search_query}")
            webbrowser.open(
                f"https://www.youtube.com/results?search_query={search_query}"
            )

        # -------------------------
        # TIME
        # -------------------------
        elif "time" in command:
            tell_time()

        # -------------------------
        # EXIT
        # -------------------------
        elif "exit" in command or "stop" in command:
            speak("Goodbye Anant")
            break

        else:
            speak("I did not understand")


if __name__ == "__main__":
    run_sentra()