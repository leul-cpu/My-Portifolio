import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # Desktop verification
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto(f'file://{os.getcwd()}/index.html')
        await asyncio.sleep(2)  # Wait for animations
        await page.screenshot(path='screenshot_desktop.png', full_page=True)

        # Mobile verification
        mobile_page = await browser.new_page(viewport={'width': 375, 'height': 812})
        await mobile_page.goto(f'file://{os.getcwd()}/index.html')
        await asyncio.sleep(2)
        await mobile_page.screenshot(path='screenshot_mobile.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
