import urllib.request
import urllib.parse
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

videos = [
    {
        "id": "edit-thumb-1.jpg",
        "url": "https://vt.tiktok.com/ZSCcxQAww/",
        "title": "Fashion Brand Showcase"
    },
    {
        "id": "edit-thumb-2.jpg",
        "url": "https://vt.tiktok.com/ZSCcxBXjU/",
        "title": "Brand Highlight Reel"
    }
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

for v in videos:
    print(f"Fetching oEmbed for {v['title']} ({v['url']})...")
    oembed_endpoint = f"https://www.tiktok.com/oembed?url={urllib.parse.quote(v['url'])}"
    try:
        req = urllib.request.Request(oembed_endpoint, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            thumb_url = data.get("thumbnail_url")
            print(f"Found thumbnail URL: {thumb_url}")
            if thumb_url:
                img_req = urllib.request.Request(thumb_url, headers=headers)
                with urllib.request.urlopen(img_req, context=ctx, timeout=15) as img_resp:
                    with open(v["id"], "wb") as f:
                        f.write(img_resp.read())
                    print(f"Saved {v['id']} successfully!")
    except Exception as e:
        print(f"Error fetching {v['title']}: {e}")
