import requests
from bs4 import BeautifulSoup


def get_google_answer(query):
    try:
        url = f"https://www.google.com/search?q={query}"
        headers = {"User-Agent": "Mozilla/5.0"}

        res = requests.get(url, headers=headers)
        soup = BeautifulSoup(res.text, "html.parser")

        results = soup.find_all("div", class_="BNeawe")

        for r in results:
            text = r.text.strip()

            # 🔥 filter useful text
            if len(text) > 30 and len(text) < 300:
                return text

        return "Sorry, I could not find a clear answer."

    except Exception as e:
        print("Search Error:", e)
        return "Error fetching answer"