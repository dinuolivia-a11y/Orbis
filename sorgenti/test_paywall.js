// The free part and the «Orbis completo» invitation, in the built app (app/),
// with a pretend server (api/) and a pretend «Sign in with Google».
// Run: node sorgenti/test_paywall.js [folder for screenshots]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', 'app'), OUT = process.argv[2] || '';
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', webmanifest: 'application/manifest+json', webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon', woff2: 'font/woff2' };
let serverReady = false; const claimed = new Set();
const api = (req, res) => {
  let b = ''; req.on('data', (c) => b += c); req.on('end', () => {
    const q = JSON.parse(b || '{}'), send = (s, d) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(d)); };
    if (!serverReady) return send(404, {});
    if (req.url === '/api/config') return send(200, { ready: true, google: 'test.apps.googleusercontent.com' });
    if (req.url === '/api/checkout') {
      if (q.idToken === 'tok-paid') return send(200, { pass: { t: 'a.b' } });
      if (q.idToken === 'tok-owner') return send(200, { pass: { t: 'a.c', owner: true } });
      if (q.idToken === 'tok-new') return send(200, { url: '/index.html?sessione=cs_new#sistema' });
      return send(401, {});
    }
    if (req.url === '/api/unlock') {
      if (q.session === 'cs_new') { if (claimed.has('cs_new')) return send(409, {}); claimed.add('cs_new'); return send(200, { pass: { t: 'a.d' } }); }
      return send(404, {});
    }
    send(404, {});
  });
};
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) return api(req, res);
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[f.split('.').pop()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
// The pretend Google script: a button that signs in with the token in window.__tok.
const FAKE_GSI = `window.google = { accounts: { id: { initialize(o) { window.__gsi = o; }, renderButton(el) { const b = document.createElement('button'); b.id = 'fake-google'; b.textContent = 'Continua con Google'; b.onclick = () => window.__gsi.callback({ credential: window.__tok }); el.appendChild(b); } } } };`;
server.listen(0, '127.0.0.1', async () => {
  const BASE = `http://localhost:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
  await ctx.route('https://accounts.google.com/gsi/client', (r) => r.fulfill({ contentType: 'text/javascript', body: FAKE_GSI }));
  await ctx.addInitScript(() => { try { localStorage.setItem('orbis-lang', 'it'); localStorage.setItem('orbis-cur-day', String(Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000))); } catch (e) {} });
  const pg = await ctx.newPage(), errs = [], fails = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  const check = async (name, js) => { const ok = await pg.evaluate(js); if (!ok) fails.push(name); console.log((ok ? 'PASS ' : 'FAIL ') + name); };
  let n = 0; const shot = async (name) => { if (OUT) await pg.screenshot({ path: path.join(OUT, `${String(++n).padStart(2, '0')}_${name}.png`) }); };
  const open = async (hash, query = '') => { await pg.goto('about:blank'); await pg.goto(BASE + query + hash); await pg.waitForTimeout(1500); };
  const signIn = async (tok) => { await pg.evaluate((x) => { window.__tok = x; }, tok); await pg.click('#fake-google'); await pg.waitForTimeout(1200); };

  await open('#lezioni');
  await check('the lessons list opens', () => !document.getElementById('lessons').hidden);
  await check('locked lessons carry a lock', () => document.querySelectorAll('.l-card.locked').length > 10);
  await check('the game lessons stay free', () => ['acidi-basi', 'tavola-periodica', 'acqua'].every((id) => { const c = document.querySelector(`.l-card[data-id="${id}"]`); return c && !c.classList.contains('locked'); }));
  await shot('lezioni');
  await pg.click('.l-card.locked'); await pg.waitForTimeout(800);
  await check('a locked lesson opens the invitation', () => !document.getElementById('pay').hidden && location.hash === '#lezioni');
  await check('with no server yet it says purchases open soon', () => /breve/.test(document.getElementById('pay-msg').textContent) && !document.getElementById('fake-google'));
  await pg.click('#pay-x');
  await pg.click('.l-card[data-id="acidi-basi"]'); await pg.waitForTimeout(500);
  await check('a free lesson opens', () => location.hash === '#lezioni/acidi-basi' && document.getElementById('pay').hidden);
  await open('#oceano');
  await check('a descent link opens the invitation over the Earth', () => !document.getElementById('pay').hidden && document.getElementById('dive').hidden && location.hash === '#terra');
  await open('#gioco');
  await check('the first room of the game is free', () => !document.getElementById('game').hidden && document.getElementById('pay').hidden);

  serverReady = true;
  await open('#oceano');
  await pg.waitForSelector('#fake-google', { timeout: 5000 }).catch(() => {});
  await check('the invitation shows «Continua con Google»', () => !!document.getElementById('fake-google'));
  await shot('invito');
  await signIn('tok-new');
  await pg.waitForTimeout(1500);
  await check('a new account pays and comes back: everything opens by itself', () => !document.getElementById('pay').hidden && /Grazie/.test(document.getElementById('pay-h').textContent) && !location.search && !!localStorage.getItem('orbis-pass'));
  await shot('grazie');
  await pg.click('#pay-go');
  await open('#lezioni');
  await check('with Orbis completo nothing is locked', () => !document.querySelector('.l-card.locked') && !document.getElementById('l-invite'));
  await open('#oceano');
  await check('with Orbis completo the descent opens', () => !document.getElementById('dive').hidden && document.getElementById('pay').hidden);
  await check('the builders page stays hidden for buyers', () => document.getElementById('open-lab').hidden);

  await pg.evaluate(() => localStorage.removeItem('orbis-pass'));
  await open('#sistema', '?sessione=cs_new');
  await check('the return link does not work a second time', () => !localStorage.getItem('orbis-pass') && !document.getElementById('pay').hidden && !/Grazie/.test(document.getElementById('pay-h').textContent));
  await signIn('tok-paid');
  await check('on another device the same Google account opens everything', () => !!localStorage.getItem('orbis-pass') && document.getElementById('pay').hidden);
  await pg.evaluate(() => localStorage.removeItem('orbis-pass'));
  await open('#oceano'); await signIn('tok-owner');
  await check('the owner signs in and never pays', () => JSON.parse(localStorage.getItem('orbis-pass')).owner === true && !document.getElementById('open-lab').hidden);

  console.log(fails.length || errs.length ? `FAILED ${fails.length} | page errors: ${errs.join(' / ') || 'none'}` : 'ALL PASSED | page errors: none');
  await browser.close(); server.close(); process.exit(fails.length || errs.length ? 1 : 0);
});
