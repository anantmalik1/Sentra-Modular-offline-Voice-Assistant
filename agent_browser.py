from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time


def start_browser():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    return driver


def search_google(driver, query):
    driver.get("https://www.google.com")
    time.sleep(2)

    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)

    time.sleep(3)


def open_first_result(driver):
    results = driver.find_elements(By.CSS_SELECTOR, "h3")
    if results:
        results[0].click()


# 🔥 FORM FILL EXAMPLE (Travel booking basic)
def fill_form_example(driver):

    time.sleep(3)

    inputs = driver.find_elements(By.TAG_NAME, "input")

    for i in inputs:
        try:
            i.send_keys("test")
        except:
            pass