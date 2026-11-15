import asyncio, functools, threading, http.server, socketserver, sys
from playwright.async_api import async_playwright
ROOT = '/home/claude/cosmo/pwa'; OUT = '/home/claude/cosmo/test/game_shots'; PORT = 8823
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.webp': 'image/webp', '.js': 'text/javascript'}
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(H, directory=ROOT)); threading.Thread(target=srv.serve_forever, daemon=True).start()
B = f'http://localhost:{PORT}/?debug'
SKIP = 'try{localStorage.setItem("orbis-cur-day", String(Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000)))}catch(e){}'
fails = []
def check(n, ok, info=''):
    print(('PASS ' if ok else 'FAIL ') + n, info)
    if not ok: fails.append(n)
async def ready(pg): await pg.wait_for_function('document.getElementById("loading").hidden === true', timeout=90000); await pg.wait_for_timeout(700)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        for name, vp, mob in [('phone', {'width': 393, 'height': 873}, True), ('desk', {'width': 1280, 'height': 860}, False)]:
            ctx = await b.new_context(viewport=vp, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob, service_workers='block'); await ctx.add_init_script(SKIP)
            pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
            shot = lambda n: pg.screenshot(path=f'{OUT}/{name}_{n}.png')
            txt = lambda sel: pg.evaluate(f'(document.querySelector({sel!r})||{{}}).textContent||""')
            await pg.goto(B + '#sistema'); await ready(pg)
            await pg.click('#nav button[data-v="lessons"]'); await pg.wait_for_timeout(400)
            check(f'{name}: banner in lessons', await pg.evaluate('!!document.getElementById("g-banner")')); await shot('00_banner')
            await pg.click('#g-banner'); await pg.wait_for_timeout(400)
            check(f'{name}: game opens', await pg.evaluate('!document.getElementById("game").hidden && location.hash==="#gioco"'))
            check(f'{name}: 5 steps, 4 locked', await pg.evaluate('document.querySelectorAll(".g-step").length===5 && document.querySelectorAll(".g-step.lock").length===4'))
            await shot('01_home'); await pg.evaluate('document.getElementById("game").scrollTop=700'); await pg.wait_for_timeout(200); await shot('01_home_b')
            # step 1: volcano
            await pg.click('.g-step button[data-id="vulcano"]'); await pg.wait_for_timeout(200); await shot('02_bet')
            await pg.click('.g-opt[data-i="0"]'); await pg.click('#g-go'); await pg.wait_for_timeout(300)
            await pg.click('.g-in[data-k="acqua"]'); await pg.wait_for_timeout(900); await pg.click('.g-in[data-k="sale"]'); await pg.wait_for_timeout(1000)
            check(f'{name}: water+salt no reaction', await pg.evaluate('document.getElementById("g-doneline").hidden'), await txt('#g-status'))
            await pg.click('#g-empty'); await pg.click('.g-in[data-k="bicarbonato"]'); await pg.wait_for_timeout(900); await shot('03_pile')
            await pg.click('.g-in[data-k="aceto"]'); await pg.wait_for_timeout(2200); await shot('03_foam'); await pg.wait_for_timeout(1500)
            check(f'{name}: volcano goal', await pg.evaluate('!document.getElementById("g-doneline").hidden'), await txt('#g-status'))
            await pg.click('#g-learn'); await pg.wait_for_timeout(200); await shot('04_learn')
            check(f'{name}: 2 stars for right bet', await pg.evaluate('JSON.parse(localStorage.getItem("orbis-game")).done.vulcano===2'))
            await pg.click('#g-next'); await pg.wait_for_timeout(200)
            # step 2: lock, with a trip to a lesson and back
            check(f'{name}: lock step', await pg.evaluate('!!document.getElementById("g-lock")')); 
            await pg.click('[data-where="0"]'); await pg.wait_for_timeout(100); await shot('05_lock')
            await pg.click('[data-go="0"]'); await pg.wait_for_timeout(500)
            check(f'{name}: trip to lesson', await pg.evaluate('document.getElementById("game").hidden && !document.getElementById("lessons").hidden && !document.getElementById("game-return").hidden && location.hash==="#lezioni/acidi-basi"')); await shot('06_trip')
            await pg.click('#g-ret-go'); await pg.wait_for_timeout(300)
            check(f'{name}: back to the lock, hint kept', await pg.evaluate('!!document.getElementById("g-lock") && !!document.querySelector("[data-go=\\"0\\"]") && document.getElementById("game-return").hidden'))
            await pg.click('#g-open'); check(f'{name}: wrong code refused', '0' in await txt('#g-status'), await txt('#g-status'))
            for i, n in enumerate([7, 8, 2]):
                for _ in range(n if n <= 5 else 0): await pg.click(f'.g-dial button[data-i="{i}"][data-d="1"]')
                for _ in range(10 - n if n > 5 else 0): await pg.click(f'.g-dial button[data-i="{i}"][data-d="-1"]')
            await pg.click('#g-open'); await pg.wait_for_timeout(200)
            check(f'{name}: lock opens, 3 stars', await pg.evaluate('JSON.parse(localStorage.getItem("orbis-game")).done.lucchetto===3')); await shot('07_lock_open')
            await pg.click('#g-next'); await pg.wait_for_timeout(200)
            # step 3: cabbage (wrong bet on purpose)
            await pg.click('.g-opt[data-i="0"]'); await pg.click('#g-go'); await pg.wait_for_timeout(300)
            await pg.click('.g-in[data-k="limone"]'); await pg.wait_for_timeout(1700); await shot('08_pink')
            await pg.click('.g-in[data-k="bicarbonato"]'); await pg.wait_for_timeout(1300); await shot('08_fizz')
            await pg.click('#g-empty'); await pg.click('.g-in[data-k="bicarbonato"]'); await pg.wait_for_timeout(1700); await shot('08_blue')
            await pg.click('.g-in[data-k="sapone"]'); await pg.wait_for_timeout(3000); await shot('08_green')
            check(f'{name}: cabbage goal', await pg.evaluate('!document.getElementById("g-doneline").hidden'), await txt('#g-found'))
            await pg.click('#g-learn'); await pg.wait_for_timeout(200)
            check(f'{name}: 1 star for wrong bet', await pg.evaluate('JSON.parse(localStorage.getItem("orbis-game")).done.cavolo===1')); await shot('09_learn_wrong')
            await pg.click('#g-next'); await pg.wait_for_timeout(300)
            # step 4: who am I, with one mistake and a trip to the Himalaya
            await shot('10_who1'); await pg.click('.g-tile[data-id="mars"]'); await pg.click('.g-tile[data-id="venus"]'); await pg.wait_for_timeout(1500)
            await shot('10_who2'); await pg.click('#g-where'); await pg.click('#g-go'); await pg.wait_for_timeout(1500)
            check(f'{name}: trip to the Himalaya', await pg.evaluate('document.getElementById("game").hidden && document.getElementById("lessons").hidden && !document.getElementById("game-return").hidden')); await shot('11_trip_dive')
            await pg.click('#g-ret-go'); await pg.wait_for_timeout(400)
            check(f'{name}: back at riddle 2', await pg.evaluate('!!document.querySelector(".g-tile[data-id=\\"lammergeier\\"]")'))
            await pg.click('.g-tile[data-id="lammergeier"]'); await pg.wait_for_timeout(1500)
            check(f'{name}: who done, 2 stars', await pg.evaluate('JSON.parse(localStorage.getItem("orbis-game")).done.chisono===2')); await shot('12_who_done')
            await pg.click('#g-next'); await pg.wait_for_timeout(200)
            # step 5: tower, oil first
            await pg.click('.g-opt[data-i="1"]'); await pg.click('#g-go'); await pg.wait_for_timeout(300)
            for k in ['olio', 'acqua']: await pg.click(f'.g-in[data-k="{k}"]'); await pg.wait_for_timeout(1100)
            await pg.click('.g-in[data-k="uva"]'); await pg.wait_for_timeout(1500); await shot('13_tower_a')
            await pg.click('.g-in[data-k="miele"]'); await pg.wait_for_timeout(1000); await shot('13_tower_b')
            for k in ['moneta', 'tappo']: await pg.click(f'.g-in[data-k="{k}"]'); await pg.wait_for_timeout(400)
            await pg.wait_for_timeout(3200); await shot('13_tower_c')
            check(f'{name}: tower goal', await pg.evaluate('!document.getElementById("g-doneline").hidden'))
            await pg.click('#g-learn'); await pg.wait_for_timeout(200); await pg.click('#g-next'); await pg.wait_for_timeout(1500)
            check(f'{name}: room complete', await pg.evaluate('!!document.querySelector(".g-room.s5") && document.querySelectorAll(".g-step.done").length===5'), await txt('.g-count')); await shot('14_home_done')
            # english, reload, close
            await pg.click('#lang-en'); await pg.wait_for_timeout(300); check(f'{name}: english', 'Laboratory' in await txt('#game-inner h1')); await shot('15_en'); await pg.click('#lang-it')
            await pg.goto(B + '#sistema'); await pg.goto(B + '#gioco'); await pg.reload(); await ready(pg)
            check(f'{name}: direct link keeps progress', await pg.evaluate('!document.getElementById("game").hidden && document.querySelectorAll(".g-step.done").length===5'), str(await pg.evaluate('[location.hash, document.getElementById("game").hidden, document.querySelectorAll(".g-step.done").length, localStorage.getItem("orbis-game"), document.getElementById("loading").hidden]')))
            await pg.click('#nav button[data-v="lessons"]'); await pg.wait_for_timeout(300)
            check(f'{name}: lessons tab closes game', await pg.evaluate('document.getElementById("game").hidden && !document.getElementById("lessons").hidden && document.querySelectorAll(".l-card").length===52'))
            await pg.click('#g-banner'); await pg.wait_for_timeout(300); await pg.go_back(); await pg.wait_for_timeout(400)
            check(f'{name}: back button closes game', await pg.evaluate('document.getElementById("game").hidden && !document.getElementById("lessons").hidden'))
            await pg.click('#nav button[data-v="solar"]'); await pg.wait_for_timeout(500)
            check(f'{name}: leaving lessons works', await pg.evaluate('document.getElementById("lessons").hidden && document.getElementById("game").hidden'))
            check(f'{name}: no errors', not errs, str(errs[:4])); await ctx.close()
        await b.close()
asyncio.run(main()); srv.shutdown()
print('FAILS:', fails); sys.exit(1 if fails else 0)
