/* Orbis service worker: keeps the app working offline. */
const CACHE = "orbis-f1c0f162ea";
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
  "img/barreleye.webp",
  "img/birchmouse.webp",
  "img/brookesia.webp",
  "img/bulletant.webp",
  "img/bumpysnail.webp",
  "img/caecilian.webp",
  "img/casper.webp",
  "img/chiton.webp",
  "img/condor.webp",
  "img/cordyceps.webp",
  "img/crabeater.webp",
  "img/dumbo.webp",
  "img/emperor.webp",
  "img/fairytern.webp",
  "img/fennec.webp",
  "img/flyingsquirrel.webp",
  "img/fossa.webp",
  "img/fulgora.webp",
  "img/giantrat.webp",
  "img/gigantactis.webp",
  "img/glassfrog.webp",
  "img/glaucus.webp",
  "img/goliath.webp",
  "img/groundsquirrel.webp",
  "img/harpy.webp",
  "img/helmetvanga.webp",
  "img/himbear.webp",
  "img/hirondellea.webp",
  "img/hoatzin.webp",
  "img/hoiho.webp",
  "img/hornedviper.webp",
  "img/icefish.webp",
  "img/ilipika.webp",
  "img/indri.webp",
  "img/ivorygull.webp",
  "img/jerboa.webp",
  "img/jumpspider.webp",
  "img/kaka.webp",
  "img/kakapo.webp",
  "img/kaki.webp",
  "img/kea.webp",
  "img/kinkajou.webp",
  "img/krill.webp",
  "img/lammergeier.webp",
  "img/leafcutter.webp",
  "img/leafmouse.webp",
  "img/lemming.webp",
  "img/liolaemus.webp",
  "img/mesite.webp",
  "img/midge.webp",
  "img/molevole.webp",
  "img/monal.webp",
  "img/mouselemur.webp",
  "img/mtnfinch.webp",
  "img/muskox.webp",
  "img/paragehyra.webp",
  "img/pardosa.webp",
  "img/pelican.webp",
  "img/phantom.webp",
  "img/pochard.webp",
  "img/ptarmigan.webp",
  "img/redpanda.webp",
  "img/roylepika.webp",
  "img/sandcat.webp",
  "img/sandfish.webp",
  "img/sandfox.webp",
  "img/sapphirina.webp",
  "img/seapig.webp",
  "img/shorttailbat.webp",
  "img/silverant.webp",
  "img/silverfish.webp",
  "img/skua.webp",
  "img/slothmoth.webp",
  "img/snailfish.webp",
  "img/snowbunting.webp",
  "img/snowcock.webp",
  "img/snowleopard.webp",
  "img/snowpetrel.webp",
  "img/snowyowl.webp",
  "img/specbear.webp",
  "img/tahr.webp",
  "img/takahe.webp",
  "img/titicacafrog.webp",
  "img/tragopan.webp",
  "img/tripod.webp",
  "img/tsquirrel.webp",
  "img/tuatara.webp",
  "img/uakari.webp",
  "img/vampire.webp",
  "img/vicuna.webp",
  "img/weddell.webp",
  "img/xeno.webp",
  "img/yeti.webp"
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
