import asyncio
from playwright.async_api import async_playwright

async def verify_mobile_menu():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 375, 'height': 667})
        page = await context.new_page()

        # Go to the local server
        await page.goto('http://localhost:8000')

        # Wait for animations
        await asyncio.sleep(2)

        # Take initial screenshot
        await page.screenshot(path='mobile_initial.png')

        # Click hamburger menu
        # Based on index.html: <button class="nav-toggle" id="navToggle" ...>
        await page.click('#navToggle')

        # Wait for menu animation
        await asyncio.sleep(1)

        # Take screenshot of open menu
        await page.screenshot(path='mobile_menu_open.png')

        # Check if body has overflow: hidden
        is_locked = await page.evaluate("document.body.style.overflow === 'hidden'")
        print(f"Body scroll locked: {is_locked}")

        # Click a link in the menu (e.g., Projects)
        # Based on index.html: <ul class="nav-links">
        await page.click('.nav-links a[href="#projects"]')

        # Wait for menu to close
        await asyncio.sleep(1)

        # Take screenshot after clicking link
        await page.screenshot(path='mobile_after_click.png')

        # Check if body scroll is unlocked
        is_unlocked = await page.evaluate("document.body.style.overflow === ''")
        print(f"Body scroll unlocked: {is_unlocked}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_mobile_menu())
