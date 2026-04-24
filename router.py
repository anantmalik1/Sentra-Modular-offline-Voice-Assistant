from actions import open_app, play_youtube, tell_time
from browser_control import search_google
from voice import speak
from memory import remember, recall
from agent_executor import run_agent
from email_sender import send_email
from scheduler import create_meeting
from smart_search import get_google_answer
from code_writer import write_python_code

def route_task(task):

    intent = task.get("intent")

    # ============================
    # 🧠 MEMORY STORE
    # ============================
    if intent == "remember":
        remember(task.get("key"), task.get("value"))
        speak("I will remember that")

    # ============================
    # 🧠 MEMORY RECALL
    # ============================
    elif intent == "recall":
        value = recall(task.get("key"))
        if value:
            speak(f"I remember: {value}")
        else:
            speak("I don't remember anything")

    # ============================
    # 🤖 AGENT TASK
    # ============================
    elif intent == "agent_task":
        speak("Starting smart agent task")
        run_agent(task)

    # ============================
    # 🌐 SEARCH
    # ============================
    elif intent == "search":
        query = task.get("query")
        if query:
            speak(f"Searching for {query}")
            search_google(query)
        else:
            speak("What should I search?")

    # ============================
    # 📂 OPEN APP
    # ============================
    elif intent == "open_app":
        app = task.get("app")
        if app:
            speak(f"Opening {app}")
            open_app(app)
        else:
            speak("Which app should I open?")

    # ============================
    # 🎵 PLAY YOUTUBE
    # ============================
    elif intent == "play_youtube":
        song = task.get("song")
        if song:
            speak(f"Playing {song}")
            play_youtube(song)
        else:
            speak("Which song should I play?")

    # ============================
    # ⏰ TIME
    # ============================
    elif intent == "tell_time":
        tell_time()

    # ============================
    # 📧 EMAIL
    # ============================
    elif intent == "send_email":
        speak("Sending email")
        send_email(task)

    # ============================
    # 📅 SCHEDULE
    # ============================
    elif intent == "schedule":
        speak("Scheduling your meeting")

        result = create_meeting(
            task.get("title", "Meeting"),
            task.get("time", "2026-04-05 10:00")
        )

        speak(result)

    # ============================
    # 💻 WRITE CODE IN VS CODE
    # ============================
    elif intent == "write_code":
        prompt = task.get("prompt")

        if prompt:
            speak("Writing code in VS Code")
            write_python_code(prompt)
        else:
            speak("What code should I write?")

    # ============================
    # 🤖 CHAT → 🔥 GOOGLE + VOICE
    # ============================
    elif intent == "chat":
        message = task.get("message")

        if message:
            speak("Searching on Google")

            # 🔥 answer fetch
            answer = get_google_answer(message)

            speak(answer)

            # 🔥 open browser
            search_google(message)
        else:
            speak("Say something")

    # ============================
    # ❌ UNKNOWN → SEARCH
    # ============================
    else:
        query = task.get("message", "")

        if query:
            speak("Searching on Google")
            search_google(query)
        else:
            speak("I did not understand the command")
    
        if 'answer' in locals():
          print("ANSWER:", answer)
    
   