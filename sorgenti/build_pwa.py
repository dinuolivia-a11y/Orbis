#!/usr/bin/env python3
"""Build the installable (PWA) version of Orbis from site/index.html into pwa/.

The artifact build (site/) keeps loading three.js and fonts from CDNs; this build
serves everything locally so it works offline once installed.
"""
import hashlib, json, os, re, shutil

ROOT = "/home/claude/cosmo"
SITE, OUT = f"{ROOT}/site", f"{ROOT}/pwa"

src = open(f"{SITE}/index.html", encoding="utf-8").read()


def sub1(old, new, s):
    assert s.count(old) == 1, f"anchor not unique/missing: {old[:60]!r}"
    return s.replace(old, new)


# ---------- split head / body ----------
style_start = src.index("<style>")
style_end = src.index("</style>") + len("</style>")
style = src[style_start:style_end]
body = src[style_end:]

HEAD = """<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Orbis</title>
<meta name="description" content="Esplora il sistema solare, le galassie, i pianeti di altre stelle e le creature più sconosciute della Terra.">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#05070c">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/favicon.ico" sizes="any">
<link rel="icon" href="icons/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Orbis">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="preload" href="vendor/three.module.min.js" as="script" crossorigin>
<link rel="stylesheet" href="fonts/fonts.css">
"""

INSTALL_CSS = """
/* ---------- install (PWA build only) ---------- */
.corner #install{color:var(--sol);border-color:color-mix(in srgb,var(--sol) 55%,transparent)}
.corner #install::before{content:"\\2193  "}
.update{position:fixed;z-index:72;left:50%;top:calc(var(--bar-h) + 8px + env(safe-area-inset-top,0px));transform:translateX(-50%);display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:999px;background:var(--glass-solid);border:1px solid color-mix(in srgb,var(--sol) 55%,transparent);box-shadow:0 10px 30px rgba(0,0,0,.45);font-size:.9rem;white-space:nowrap;animation:rise .35s ease-out}
.update[hidden]{display:none!important}
.update::before{content:"\\2726";color:var(--sol)}
.update button{padding:7px 14px;border-radius:999px;background:var(--sol);color:var(--void);font-weight:700;font-size:.85rem}
.loading .appicon{width:104px;height:104px;border-radius:24px;box-shadow:0 14px 50px rgba(241,183,102,.16),0 0 0 1px rgba(255,255,255,.06)}
.ios-sheet{position:fixed;inset:0;z-index:76;display:grid;align-items:end;justify-items:center;background:rgba(2,3,6,.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.ios-sheet[hidden]{display:none!important}
.ios-card{position:relative;box-sizing:border-box;width:min(520px,100vw);background:var(--glass-solid);border:1px solid var(--hair);border-bottom:0;border-radius:22px 22px 0 0;padding:26px 22px calc(26px + env(safe-area-inset-bottom,0px));box-shadow:0 -20px 60px rgba(0,0,0,.5)}
.ios-card .x{position:absolute;top:12px;right:12px}
.ios-card .top{display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-right:36px}
.ios-card .top img{width:60px;height:60px;border-radius:14px}
.ios-card h2{font-family:var(--display);font-weight:500;font-size:1.5rem;line-height:1.15;margin:0}
.ios-card ol{list-style:none;margin:0;padding:0;display:grid;gap:14px;counter-reset:s}
.ios-card li{display:grid;grid-template-columns:30px 1fr;gap:12px;align-items:start;counter-increment:s;color:#dfe4ee}
.ios-card li::before{content:counter(s);display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1px solid color-mix(in srgb,var(--sol) 60%,transparent);color:var(--sol);font-family:var(--mono);font-size:.85rem}
.ios-card .ico{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.25em;margin:0 .15em;color:#5aa9ff}
.ios-card .note{margin:18px 0 0;color:var(--mist);font-size:.88rem}
"""
style = style.replace("</style>", INSTALL_CSS + "</style>")

# ---------- body edits ----------
body = sub1('<div class="logo">Orbis</div>',
            '<img class="appicon" src="icons/icon-192.png" alt="" width="104" height="104">\n    <div class="logo">Orbis</div>', body)
body = sub1('<div class="corner"><button type="button" id="open-lab"></button><button type="button" id="open-credits"></button></div>',
            '<div class="corner"><button type="button" id="install" hidden></button><button type="button" id="open-lab"></button><button type="button" id="open-credits"></button></div>\n'
            '<div class="update" id="update" hidden role="status"><span id="update-msg"></span><button type="button" id="update-go"></button></div>\n'
            '<section class="ios-sheet" id="ios-sheet" hidden role="dialog" aria-modal="true" aria-labelledby="ios-h"><div class="ios-card" id="ios-card"></div></section>', body)
body = sub1('"three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",', '"three": "./vendor/three.module.min.js",', body)
body = sub1('"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"', '"three/addons/": "./vendor/addons/"', body)
body = sub1('$("cur-chip").textContent = t(UI.cur.chip); if (!$("cur").hidden) renderCur();',
            '$("cur-chip").textContent = t(UI.cur.chip); if (!$("cur").hidden) renderCur(); renderInstall();', body)

INSTALL_JS = r'''
/* =========================================================
   INSTALL AS AN APP (PWA build only)
   ========================================================= */
const INS = {
  btn: { it: "Installa", en: "Install" },
  title: { it: "Metti Orbis nella schermata Home", en: "Add Orbis to your Home Screen" },
  s1: { it: "Tocca i tre puntini ••• accanto all’indirizzo, poi «Condividi» {share}. Sugli iPhone meno recenti il tasto Condividi è già nella barra in basso.", en: "Tap the three dots ••• next to the address, then “Share” {share}. On older iPhones the Share button is already in the bottom bar." },
  s2: { it: "Scorri e scegli «Aggiungi alla schermata Home» {add}.", en: "Scroll down and choose “Add to Home Screen” {add}." },
  s3: { it: "Lascia acceso «Apri come app web» e tocca «Aggiungi». Orbis comparirà tra le tue app con la sua icona e si aprirà a tutto schermo.", en: "Keep “Open as Web App” on and tap “Add”. Orbis will appear among your apps with its own icon and open full screen." },
  note: { it: "Dopo la prima apertura funziona anche senza internet.", en: "After the first launch it works offline too." },
  done: { it: "Fatto! Orbis è nella tua schermata Home.", en: "Done! Orbis is on your Home Screen." },
  upd: { it: "C’è una nuova versione di Orbis", en: "A new version of Orbis is here" },
  updGo: { it: "Aggiorna", en: "Update" }
};
const SVG_SHARE = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
const SVG_ADD = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches || navigator.standalone === true;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let installEvt = null;
function renderInstall() {
  const b = $("install");
  b.textContent = t(INS.btn);
  b.hidden = isStandalone() || !(installEvt || isIOS);
  if (!$("ios-sheet").hidden) renderIosSheet();
  $("update-msg").textContent = t(INS.upd); $("update-go").textContent = t(INS.updGo);
}
function renderIosSheet() {
  $("ios-card").innerHTML = `<button type="button" class="x" id="ios-x" aria-label="${esc(t(UI.close))}">×</button>
    <div class="top"><img src="icons/icon-192.png" alt=""><h2 id="ios-h">${esc(t(INS.title))}</h2></div>
    <ol><li><span>${esc(t(INS.s1)).replace("{share}", SVG_SHARE)}</span></li><li><span>${esc(t(INS.s2)).replace("{add}", SVG_ADD)}</span></li><li><span>${esc(t(INS.s3))}</span></li></ol>
    <p class="note">${esc(t(INS.note))}</p>`;
  $("ios-x").onclick = () => { $("ios-sheet").hidden = true; };
}
$("ios-sheet").addEventListener("click", (e) => { if (e.target === $("ios-sheet")) $("ios-sheet").hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("ios-sheet").hidden = true; });
$("install").onclick = async () => {
  if (installEvt) {
    const ev = installEvt; installEvt = null; ev.prompt();
    try { await ev.userChoice; } catch (e) {}
    renderInstall();
  } else { renderIosSheet(); $("ios-sheet").hidden = false; }
};
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; renderInstall(); });
window.addEventListener("appinstalled", () => { installEvt = null; renderInstall(); toast(t(INS.done)); });
$("update-go").onclick = () => location.reload();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      // A new version installed while Orbis was already open: offer to reload.
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) $("update").hidden = false; });
      });
      // Apps left open in the background check again when they come back to the front.
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
    }).catch(() => {});
  });
}
'''
body = sub1("\nresize();\nsetLang(LANG);\nroute();\nloop();", "\n" + INSTALL_JS + "\nresize();\nsetLang(LANG);\nroute();\nloop();", body)

html = HEAD + style + "\n</head>\n<body>\n" + body.lstrip("\n")
if not html.rstrip().endswith("</html>"):
    html = html.rstrip() + "\n</body>\n</html>\n"
assert "cdn.jsdelivr" not in html and "fonts.googleapis" not in html

# ---------- copy assets ----------
for d in ("tex", "photos", "img"):
    if os.path.isdir(f"{SITE}/{d}"):
        shutil.rmtree(f"{OUT}/{d}", ignore_errors=True)  # keep the build in step with the site (removed images go too)
        shutil.copytree(f"{SITE}/{d}", f"{OUT}/{d}")
open(f"{OUT}/index.html", "w", encoding="utf-8").write(html)

# ---------- manifest ----------
manifest = {
    "id": "./",
    "name": "Orbis",
    "short_name": "Orbis",
    "description": "Esplora il sistema solare, le galassie, i pianeti di altre stelle e le creature più sconosciute della Terra.",
    "lang": "it",
    "dir": "ltr",
    "start_url": "./",
    "scope": "./",
    "display": "standalone",
    "orientation": "any",
    "background_color": "#05070c",
    "theme_color": "#05070c",
    "categories": ["education", "kids", "science"],
    "icons": [
        {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
        {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
        {"src": "icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable"},
        {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
    ],
}
shots = sorted(f for f in os.listdir(f"{OUT}/screens") if f.endswith(".webp")) if os.path.isdir(f"{OUT}/screens") else []
if shots:
    from PIL import Image
    manifest["screenshots"] = []
    for f in shots:
        w, h = Image.open(f"{OUT}/screens/{f}").size
        manifest["screenshots"].append({"src": f"screens/{f}", "sizes": f"{w}x{h}", "type": "image/webp", "form_factor": "narrow" if h > w else "wide"})
json.dump(manifest, open(f"{OUT}/manifest.webmanifest", "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------- service worker ----------
pre = ["./", "index.html", "manifest.webmanifest", "fonts/fonts.css", "vendor/three.module.min.js", "vendor/addons/controls/OrbitControls.js"]
pre += [f"fonts/{f}" for f in sorted(os.listdir(f"{OUT}/fonts")) if f.endswith(".woff2")]
pre += [f"icons/{f}" for f in sorted(os.listdir(f"{OUT}/icons"))]
pre += [f"tex/{f}" for f in sorted(os.listdir(f"{OUT}/tex"))]
pre += [f"photos/{f}" for f in sorted(os.listdir(f"{OUT}/photos")) if f.endswith("-s.webp")]
if os.path.isdir(f"{OUT}/img"):
    pre += [f"img/{f}" for f in sorted(os.listdir(f"{OUT}/img")) if f.endswith(".webp")]
h = hashlib.sha256()
for p in pre[1:]:
    h.update(p.encode()); h.update(open(f"{OUT}/{p}", "rb").read())
version = h.hexdigest()[:10]

SW = """/* Orbis service worker: keeps the app working offline. */
const CACHE = "orbis-%s";
const PRECACHE = %s;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith("orbis-") && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function fromNetwork(req, key) {
  return fetch(req).then((res) => {
    if (res && res.ok && res.type === "basic") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key || req, copy)); }
    return res;
  });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    // Fresh page when online (so updates arrive), cached page when offline or slow.
    const net = fromNetwork(req, "./");
    const cached = caches.match("./");
    const slow = new Promise((r) => setTimeout(r, 3500)).then(() => cached);
    e.respondWith(Promise.race([net, slow]).then((res) => res || net).catch(() => cached.then((c) => c || Response.error())));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fromNetwork(req)));
});
""" % (version, json.dumps(pre, indent=2))
open(f"{OUT}/sw.js", "w", encoding="utf-8").write(SW)
size = sum(os.path.getsize(f"{OUT}/{p}") for p in pre[1:])
print(f"built pwa: index {len(html)//1024} KB, precache {len(pre)} files {size/1e6:.1f} MB, version {version}")
