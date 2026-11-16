"""Build the illustrated Edward preview using the game and lessons from the Orbis app.

Run after building app/index.html and after editing any of the illustrated scenes.
The main edition and the preview keep separate game progress.
"""
from hashlib import sha256
from pathlib import Path
import re


APP = Path(__file__).resolve().parents[2] / "app"
PREVIEW = APP / "anteprima-edward"
SCENES = ("room", "volcano", "chemistry")


def replace_once(document, before, after):
    if document.count(before) != 1:
        raise ValueError(f"Expected one occurrence of {before!r} in the Orbis app")
    return document.replace(before, after)


def build():
    html = (APP / "index.html").read_text(encoding="utf-8")
    # Original media and imports live one folder up. Keep hashes and relative
    # navigation anchored in the preview, including the trip out to a lesson.
    html = re.sub(
        r'''(["'`(])(?:\./)?((?:img|photos|tex|fonts|icons|vendor|screens)/)''',
        r"\1../\2",
        html,
    )
    html = replace_once(html, "<title>Orbis</title>", "<title>Edward · Orbis</title>")
    html = replace_once(html, '<link rel="manifest" href="manifest.webmanifest">', "")
    html = replace_once(html, "b.hidden = isStandalone() || !(installEvt || isIOS);", "b.hidden = true;")
    worker_start = html.index('if ("serviceWorker" in navigator && location.protocol.startsWith("http"))')
    worker_end = html.index("\nresize();", worker_start)
    html = html[:worker_start] + html[worker_end:]
    html = replace_once(html, "maybeAutoCur();", "")
    html = html.replace('"orbis-game"', '"orbis-game-edward-preview-v2"')
    styles = []
    scripts = []
    for scene in SCENES:
        css_path = PREVIEW / f"{scene}.css"
        version = sha256(css_path.read_bytes()).hexdigest()[:12]
        styles.append(f'<link rel="stylesheet" href="{css_path.name}?v={version}">')
        scripts.append((PREVIEW / f"{scene}.js").read_text(encoding="utf-8"))

    direct_entry = """<script>
if (!location.hash) history.replaceState(null, "", location.pathname + location.search + "#gioco");
</script>"""
    html = replace_once(html, "</head>", "\n".join([*styles, direct_entry, "</head>"]))
    marker = "/* GAME-JS:END */"
    html = replace_once(html, marker, "\n".join([*scripts, marker]))
    (PREVIEW / "index.html").write_bytes(html.encode("utf-8"))


if __name__ == "__main__":
    build()
