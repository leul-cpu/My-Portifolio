import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Desktop
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.goto('http://localhost:8000')
        await asyncio.sleep(1.5) # Wait for animations
        await page.screenshot(path='screenshot_desktop.png', full_page=True)

        # Mobile
        await page.set_viewport_size({"width": 375, "height": 667})
        await page.goto('http://localhost:8000')
        await asyncio.sleep(1.5) # Wait for animations
        await page.screenshot(path='screenshot_mobile.png')

        # Open mobile menu
        await page.click('#navToggle')
        await asyncio.sleep(0.5) # wait for transition
        await page.screenshot(path='screenshot_mobile_menu.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
