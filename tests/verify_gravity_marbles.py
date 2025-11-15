from playwright.sync_api import Page, expect, sync_playwright

def verify_gravity_marbles(page: Page):
    # Navigate to the local file
    page.goto(f"file:///app/WebGL/GravityMarbles/kaaro.html")

    # Take a screenshot of the initial state
    page.screenshot(path="/home/jules/verification/initial_state.png")

    # Select a different level
    page.select_option("#level-select", "21")

    # Click the generate button
    page.click("#generate-button")

    # Wait for the maze to regenerate (add a small delay to be safe)
    page.wait_for_timeout(1000)

    # Take a screenshot of the new state
    page.screenshot(path="/home/jules/verification/new_maze.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_gravity_marbles(page)
        finally:
            browser.close()