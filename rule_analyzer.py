
def analyze_rule(command):

    command = command.lower()

    if command.startswith("open"):

        app = command.replace("open","").strip()

        return {
            "intent":"open_app",
            "app":app
        }

    elif "send mail" in command or "email" in command:
         return {
        "intent": "send_email",
        "email": "example@gmail.com",
        "message": command.replace("send mail", "").strip()
        }

    if "youtube" in command:

        song = command.replace("youtube","").replace("play","")

        return {
            "intent":"play_youtube",
            "song":song
        }

    if "time" in command:

        return {
            "intent":"tell_time"
        }

    if "search" in command:

        query = command.replace("search","")

        return {
            "intent":"search",
            "query":query
        }

    return {
        "intent":"chat",
        "message":command
    }
