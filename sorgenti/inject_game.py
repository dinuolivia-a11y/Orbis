#!/usr/bin/env python3
"""Put the Laboratory (the game) into Orbis (site/index.html).

Sources: game/game.js (steps, experiments, riddles, drawings) and game/style.css.
Run it AFTER inject_lessons.py. Running it again replaces the previous copy.
"""
SITE = "/home/claude/cosmo/site/index.html"; SRC = "/home/claude/cosmo/game"
s = open(SITE, encoding="utf-8").read()

def block(begin, end, content, anchor, before=True):
    global s
    if begin in s:
        i = s.index(begin); j = s.index(end) + len(end)
        s = s[:i] + begin + content + end + s[j:]
    else:
        assert s.count(anchor) == 1, f"anchor not unique: {anchor[:50]}"
        ins = begin + content + end
        s = s.replace(anchor, ins + anchor if before else anchor + ins)

block("/* GAME-CSS:BEGIN */\n", "/* GAME-CSS:END */\n", open(f"{SRC}/style.css", encoding="utf-8").read(), "</style>")
html = '<section class="page game" id="game" hidden><div class="inner" id="game-inner"></div></section>\n<div class="g-return" id="game-return" hidden></div>\n'
block("<!-- GAME-HTML:BEGIN -->\n", "<!-- GAME-HTML:END -->\n", html, "<!-- LESSONS-HTML:END -->\n", before=False)
block("/* GAME-JS:BEGIN */\n", "/* GAME-JS:END */\n", open(f"{SRC}/game.js", encoding="utf-8").read(), "/* LESSONS-JS:END */\n", before=False)

hooks = [
 ('''  else if (h === "lezioni" || h.startsWith("lezioni/")) {''',
  '''  else if (h === "gioco") { setView("solar", { instant: true }); openGame(null, false); }
  else if (h === "lezioni" || h.startsWith("lezioni/")) {'''),
 ('''  $("cur-chip").textContent = t(UI.cur.chip); if (!$("cur").hidden) renderCur();''',
  '''  $("cur-chip").textContent = t(UI.cur.chip); if (!$("cur").hidden) renderCur();
  if (!$("game").hidden) renderGame();'''),
 # the game has its own display typeface (the installable build has it in fonts/, see fonts.css)
 ("&family=DM+Mono:wght@400;500&display=swap", "&family=DM+Mono:wght@400;500&family=Grandstander:wght@500..800&display=swap"),
]
for a, b in hooks:
    if b in s: continue
    assert s.count(a) == 1, "hook anchor not found: " + a[:70]
    s = s.replace(a, b)
open(SITE, "w", encoding="utf-8").write(s)
print("game injected")
