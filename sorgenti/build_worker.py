"""Generate the offline cache for a finished Orbis PWA directory."""
import hashlib
import json
from pathlib import Path


SW = """/* Orbis service worker: keeps the app working offline. */
const CACHE = __CACHE_NAME__;
const PRECACHE = __FILE_LIST__;
const scope = new URL(self.registration.scope);
const preview = new URL("anteprima-edward/", scope).pathname;
const listed = new Set(PRECACHE.map(path => new URL(path, scope).pathname));

self.addEventListener("install", event => {
  // Fetch the release instead of reusing an older entry in the HTTP cache.
  const requests = PRECACHE.map(path => new Request(new URL(path, scope), { cache: "reload" }));
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(requests)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("orbis-") && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== scope.origin) return;
  // The independent preview has its own page. Only its shared production assets
  // belong to this release's cache, including the CSS URLs with version queries.
  const sharedWithPreview = url.pathname.startsWith(preview);
  if (sharedWithPreview && !listed.has(url.pathname)) return;
  if (req.mode === "navigate") {
    if (url.pathname !== scope.pathname && url.pathname !== new URL("index.html", scope).pathname) return;
    event.respondWith(caches.open(CACHE).then(async cache => await cache.match("index.html") || fetch(req)));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache => {
    if (sharedWithPreview && event.clientId) {
      const client = await self.clients.get(event.clientId);
      if (client && new URL(client.url).pathname.startsWith(preview)) {
        // Preview edits may be newer than the installed edition. Do not put them
        // in its cache. When offline both editions can use the released artwork.
        try {
          const fresh = await fetch(req, { cache: "no-cache" });
          if (fresh.ok) return fresh;
          return await cache.match(req, { ignoreSearch: true }) || fresh;
        } catch (error) {
          const offline = await cache.match(req, { ignoreSearch: true });
          if (offline) return offline;
          throw error;
        }
      }
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const response = await fetch(req);
    if (response.ok && response.type === "basic") {
      event.waitUntil(cache.put(req, response.clone()).catch(() => {}));
    }
    return response;
  }));
});
"""


def build_worker(output):
    root = Path(output)
    files = ["./", "index.html", "manifest.webmanifest", "fonts/fonts.css",
             "vendor/three.module.min.js", "vendor/addons/controls/OrbitControls.js"]
    for directory, pattern in (("fonts", "*.woff2"), ("icons", "*"), ("tex", "*"),
                               ("photos", "*-s.webp"), ("img", "*.webp")):
        files.extend(p.relative_to(root).as_posix() for p in sorted((root / directory).glob(pattern)) if p.is_file())
    files.extend(f"anteprima-edward/{name}.css" for name in ("room", "volcano", "chemistry"))
    illustrated = sorted((root / "anteprima-edward" / "assets").glob("*.webp"))
    if not illustrated:
        raise FileNotFoundError("The illustrated room assets are missing from the PWA output")
    files.extend(p.relative_to(root).as_posix() for p in illustrated)

    digest = hashlib.sha256(SW.encode("utf-8"))
    size = 0
    for path in files[1:]:
        data = (root / path).read_bytes()
        digest.update(path.encode("utf-8") + b"\0")
        digest.update(hashlib.sha256(data).digest())
        size += len(data)
    version = "orbis-" + digest.hexdigest()[:12]
    script = SW.replace("__CACHE_NAME__", json.dumps(version)).replace("__FILE_LIST__", json.dumps(files, indent=2))
    (root / "sw.js").write_bytes(script.encode("utf-8"))
    return version, len(files), size


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", type=Path, default=Path(__file__).resolve().parents[1] / "app")
    version, count, size = build_worker(parser.parse_args().output)
    print(f"{version}: {count} offline entries, {size / 1e6:.1f} MB")
