"""Rebuild /home/claude/orbis/Orbis.html (one file that works offline): keeps the embedded textures and photos,
re-embeds every creature image from site/img at 480 px, then appends the current site/index.html."""
import base64, io, json, os, sys
from PIL import Image
OUT = '/home/claude/orbis/Orbis.html'; SITE = '/home/claude/cosmo/site'
s = open(OUT).read()
i = s.find('<script>window.ORBIS_IMG')
if i < 0: i = s.find('</head>\n<body>\n')
prefix = s[:i]
imgs = {}
for f in sorted(os.listdir(os.path.join(SITE, 'img'))):
    if not f.endswith('.webp'): continue
    im = Image.open(os.path.join(SITE, 'img', f)).convert('RGB'); im.thumbnail((480, 480), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=74, method=6)
    imgs['img/' + f] = 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
site = open(os.path.join(SITE, 'index.html')).read()
open(OUT, 'w').write(prefix + '<script>window.ORBIS_IMG = ' + json.dumps(imgs) + ';</script>\n</head>\n<body>\n' + site)
print(len(imgs), 'images,', os.path.getsize(OUT) // 1024, 'KB')
