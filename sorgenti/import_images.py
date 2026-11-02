#!/usr/bin/env python3
"""Put checked creature images into Orbis.

usage: import_images.py id=path [id=path ...]
Each image is centre-cropped to a square, resized to 1024 px and saved as site/img/<id>.webp;
the IMAGES table in site/index.html is rewritten to list every file present in site/img/.
"""
import os, re, sys
from PIL import Image, ImageOps
SITE = "/home/claude/cosmo/site"; IMG = f"{SITE}/img"; os.makedirs(IMG, exist_ok=True)
for arg in sys.argv[1:]:
    cid, path = arg.split("=", 1)
    mode = "0.5"
    if "@" in path: path, mode = path.rsplit("@", 1)
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    w, h = im.size; s = min(w, h)
    if mode == "fit":
        # whole picture inside the square, sides filled with a soft blurred copy of itself
        from PIL import ImageFilter
        bg = im.resize((1024, 1024), Image.LANCZOS).filter(ImageFilter.GaussianBlur(40))
        bg = Image.blend(bg, Image.new("RGB", bg.size, (0, 0, 0)), 0.35)
        fg = im.copy(); fg.thumbnail((1024, 1024), Image.LANCZOS)
        bg.paste(fg, ((1024 - fg.width) // 2, (1024 - fg.height) // 2)); im = bg
    else:
        c = float(mode)  # where the centre of the square sits along the long side (0..1)
        if h >= w: top = min(max(0, int(c * h - s / 2)), h - s); box = (0, top, s, top + s)
        else: left = min(max(0, int(c * w - s / 2)), w - s); box = (left, 0, left + s, s)
        im = im.crop(box).resize((1024, 1024), Image.LANCZOS)
    im.save(f"{IMG}/{cid}.webp", quality=84, method=6)
    print(f"{cid}: {w}x{h} -> img/{cid}.webp ({os.path.getsize(f'{IMG}/{cid}.webp') // 1024} KB)")
ids = sorted(f[:-5] for f in os.listdir(IMG) if f.endswith(".webp"))
html = open(f"{SITE}/index.html", encoding="utf-8").read()
table = "const IMAGES = {" + (" " + ", ".join(f'{i}: "img/{i}.webp"' for i in ids) + " " if ids else "") + "};"
html, n = re.subn(r"const IMAGES = \{[^}]*\};", lambda m: table, html)
assert n == 1
open(f"{SITE}/index.html", "w", encoding="utf-8").write(html)
print(f"IMAGES now lists {len(ids)} creatures")
