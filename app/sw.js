/* Orbis service worker: keeps the app working offline. */
const CACHE = "orbis-8f4b436382";
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts/fonts.css",
  "vendor/three.module.min.js",
  "vendor/addons/controls/OrbitControls.js",
  "fonts/AtkinsonHyperlegible-italic-latin-3dfb9b.woff2",
  "fonts/AtkinsonHyperlegible-italic-latin-ext-5e93bb.woff2",
  "fonts/AtkinsonHyperlegible-normal-latin-7cd82a.woff2",
  "fonts/AtkinsonHyperlegible-normal-latin-ext-45959b.woff2",
  "fonts/AtkinsonHyperlegible-normal-latin-ext-ab0f02.woff2",
  "fonts/AtkinsonHyperlegible-normal-latin-fd943e.woff2",
  "fonts/BodoniModa-italic-latin-5d0b87.woff2",
  "fonts/BodoniModa-italic-latin-ext-f43160.woff2",
  "fonts/BodoniModa-normal-latin-aad168.woff2",
  "fonts/BodoniModa-normal-latin-ext-212245.woff2",
  "fonts/DMMono-normal-latin-6d9330.woff2",
  "fonts/DMMono-normal-latin-7e5f82.woff2",
  "fonts/DMMono-normal-latin-ext-1cb063.woff2",
  "fonts/DMMono-normal-latin-ext-5eb3b9.woff2",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/favicon.ico",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
  "tex/earth-clouds.webp",
  "tex/earth-day.webp",
  "tex/earth-night.webp",
  "tex/earth-water.png",
  "tex/jupiter.webp",
  "tex/mars.webp",
  "tex/mercury.webp",
  "tex/milkyway.webp",
  "tex/moon.webp",
  "tex/neptune.webp",
  "tex/saturn-ring.png",
  "tex/saturn.webp",
  "tex/sun.webp",
  "tex/uranus.webp",
  "tex/venus.webp",
  "photos/cena-s.webp",
  "photos/lmc-s.webp",
  "photos/m101-s.webp",
  "photos/m104-s.webp",
  "photos/m31-s.webp",
  "photos/m33-s.webp",
  "photos/m51-s.webp",
  "photos/m87-s.webp",
  "photos/momz14-s.webp",
  "photos/mw-s.webp",
  "photos/smc-s.webp",
  "img/addax.webp",
  "img/adelie.webp",
  "img/andeancat.webp",
  "img/apollo.webp",
  "img/arcticfox.webp",
  "img/arctichare.webp",
  "img/arcticwolf.webp",
  "img/ayeaye.webp",
  "img/condor.webp",
  "img/emperor.webp",
  "img/fairytern.webp",
  "img/fennec.webp",
  "img/fossa.webp",
  "img/giantrat.webp",
  "img/groundsquirrel.webp",
  "img/himbear.webp",
  "img/hoiho.webp",
  "img/ilipika.webp",
  "img/ivorygull.webp",
  "img/jumpspider.webp",
  "img/kaka.webp",
  "img/kakapo.webp",
  "img/kaki.webp",
  "img/kea.webp",
  "img/krill.webp",
  "img/leafmouse.webp",
  "img/lemming.webp",
  "img/liolaemus.webp",
  "img/molevole.webp",
  "img/monal.webp",
  "img/mouselemur.webp",
  "img/muskox.webp",
  "img/paragehyra.webp",
  "img/pardosa.webp",
  "img/pochard.webp",
  "img/ptarmigan.webp",
  "img/redpanda.webp",
  "img/roylepika.webp",
  "img/sandcat.webp",
  "img/shorttailbat.webp",
  "img/silverant.webp",
  "img/silverfish.webp",
  "img/skua.webp",
  "img/snowcock.webp",
  "img/snowleopard.webp",
  "img/snowpetrel.webp",
  "img/snowyowl.webp",
  "img/specbear.webp",
  "img/tahr.webp",
  "img/takahe.webp",
  "img/tragopan.webp",
  "img/tsquirrel.webp",
  "img/tuatara.webp",
  "img/vicuna.webp",
  "img/weddell.webp"
];

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
