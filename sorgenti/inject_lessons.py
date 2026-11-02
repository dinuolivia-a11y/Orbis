#!/usr/bin/env python3
"""Put the science mini-lessons into Orbis (site/index.html).

Sources: lessons/NN-*.js (the lessons, one file per subject, more can be added),
lessons/ui.js (interface, drawings, experiments) and lessons/style.css.
Running it again replaces the previous copy, so to add lessons: edit or add a file
in lessons/ and run this script. The small hooks into the rest of the app are
applied once.
"""
import os, re, sys
SITE = "/home/claude/cosmo/site/index.html"; SRC = "/home/claude/cosmo/lessons"
s = open(SITE, encoding="utf-8").read()

def block(text, begin, end, content, anchor, before=True):
    global s
    if begin in s:
        i = s.index(begin); j = s.index(end) + len(end)
        s = s[:i] + begin + content + end + s[j:]
    else:
        assert s.count(anchor) == 1, f"anchor not unique: {anchor[:50]}"
        ins = begin + content + end
        s = s.replace(anchor, ins + anchor if before else anchor + ins)

css = open(f"{SRC}/style.css", encoding="utf-8").read()
block(s, "/* LESSONS-CSS:BEGIN */\n", "/* LESSONS-CSS:END */\n", css, "</style>")

html = '<section class="page lessons" id="lessons" hidden><div class="inner" id="lessons-inner"></div></section>\n'
block(s, "<!-- LESSONS-HTML:BEGIN -->\n", "<!-- LESSONS-HTML:END -->\n", html,
      '<section class="page" id="credits" hidden><div class="inner" id="credits-inner"></div></section>\n', before=False)

files = sorted(f for f in os.listdir(SRC) if re.match(r"\d\d-.*\.js$", f))
data = "const LESSONS = [];\n" + "".join(open(f"{SRC}/{f}", encoding="utf-8").read() for f in files)
ui = open(f"{SRC}/ui.js", encoding="utf-8").read()
block(s, "/* LESSONS-JS:BEGIN */\n", "/* LESSONS-JS:END */\n", data + "\n" + ui, "if (/[?&]debug\\b/.test(location.search))")

# one-time hooks into the rest of the app
hooks = [
 ('  nav: { solar: { it: "Sistema solare", en: "Solar system" }, earth: { it: "Terra", en: "Earth" }, galaxies: { it: "Galassie", en: "Galaxies" }, exo: { it: "Esopianeti", en: "Exoplanets" } },',
  '  nav: { solar: { it: "Sistema solare", en: "Solar system" }, earth: { it: "Terra", en: "Earth" }, galaxies: { it: "Galassie", en: "Galaxies" }, exo: { it: "Esopianeti", en: "Exoplanets" }, lessons: { it: "Lezioni", en: "Lessons" } },'),
 ('''  const order = [["solar", "solar"], ["earth", "earth"], ["galaxies", "galaxies"], ["exo", "exo"]];
  $("nav").innerHTML = order.map(([v]) => `<button type="button" data-v="${v}" ${VIEW === v ? 'aria-current="page"' : ""}>${esc(t(UI.nav[v]))}</button>`).join("");
  $("nav").querySelectorAll("button").forEach((b) => b.onclick = () => { if (!diveEl.hidden) { diveEl.hidden = true; overlayOpen = null; dive = null; cancelAnimationFrame(moteRaf); } if (b.dataset.v !== VIEW) setView(b.dataset.v); else resetView(); });''',
  '''  const order = [["solar", "solar"], ["earth", "earth"], ["galaxies", "galaxies"], ["exo", "exo"], ["lessons", "lessons"]];
  const lessonsOn = !$("lessons").hidden, cur = lessonsOn ? "lessons" : VIEW;
  $("nav").innerHTML = order.map(([v]) => `<button type="button" data-v="${v}" ${cur === v ? 'aria-current="page"' : ""}>${v === "solar" ? `<span class="nl">${esc(t(UI.nav[v]))}</span><span class="ns">${esc(t({ it: "Sistema", en: "Planets" }))}</span>` : esc(t(UI.nav[v]))}</button>`).join("");
  $("nav").querySelectorAll("button").forEach((b) => b.onclick = () => {
    if (b.dataset.v === "lessons") { if (lessonsOn && lessonOpen) { renderLessonList(); setHash("lezioni"); } else if (!lessonsOn) openLessons(null); return; }
    if (lessonsOn) { closeLessons(); if (b.dataset.v === VIEW) { setHash(VIEW === "solar" ? "sistema" : VIEW === "earth" ? "terra" : VIEW === "galaxies" ? "galassie" : "esopianeti"); return; } }
    if (!diveEl.hidden) { diveEl.hidden = true; overlayOpen = null; dive = null; cancelAnimationFrame(moteRaf); } if (b.dataset.v !== VIEW) setView(b.dataset.v); else resetView(); });'''),
 ('''  $("lab").hidden = true; $("credits").hidden = true;
  if (!diveEl.hidden) { diveEl.hidden = true; dive = null; cancelAnimationFrame(moteRaf); }
  overlayOpen = null;''',
  '''  $("lab").hidden = true; $("credits").hidden = true; closeLessons();
  if (!diveEl.hidden) { diveEl.hidden = true; dive = null; cancelAnimationFrame(moteRaf); }
  overlayOpen = null;'''),
 ('''  hideOverlays();
  if (g.v === "dive")''', '''  if (g.v === "lesson") { openLessons(g.id); return; }
  hideOverlays();
  if (g.v === "dive")'''),
 ('''  else if (h === "laboratorio") { setView("solar", { instant: true }); openPage("lab"); }''',
  '''  else if (h === "lezioni" || h.startsWith("lezioni/")) { setView("solar", { instant: true }); openLessons(h.slice(8) || null); }
  else if (h === "laboratorio") { setView("solar", { instant: true }); openPage("lab"); }'''),
 ('''  if (!$("cur").hidden) { closeCur(); return; }''',
  '''  if (!$("cur").hidden) { closeCur(); return; }
  if (!$("lessons").hidden) { if (lessonOpen) { renderLessonList(); setHash("lezioni"); } else closeLessons(); return; }'''),
 ('''  if (!$("lab").hidden) renderLab(); if (!$("credits").hidden) renderCredits();
}''', '''  if (!$("lab").hidden) renderLab(); if (!$("credits").hidden) renderCredits();
  if (!$("lessons").hidden) { if (lessonOpen) renderLesson(lessonOpen); else renderLessonList(); measureBar(); }
}'''),
 ('''  renderer.setSize(w, h, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); applyOffset();''',
  '''  renderer.setSize(w, h, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); applyOffset(); measureBar();'''),
]
for a, b in hooks:
    if b in s: continue
    assert s.count(a) == 1, "hook anchor not found: " + a[:70]
    s = s.replace(a, b)
open(SITE, "w", encoding="utf-8").write(s)
n = len(re.findall(r'^\{ id: "', data, re.M))
print(f"{n} lessons from {len(files)} files")
