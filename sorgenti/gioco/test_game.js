// The whole game, played from start to finish on a phone, in the built app (the app/ folder).
// Run: node sorgenti/gioco/test_game.js [folder for screenshots] [it|en]
// Set ORBIS_EDWARD_PREVIEW=1 for the illustrated edition, ORBIS_TEST_URL to test a live copy.
// It needs Playwright for Node. It prints PASS or FAIL for each check and ends with an error if one fails.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..', 'app'), OUT = process.argv[2] || '', LANG = process.argv[3] || 'it';
const preview = process.env.ORBIS_EDWARD_PREVIEW === '1';
const progressKey = preview ? 'orbis-game-edward-preview-v2' : 'orbis-game';
const MIME = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', webmanifest: 'application/manifest+json', webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon', woff2: 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[f.split('.').pop()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
server.listen(0, '127.0.0.1', async () => {
  const entry = preview ? 'anteprima-edward/index.html' : 'index.html';
  const BASE = process.env.ORBIS_TEST_URL || `http://localhost:${server.address().port}/${entry}`;
  const launch = process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } } : {};
  if (process.env.ORBIS_CHROME_CHANNEL) launch.channel = process.env.ORBIS_CHROME_CHANNEL;
  const browser = await chromium.launch(launch);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  // skip the curiosity of the day, which would open over the page
  await ctx.addInitScript((l) => { try { localStorage.setItem('orbis-lang', l); localStorage.setItem('orbis-cur-day', String(Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000))); } catch (e) {} }, LANG);
  const pg = await ctx.newPage(), errs = [], fails = [];
  pg.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  let n = 0; const shot = async (name) => { if (OUT) await pg.screenshot({ path: path.join(OUT, `${String(++n).padStart(2, '0')}_${name}.png`) }); };
  const w = (ms) => pg.waitForTimeout(ms);
  const check = async (name, js, arg) => { const ok = await pg.evaluate(js, arg); if (!ok) fails.push(name); console.log((ok ? 'PASS ' : 'FAIL ') + name); };
  const reviewRewards = async earned => {
    const saved = await pg.evaluate(key => localStorage.getItem(key), progressKey);
    await pg.click('#g-rooms');
    await pg.click('#ed-replay');
    await check('review opens on the empty room', () =>
      !!document.querySelector('.ed-review-scene .g-room.s0') && document.getElementById('ed-prev').disabled);
    for (let i = 0; i < earned; i++) await pg.click('#ed-next');
    await check('review stops at the last earned reward', step =>
      !!document.querySelector('.ed-review-scene .g-room.s' + step) && document.getElementById('ed-next').disabled, earned);
    await pg.click('#ed-prev');
    await pg.click('#g-modal-x');
    await check('returning to the room preserves the award and saved stars', ([key, initial, step]) =>
      !document.querySelector('.ed-review') && !!document.querySelector('#g-scene .g-room.s' + step)
      && localStorage.getItem(key) === initial, [progressKey, saved, earned]);
  };
  const stars = async (id, want) => { const got = await pg.evaluate(([x, key]) => (JSON.parse(localStorage.getItem(key) || '{}').done || {})[x], [id, progressKey]); if (got !== want) fails.push(`${id}: ${got} stars, wanted ${want}`); console.log((got === want ? 'PASS ' : 'FAIL ') + `${id}: ${got} stars`); };
  // back in the room: wait for the title or the cutscene to end, listen to the professor, close the bubble
  const settle = async (name) => {
    await pg.waitForFunction(() => { const s = document.getElementById('g-stage'); return s && !s.classList.contains('cine') && !s.classList.contains('g-intro'); }, null, { timeout: 15000 });
    await w(300);
    if (await pg.evaluate(() => { const t = document.getElementById('g-talk'); return !!t && !t.hidden; })) {
      await w(900); if (name) await shot(name);
      for (let i = 0; i < 4 && await pg.evaluate(() => !document.getElementById('g-talk').hidden); i++) { await pg.click('#g-talk', { position: { x: 200, y: 60 } }); await w(250); }
    }
    await w(700);
  };
  await pg.goto(BASE + '#lezioni', { waitUntil: 'networkidle' });
  await pg.waitForSelector('#g-banner', { timeout: 30000 }); await w(700); await shot('lessons');
  await pg.click('#g-banner'); await w(1000); await shot('title');
  await check('the game opens over the whole screen', () => !document.getElementById('game').hidden && location.hash === '#gioco' && !!document.querySelector('.g-stage.g-home'));
  await settle('professor'); await shot('room_0');
  await check('5 steps, 4 locked', () => document.querySelectorAll('.g-step').length === 5 && document.querySelectorAll('.g-step.lock').length === 4);
  await check('the professor has said hello once', key => JSON.parse(localStorage.getItem(key)).said === 0 && document.getElementById('g-talk').hidden, progressKey);
  await pg.click('#g-rooms'); await w(500); await shot('rooms');
  await check('rooms: one open, three coming', () => document.querySelectorAll('.g-rooms li').length === 4 && document.querySelectorAll('.g-rooms li.lock').length === 3);
  if (preview) await check('rewards appear after the first win', () => !document.getElementById('ed-replay'));
  await pg.click('#g-modal-x'); await w(200);
  // 1 the foam volcano
  await pg.click('#g-play'); await w(400); await shot('bet');
  await pg.click('.g-opt[data-i="0"]'); await w(300); await pg.click('#g-go'); await w(500);
  await pg.click('.g-in[data-k="acqua"]'); await w(900); await pg.click('.g-in[data-k="sale"]'); await w(1000);
  await check('water + salt: no reaction', () => document.getElementById('g-doneline').hidden);
  await pg.click('#g-empty'); await pg.click('.g-in[data-k="bicarbonato"]'); await w(1000); await shot('bench');
  await pg.click('.g-in[data-k="aceto"]'); await w(2300); await shot('foam'); await w(1500);
  if (preview) {
    await shot('foam_rising');
    await pg.waitForSelector('#g-doneline:visible', {timeout: 20000});
    await shot('foam_overflow');
  }
  await check('volcano: mission accomplished', () => !document.getElementById('g-doneline').hidden);
  await pg.click('#g-learn'); await w(1300); await shot('find_out'); await stars('vulcano', 2);
  await pg.click('#g-next'); await w(2300); await shot('cutscene_lamp');
  await check('cutscene: the lamp is on', () => document.querySelector('.g-room').classList.contains('s1'));
  await settle('professor_1'); await shot('room_1');
  if (preview) await reviewRewards(1);
  // 2 the lock, with a trip to a lesson and back
  await pg.click('#g-play'); await w(400);
  await pg.click('[data-where="0"]'); await w(200); await shot('lock');
  await pg.click('[data-go="0"]'); await w(700);
  await check('trip to the lesson', () => document.getElementById('game').hidden && !document.getElementById('lessons').hidden && !document.getElementById('game-return').hidden && location.hash === '#lezioni/acidi-basi'); await shot('trip');
  await pg.click('#g-ret-go'); await w(500);
  await check('back at the lock, hint kept', () => !!document.getElementById('g-lock') && !!document.querySelector('[data-go="0"]') && document.getElementById('game-return').hidden);
  await pg.click('#g-open'); await w(200); await check('wrong code refused', () => /0/.test(document.getElementById('g-status').textContent));
  for (const [i, v] of [[0, 7], [1, 8], [2, 2]]) for (let k = 0; k < (v > 5 ? 10 - v : v); k++) await pg.click(`.g-dial button[data-i="${i}"][data-d="${v > 5 ? -1 : 1}"]`);
  await pg.click('#g-open'); await w(1300); await shot('lock_open'); await stars('lucchetto', 3);
  await pg.click('#g-next'); await w(2300); await shot('cutscene_flasks'); await settle(); await shot('room_2');
  // 3 the colour-changing juice (wrong bet on purpose: one star)
  await pg.click('#g-play'); await w(400); await pg.click('.g-opt[data-i="0"]'); await pg.click('#g-go'); await w(500);
  await pg.click('.g-in[data-k="limone"]'); await w(1800); await shot('juice_pink');
  if (preview) await check('cabbage: the photographed flask is visible behind the liquid', visibleGlass);
  await pg.click('#g-empty'); await pg.click('.g-in[data-k="bicarbonato"]'); await w(1800); await pg.click('.g-in[data-k="sapone"]'); await w(3600);
  await check('juice: four colours found', () => !document.getElementById('g-doneline').hidden);
  await pg.click('#g-learn'); await w(600); await stars('cavolo', 1);
  await pg.click('#g-next'); await w(2300); await shot('cutscene_table'); await settle();
  // 4 who am I? (one wrong tile: two stars)
  await pg.click('#g-play'); await w(400); await shot('who_planet');
  await pg.click('.g-tile[data-id="mars"]'); await w(500); await pg.click('#g-where'); await w(300);
  await check('wrong tile stays crossed out', () => document.querySelector('.g-tile[data-id="mars"]').disabled && !!document.getElementById('g-go'));
  await pg.click('.g-tile[data-id="venus"]'); await w(1600); await shot('who_creature');
  await pg.click('.g-tile[data-id="lammergeier"]'); await w(1700); await stars('chisono', 2);
  await pg.click('#g-next'); await w(2300); await shot('cutscene_telescope'); await settle(); await shot('room_4');
  // 5 the liquid tower
  await pg.click('#g-play'); await w(400); await pg.click('.g-opt[data-i="1"]'); await pg.click('#g-go'); await w(500);
  for (const k of ['olio', 'acqua', 'miele']) { await pg.click(`.g-in[data-k="${k}"]`); await w(1300); }
  for (const k of ['moneta', 'uva', 'tappo']) { await pg.click(`.g-in[data-k="${k}"]`); await w(500); }
  await w(1700); await shot('tower'); await w(1300);
  if (preview) await check('density tower: the photographed glass is visible behind the layers', visibleGlass);
  await check('tower: mission accomplished', () => !document.getElementById('g-doneline').hidden);
  await pg.click('#g-learn'); await w(600); await stars('torre', 2);
  await pg.click('#g-next'); await w(2500); await shot('cutscene_badge'); await settle('professor_5'); await shot('room_5');
  await check('room complete: 10 stars, nothing left to play', () => document.querySelector('#g-count b').textContent === '10' && !document.getElementById('g-play') && document.querySelector('.g-room').classList.contains('s5'));
  if (preview) await reviewRewards(5);
  // leave, come back: the room again, and the professor does not repeat himself
  await pg.click('#g-back'); await w(600); await check('back in the lessons', () => document.getElementById('game').hidden && location.hash === '#lezioni');
  await pg.click('#g-banner'); await settle(); await check('second visit: no speech again', () => document.getElementById('g-talk').hidden && !document.getElementById('game').hidden);
  await pg.click('.g-step button[data-id="vulcano"]'); await w(400); await check('a finished step can be played again', () => !!document.querySelector('.g-opt'));
  if (preview) {
    await pg.goto(BASE.split('#')[0]);
    await pg.waitForSelector('.g-room.s5');
    await check('direct preview link opens the saved room and leaves regular game progress alone', () =>
      location.hash === '#gioco' && document.querySelector('#g-count b').textContent === '10' && !localStorage.getItem('orbis-game'));
  }
  console.log(`${fails.length ? 'FAILED: ' + fails.join('; ') : 'ALL PASSED'} | page errors: ${errs.length ? errs.join('\n') : 'none'}`);
  await browser.close(); server.close(); process.exit(fails.length || errs.length ? 1 : 0);
});

// A canvas can render every ingredient correctly and still hide the entire photograph.
function visibleGlass() {
  const scene = document.querySelector('#g-bench .ec-table');
  const photo = scene && scene.querySelector('img');
  const canvas = scene && scene.querySelector('canvas');
  if (!photo || !photo.naturalWidth || !canvas) return false;
  const style = getComputedStyle(canvas);
  return style.backgroundImage === 'none' && style.backgroundColor === 'rgba(0, 0, 0, 0)';
}
