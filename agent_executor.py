from agent_browser import start_browser, search_google, open_first_result, fill_form_example
from voice import speak


def run_agent(task):

    query = task.get("query")

    speak(f"Working on {query}")

    driver = start_browser()

    # Step 1: Search
    search_google(driver, query)

    # Step 2: Open first result
    open_first_result(driver)

    # Step 3: Try form fill
    fill_form_example(driver)