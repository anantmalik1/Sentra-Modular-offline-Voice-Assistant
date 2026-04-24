def normalize_command(text):

    text = text.lower()

    replacements = {
        "you to": "youtube",
        "you tube": "youtube",
        "what's up": "whatsapp",
        "what sup": "whatsapp",
        "kar do": "",
        "kholo": "open",
        "chala do": "play",
        "bajao": "play"
    }

    for wrong, correct in replacements.items():
        text = text.replace(wrong, correct)

    return text.strip()