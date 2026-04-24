from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import os
import time
import subprocess

# 🔐 API KEY
api_key = "2y4WEa1BPzA8vovhKsbDY3eiLnXf20oz"
client = MistralClient(api_key=api_key)


# ============================
# 🧠 GENERATE CLEAN CODE
# ============================
def generate_code(prompt):

    full_prompt = f"""
Write a clean Python program.

User request: {prompt}

Rules:
- Only return code
- No explanation
- No markdown
- Always include print output
"""

    response = client.chat(
        model="mistral-small",
        messages=[ChatMessage(role="user", content=full_prompt)]
    )

    code = response.choices[0].message.content.strip()

    # 🔥 CLEAN AI OUTPUT
    if "```" in code:
        parts = code.split("```")
        if len(parts) >= 2:
            code = parts[1]

    return code.strip()


# ============================
# 💻 WRITE + RUN CODE
# ============================
def write_python_code(prompt):

    try:
        print("⚡ Generating code...")

        code = generate_code(prompt)

        print("\n✅ Generated Code:\n")
        print(code)

        # 🔥 file name
        filename = f"ai_program_{int(time.time())}.py"
        file_path = os.path.join(os.getcwd(), filename)

        # 🔥 SAVE FILE
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        print(f"\n📁 File saved: {file_path}")

        # 🔥 VS Code open
        os.system(f'code "{file_path}"')

        # ============================
        # ▶️ AUTO RUN CODE
        # ============================
        print("\n🚀 Running code...\n")

        result = subprocess.run(
            ["python", file_path],
            capture_output=True,
            text=True
        )

        output = result.stdout
        error = result.stderr

        if output:
            print("✅ OUTPUT:\n", output)

        if error:
            print("❌ ERROR:\n", error)

        return output if output else error

    except Exception as e:
        print("❌ Error:", e)
        return str(e)