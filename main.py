import threading
import time

from voice import take_command, speak
from ai_brain import analyze_command
from router import route_task
from normalizer import normalize_command

try:
    from sentra_animation import start_sentra_ui, set_state
    UI_ENABLED = True
except:
    UI_ENABLED = False


def run_sentra():

    # ============================
    # 🔥 START UI (SAFE THREAD)
    # ============================
    if UI_ENABLED:
        try:
            threading.Thread(target=start_sentra_ui, daemon=True).start()
            set_state("online")
        except:
            print("UI failed, running without UI")

    speak("Sentra is online")

    # ============================
    # 🔁 MAIN LOOP
    # ============================
    while True:

        try:
            # 🟢 LISTENING STATE
            if UI_ENABLED:
                set_state("listening")

            raw_command = take_command()

            # 🔥 avoid freeze
            if not raw_command:
                time.sleep(0.5)
                continue

            command = normalize_command(raw_command)
            print("User:", command)

            # 🟣 THINKING
            if UI_ENABLED:
                set_state("thinking")

            task = analyze_command(command)
            print("AI Task:", task)

            # 🔷 EXECUTE
            if UI_ENABLED:
                set_state("speaking")

            route_task(task)

            # 🟦 BACK ONLINE
            if UI_ENABLED:
                set_state("online")

        except Exception as e:
            import traceback
            print("🔥 FULL ERROR:")
            traceback.print_exc()

            speak("Error aa gaya")

            if UI_ENABLED:
                set_state("online")

            time.sleep(1)


# ============================
# 🚀 ENTRY POINT
# ============================
if __name__ == "__main__":
    run_sentra()