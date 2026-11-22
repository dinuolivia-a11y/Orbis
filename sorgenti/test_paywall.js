// The free part and the «Orbis completo» invitation, in the built app (app/).
// Run: node sorgenti/test_paywall.js [folder for screenshots]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', 'app'), OUT = process.argv[2] || '';
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', webmanifest: 'application/manifest+json', webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon', woff2: 'font/woff2' };
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/unlock') {   // a pretend server: the paid session cs_paid
    let b = ''; req.on('data', (c) => b += c); req.on('end', () => {
      const q = JSON.parse(b || '{}'), ok = q.session === 'cs_paid';
      res.writeHead(ok ? 200 : 404, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(ok ? { pass: { t: 'x.y', code: 'ORB-7KQ4-M2XD' }, code: 'ORB-7KQ4-M2XD' } : { error: 'no' }));
    }); return;
  }
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[f.split('.').pop()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
server.listen(0, '127.0.0.1', async () => {
  const BASE = `http://localhost:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
  await ctx.addInitScript(() => { try { localStorage.setItem('orbis-lang', 'it'); localStorage.setItem('orbis-cur-day', String(Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000))); } catch (e) {} });
  const pg = await ctx.newPage(), errs = [], fails = [];
  pg.on('pageerror', (e) => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' '))); 
  const check = async (name, js) => { const ok = await pg.evaluate(js); if (!ok) fails.push(name); console.log((ok ? 'PASS ' : 'FAIL ') + name); };
  let n = 0; const shot = async (name) => { if (OUT) await pg.screenshot({ path: path.join(OUT, `${String(++n).padStart(2, '0')}_${name}.png`) }); };
  const open = async (hash) => { await pg.goto('about:blank'); await pg.goto(BASE + hash); await pg.waitForFunction(() => document.getElementById('loading').classList.contains('gone') || document.getElementById('loading').hidden, null, { timeout: 30000 }).catch(() => {}); await pg.waitForTimeout(1200); };

  await open('#lezioni');
  await check('the lessons list opens', () => !document.getElementById('lessons').hidden);
  await check('locked lessons carry a lock', () => document.querySelectorAll('.l-card.locked').length > 10);
  await check('the game lessons stay free', () => ['acidi-basi', 'tavola-periodica', 'acqua'].every((id) => { const c = document.querySelector(`.l-card[data-id="${id}"]`); return c && !c.classList.contains('locked'); }));
  await check('the invitation strip is there', () => !!document.getElementById('l-invite'));
  await shot('lezioni');
  await pg.click('.l-card.locked');
  await pg.waitForTimeout(400);
  await check('a locked lesson opens the invitation', () => !document.getElementById('pay').hidden && !document.querySelector('.l-body, .l-lesson') && location.hash === '#lezioni');
  await shot('invito');
  await pg.click('#pay-x');
  await pg.click('.l-card[data-id="acidi-basi"]');
  await pg.waitForTimeout(500);
  await check('a free lesson opens', () => location.hash === '#lezioni/acidi-basi' && document.getElementById('pay').hidden);

  await open('#oceano');
  await check('a descent link opens the invitation over the Earth', () => !document.getElementById('pay').hidden && document.getElementById('dive').hidden && location.hash === '#terra');
  await shot('discesa');
  await pg.click('#pay-buy'); await pg.waitForTimeout(800);
  await check('buying without a server says purchases open soon', () => /breve/.test(document.getElementById('pay-msg').textContent));

  await open('#gioco');
  await check('the first room of the game is free', () => !document.getElementById('game').hidden && document.getElementById('pay').hidden);

  await pg.goto('about:blank'); await pg.goto(BASE.replace('index.html', '') + '?sessione=cs_paid#sistema'); await pg.waitForTimeout(2500);
  await check('back from Stripe it unlocks by itself and shows the code', () => !document.getElementById('pay').hidden && document.getElementById('pay-thecode').textContent === 'ORB-7KQ4-M2XD' && !location.search && !!localStorage.getItem('orbis-pass'));
  await shot('grazie');
  await pg.click('#pay-go');
  await open('#lezioni');
  await check('with Orbis completo nothing is locked', () => !document.querySelector('.l-card.locked') && !document.getElementById('l-invite'));
  await open('#oceano');
  await check('with Orbis completo the descent opens', () => !document.getElementById('dive').hidden && document.getElementById('pay').hidden);
  await check('the builders page stays hidden for buyers', () => document.getElementById('open-lab').hidden);
  await pg.evaluate(() => localStorage.setItem('orbis-pass', JSON.stringify({ t: 'test', owner: true })));
  await open('#sistema');
  await check('the owner sees the builders page', () => !document.getElementById('open-lab').hidden);

  console.log(fails.length || errs.length ? `FAILED ${fails.length} | page errors: ${errs.join(' / ') || 'none'}` : 'ALL PASSED | page errors: none');
  await browser.close(); server.close(); process.exit(fails.length || errs.length ? 1 : 0);
});
