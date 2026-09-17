import os
import json
import re
from dotenv import load_dotenv
from rule_analyzer import analyze_rule

# Load environment variables
load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY", "").strip()
model_name = os.getenv("MISTRAL_MODEL", "mistral-small-latest")

# Lazy / Safe client initialization
client = None
if api_key:
    try:
        from mistralai.client import Mistral
        client = Mistral(api_key=api_key)
    except Exception as e:
        print(f"⚠️ Failed to initialize Mistral client: {e}")
        client = None


def extract_json(text):
    """
    Extracts JSON safely from string even if surrounded by markdown or conversational text.
    """
    if not text:
        return None
    try:
        # Check if text contains markdown code fences with json
        match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if match:
            return json.loads(match.group(1))

        # Fallback to finding first { and last }
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != -1 and start < end:
            return json.loads(text[start:end])
    except Exception as e:
        print(f"JSON parsing error: {e}")
    return None


def analyze_command(command):
    """
    Analyze user command to determine structured intent and parameters.
    Uses Mistral AI when available with seamless offline rule-based fallback.
    """
    command_clean = command.strip() if command else ""
    if not command_clean:
        return {
            "intent": "chat",
            "message": "I didn't hear anything. How can I assist you?",
            "raw": ""
        }

    # If Mistral client is available, attempt neural command classification
    if client:
        prompt = f"""You are SENTRA AI 2.0 command parser. Convert user spoken or typed command into STRICT JSON.

RULES:
- Return ONLY valid JSON.
- No markdown, no prose, no backticks outside JSON.
- Supported intents:
  - open_app: {{"intent":"open_app", "app":"youtube|chrome|vscode|notepad|calculator|whatsapp|..."}}
  - search: {{"intent":"search", "query":"topic"}}
  - play_youtube: {{"intent":"play_youtube", "song":"query or title"}}
  - tell_time: {{"intent":"tell_time"}}
  - write_code: {{"intent":"write_code", "language":"python|c|cpp|java|javascript|typescript|html|css|sql", "prompt":"specific task description", "category":"general|dsa|game"}}
  - send_email: {{"intent":"send_email", "email":"target email", "message":"content"}}
  - schedule: {{"intent":"schedule", "title":"meeting title", "time":"YYYY-MM-DD HH:MM"}}
  - remember: {{"intent":"remember", "key":"item", "value":"info"}}
  - recall: {{"intent":"recall", "key":"item"}}
  - system_action: {{"intent":"system_action", "action":"volume_up|volume_down|mute|lock|sleep"}}
  - chat: {{"intent":"chat", "message":"user query"}}

LANGUAGE DETECTION FOR write_code:
- "python mein ...", "in python" -> language: "python"
- "c++ mein ...", "in cpp", "in c++" -> language: "cpp"
- "java mein ...", "in java" -> language: "java"
- "c mein ...", "in c" -> language: "c"
- "javascript mein ...", "in js", "in javascript" -> language: "javascript"
- "typescript mein ..." -> language: "typescript"
- "html mein ...", "webpage" -> language: "html"
- "sql query ..." -> language: "sql"
- If no language is mentioned, default to "python".

CATEGORIES:
- If user asks for algorithms, data structures (BST, binary search, tree, graph, stack, queue, dp, linked list), category: "dsa".
- If user asks for game (snake, pong, tic tac toe, flappy bird, platformer), category: "game".

EXAMPLES:
"open youtube" -> {{"intent":"open_app", "app":"youtube"}}
"play kesariya" -> {{"intent":"play_youtube", "song":"kesariya"}}
"search latest quantum computing news" -> {{"intent":"search", "query":"latest quantum computing news"}}
"write a python addition program" -> {{"intent":"write_code", "language":"python", "prompt":"addition program", "category":"general"}}
"create a binary search tree in python" -> {{"intent":"write_code", "language":"python", "prompt":"binary search tree", "category":"dsa"}}
"c++ mein linked list banao" -> {{"intent":"write_code", "language":"cpp", "prompt":"singly linked list implementation", "category":"dsa"}}
"create a snake game in python" -> {{"intent":"write_code", "language":"python", "prompt":"snake game", "category":"game"}}
"what time is it" -> {{"intent":"tell_time"}}
"remember that my birthday is tomorrow" -> {{"intent":"remember", "key":"birthday", "value":"tomorrow"}}

Command: {command_clean}"""

        try:
            chat_response = client.chat.complete(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )
            raw_text = chat_response.choices[0].message.content.strip()
            data = extract_json(raw_text)
            if data and "intent" in data:
                data["raw"] = command_clean
                return data
        except Exception as e:
            # Handle rate limit (429) or connection error gracefully
            try:
                print(f"[Sentra Brain] Mistral API notice: {e}. Switching to offline hybrid engine.")
            except Exception:
                pass

    # Offline / Heuristic Fallback
    fallback_result = analyze_rule(command_clean)
    fallback_result["raw"] = command_clean
    return fallback_result