import os
import json
import urllib.parse
from datetime import datetime

from actions import open_app, play_youtube, tell_time, execute_system_action
from voice import speak
from memory import remember, recall, load_memory
from scheduler import create_meeting
from smart_search import get_google_answer
from code_writer import write_and_run_code

def route_task(task):
    """
    Intelligent router that dispatches tasks to specific modules.
    Always returns a structured JSON dictionary:
    {
       "success": bool,
       "intent": str,
       "message": str,
       "action": str,
       "data": dict,
       "error": str or None
    }
    """
    if not isinstance(task, dict):
        task = {"intent": "chat", "message": str(task)}

    intent = task.get("intent", "chat")
    raw_command = task.get("raw", "")

    # 1. TELL TIME
    if intent == "tell_time":
        res = tell_time()
        return {
            "success": True,
            "intent": intent,
            "action": "tell_time",
            "message": res.get("message", "Checked the time"),
            "data": res
        }

    # 2. OPEN APPLICATION OR WEBSITE
    elif intent == "open_app":
        app = task.get("app") or task.get("target") or "browser"
        res = open_app(app)
        return {
            "success": res.get("success", True),
            "intent": intent,
            "action": "open_app",
            "message": res.get("message", f"Opened {app}"),
            "data": res
        }

    # 3. PLAY YOUTUBE
    elif intent == "play_youtube":
        song = task.get("song") or task.get("query") or "music"
        res = play_youtube(song)
        return {
            "success": True,
            "intent": intent,
            "action": "play_youtube",
            "message": res.get("message", f"Playing {song} on YouTube"),
            "data": res
        }

    # 4. WRITE & EXECUTE CODE / DSA / GAMES
    elif intent == "write_code":
        prompt = task.get("prompt") or raw_command or "addition program"
        language = task.get("language", "python")
        category = task.get("category", "general")
        
        speak(f"Generating {language.upper()} code for {prompt}")
        code_res = write_and_run_code(prompt, language=language, category=category, auto_run=True)
        
        speak_feedback = f"Created {code_res['filename']} in VS Code"
        if code_res.get("executed") and code_res.get("output"):
            speak_feedback += " and executed successfully."
        speak(speak_feedback)

        return {
            "success": True,
            "intent": intent,
            "action": "write_code",
            "message": code_res.get("message", "Generated code"),
            "data": code_res
        }

    # 5. MEMORY - REMEMBER
    elif intent == "remember":
        key = task.get("key", "note")
        val = task.get("value", "")
        if not val and " " in key:
            parts = key.split(" ", 1)
            key, val = parts[0], parts[1]
        remember(key, val)
        msg = f"Saved to memory: {key} is {val}"
        speak("I will remember that")
        return {
            "success": True,
            "intent": intent,
            "action": "remember",
            "message": msg,
            "data": {"key": key, "value": val}
        }

    # 6. MEMORY - RECALL
    elif intent == "recall":
        key = task.get("key", "all")
        if key == "all":
            all_mem = load_memory()
            msg = f"Known memories: {len(all_mem)} items stored."
            speak(msg)
            return {
                "success": True,
                "intent": intent,
                "action": "recall",
                "message": msg,
                "data": {"memory": all_mem}
            }
        val = recall(key)
        msg = f"I remember that {key} is {val}"
        speak(msg)
        return {
            "success": True,
            "intent": intent,
            "action": "recall",
            "message": msg,
            "data": {"key": key, "value": val}
        }

    # 7. WEB SEARCH
    elif intent == "search":
        query = task.get("query") or raw_command or "latest news"
        speak(f"Searching web for {query}")
        answer = get_google_answer(query)
        # Also open in browser
        import webbrowser
        webbrowser.open(f"https://www.google.com/search?q={urllib.parse.quote_plus(query)}")
        if answer and "Sorry" not in answer:
            speak(answer[:150])
        return {
            "success": True,
            "intent": intent,
            "action": "search",
            "message": answer if answer else f"Searched for {query}",
            "data": {"query": query, "answer": answer}
        }

    # 8. SEND EMAIL
    elif intent == "send_email":
        try:
            from email_sender import send_email
            res = send_email(task)
            return {
                "success": res.get("success", False),
                "intent": intent,
                "action": "send_email",
                "message": res.get("message", "Email action finished"),
                "data": res
            }
        except Exception as e:
            return {"success": False, "intent": intent, "message": f"Email error: {e}"}

    # 9. SCHEDULE MEETING
    elif intent == "schedule":
        title = task.get("title", "Quick Reminder")
        time_str = task.get("time", datetime.now().strftime("%Y-%m-%d %H:%M"))
        res = create_meeting(title, time_str)
        speak(res)
        return {
            "success": True,
            "intent": intent,
            "action": "schedule",
            "message": res,
            "data": {"title": title, "time": time_str}
        }

    # 10. SYSTEM ACTIONS (Volume, lock)
    elif intent == "system_action":
        action = task.get("action", "volume_up")
        res = execute_system_action(action)
        return {
            "success": res.get("success", True),
            "intent": intent,
            "action": "system_action",
            "message": res.get("message", f"Executed {action}"),
            "data": res
        }

    # 11. CHAT / GENERAL QUERY
    elif intent == "chat":
        msg = task.get("message") or raw_command or "Hello"
        # Try quick search or greeting
        lower_msg = msg.lower()
        if any(greet in lower_msg for greet in ["hello", "hi", "hey", "namaste"]):
            reply = "Greetings! Sentra AI 2.0 online and ready for commands."
            speak(reply)
            return {
                "success": True,
                "intent": intent,
                "action": "chat",
                "message": reply,
                "data": {"reply": reply}
            }
        
        # Answer with quick web knowledge
        answer = get_google_answer(msg)
        if answer and "Sorry" not in answer and "Error" not in answer:
            speak(answer[:150])
            return {
                "success": True,
                "intent": intent,
                "action": "chat",
                "message": answer,
                "data": {"query": msg, "answer": answer}
            }

        reply = f"Understood: '{msg}'. Searching on Google for more details."
        speak(reply)
        import webbrowser
        webbrowser.open(f"https://www.google.com/search?q={urllib.parse.quote_plus(msg)}")
        return {
            "success": True,
            "intent": intent,
            "action": "chat",
            "message": reply,
            "data": {"query": msg}
        }

    # UNKNOWN INTENT FALLBACK
    default_msg = f"Processed command: {raw_command}"
    return {
        "success": True,
        "intent": "unknown",
        "action": "default",
        "message": default_msg,
        "data": task
    }