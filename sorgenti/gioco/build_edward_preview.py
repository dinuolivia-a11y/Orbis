"""Build Edward's illustrated laboratory in Orbis and its separate preview.

The PWA builder uses decorate_app() before it versions its service worker.
When developing a scene, run this script to refresh both HTML entry points.
"""
from hashlib import sha256
from pathlib import Path
import re


APP = Path(__file__).resolve().parents[2] / "app"
PREVIEW = APP / "anteprima-edward"
SCENES = ("room", "volcano", "chemistry")
STYLE_MARKERS = ("<!-- EDWARD-STYLES:BEGIN -->", "<!-- EDWARD-STYLES:END -->")
SCENE_MARKERS = ("/* EDWARD-SCENES:BEGIN */", "/* EDWARD-SCENES:END */")
UPDATE_MARKERS = ("/* PWA-UPDATE:BEGIN */", "/* PWA-UPDATE:END */")


def replace_once(document, before, after):
    if document.count(before) != 1:
        raise ValueError(f"Expected one occurrence of {before!r} in the Orbis app")
    return document.replace(before, after)


def remove_block(html, markers):
    begin, end = markers
    if begin not in html and end not in html:
        return html
    if html.count(begin) != 1 or html.count(end) != 1:
        raise ValueError(f"Unmatched or repeated block {begin}")
    start = html.index(begin)
    stop = html.index(end, start) + len(end)
    return html[:start] + html[stop:].removeprefix("\n")


def undecorated(html):
    return remove_block(remove_block(html, STYLE_MARKERS), SCENE_MARKERS)


def decorate(html, scene_dir, prefix):
    styles = [STYLE_MARKERS[0]]
    scripts = [SCENE_MARKERS[0], "{", f'const edwardSceneRoot = new URL("{prefix}", document.baseURI);']
    for scene in SCENES:
        css = scene_dir / f"{scene}.css"
        version = sha256(css.read_text(encoding="utf-8").encode("utf-8")).hexdigest()[:12]
        styles.append(f'<link rel="stylesheet" href="{prefix}{css.name}?v={version}">')
        scripts.append((scene_dir / f"{scene}.js").read_text(encoding="utf-8").rstrip("\n"))
    styles.append(STYLE_MARKERS[1])
    scripts.extend(("}", SCENE_MARKERS[1]))
    html = replace_once(html, "</head>", "\n".join([*styles, "</head>"]))
    marker = "/* GAME-JS:END */"
    return replace_once(html, marker, "\n".join([*scripts, marker]))


def decorate_app(html, scene_dir=PREVIEW):
    """Install the shared scenes in the ordinary Orbis route and save namespace."""
    return decorate(undecorated(html), Path(scene_dir), "./anteprima-edward/")


def preview_html(main_html, scene_dir=PREVIEW):
    html = undecorated(main_html)
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
    if UPDATE_MARKERS[0] in html:
        html = remove_block(html, UPDATE_MARKERS)
    else:
        worker_start = html.index('$("update-go").onclick = () => location.reload();')
        worker_end = html.index("\nresize();", worker_start)
        html = html[:worker_start] + html[worker_end:]
    html = replace_once(html, "maybeAutoCur();", "")
    html = html.replace('"orbis-game"', '"orbis-game-edward-preview-v2"')
    direct_entry = """<script>
if (!location.hash) history.replaceState(null, "", location.pathname + location.search + "#gioco");
</script>"""
    html = replace_once(html, "</head>", direct_entry + "\n</head>")
    return decorate(html, Path(scene_dir), "./")


def build():
    main = APP / "index.html"
    html = decorate_app(main.read_text(encoding="utf-8"))
    preview = preview_html(html)
    main.write_bytes(html.encode("utf-8"))
    (PREVIEW / "index.html").write_bytes(preview.encode("utf-8"))


if __name__ == "__main__":
    build()
