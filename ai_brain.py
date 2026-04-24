import json
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

# 🔐 API KEY
api_key = "2y4WEa1BPzA8vovhKsbDY3eiLnXf20oz"
client = MistralClient(api_key=api_key)


# ============================
# 🧠 JSON EXTRACTOR
# ============================
def extract_json(text):
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
    except:
        return None


# ============================
# 🤖 ANALYZE COMMAND
# ============================
def analyze_command(command):

    prompt = f"""
Convert user command into STRICT JSON.

RULES:
- Only return JSON
- No explanation
- No text before or after JSON
Examples:

open youtube ->
{{ "intent":"open_app","app":"youtube" }}

search AI ->
{{ "intent":"search","query":"AI" }}

play kesariya song ->
{{ "intent":"play_youtube","song":"kesariya" }}

write python addition program ->
{{ "intent":"write_code","prompt":"python addition program" }}

write linked list program ->
{{ "intent":"write_code","prompt":"linked list python program" }}

write binary search tree ->
{{ "intent":"write_code","prompt":"binary search tree python program" }}

write dsa program ->
{{ "intent":"write_code","prompt":"python dsa program" }}s

Command: {command}
"""

    try:
        response = client.chat(
            model="mistral-small",
            messages=[ChatMessage(role="user", content=prompt)]
        )

        text = response.choices[0].message.content.strip()

        print("RAW AI:", text)  # 🔥 debug

        data = extract_json(text)

        if data:
            return data

        return {
            "intent": "chat",
            "message": command
        }

    except Exception as e:
        print("AI ERROR:", e)
        return {
            "intent": "chat",
            "message": command
        }