import re

def analyze_rule(command):
    """
    High accuracy offline rule-based intent analyzer for Sentra AI 2.0.
    Handles Hinglish, shorthand, common commands, and multi-language code generation offline.
    """
    cmd = command.lower().strip()

    # 1. TIME CHECK
    if any(k in cmd for k in ["tell time", "what is the time", "current time", "tell me time", "samay", "time batao", "what time is it"]) or cmd == "time" or "time" in cmd.split():
        return {"intent": "tell_time"}

    # 2. APPLICATION OPENING
    open_keywords = ["open ", "kholo ", "launch ", "start "]
    for kw in open_keywords:
        if cmd.startswith(kw) or f" {kw}" in cmd:
            parts = cmd.split(kw, 1)
            target = parts[1].strip() if len(parts) > 1 else ""
            if "youtube" in target:
                return {"intent": "open_app", "app": "youtube"}
            if "chrome" in target or "google chrome" in target:
                return {"intent": "open_app", "app": "chrome"}
            if "vs code" in target or "vscode" in target or "code editor" in target:
                return {"intent": "open_app", "app": "vscode"}
            if "notepad" in target:
                return {"intent": "open_app", "app": "notepad"}
            if "calculator" in target or "calc" in target:
                return {"intent": "open_app", "app": "calculator"}
            if "whatsapp" in target:
                return {"intent": "open_app", "app": "whatsapp"}
            if target:
                return {"intent": "open_app", "app": target}

    # 3. YOUTUBE PLAY / MUSIC
    play_keywords = ["play ", "bajao ", "chala do ", "sunao "]
    for kw in play_keywords:
        if kw in cmd:
            song = cmd.split(kw, 1)[1].replace("song", "").replace("on youtube", "").replace("in youtube", "").strip()
            return {"intent": "play_youtube", "song": song or "top hits"}

    if "youtube" in cmd and any(k in cmd for k in ["search", "pe search", "chalao"]):
        song = cmd.replace("youtube", "").replace("search", "").replace("pe", "").strip()
        return {"intent": "play_youtube", "song": song}

    # 4. MEMORY STORAGE & RECALL
    if cmd.startswith("remember that ") or cmd.startswith("remember "):
        content = cmd.replace("remember that ", "").replace("remember ", "").strip()
        if " is " in content:
            k, v = content.split(" is ", 1)
            return {"intent": "remember", "key": k.strip(), "value": v.strip()}
        return {"intent": "remember", "key": "general", "value": content}

    if "what do you remember" in cmd or "recall " in cmd or "do you remember" in cmd:
        key = cmd.replace("what do you remember about ", "").replace("do you remember ", "").replace("recall ", "").strip()
        return {"intent": "recall", "key": key if key != "what do you remember" else "all"}

    # 5. CODE GENERATION / DSA / GAMES
    code_triggers = ["write code", "code likho", "create a program", "banao program", "implement", "binary search", "linked list", "tree", "dsa", "game", "write a", "create a", "write python", "write cpp", "write java", "addition program", "calculator program", "program", "code"]
    if any(trigger in cmd for trigger in code_triggers):
        # Detect target language
        lang = "python"
        if "c++" in cmd or "cpp" in cmd:
            lang = "cpp"
        elif "java" in cmd and "javascript" not in cmd:
            lang = "java"
        elif "javascript" in cmd or " js" in cmd:
            lang = "javascript"
        elif "typescript" in cmd or " ts" in cmd:
            lang = "typescript"
        elif " c " in f" {cmd} " or "in c" in cmd or "c mein" in cmd:
            lang = "c"
        elif "html" in cmd or "webpage" in cmd:
            lang = "html"
        elif "css" in cmd or "stylesheet" in cmd:
            lang = "css"
        elif "sql" in cmd or "query" in cmd:
            lang = "sql"

        # Detect category
        category = "general"
        dsa_topics = ["binary search", "bst", "tree", "linked list", "stack", "queue", "graph", "heap", "dsa", "sort", "sorting", "dynamic programming", "dp", "recursion"]
        game_topics = ["snake game", "pong", "tic tac toe", "game", "flappy bird", "platformer"]

        if any(topic in cmd for topic in dsa_topics):
            category = "dsa"
        elif any(topic in cmd for topic in game_topics):
            category = "game"

        prompt = cmd.replace("write code for", "").replace("write a", "").replace("create a", "").replace("banao", "").replace("likho", "").strip()
        return {
            "intent": "write_code",
            "language": lang,
            "prompt": prompt or "sample hello world program",
            "category": category
        }

    # 6. EMAIL
    if "send mail" in cmd or "send email" in cmd or "email bhejo" in cmd:
        return {
            "intent": "send_email",
            "email": "",
            "message": cmd.replace("send mail", "").replace("send email", "").strip()
        }

    # 7. WEB SEARCH
    if cmd.startswith("search ") or "search for " in cmd or "google " in cmd or "dhundo" in cmd:
        query = cmd.replace("search for", "").replace("search", "").replace("google", "").replace("dhundo", "").strip()
        return {
            "intent": "search",
            "query": query
        }

    # Default to Conversational Chat
    return {
        "intent": "chat",
        "message": command
    }
