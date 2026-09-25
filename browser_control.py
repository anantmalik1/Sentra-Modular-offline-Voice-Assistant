import webbrowser
import pyautogui
import time


def search_google(query):

    webbrowser.open("https://www.google.com")

    time.sleep(5)

    pyautogui.write(query)
    pyautogui.press("enter")