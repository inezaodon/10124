from playwright.sync_api import sync_playwright

def verify_landing_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Use file protocol to open local index.html
        page.goto("file:///app/index.html")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="verification/landing_page.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    verify_landing_page()
