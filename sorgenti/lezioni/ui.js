/* =========================================================
   MINI-LESSONS OF SCIENCE
   A fifth section: a scrollable library of short lessons, each with a drawing or a small
   experiment to touch. Lessons live in LESSONS (lessons/*.js), added a few at a time:
   give a new one an `added: "YYYY-MM-DD"` date and it shows the "New" badge for two weeks.
   ========================================================= */
const SUBJ = {
  quanti: { it: "Particelle e quanti", en: "Particles & quanta", c: "#b9a4ff" },
  fisica: { it: "Fisica", en: "Physics", c: "#7cbcff" },
  chimica: { it: "Chimica", en: "Chemistry", c: "#ffb45e" },
  vita: { it: "Vita", en: "Life", c: "#86dc93" },
  spazio: { it: "Spazio", en: "Space", c: "#ffd479" },
  terra: { it: "Terra", en: "Earth", c: "#5fd3c6" },
  numeri: { it: "Numeri e idee", en: "Numbers & ideas", c: "#ff92b4" },
  fanta: { it: "E se fosse vero?", en: "What if it were real?", c: "#ff7a6b" }
};
const LESSONS_LAUNCH = "2026-11-02";
const LUI = {
  eyebrow: { it: "Orbis · Lezioni", en: "Orbis · Lessons" },
  title: { it: "Mini lezioni di scienza", en: "Science mini-lessons" },
  lead: { it: "Lezioni brevi ma vere, per curiosi di tutte le età: dai quanti alle stelle, dalle cellule all’infinito, fino ai poteri dei personaggi più famosi. Molte hanno un disegno o un esperimento da toccare.", en: "Short but real lessons for the curious of every age: from quanta to stars, from cells to infinity, all the way to the powers of famous characters. Many come with a drawing or an experiment to touch." },
  all: { it: "Tutte", en: "All" }, newOnes: { it: "Nuove", en: "New" }, isNew: { it: "Nuova", en: "New" },
  search: { it: "Cerca una lezione…", en: "Search the lessons…" }, none: { it: "Nessuna lezione trovata.", en: "No lessons found." },
  min: { it: "min", en: "min" }, read: { it: "letta", en: "read" }, exp: { it: "esperimento", en: "experiment" }, fig: { it: "disegno", en: "drawing" },
  progress: { it: "Ne hai lette {r} su {n}.", en: "You have read {r} of {n}." }, progress0: { it: "{n} lezioni da scoprire.", en: "{n} lessons to discover." },
  back: { it: "Tutte le lezioni", en: "All lessons" }, tryIt: { it: "Prova tu", en: "Try it" }, experiment: { it: "Esperimento", en: "Experiment" },
  goOrbis: { it: "Guardalo in Orbis", en: "See it in Orbis" }, prev: { it: "Precedente", en: "Previous" }, next: { it: "Successiva", en: "Next" },
  reset: { it: "Ricomincia", en: "Start again" },
  more: { it: "Vuoi saperne di più?", en: "Want to know more?" }
};
// The deeper-dive questions of a lesson (09-approfondimenti.js), or its own `more` if it has one.
const lessonMore = (l) => l.more || (typeof LESSON_MORE !== "undefined" && LESSON_MORE[l.id]) || [];
let lessonFilter = "all", lessonQuery = "", lessonOpen = null, lessonStop = null, lessonListScroll = 0, lessonsPushed = false;
const lessonColor = (l) => SUBJ[l.s].c;
function lessonsRead() { try { return new Set(JSON.parse(localStorage.getItem("orbis-lessons-read") || "[]")); } catch (e) { return new Set(); } }
function markLessonRead(id) {
  const s = lessonsRead(); if (s.has(id)) return; s.add(id);
  try { localStorage.setItem("orbis-lessons-read", JSON.stringify([...s])); } catch (e) {}
}
function lessonIsNew(l) {
  if (!l.added || l.added <= LESSONS_LAUNCH) return false;
  const days = (Date.now() - Date.parse(l.added + "T00:00:00")) / 864e5; return days >= 0 && days <= 14;
}
function lessonMinutes(l) {
  const words = [t(l.k), ...l.b.map((b) => t(b.p)), t(l.try), t(l.fact)].join(" ").split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 140) + (l.w ? 1 : 0));
}
function lessonsShown() {
  const q = lessonQuery.trim().toLowerCase();
  return LESSONS.filter((l) => (lessonFilter === "all" || (lessonFilter === "new" ? lessonIsNew(l) : l.s === lessonFilter)) &&
    (!q || [t(l.t), t(l.k), t(SUBJ[l.s]), ...lessonMore(l).map((m) => t(m.q))].join(" ").toLowerCase().includes(q)))
    .map((l, i, arr) => ({ l, k: arr.slice(0, i).filter((x) => x.s === l.s).length * 10 + Object.keys(SUBJ).indexOf(l.s) }))
    .sort((a, b) => (lessonIsNew(b.l) - lessonIsNew(a.l)) || (lessonFilter === "all" && !q ? a.k - b.k : 0)).map((x) => x.l);
}
function measureBar() { const b = document.querySelector(".bar"); if (b) document.documentElement.style.setProperty("--bar-real", b.offsetHeight + "px"); }
function stopLessonWidget() { if (lessonStop) { try { lessonStop(); } catch (e) {} lessonStop = null; } }
function openLessons(id, push) {
  if (!diveEl.hidden) { diveEl.hidden = true; dive = null; cancelAnimationFrame(moteRaf); }
  closeCur(); $("lab").hidden = true; $("credits").hidden = true;
  const P = $("lessons"); P.hidden = false; overlayOpen = "lessons"; document.body.classList.add("lessons-open");
  measureBar();
  const l = id && LESSONS.find((x) => x.id === id);
  if (l) renderLesson(l.id); else renderLessonList();
  const h = l ? "lezioni/" + l.id : "lezioni";
  try { if (push) { history.pushState({ orbisLesson: 1 }, "", "#" + h); lessonsPushed = true; } else history.replaceState(null, "", "#" + h); } catch (e) {}
  renderNav();
}
function closeLessons() {
  if ($("lessons").hidden) return;
  stopLessonWidget(); $("lessons").hidden = true; document.body.classList.remove("lessons-open"); lessonOpen = null; lessonsPushed = false;
  overlayOpen = diveEl.hidden ? null : "dive";
  renderNav();
}
function lessonCard(l, read) {
  const done = read.has(l.id), extra = l.w ? t(LUI.exp) : l.fig ? t(LUI.fig) : "";
  return `<button type="button" class="l-card${done ? " done" : ""}" data-id="${l.id}" style="--sc:${lessonColor(l)}">
    <span class="l-subj">${esc(t(SUBJ[l.s]))}${lessonIsNew(l) ? `<span class="l-new">${esc(t(LUI.isNew))}</span>` : ""}</span>
    <span class="l-title">${esc(t(l.t))}</span><span class="l-hook">${esc(t(l.k))}</span>
    <span class="l-meta">${lessonMinutes(l)} ${esc(t(LUI.min))}${extra ? " · " + esc(extra) : ""}${done ? ` · <span class="ok">✓ ${esc(t(LUI.read))}</span>` : ""}</span></button>`;
}
function renderLessonGrid() {
  const read = lessonsRead(), list = lessonsShown();
  $("l-grid").innerHTML = list.length ? list.map((l) => lessonCard(l, read)).join("") : `<p class="l-empty">${esc(t(LUI.none))}</p>`;
  $("l-grid").querySelectorAll(".l-card").forEach((b) => b.onclick = () => { lessonListScroll = $("lessons").scrollTop; openLessons(b.dataset.id, true); });
}
function renderLessonList() {
  stopLessonWidget(); lessonOpen = null;
  const read = lessonsRead(), n = LESSONS.length, r = LESSONS.filter((l) => read.has(l.id)).length, anyNew = LESSONS.some(lessonIsNew);
  const keys = ["all", ...(anyNew ? ["new"] : []), ...Object.keys(SUBJ)];
  const chips = keys.map((k) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${lessonFilter === k}"${SUBJ[k] ? ` style="--sc:${SUBJ[k].c}"` : ""}>${esc(k === "all" ? t(LUI.all) : k === "new" ? t(LUI.newOnes) : t(SUBJ[k]))}</button>`).join("");
  $("lessons-inner").innerHTML = `<header class="l-head"><p class="l-eyebrow">${esc(t(LUI.eyebrow))}</p><h1>${esc(t(LUI.title))}</h1>
    <p class="lead">${esc(t(LUI.lead))}</p><p class="l-progress">${esc(t(r ? LUI.progress : LUI.progress0).replace("{r}", r).replace("{n}", n))}</p></header>
    <div class="l-tools"><input type="search" id="l-search" placeholder="${esc(t(LUI.search))}" aria-label="${esc(t(LUI.search))}" value="${esc(lessonQuery)}"><div class="chips l-chips">${chips}</div></div>
    <div class="l-grid" id="l-grid"></div>`;
  renderLessonGrid();
  $("lessons-inner").querySelectorAll(".l-chips .chip").forEach((b) => b.onclick = () => { lessonFilter = b.dataset.k; $("lessons-inner").querySelectorAll(".l-chips .chip").forEach((c) => c.setAttribute("aria-pressed", c === b)); renderLessonGrid(); });
  $("l-search").addEventListener("input", (e) => { lessonQuery = e.target.value; renderLessonGrid(); });
  requestAnimationFrame(() => { $("lessons").scrollTop = lessonListScroll; });
}
function renderLesson(id) {
  stopLessonWidget();
  const l = LESSONS.find((x) => x.id === id); if (!l) { renderLessonList(); return; }
  lessonOpen = id;
  const list = lessonsShown().some((x) => x.id === id) ? lessonsShown() : LESSONS, i = list.findIndex((x) => x.id === id);
  const prev = list[i - 1], next = list[i + 1];
  const fig = l.fig && LFIG[l.fig] ? `<figure class="l-fig">${LFIG[l.fig]()}</figure>` : "";
  const body = l.b.map((b) => `<h2>${esc(t(b.h))}</h2><p>${esc(t(b.p))}</p>`).join("");
  const widget = l.w && LWIDGET[l.w] ? `<section class="l-widget" aria-label="${esc(t(LUI.experiment))}"><p class="l-wlabel">${esc(t(LUI.experiment))}</p><div id="l-w"></div></section>` : "";
  const go = l.go ? `<button type="button" class="cta" id="l-go">${esc(t(LUI.goOrbis))} →</button>` : "";
  const more = lessonMore(l);
  const deep = more.length ? `<details class="l-more"><summary><span class="l-more-k">${esc(t(LUI.more))}</span><span class="l-more-qs">${more.map((m) => `<span>${esc(t(m.q))}</span>`).join("")}</span><span class="l-more-ic" aria-hidden="true">+</span></summary><div class="l-more-body">${more.map((m) => `<h3>${esc(t(m.q))}</h3><p>${esc(t(m.a))}</p>`).join("")}</div></details>` : "";
  const pn = `<nav class="l-pn">${prev ? `<button type="button" data-id="${prev.id}"><small>← ${esc(t(LUI.prev))}</small><span>${esc(t(prev.t))}</span></button>` : "<span></span>"}${next ? `<button type="button" class="nx" data-id="${next.id}"><small>${esc(t(LUI.next))} →</small><span>${esc(t(next.t))}</span></button>` : ""}</nav>`;
  $("lessons-inner").innerHTML = `<div class="l-backrow"><button type="button" class="l-back" id="l-back">← ${esc(t(LUI.back))}</button></div>
    <article class="l-article" style="--sc:${lessonColor(l)}"><p class="l-subj">${esc(t(SUBJ[l.s]))} · ${lessonMinutes(l)} ${esc(t(LUI.min))}</p>
    <h1>${esc(t(l.t))}</h1><p class="lead">${esc(t(l.k))}</p>${fig}${body}${widget}
    <aside class="l-box l-try"><strong>${esc(t(LUI.tryIt))}</strong><p>${esc(t(l.try))}</p></aside>
    <aside class="l-box l-fact" id="l-fact"><strong>${esc(t(UI.fact))}</strong><p>${esc(t(l.fact))}</p></aside>${deep}${go}${pn}</article>`;
  $("lessons").scrollTop = 0;
  $("l-back").onclick = () => { if (lessonsPushed) { try { history.back(); return; } catch (e) {} } renderLessonList(); setHash("lezioni"); };
  $("lessons-inner").querySelectorAll(".l-pn button").forEach((b) => b.onclick = () => openLessons(b.dataset.id, false));
  const g = $("l-go"); if (g) g.onclick = () => { const target = l.go; closeLessons(); goTo(target); };
  if (l.w) { try { lessonStop = LWIDGET[l.w]($("l-w")) || null; } catch (e) { console.warn(e); } }
  const fact = $("l-fact");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { markLessonRead(id); io.disconnect(); } }, { root: $("lessons"), threshold: 0.6 });
    io.observe(fact); const old = lessonStop; lessonStop = () => { io.disconnect(); if (old) old(); };
  } else markLessonRead(id);
}
window.addEventListener("popstate", () => {
  const h = (location.hash || "").replace("#", "");
  if (h.startsWith("lezioni/")) openLessons(h.slice(8), false);
  else if (h === "lezioni") { if (!$("lessons").hidden) { lessonsPushed = false; renderLessonList(); } else openLessons(null, false); }
  else if (!$("lessons").hidden) closeLessons();
});

/* ---------- drawings ---------- */
const svgT = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || "#d6dbe5"}" font-size="${o.size || 13}" text-anchor="${o.anchor || "middle"}"${o.weight ? ` font-weight="${o.weight}"` : ""} font-family="Atkinson Hyperlegible, system-ui, sans-serif">${esc(s)}</text>`;
const LFIG = {
  atom() {
    let dots = ""; let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 260; i++) { const a = rnd() * Math.PI * 2, r = 40 + Math.pow(rnd(), 0.6) * 95; dots += `<circle cx="${(300 + Math.cos(a) * r * 1.25).toFixed(1)}" cy="${(140 + Math.sin(a) * r * 0.9).toFixed(1)}" r="1.6" fill="#9fc3ff" opacity="${(0.25 + rnd() * 0.5).toFixed(2)}"/>`; }
    const nuc = [[0, 0, "p"], [6, -5, "n"], [-6, -4, "p"], [-4, 6, "n"], [5, 5, "p"], [0, -9, "n"]].map(([x, y, k]) => `<circle cx="${300 + x}" cy="${140 + y}" r="6" fill="${k === "p" ? "#ff7a6b" : "#c9ced8"}"/>`).join("");
    return `<svg viewBox="0 0 600 290" role="img" aria-label="${esc(t({ it: "Disegno di un atomo", en: "Drawing of an atom" }))}">${dots}
      <ellipse cx="300" cy="140" rx="175" ry="125" fill="none" stroke="#9fc3ff" stroke-opacity=".25" stroke-dasharray="3 6"/>${nuc}
      <line x1="314" y1="132" x2="398" y2="62" stroke="#ff7a6b" stroke-width="1"/>${svgT(402, 52, t({ it: "nucleo (qui enorme:", en: "nucleus (huge here:" }), { anchor: "start", size: 12, fill: "#ffb3a9" })}${svgT(402, 68, t({ it: "in realtà è 100.000 volte", en: "really it is 100,000 times" }), { anchor: "start", size: 12, fill: "#ffb3a9" })}${svgT(402, 84, t({ it: "più piccolo dell’atomo)", en: "smaller than the atom)" }), { anchor: "start", size: 12, fill: "#ffb3a9" })}
      ${svgT(300, 284, t({ it: "nuvola di elettroni: dove è più fitta, è più probabile trovarli", en: "electron cloud: thicker where they are more likely to be found" }), { size: 12, fill: "#9fc3ff" })}
      <circle cx="30" cy="146" r="6" fill="#ff7a6b"/>${svgT(42, 150, t({ it: "protone", en: "proton" }), { size: 12, fill: "#ff7a6b", anchor: "start" })}<circle cx="30" cy="166" r="6" fill="#c9ced8"/>${svgT(42, 170, t({ it: "neutrone", en: "neutron" }), { size: 12, fill: "#c9ced8", anchor: "start" })}</svg>`;
  },
  sm() {
    const cell = (x, y, sym, name, col) => `<g><rect x="${x}" y="${y}" width="88" height="64" rx="10" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-opacity=".7"/>${svgT(x + 44, y + 33, sym, { size: 22, fill: col, weight: 700 })}${svgT(x + 44, y + 53, name, { size: 11, fill: "#d6dbe5" })}</g>`;
    const q = "#ff9a7a", lp = "#7cbcff", b = "#ffd479", h = "#b9a4ff";
    const rows = [[["u", "up"], ["c", "charm"], ["t", "top"]], [["d", "down"], ["s", "strange"], ["b", "bottom"]], [["e", t({ it: "elettrone", en: "electron" })], ["μ", t({ it: "muone", en: "muon" })], ["τ", "tau"]], [["νe", "neutrino e"], ["νμ", "neutrino μ"], ["ντ", "neutrino τ"]]];
    let s = "";
    rows.forEach((r, i) => r.forEach(([sym, nm], j) => { s += cell(20 + j * 96, 30 + i * 72, sym, nm, i < 2 ? q : lp); }));
    [["g", t({ it: "gluone", en: "gluon" })], ["γ", t({ it: "fotone", en: "photon" })], ["Z", "bosone Z"], ["W", "bosone W"]].forEach(([sym, nm], i) => { s += cell(322, 30 + i * 72, sym, nm, b); });
    s += cell(430, 138, "H", "Higgs", h);
    return `<svg viewBox="0 0 540 330" role="img" aria-label="${esc(t({ it: "Tabella delle particelle", en: "Table of particles" }))}">${s}
      ${svgT(164, 20, t({ it: "materia: quark (in alto) e leptoni", en: "matter: quarks (top) and leptons" }), { size: 12, fill: "#a3acbd" })}${svgT(366, 20, t({ it: "forze", en: "forces" }), { size: 12, fill: "#a3acbd" })}
      <rect x="16" y="26" width="104" height="300" rx="14" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-dasharray="4 4"/>${svgT(474, 222, t({ it: "il riquadro: tutta", en: "the boxed column:" }), { size: 11, fill: "#a3acbd" })}${svgT(474, 238, t({ it: "la materia di ogni giorno", en: "all everyday matter" }), { size: 11, fill: "#a3acbd" })}</svg>`;
  },
  spectrum() {
    const segs = [["radio", "#6d7cff", 0, 150], [t({ it: "microonde", en: "microwaves" }), "#7b8cff", 150, 230], [t({ it: "infrarosso", en: "infrared" }), "#c06060", 230, 300], ["", "url(#rb)", 300, 330], [t({ it: "ultravioletto", en: "ultraviolet" }), "#9b6dff", 330, 400], [t({ it: "raggi X", en: "X-rays" }), "#7fb1c9", 400, 470], ["gamma", "#c9e7f0", 470, 560]];
    let wave = "M20 70"; for (let x = 20; x <= 580; x += 2) { const k = 0.03 + Math.pow((x - 20) / 560, 2) * 0.42; wave += ` L${x} ${(70 + Math.sin((x - 20) * k) * 20).toFixed(1)}`; }
    return `<svg viewBox="0 0 600 220" role="img" aria-label="${esc(t({ it: "Lo spettro elettromagnetico", en: "The electromagnetic spectrum" }))}"><defs><linearGradient id="rb"><stop offset="0" stop-color="#ff3b30"/><stop offset=".2" stop-color="#ff9500"/><stop offset=".38" stop-color="#ffcc00"/><stop offset=".55" stop-color="#34c759"/><stop offset=".75" stop-color="#0a84ff"/><stop offset="1" stop-color="#8e44ff"/></linearGradient></defs>
      <path d="${wave}" fill="none" stroke="#d6dbe5" stroke-opacity=".7" stroke-width="1.5"/>
      ${segs.map(([n, c, a, b]) => `<rect x="${20 + a}" y="110" width="${b - a}" height="34" fill="${c}" fill-opacity="${c.startsWith("url") ? 1 : 0.55}"/>${n ? svgT(20 + (a + b) / 2, 166, n, { size: 11 }) : ""}`).join("")}
      <path d="M335 146 v34" stroke="#ffd479"/>${svgT(335, 200, t({ it: "luce visibile: solo questa fettina", en: "visible light: just this slice" }), { size: 12, fill: "#ffd479" })}
      ${svgT(30, 24, t({ it: "onde lunghe", en: "long waves" }), { anchor: "start", size: 11, fill: "#a3acbd" })}${svgT(570, 24, t({ it: "onde corte, più energia", en: "short waves, more energy" }), { anchor: "end", size: 11, fill: "#a3acbd" })}</svg>`;
  },
  table() {
    const sym = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
    const pos = (z) => { // [row, col] in an 18-column table; lanthanides and actinides in rows 8 and 9
      if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
      if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8]; if (z <= 18) return [3, z <= 12 ? z - 10 : z];
      if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
      if (z >= 57 && z <= 71) return [8, z - 54]; if (z >= 89 && z <= 103) return [9, z - 86];
      if (z <= 86) return [6, z <= 56 ? z - 54 : z - 68]; return [7, z <= 88 ? z - 86 : z - 100];
    };
    const cat = (z) => { const [r, c] = pos(z); if (r >= 8) return "#c49bff"; if (z === 1) return "#9fc3ff"; if (c === 1) return "#ff8a7a"; if (c === 2) return "#ffb45e"; if (c === 18) return "#7fd6ff"; if (c >= 3 && c <= 12) return "#8fa2bf";
      if ([6, 7, 8, 15, 16, 34].includes(z)) return "#86dc93"; if ([9, 17, 35, 53, 85, 117].includes(z)) return "#5fd3c6"; if ([5, 14, 32, 33, 51, 52].includes(z)) return "#d8c46a"; return "#b9c0cc"; };
    const hi = { 31: 1, 32: 1 };
    let s = ""; const W = 31, H = 31;
    for (let z = 1; z <= 118; z++) { const [r, c] = pos(z), x = 6 + (c - 1) * (W + 2), y = 6 + (r - 1) * (H + 2) + (r >= 8 ? 10 : 0), col = cat(z);
      s += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="4" fill="${col}" fill-opacity="${hi[z] ? 0.55 : 0.18}" stroke="${hi[z] ? "#fff" : col}" stroke-opacity="${hi[z] ? 0.9 : 0.5}"/>${svgT(x + W / 2, y + 20, sym[z - 1], { size: 11, fill: hi[z] ? "#fff" : col, weight: 700 })}`; }
    return `<svg viewBox="0 0 606 320" role="img" aria-label="${esc(t({ it: "La tavola periodica", en: "The periodic table" }))}">${s}
      ${svgT(306, 22, t({ it: "in bianco: gallio e germanio, previsti da Mendeleev prima della scoperta", en: "in white: gallium and germanium, predicted by Mendeleev before their discovery" }), { size: 11, fill: "#d6dbe5" })}</svg>`;
  },
  water() {
    const mol = (x, y, a, s = 1, lab) => { const r = (d) => (a + d) * Math.PI / 180, L = 34 * s;
      const h1 = [x + Math.cos(r(-52.25)) * L, y + Math.sin(r(-52.25)) * L], h2 = [x + Math.cos(r(52.25)) * L, y + Math.sin(r(52.25)) * L];
      return `<line x1="${x}" y1="${y}" x2="${h1[0]}" y2="${h1[1]}" stroke="#d6dbe5" stroke-width="${3 * s}"/><line x1="${x}" y1="${y}" x2="${h2[0]}" y2="${h2[1]}" stroke="#d6dbe5" stroke-width="${3 * s}"/>
        <circle cx="${x}" cy="${y}" r="${18 * s}" fill="#ff6b5e"/><circle cx="${h1[0]}" cy="${h1[1]}" r="${11 * s}" fill="#eef1f6"/><circle cx="${h2[0]}" cy="${h2[1]}" r="${11 * s}" fill="#eef1f6"/>
        ${lab ? svgT(x, y + 5, "O", { size: 14, fill: "#fff", weight: 700 }) + svgT(h1[0], h1[1] + 4, "H", { size: 11, fill: "#05070c", weight: 700 }) + svgT(h2[0], h2[1] + 4, "H", { size: 11, fill: "#05070c", weight: 700 }) : ""}`; };
    return `<svg viewBox="0 0 600 260" role="img" aria-label="${esc(t({ it: "Molecole d’acqua e legami a idrogeno", en: "Water molecules and hydrogen bonds" }))}">
      ${mol(190, 130, 0, 1.5, true)}<path d="M 206 109.5 A 26 26 0 0 1 206 150.5" fill="none" stroke="#ffd479" stroke-width="1.5"/>${svgT(216, 135, LANG === "it" ? "104,5°" : "104.5°", { size: 12, fill: "#ffd479", anchor: "start" })}
      ${svgT(146, 172, "δ−", { size: 16, fill: "#ff8a7a" })}${svgT(268, 74, "δ+", { size: 16, fill: "#eef1f6" })}${svgT(268, 196, "δ+", { size: 16, fill: "#eef1f6" })}
      <line x1="256" y1="168" x2="340" y2="180" stroke="#7cbcff" stroke-dasharray="4 5" stroke-width="2"/>${mol(370, 186, 160, 1)}
      <line x1="256" y1="92" x2="350" y2="70" stroke="#7cbcff" stroke-dasharray="4 5" stroke-width="2"/>${mol(380, 64, 200, 1)}
      ${svgT(470, 130, t({ it: "legami a idrogeno", en: "hydrogen bonds" }), { size: 13, fill: "#7cbcff" })}${svgT(470, 148, t({ it: "(tratteggiati)", en: "(dashed)" }), { size: 12, fill: "#7cbcff" })}</svg>`;
  },
  ph() {
    const stops = [[0, "#d7263d"], [3, "#ff5c8a"], [6, "#b0418f"], [7, "#7b4fa8"], [8, "#4062c9"], [10, "#2aa198"], [12, "#9ccc3c"], [14, "#f2d52a"]];
    const items = [[2, t({ it: "limone", en: "lemon" })], [3, t({ it: "aceto", en: "vinegar" })], [7, t({ it: "acqua", en: "water" })], [8.5, t({ it: "bicarbonato", en: "baking soda" })], [10, t({ it: "sapone", en: "soap" })], [12.5, t({ it: "candeggina", en: "bleach" })]];
    const X = (p) => 30 + p / 14 * 540;
    return `<svg viewBox="0 0 600 200" role="img" aria-label="${esc(t({ it: "La scala del pH con i colori del cavolo rosso", en: "The pH scale with red cabbage colours" }))}"><defs><linearGradient id="phg">${stops.map(([p, c]) => `<stop offset="${p / 14}" stop-color="${c}"/>`).join("")}</linearGradient></defs>
      <rect x="30" y="70" width="540" height="40" rx="8" fill="url(#phg)"/>
      ${Array.from({ length: 15 }, (_, i) => svgT(X(i), 128, String(i), { size: 12, fill: "#a3acbd" })).join("")}
      ${items.map(([p, n], i) => `<line x1="${X(p)}" y1="66" x2="${X(p)}" y2="${i % 2 ? 46 : 28}" stroke="#d6dbe5" stroke-opacity=".6"/>${svgT(X(p), i % 2 ? 40 : 22, n, { size: 12 })}`).join("")}
      ${svgT(X(1.5), 160, t({ it: "← acidi", en: "← acids" }), { size: 13, fill: "#ff8a9a" })}${svgT(X(7), 160, t({ it: "neutro", en: "neutral" }), { size: 13, fill: "#b9a4ff" })}${svgT(X(12.5), 160, t({ it: "basi →", en: "bases →" }), { size: 13, fill: "#b5dc6a" })}
      ${svgT(300, 190, t({ it: "i colori sono quelli del succo di cavolo rosso", en: "the colours are those of red cabbage juice" }), { size: 11, fill: "#a3acbd" })}</svg>`;
  },
  dna() {
    let a = "M0 0", b = "M0 0", rungs = ""; const pairs = [["A", "T"], ["C", "G"], ["G", "C"], ["T", "A"], ["A", "T"], ["G", "C"], ["T", "A"], ["C", "G"], ["A", "T"], ["T", "A"], ["G", "C"], ["C", "G"]];
    const col = { A: "#ff8a7a", T: "#ffd479", C: "#7cbcff", G: "#86dc93" };
    const y1 = (x) => 110 + Math.sin(x / 38) * 60, y2 = (x) => 110 - Math.sin(x / 38) * 60;
    for (let x = 20; x <= 580; x += 4) { a += (x === 20 ? " M" : " L") + `${x} ${y1(x).toFixed(1)}`; b += (x === 20 ? " M" : " L") + `${x} ${y2(x).toFixed(1)}`; }
    pairs.forEach(([p, q], i) => { const x = 40 + i * 45, ya = y1(x), yb = y2(x), m = (ya + yb) / 2;
      if (Math.abs(ya - yb) < 14) return;
      rungs += `<line x1="${x}" y1="${ya}" x2="${x}" y2="${m}" stroke="${col[p]}" stroke-width="7" stroke-linecap="round"/><line x1="${x}" y1="${m}" x2="${x}" y2="${yb}" stroke="${col[q]}" stroke-width="7" stroke-linecap="round"/>`; });
    return `<svg viewBox="0 0 600 250" role="img" aria-label="${esc(t({ it: "La doppia elica del DNA", en: "The DNA double helix" }))}">${rungs}<path d="${a}" fill="none" stroke="#d6dbe5" stroke-width="4"/><path d="${b}" fill="none" stroke="#a3acbd" stroke-width="4"/>
      ${["A", "T", "C", "G"].map((k, i) => `<rect x="${110 + i * 105}" y="214" width="16" height="16" rx="4" fill="${col[k]}"/>${svgT(132 + i * 105, 227, k + " " + (LANG === "it" ? { A: "adenina", T: "timina", C: "citosina", G: "guanina" } : { A: "adenine", T: "thymine", C: "cytosine", G: "guanine" })[k], { size: 12, anchor: "start" })}`).join("")}</svg>`;
  },
  stars() {
    const node = (x, y, r, c, l1, l2, up) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>${up ? (l2 ? svgT(x, y - r - 24, l1, { size: 12 }) + svgT(x, y - r - 9, l2, { size: 11, fill: "#a3acbd" }) : svgT(x, y - r - 9, l1, { size: 12 })) : svgT(x, y + r + 16, l1, { size: 12 }) + (l2 ? svgT(x, y + r + 31, l2, { size: 11, fill: "#a3acbd" }) : "")}`;
    const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a3acbd" stroke-width="1.5" marker-end="url(#ar)"/>`;
    const L = (it, en) => t({ it, en });
    return `<svg viewBox="0 0 640 330" role="img" aria-label="${esc(L("Il ciclo di vita delle stelle", "The life cycle of stars"))}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#a3acbd"/></marker>
      <radialGradient id="neb"><stop offset="0" stop-color="#ff92b4" stop-opacity=".8"/><stop offset="1" stop-color="#7cbcff" stop-opacity="0"/></radialGradient></defs>
      <circle cx="60" cy="160" r="46" fill="url(#neb)"/>${svgT(60, 228, L("nebulosa", "nebula"), { size: 12 })}
      ${arrow(108, 142, 180, 104)}${arrow(110, 180, 168, 230)}
      ${node(200, 96, 14, "#ffd479", L("stella come il Sole", "Sun-like star"), L("10 miliardi di anni", "10 billion years"), true)}${arrow(222, 96, 300, 96)}
      ${node(338, 96, 30, "#ff8a5c", L("gigante rossa", "red giant"), "", true)}${arrow(372, 96, 440, 96)}
      <circle cx="480" cy="96" r="30" fill="none" stroke="#5fd3c6" stroke-width="5" stroke-opacity=".7"/><circle cx="480" cy="96" r="4" fill="#fff"/>${svgT(480, 56, L("nebulosa planetaria", "planetary nebula"), { size: 12 })}${arrow(512, 96, 556, 96)}
      ${node(578, 96, 7, "#e9f1ff", L("nana bianca", "white dwarf"), "", true)}
      ${node(200, 240, 24, "#9fc3ff", L("stella gigante", "giant star"), L("decine di milioni di anni", "tens of millions of years"))}${arrow(230, 240, 300, 240)}
      ${node(340, 240, 36, "#ff6b5e", L("supergigante rossa", "red supergiant"))}${arrow(380, 240, 440, 240)}
      <path d="M480 212 l8 18 20 -6 -12 16 14 14 -20 -2 -2 20 -10 -16 -14 14 2 -20 -20 -4 16 -10 -8 -18 18 8z" fill="#fff4b8"/>${svgT(480, 296, L("supernova", "supernova"), { size: 12 })}
      ${arrow(512, 228, 556, 208)}${arrow(512, 252, 556, 274)}
      ${node(578, 202, 5, "#b9a4ff", L("stella di neutroni", "neutron star"), "", true)}<circle cx="578" cy="282" r="9" fill="#000" stroke="#ffd479" stroke-width="2"/>${svgT(578, 308, L("buco nero", "black hole"), { size: 12 })}</svg>`;
  },
  seasons() {
    const earth = (x, lab1, lab2, lit) => `<g transform="translate(${x} 150)"><circle r="34" fill="#2a5bb8"/><path d="M0 -34 A34 34 0 0 ${lit ? 1 : 0} 0 34 Z" fill="#05070c" fill-opacity=".55"/>
      <g transform="rotate(23.4)"><line x1="0" y1="-52" x2="0" y2="52" stroke="#ffd479" stroke-width="2"/><ellipse rx="34" ry="5" fill="none" stroke="#86dc93" stroke-opacity=".7"/>${svgT(0, -58, "N", { size: 12, fill: "#ffd479" })}</g>
      ${svgT(0, 74, lab1, { size: 12 })}${svgT(0, 90, lab2, { size: 11, fill: "#a3acbd" })}</g>`;
    const L = (it, en) => t({ it, en });
    return `<svg viewBox="0 0 640 280" role="img" aria-label="${esc(L("Le stagioni e l’asse inclinato della Terra", "The seasons and the Earth’s tilted axis"))}"><defs><radialGradient id="sun"><stop offset="0" stop-color="#fff4c2"/><stop offset=".6" stop-color="#ffc24d"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="320" cy="150" rx="230" ry="46" fill="none" stroke="#a3acbd" stroke-opacity=".35" stroke-dasharray="4 6"/>
      <circle cx="320" cy="150" r="52" fill="url(#sun)"/>${svgT(320, 230, L("Sole", "Sun"), { size: 12, fill: "#ffd479" })}
      ${earth(90, L("giugno: estate al nord", "June: northern summer"), L("il polo nord guarda il Sole", "north pole leans to the Sun"), false)}
      ${earth(550, L("dicembre: inverno al nord", "December: northern winter"), L("il polo nord guarda lontano", "north pole leans away"), true)}
      ${svgT(320, 26, L("l’asse punta sempre nella stessa direzione dello spazio", "the axis always points the same way in space"), { size: 12, fill: "#d6dbe5" })}</svg>`;
  },
  bombardier() {
    const L = (it, en) => t({ it, en });
    let drops = ""; for (let i = 0; i < 24; i++) { const a = (i / 23 - 0.5) * 0.7, d = 18 + (i * 37) % 132; drops += `<circle cx="${(254 + Math.cos(a) * d).toFixed(1)}" cy="${(150 + Math.sin(a) * d).toFixed(1)}" r="${(2 + (i % 3) * 0.9).toFixed(1)}" fill="${i % 2 ? "#ffd479" : "#ff8a3d"}" opacity="${(0.95 - d / 200).toFixed(2)}"/>`; }
    const legs = ["M130 115 L118 88", "M170 109 L170 82", "M210 113 L226 88", "M130 185 L118 212", "M170 191 L170 218", "M210 187 L226 212"].map((d) => `<path d="${d}" stroke="#5d6b85" stroke-width="4" stroke-linecap="round"/>`).join("");
    return `<svg viewBox="0 0 420 300" role="img" aria-label="${esc(L("Come spara il coleottero bombardiere", "How the bombardier beetle fires"))}">${legs}
      <path d="M50 141 L20 112 M50 159 L20 188" stroke="#5d6b85" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="150" r="16" fill="#2b3446"/><ellipse cx="92" cy="150" rx="18" ry="24" fill="#2b3446"/>
      <ellipse cx="172" cy="150" rx="80" ry="42" fill="#2b3446" stroke="#5d6b85" stroke-width="2"/>
      <ellipse cx="185" cy="150" rx="33" ry="17" fill="#4a7fd6" fill-opacity=".85"/><rect x="221" y="146" width="7" height="8" fill="#a3acbd"/><circle cx="240" cy="150" r="11" fill="#ff8a3d"/>${drops}
      <path d="M185 133 L185 62" stroke="#9fc3ff" stroke-width="1"/>
      ${svgT(185, 32, L("serbatoio", "reservoir"), { size: 18, fill: "#9fc3ff" })}${svgT(185, 52, L("idrochinoni + acqua ossigenata", "hydroquinones + hydrogen peroxide"), { size: 14, fill: "#a3acbd" })}
      <path d="M243 161 L250 244" stroke="#ffb07a" stroke-width="1"/>
      ${svgT(250, 264, L("camera di reazione", "reaction chamber"), { size: 18, fill: "#ffb07a" })}${svgT(250, 284, L("con gli enzimi: qui esplode", "with enzymes: it explodes here"), { size: 14, fill: "#a3acbd" })}
      ${svgT(345, 80, "100 °C", { size: 22, fill: "#ffd479", weight: 700 })}${svgT(345, 224, L("centinaia di spruzzi", "hundreds of bursts"), { size: 14, fill: "#a3acbd" })}${svgT(345, 242, L("al secondo", "every second"), { size: 14, fill: "#a3acbd" })}</svg>`;
  }
};

/* ---------- experiments ---------- */
function wCanvas(el, h) {
  const cv = document.createElement("canvas"), W = Math.max(260, el.clientWidth || 600), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W * dpr); cv.height = Math.round(h * dpr); cv.style.width = "100%"; cv.style.height = h + "px"; cv.className = "w-canvas";
  el.prepend(cv); const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
  return { cv, ctx, W, H: h };
}
function wLoop(step) { let raf = 0, last = performance.now(), on = true; const f = (now) => { if (!on) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; step(dt); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => { on = false; cancelAnimationFrame(raf); }; }
const wBtn = (a, label, ghost) => `<button type="button" class="w-btn${ghost ? " ghost" : ""}" data-a="${a}">${esc(label)}</button>`;
const L2 = (it, en) => t({ it, en });
function fmtDur(s) {
  const n = (v, d) => fmt(v, d);
  if (s < 60) return `${n(s, s < 10 ? 1 : 0)} ${L2("secondi", "seconds")}`;
  if (s < 3600) { const m = Math.floor(s / 60), r = Math.round(s % 60); return `${m} min${r ? ` ${r} s` : ""}`; }
  if (s < 172800) { const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return `${h} ${L2("ore", "hours")}${m ? ` ${m} min` : ""}`; }
  const y = s / 31557600;
  if (y < 1) return `${n(s / 86400, 0)} ${L2("giorni", "days")}`;
  if (y < 1e6) return `${n(y, y < 10 ? 2 : 0)} ${L2("anni", "years")}`;
  return `${n(y / 1e6, 1)} ${L2("milioni di anni", "million years")}`;
}
const LWIDGET = {
  slit(el) {
    el.innerHTML = `<div class="w-row">${wBtn("det", "")}${wBtn("reset", t(LUI.reset), true)}<span class="w-count"></span></div><p class="w-note"></p>`;
    const { ctx, W, H } = wCanvas(el, 230); const col = "#b9a4ff";
    let det = false, n = 0; const A = (u) => { const z = 7 * u; return z === 0 ? 1 : Math.sin(z) / z; };
    const I = (x) => { const a = A(x - 0.24), b = A(x + 0.24); return det ? a * a + b * b : a * a + b * b + 2 * a * b * Math.cos(48 * x); };
    const clear = () => { ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = "rgba(238,241,246,.15)"; ctx.strokeRect(0.5, 0.5, W - 1, H - 1); n = 0; };
    const label = () => { el.querySelector('[data-a="det"]').textContent = det ? L2("Rivelatore acceso: guardo da che fessura passa", "Detector on: watching which slit it takes") : L2("Rivelatore spento", "Detector off");
      el.querySelector('[data-a="det"]').setAttribute("aria-pressed", det);
      el.querySelector(".w-note").textContent = det ? L2("Ora sappiamo da che parte passa ogni elettrone: le strisce spariscono e resta solo la somma di due macchie, una per fessura, come per le palline.", "Now we know which way each electron goes: the stripes vanish, leaving just the sum of two patches, one per slit, as with balls.") : L2("Nessuno guarda da che parte passano: a poco a poco compaiono le strisce, come per un’onda.", "Nobody watches which way they go: little by little the stripes appear, as with a wave."); };
    el.querySelector('[data-a="det"]').onclick = () => { det = !det; clear(); label(); };
    el.querySelector('[data-a="reset"]').onclick = () => clear();
    clear(); label();
    const cnt = el.querySelector(".w-count");
    return wLoop(() => {
      if (n >= 5000) return;
      const k = Math.min(14, 1 + Math.floor(n / 60));
      for (let i = 0; i < k; i++) {
        let x, tries = 0; do { x = Math.random() * 2 - 1; tries++; } while (Math.random() * 4 > I(x) && tries < 200);
        ctx.fillStyle = col; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc((x + 1) / 2 * W, 8 + Math.random() * (H - 16), 1.5, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; n++;
      }
      cnt.textContent = `${fmt(n)} ${L2("elettroni", "electrons")}`;
    });
  },
  halflife(el) {
    el.innerHTML = `<div class="w-row">${wBtn("go", "")}${wBtn("reset", t(LUI.reset), true)}<span class="w-count"></span></div>`;
    const narrow = (el.clientWidth || 600) < 520, Hh = narrow ? 360 : 240, { ctx, W, H } = wCanvas(el, Hh);
    const G = narrow ? Math.min(W - 20, 200) : Math.min(210, H - 20), gx = narrow ? (W - G) / 2 : 10, gy = 10;
    const px = narrow ? 34 : gx + G + 40, py = narrow ? gy + G + 24 : 14, pw = W - px - 12, ph = narrow ? H - py - 30 : H - py - 34;
    let atoms, tm, run = false, hist; const T = 1.6, MAX = 6;
    const reset = () => { atoms = Array.from({ length: 100 }, () => ({ d: false, f: 0 })); tm = 0; hist = [[0, 100]]; run = false; btn(); };
    const btn = () => { el.querySelector('[data-a="go"]').textContent = run ? L2("Pausa", "Pause") : tm > 0 ? L2("Continua", "Carry on") : L2("Avvia il tempo", "Start the clock"); };
    el.querySelector('[data-a="go"]').onclick = () => { if (tm >= MAX * T) reset(); run = !run; btn(); };
    el.querySelector('[data-a="reset"]').onclick = reset; reset();
    const cnt = el.querySelector(".w-count");
    return wLoop((dt) => {
      if (run) { tm += dt; const p = 1 - Math.pow(2, -dt / T); atoms.forEach((a) => { if (!a.d && Math.random() < p) { a.d = true; a.f = 1; } }); hist.push([tm / T, atoms.filter((a) => !a.d).length]); if (tm >= MAX * T) { run = false; btn(); } }
      atoms.forEach((a) => { a.f = Math.max(0, a.f - dt * 2); });
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      const c = G / 10; atoms.forEach((a, i) => { const x = gx + (i % 10) * c + c / 2, y = gy + Math.floor(i / 10) * c + c / 2;
        ctx.beginPath(); ctx.arc(x, y, c * 0.36 + a.f * 4, 0, 6.283); ctx.fillStyle = a.d ? (a.f > 0 ? "#fff4b8" : "rgba(163,172,189,.25)") : "#b9a4ff"; ctx.fill(); });
      ctx.strokeStyle = "rgba(238,241,246,.25)"; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + ph); ctx.lineTo(px + pw, py + ph); ctx.stroke();
      ctx.setLineDash([4, 5]); ctx.strokeStyle = "rgba(255,212,121,.7)"; ctx.beginPath();
      for (let k = 0; k <= 60; k++) { const u = k / 60 * MAX, x = px + u / MAX * pw, y = py + ph - Math.pow(2, -u) * ph; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "#b9a4ff"; ctx.lineWidth = 2; ctx.beginPath(); hist.forEach(([u, nn], k) => { const x = px + u / MAX * pw, y = py + ph - nn / 100 * ph; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = "#a3acbd"; ctx.font = "11px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "center";
      for (let u = 0; u <= MAX; u++) ctx.fillText(String(u), px + u / MAX * pw, py + ph + 14);
      ctx.textAlign = "right"; ctx.fillText("100", px - 5, py + 4); ctx.fillText("50", px - 5, py + ph / 2 + 4); ctx.fillText(L2("dimezzamenti →", "half-lives →"), px + pw, py + ph - 6);
      const left = atoms.filter((a) => !a.d).length;
      cnt.textContent = `${L2("Atomi rimasti", "Atoms left")}: ${left} · ${L2("tempo", "time")}: ${fmt(tm / T, 1)} ${L2("dimezzamenti", "half-lives")}`;
    });
  },
  light(el) {
    const D = [[L2("Luna", "Moon"), 1.282, ""], [L2("Sole", "Sun"), 499, ""], [L2("Marte", "Mars"), 750, L2("in media; da 3 a 22 minuti", "on average; 3 to 22 minutes")], [L2("Giove", "Jupiter"), 2600, L2("in media; da 33 a 53 minuti", "on average; 33 to 53 minutes")],
      ["Voyager 1", 86000, L2("quasi un giorno intero", "almost a whole day")], ["Proxima Centauri", 4.24 * 31557600, ""], [L2("Andromeda", "Andromeda"), 2.5e6 * 31557600, ""]];
    el.innerHTML = `<div class="w-row w-wrap">${D.map((d, i) => `<button type="button" class="w-btn${i ? " ghost" : ""}" data-i="${i}">${esc(d[0])}</button>`).join("")}</div><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W, H } = wCanvas(el, 110);
    let cur = 0, start = performance.now(), dur = 1.282;
    const pick = (i) => { cur = i; start = performance.now(); dur = D[i][1] <= 3 ? D[i][1] : 2.6;
      el.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("ghost", +b.dataset.i !== i));
      el.querySelector(".w-big").textContent = `${D[i][0]}: ${fmtDur(D[i][1])}${D[i][2] ? " (" + D[i][2] + ")" : ""}`;
      el.querySelector(".w-note").textContent = D[i][1] <= 3 ? L2("Questa animazione va a velocità reale: è proprio il tempo che impiega la luce.", "This animation runs in real time: it is exactly how long light takes.") : L2(`Animazione accelerata: in realtà è ${fmt(Math.round(D[i][1] / dur))} volte più lento.`, `Sped-up animation: in reality it is ${fmt(Math.round(D[i][1] / dur))} times slower.`); };
    el.querySelectorAll("[data-i]").forEach((b) => b.onclick = () => pick(+b.dataset.i)); pick(0);
    return wLoop(() => {
      const k = Math.min(1, (performance.now() - start) / 1000 / dur), x0 = 40, x1 = W - 40, y = 55;
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(238,241,246,.15)"; ctx.setLineDash([3, 6]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#2a5bb8"; ctx.beginPath(); ctx.arc(x0, y, 14, 0, 6.283); ctx.fill();
      ctx.fillStyle = cur === 1 ? "#ffd479" : cur >= 5 ? "#e9f1ff" : "#c9ced8"; ctx.beginPath(); ctx.arc(x1, y, cur === 1 ? 18 : 10, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#a3acbd"; ctx.font = "12px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "center"; ctx.fillText(L2("Terra", "Earth"), x0, y + 32); ctx.fillText(D[cur][0], x1, y + 32);
      const px = x0 + (x1 - x0) * k; const g = ctx.createRadialGradient(px, y, 0, px, y, 16); g.addColorStop(0, "rgba(255,244,184,1)"); g.addColorStop(1, "rgba(255,244,184,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, y, 16, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#d6dbe5"; ctx.textAlign = "left"; ctx.fillText(k < 1 ? `${L2("in viaggio", "travelling")}… ${fmtDur(D[cur][1] * k)}` : `${L2("arrivato dopo", "arrived after")} ${fmtDur(D[cur][1])}`, 8, 16);
    });
  },
  drop(el) {
    const B = [[L2("Terra", "Earth"), 9.81, "#2a5bb8"], [L2("Luna", "Moon"), 1.62, "#c9ced8"], [L2("Marte", "Mars"), 3.71, "#d9774b"], [L2("Giove", "Jupiter"), 24.79, "#d8b48a"]];
    el.innerHTML = `<div class="w-row">${wBtn("go", L2("Lascia cadere da 2 metri", "Drop from 2 metres"))}</div><p class="w-note">${esc(L2("Le palle cadono tutte insieme, a velocità reale.", "All the balls fall together, in real time."))}</p>`;
    const { ctx, W, H } = wCanvas(el, 270); let t0 = null;
    el.querySelector('[data-a="go"]').onclick = () => { t0 = performance.now(); };
    return wLoop(() => {
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      const cw = W / B.length, top = 34, bottom = H - 62, el2 = t0 ? (performance.now() - t0) / 1000 : 0;
      B.forEach(([name, g, c], i) => { const x = cw * i + cw / 2, tf = Math.sqrt(2 * 2 / g), s = Math.min(2, 0.5 * g * el2 * el2), y = top + s / 2 * (bottom - top);
        ctx.strokeStyle = "rgba(238,241,246,.2)"; ctx.beginPath(); ctx.moveTo(x - cw * 0.35, bottom + 9); ctx.lineTo(x + cw * 0.35, bottom + 9); ctx.stroke();
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
        ctx.fillStyle = "#eef1f6"; ctx.font = "bold 13px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "center"; ctx.fillText(name, x, 18);
        ctx.font = "11px Atkinson Hyperlegible, system-ui"; ctx.fillStyle = "#a3acbd";
        ctx.fillText(t0 && el2 >= tf ? `${fmt(tf, 2)} s` : `g = ${fmt(g, 2)}`, x, bottom + 26);
        ctx.fillText(L2(`salto: ${fmt(0.5 * 9.81 / g, 1)} m`, `jump: ${fmt(0.5 * 9.81 / g, 1)} m`), x, bottom + 44); });
      ctx.textAlign = "left"; ctx.fillStyle = "#6c7486"; ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.fillText(L2("«salto»: quanto sale chi sulla Terra salta 50 cm", "“jump”: how high someone who jumps 50 cm on Earth would go"), 6, H - 4);
    });
  },
  entropy(el) {
    el.innerHTML = `<div class="w-row">${wBtn("open", L2("Togli la parete", "Remove the wall"))}${wBtn("reset", t(LUI.reset), true)}<span class="w-count"></span></div><p class="w-note">${esc(L2("Prova ad aspettare che tornino tutti a sinistra: la probabilità è circa 1 su un numero con 45 cifre.", "Try waiting for them all to go back to the left: the odds are about 1 in a number with 45 digits."))}</p>`;
    const { ctx, W, H } = wCanvas(el, 230); let P, wall;
    const reset = () => { wall = true; P = Array.from({ length: 150 }, () => { const a = Math.random() * 6.283, v = 60 + Math.random() * 90; return { x: 8 + Math.random() * (W / 2 - 16), y: 8 + Math.random() * (H - 16), vx: Math.cos(a) * v, vy: Math.sin(a) * v }; }); };
    el.querySelector('[data-a="open"]').onclick = () => { wall = false; }; el.querySelector('[data-a="reset"]').onclick = reset; reset();
    const cnt = el.querySelector(".w-count");
    return wLoop((dt) => {
      P.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y < 4 || p.y > H - 4) { p.vy *= -1; p.y = Math.max(4, Math.min(H - 4, p.y)); }
        const lo = 4, hi = wall ? W / 2 - 4 : W - 4; if (p.x < lo || p.x > hi) { p.vx *= -1; p.x = Math.max(lo, Math.min(hi, p.x)); } });
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = "rgba(238,241,246,.2)"; ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
      if (wall) { ctx.fillStyle = "rgba(238,241,246,.5)"; ctx.fillRect(W / 2 - 2, 0, 4, H); }
      ctx.fillStyle = "#7cbcff"; P.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.283); ctx.fill(); });
      const l = P.filter((p) => p.x < W / 2).length; cnt.textContent = `${L2("sinistra", "left")}: ${l} · ${L2("destra", "right")}: ${150 - l}`;
    });
  },
  transit(el) {
    const S = [[L2("Terra", "Earth"), 0.0092], [L2("Nettuno", "Neptune"), 0.035], [L2("Giove", "Jupiter"), 0.1], [L2("gigante gonfio", "puffy giant"), 0.14]];
    el.innerHTML = `<div class="w-row w-wrap">${S.map((s, i) => `<button type="button" class="w-btn${i === 2 ? "" : " ghost"}" data-i="${i}">${esc(s[0])}</button>`).join("")}</div><p class="w-big"></p>`;
    const { ctx, W, H } = wCanvas(el, 300); let k = 2, ph = 0, curve = [];
    const set = (i) => { k = i; curve = []; el.querySelectorAll("[data-i]").forEach((b) => b.classList.toggle("ghost", +b.dataset.i !== i));
      el.querySelector(".w-big").textContent = L2(`Calo di luce: ${fmt(S[i][1] * S[i][1] * 100, S[i][1] < 0.02 ? 4 : 2)}%`, `Dip in light: ${fmt(S[i][1] * S[i][1] * 100, S[i][1] < 0.02 ? 4 : 2)}%`); };
    el.querySelectorAll("[data-i]").forEach((b) => b.onclick = () => set(+b.dataset.i)); set(2);
    const overlap = (d, R, r) => { if (d >= R + r) return 0; if (d <= R - r) return Math.PI * r * r;
      const a = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r)), b = R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R)), c = 0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R)); return a + b - c; };
    return wLoop((dt) => {
      ph = (ph + dt * 0.18) % 1; const R = 62, cx = W / 2, cy = 82, rp = Math.max(1.5, S[k][1] * R), front = ph < 0.5, x = cx + Math.cos(Math.PI + ph * 2 * Math.PI) * (W * 0.42), yy = cy;
      const d = Math.abs(x - cx), flux = front ? 1 - overlap(d, R, S[k][1] * R) / (Math.PI * R * R) : 1; curve.push(flux); if (curve.length > W - 60) curve.shift();
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      if (!front) { ctx.fillStyle = "#c8a27a"; ctx.beginPath(); ctx.arc(x, yy, rp, 0, 6.283); ctx.fill(); }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6); g.addColorStop(0, "#fff7d6"); g.addColorStop(0.55, "#ffd479"); g.addColorStop(0.62, "rgba(255,180,80,.35)"); g.addColorStop(1, "rgba(255,160,60,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, 6.283); ctx.fill();
      if (front) { ctx.fillStyle = "#1a1f2b"; ctx.beginPath(); ctx.arc(x, yy, rp, 0, 6.283); ctx.fill(); }
      const gx = 40, gy = 170, gw = W - 60, gh = 100, lo = 0.975;
      ctx.strokeStyle = "rgba(238,241,246,.2)"; ctx.strokeRect(gx, gy, gw, gh);
      ctx.strokeStyle = "#ffd479"; ctx.lineWidth = 2; ctx.beginPath(); curve.forEach((f, i) => { const yv = gy + (1.002 - f) / (1.002 - lo) * gh; i ? ctx.lineTo(gx + i, yv) : ctx.moveTo(gx + i, yv); }); ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = "#a3acbd"; ctx.font = "11px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "right"; ctx.fillText("100%", gx - 4, gy + 0.002 / (1.002 - lo) * gh + 4); ctx.fillText("98%", gx - 4, gy + 0.022 / (1.002 - lo) * gh + 4);
      ctx.textAlign = "left"; ctx.fillText(L2("luce della stella misurata dal telescopio", "starlight measured by the telescope"), gx + 4, gy + gh + 16);
    });
  },
  doubling(el) {
    const M = [[0.0001, L2("un foglio di carta", "a sheet of paper"), L2("di un foglio di carta", "a sheet of paper")], [0.03, L2("un libro", "a book"), L2("di un libro", "a book")], [1.6, L2("una persona", "a person"), L2("di una persona", "a person")],
      [50, L2("un palazzo di 15 piani", "a 15-storey building"), L2("di un palazzo di 15 piani", "a 15-storey building")], [330, L2("la Torre Eiffel", "the Eiffel Tower"), L2("della Torre Eiffel", "the Eiffel Tower")], [8849, L2("l’Everest", "Everest"), L2("dell’Everest", "Everest")],
      [100000, L2("il confine dello spazio (100 km)", "the edge of space (100 km)"), L2("del confine dello spazio (100 km)", "the edge of space (100 km)")], [408000, L2("la Stazione spaziale", "the Space Station"), L2("della Stazione spaziale", "the Space Station")],
      [384400000, L2("la Luna", "the Moon"), L2("della distanza della Luna", "the distance to the Moon")], [149.6e9, L2("il Sole", "the Sun"), L2("della distanza del Sole", "the distance to the Sun")]];
    el.innerHTML = `<div class="w-row">${wBtn("fold", L2("Piega a metà", "Fold in half"))}${wBtn("ten", "+10", true)}${wBtn("reset", t(LUI.reset), true)}</div><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W, H } = wCanvas(el, 70); let n = 0;
    const len = (m) => m < 0.01 ? `${fmt(m * 1000, 1)} mm` : m < 1 ? `${fmt(m * 100, 1)} cm` : m < 1000 ? `${fmt(m, 1)} m` : `${fmt(m / 1000, m < 1e5 ? 1 : 0)} km`;
    const show = () => { const th = 0.0001 * Math.pow(2, n), past = M.filter((m) => m[0] <= th).pop(), nextM = M.find((m) => m[0] > th);
      el.querySelector(".w-big").textContent = `${n} ${n === 1 ? L2("piega", "fold") : L2("pieghe", "folds")}: ${len(th)}`;
      el.querySelector(".w-note").textContent = (n ? L2(`La pila di carta è più alta ${past[2]}.`, `The stack of paper is taller than ${past[2]}.`) : L2("Un foglio è spesso un decimo di millimetro.", "A sheet is a tenth of a millimetre thick.")) + (nextM ? " " + L2(`Prossimo traguardo: ${nextM[1]}.`, `Next landmark: ${nextM[1]}.`) : " " + L2("Hai superato il Sole!", "You have passed the Sun!"));
      const lg = (v) => (Math.log10(v) + 4) / (Math.log10(149.6e9) + 4), x0 = 14, x1 = W - 14;
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "rgba(238,241,246,.08)"; ctx.fillRect(x0, 30, x1 - x0, 10);
      ctx.fillStyle = "#ff92b4"; ctx.fillRect(x0, 30, Math.min(1, lg(th)) * (x1 - x0), 10);
      M.forEach(([v], i) => { const x = x0 + lg(v) * (x1 - x0); ctx.fillStyle = "#a3acbd"; ctx.fillRect(x, 26, 1, 18); });
      ctx.fillStyle = "#6c7486"; ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "left"; ctx.fillText(L2("foglio", "paper"), x0, 60); ctx.textAlign = "right"; ctx.fillText(L2("Sole (scala logaritmica)", "Sun (log scale)"), x1, 60); };
    el.querySelector('[data-a="fold"]').onclick = () => { if (n < 60) n++; show(); };
    el.querySelector('[data-a="ten"]').onclick = () => { n = Math.min(60, n + 10); show(); };
    el.querySelector('[data-a="reset"]').onclick = () => { n = 0; show(); }; show();
    return null;
  },
  birthday(el) {
    const ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], mon = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(LANG === "it" ? "it-IT" : "en-GB", { month: "short" }).format(new Date(2026, i, 1)));
    el.innerHTML = `<div class="w-row w-wrap"><label class="w-range">${esc(L2("Persone", "People"))}: <b id="bd-n">23</b><input type="range" min="2" max="80" value="23" id="bd-r"></label>${wBtn("one", L2("Crea un gruppo", "Make a group"))}${wBtn("many", L2("Crea 100 gruppi", "Make 100 groups"), true)}</div><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W, H } = wCanvas(el, 240); let N = 23, groups = 0, hits = 0, last = null;
    const prob = (n) => { let p = 1; for (let k = 0; k < n; k++) p *= (365 - k) / 365; return 1 - p; };
    const make = () => { const days = Array.from({ length: N }, () => Math.floor(Math.random() * 365)), c = {}; days.forEach((d) => c[d] = (c[d] || 0) + 1); const dup = Object.keys(c).filter((d) => c[d] > 1).map(Number); groups++; if (dup.length) hits++; return { c, dup }; };
    const dateOf = (d) => { let m = 0; while (d >= ML[m]) { d -= ML[m]; m++; } return [m, d]; };
    const draw = () => { ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      const lw = 34, cw = (W - lw - 8) / 31, ch = (H - 8) / 12;
      ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "left";
      for (let m = 0; m < 12; m++) { ctx.fillStyle = "#6c7486"; ctx.fillText(mon[m], 2, 4 + m * ch + ch * 0.7);
        for (let d = 0; d < ML[m]; d++) { ctx.fillStyle = "rgba(238,241,246,.06)"; ctx.fillRect(lw + d * cw, 4 + m * ch, cw - 1.5, ch - 1.5); } }
      if (!last) return; let idx = 0;
      for (let m = 0; m < 12; m++) for (let d = 0; d < ML[m]; d++, idx++) { const k = last.c[idx]; if (!k) continue;
        ctx.fillStyle = k > 1 ? "#ff92b4" : "#7cbcff"; ctx.fillRect(lw + d * cw, 4 + m * ch, cw - 1.5, ch - 1.5); } };
    const text = () => { el.querySelector("#bd-n").textContent = N;
      el.querySelector(".w-big").textContent = L2(`Probabilità di almeno una coppia con ${N} persone: ${fmt(prob(N) * 100, 1)}%`, `Chance of at least one pair with ${N} people: ${fmt(prob(N) * 100, 1)}%`);
      el.querySelector(".w-note").textContent = !groups ? L2("In rosa i giorni con due o più compleanni.", "Days with two or more birthdays are shown in pink.") :
        (last && last.dup.length ? L2(`Coppia trovata: ${last.dup.map((d) => { const [m, dd] = dateOf(d); return (dd + 1) + " " + mon[m]; }).join(", ")}. `, `Pair found: ${last.dup.map((d) => { const [m, dd] = dateOf(d); return (dd + 1) + " " + mon[m]; }).join(", ")}. `) : L2("Nessuna coppia questa volta. ", "No pair this time. ")) +
        L2(`Gruppi provati: ${groups}, con una coppia: ${hits} (${fmt(hits / groups * 100, 0)}%).`, `Groups tried: ${groups}, with a pair: ${hits} (${fmt(hits / groups * 100, 0)}%).`); };
    el.querySelector("#bd-r").oninput = (e) => { N = +e.target.value; groups = 0; hits = 0; last = null; draw(); text(); };
    el.querySelector('[data-a="one"]').onclick = () => { last = make(); draw(); text(); };
    el.querySelector('[data-a="many"]').onclick = () => { for (let i = 0; i < 100; i++) last = make(); draw(); text(); };
    draw(); text(); return null;
  },
  scale(el) {
    const E = [[1.7e-15, L2("un protone", "a proton"), "1,7 femtometri"], [1e-10, L2("un atomo di idrogeno", "a hydrogen atom"), "0,1 nm"], [2e-9, L2("la larghezza del DNA", "the width of DNA"), "2 nm"], [1e-7, L2("il virus dell’influenza", "a flu virus"), "100 nm"],
      [2e-6, L2("un batterio", "a bacterium"), "2 µm"], [8e-6, L2("un globulo rosso", "a red blood cell"), "8 µm"], [7e-5, L2("lo spessore di un capello", "the thickness of a hair"), "0,07 mm"], [5e-4, L2("un tardigrado", "a tardigrade"), "0,5 mm"],
      [1e-2, L2("un’unghia", "a fingernail"), "1 cm"], [1.7, L2("una persona", "a person"), "1,7 m"], [30, L2("una balenottera azzurra", "a blue whale"), "30 m"], [330, L2("la Torre Eiffel", "the Eiffel Tower"), "330 m"], [8849, L2("l’Everest", "Everest"), "8,8 km"],
      [1.2e6, L2("la lunghezza dell’Italia", "the length of Italy"), "1.200 km"], [1.27e7, L2("il diametro della Terra", "the Earth’s diameter"), "12.742 km"], [3.84e8, L2("la distanza Terra–Luna", "the Earth–Moon distance"), "384.400 km"], [1.39e9, L2("il diametro del Sole", "the Sun’s diameter"), "1,39 mln km"],
      [1.5e11, L2("la distanza Terra–Sole", "the Earth–Sun distance"), "150 mln km"], [9e12, L2("l’orbita di Nettuno", "Neptune’s orbit"), "9 mld km"], [9.46e15, L2("un anno luce", "one light-year"), "9.460 mld km"], [4e16, L2("la stella più vicina", "the nearest star"), "4,24 a.l."],
      [9.5e20, L2("la Via Lattea", "the Milky Way"), "100.000 a.l."], [2.4e22, L2("la distanza di Andromeda", "the distance to Andromeda"), "2,5 mln a.l."], [4.9e24, L2("il superammasso Laniakea", "the Laniakea supercluster"), "520 mln a.l."], [8.8e26, L2("l’universo osservabile", "the observable universe"), "93 mld a.l."]];
    const sup = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] || (c === "-" ? "⁻" : c)).join("");
    el.innerHTML = `<input type="range" class="w-slider" min="0" max="${E.length - 1}" value="9" id="sc-r" aria-label="${esc(L2("Scala", "Scale"))}"><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W, H } = wCanvas(el, 64); const r = el.querySelector("#sc-r");
    const show = () => { const [v, name, val] = E[+r.value], ex = Math.round(Math.log10(v));
      const valT = LANG === "it" ? val : val.replace(/(\d),(\d)/g, "$1.$2").replace(/(\d)\.(\d{3})/g, "$1,$2").replace("mln", "million").replace("mld", "billion").replace("a.l.", "ly").replace("femtometri", "femtometres");
      el.querySelector(".w-big").textContent = `≈ 10${sup(ex)} m · ${name}`;
      el.querySelector(".w-note").textContent = `${valT}. ${L2("Trascina per cambiare scala: ogni tacca del righello è un fattore 10.", "Drag to change scale: each tick on the ruler is a factor of 10.")}`;
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H); const x0 = 14, x1 = W - 14, X = (e) => x0 + (e + 15) / 42 * (x1 - x0);
      ctx.strokeStyle = "rgba(238,241,246,.3)"; ctx.beginPath(); ctx.moveTo(x0, 30); ctx.lineTo(x1, 30); ctx.stroke();
      for (let e = -15; e <= 27; e++) { ctx.fillStyle = e === 0 ? "#ffd479" : "rgba(238,241,246,.35)"; ctx.fillRect(X(e), e % 5 ? 26 : 22, 1, e % 5 ? 8 : 16); }
      ctx.fillStyle = "#ff92b4"; ctx.beginPath(); ctx.arc(X(Math.log10(v)), 30, 6, 0, 6.283); ctx.fill();
      ctx.fillStyle = "#6c7486"; ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "left"; ctx.fillText("10⁻¹⁵ m", x0, 56); ctx.textAlign = "center"; ctx.fillText("1 m", X(0), 56); ctx.textAlign = "right"; ctx.fillText("10²⁷ m", x1, 56); };
    r.oninput = show; show(); return null;
  },
  spark(el) {
    // How far a spark jumps in dry air: about 3,000 volts for every millimetre, from an electric eel to Pikachu's "100,000 volts".
    const PR = [[860 / 3000, L2("Anguilla", "Eel")], [5, L2("Maniglia", "Door handle")], [100000 / 3000, "Pikachu"], [1000, L2("1 metro", "1 metre")]];
    el.innerHTML = `<div class="w-row">${PR.map((p, i) => wBtn("p" + i, p[1], true)).join("")}</div><input type="range" class="w-slider" min="0" max="1000" id="sp-r" aria-label="${esc(L2("Lunghezza della scintilla", "Length of the spark"))}"><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W } = wCanvas(el, 118), H = 118, r = el.querySelector("#sp-r"), lo = -1, hi = 3, x0 = 26, x1 = W - 26;
    const mmOf = (v) => Math.pow(10, lo + (hi - lo) * v / 1000), posOf = (mm) => Math.round((Math.log10(mm) - lo) / (hi - lo) * 1000), X = (mm) => x0 + (Math.log10(mm) - lo) / (hi - lo) * (x1 - x0);
    const sig = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
    const len = (mm) => mm < 1 ? `${fmt(mm, 2)} mm` : mm < 10 ? `${fmt(mm, 1)} mm` : mm < 999.5 ? `${fmt(mm / 10, mm < 100 ? 1 : 0)} cm` : L2("1 metro", "1 metre");
    let mm = 100000 / 3000, seed = 7, acc = 0;
    const draw = () => {
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      const xa = x0, xb = Math.max(x0 + 8, X(mm)), y = 42; let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      ctx.strokeStyle = "#fff6c2"; ctx.lineWidth = 2; ctx.shadowColor = "#ffd479"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(xa, y);
      const n = Math.max(2, Math.round((xb - xa) / 14)); for (let i = 1; i < n; i++) ctx.lineTo(xa + (xb - xa) * i / n, y + (rnd() - 0.5) * 22);
      ctx.lineTo(xb, y); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#a3acbd"; [xa, xb].forEach((x) => { ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.283); ctx.fill(); });
      ctx.strokeStyle = "rgba(238,241,246,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, 86); ctx.lineTo(x1, 86); ctx.stroke();
      ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "center";
      [[0.1, "0,1 mm"], [1, "1 mm"], [10, "1 cm"], [100, "10 cm"], [1000, "1 m"]].forEach(([v, lab]) => { const x = X(v); ctx.fillStyle = "rgba(238,241,246,.45)"; ctx.fillRect(x, 80, 1, 12); ctx.fillStyle = "#6c7486"; ctx.fillText(LANG === "it" ? lab : lab.replace(",", "."), x, 108); });
      [[860 / 3000, "#7cbcff"], [100000 / 3000, "#ffd479"]].forEach(([v, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(v), 86, 4, 0, 6.283); ctx.fill(); });
    };
    const show = () => {
      const V = mm * 3000, eels = V / 860;
      el.querySelector(".w-big").textContent = L2(`Scintilla di ${len(mm)}: circa ${fmt(sig(V))} volt`, `A ${len(mm)} spark: about ${fmt(sig(V))} volts`);
      el.querySelector(".w-note").textContent = (eels <= 1.001 ? L2("Un’anguilla elettrica, con i suoi 860 volt, ce la fa da sola.", "An electric eel, with its 860 volts, can do it alone.") : L2(`Servono circa ${fmt(Math.ceil(eels))} anguille elettriche messe in fila.`, `You need about ${fmt(Math.ceil(eels))} electric eels lined up.`)) + " " +
        (V < 99000 ? L2("Il «Fulmine» di Pikachu, 100.000 volt, salterebbe circa 3 cm.", "Pikachu’s Thunderbolt, 100,000 volts, would jump about 3 cm.") : V <= 101000 ? L2("Questo è il «Fulmine» di Pikachu: «100.000 volt».", "This is Pikachu’s Thunderbolt: “100,000 volts”.") : L2("Più dei 100.000 volt del «Fulmine» di Pikachu.", "More than the 100,000 volts of Pikachu’s Thunderbolt."));
      PR.forEach((p, i) => el.querySelector(`[data-a="p${i}"]`).classList.toggle("ghost", Math.abs(Math.log10(mm / p[0])) > 0.004));
      draw();
    };
    r.value = posOf(mm); r.oninput = () => { mm = mmOf(+r.value); show(); };
    PR.forEach((p, i) => { el.querySelector(`[data-a="p${i}"]`).onclick = () => { mm = p[0]; r.value = posOf(mm); show(); }; });
    show();
    return REDUCED ? null : wLoop((dt) => { acc += dt; if (acc > 0.09) { acc = 0; seed = (seed * 9301 + 49297) % 233280; draw(); } });
  },
  zeno(el) {
    // Achilles (steady speed: each half takes half the time, 2 s in all) against Gojo's Infinity (the speed halves too: every half takes 0.8 s, for ever).
    el.innerHTML = `<div class="w-row">${wBtn("a", L2("Achille: velocità costante", "Achilles: steady speed"))}${wBtn("g", L2("Gojo: la velocità si dimezza", "Gojo: the speed halves"))}${wBtn("reset", t(LUI.reset), true)}</div><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W } = wCanvas(el, 92), H = 92, x0 = 22, x1 = W - 40, TA = 2, TG = 0.8;
    let mode = null, tt = 0, done = false;
    const state = () => {
      if (!mode) return { d: 1, n: 0 };
      if (mode === "a") { const d = Math.max(0, 1 - tt / TA); return { d, n: d > 0 ? Math.floor(-Math.log2(d) + 1e-9) : Infinity }; }
      const n = Math.floor(tt / TG), f = tt / TG - n; return { d: Math.pow(2, -n) * (1 - f / 2), n };
    };
    const dist = (d) => d >= 0.01 ? `${fmt(d * 100, 1)} cm` : d >= 1e-3 ? `${fmt(d * 1000, 2)} mm` : d >= 1e-6 ? L2(`${fmt(d * 1e6, 1)} millesimi di millimetro`, `${fmt(d * 1e6, 1)} thousandths of a millimetre`) :
      d >= 1e-9 ? L2(`${fmt(d * 1e9, 1)} milionesimi di millimetro`, `${fmt(d * 1e9, 1)} millionths of a millimetre`) : L2("meno di un milionesimo di millimetro", "less than a millionth of a millimetre");
    const draw = () => {
      const { d } = state(); ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(238,241,246,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, 46); ctx.lineTo(x1, 46); ctx.stroke();
      for (let k = 1; k <= 12; k++) { const x = x0 + (1 - Math.pow(2, -k)) * (x1 - x0); ctx.fillStyle = "rgba(238,241,246,.35)"; ctx.fillRect(x, 40, 1, 12); }
      ctx.fillStyle = "#ff7a6b"; ctx.fillRect(x1, 18, 4, 56);
      ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "center"; ctx.fillStyle = "#a3acbd"; ctx.fillText("Gojo", x1 + 2, 86); ctx.fillText("1 m", x0, 86);
      ctx.fillStyle = mode === "g" ? "#ff92b4" : "#7cbcff"; ctx.beginPath(); ctx.arc(x0 + (1 - d) * (x1 - x0), 46, 7, 0, 6.283); ctx.fill();
    };
    const text = () => {
      const { d, n } = state(), big = el.querySelector(".w-big"), note = el.querySelector(".w-note");
      if (!mode) { big.textContent = L2("Scegli chi corre verso Gojo.", "Choose who runs towards Gojo."); note.textContent = L2("Ogni tacca è una metà della strada che resta: sono sempre più fitte, e sono infinite.", "Each tick is half of the road that is left: they get closer and closer, and there are infinitely many."); return; }
      const steps = n === Infinity ? L2("infiniti", "infinitely many") : fmt(Math.min(n, 9999));
      big.textContent = L2(`Pezzi di strada: ${steps} · tempo: ${fmt(tt, 1)} s`, `Pieces of road: ${steps} · time: ${fmt(tt, 1)} s`);
      if (mode === "a") note.textContent = done ? L2("Arrivato in 2 secondi! Infiniti pezzi, ma sempre più brevi: anche il tempo totale è finito.", "Arrived in 2 seconds! Infinitely many pieces, but shorter and shorter: the total time is finite too.") : L2(`Distanza rimasta: ${dist(d)}. Ogni pezzo dura la metà del precedente.`, `Distance left: ${dist(d)}. Each piece takes half as long as the one before.`);
      else note.textContent = L2(`Distanza rimasta: ${dist(d)}. Ogni pezzo dura sempre 0,8 secondi: non arriverà mai.`, `Distance left: ${dist(d)}. Every piece always takes 0.8 seconds: it will never arrive.`) + (d < 1e-10 ? " " + L2("Ormai la distanza è più piccola di un atomo, ma non è zero.", "The distance is now smaller than an atom, but it isn’t zero.") : "");
    };
    const go = (m) => { mode = m; tt = 0; done = false; draw(); text(); };
    el.querySelector('[data-a="a"]').onclick = () => go("a"); el.querySelector('[data-a="g"]').onclick = () => go("g"); el.querySelector('[data-a="reset"]').onclick = () => go(null);
    go(null);
    let acc = 0;
    return wLoop((dt) => { if (!mode || done) return; tt += dt; if (mode === "a" && tt >= TA) { tt = TA; done = true; } draw(); acc += dt; if (acc > 0.1 || done) { acc = 0; text(); } });
  },
  squarecube(el) {
    // Scale up a 1.7 m person: height ×k, bone strength (cross-section) ×k², weight (volume) ×k³, so each bone carries ×k more load.
    const PR = [[1.7, L2("Tu", "You")], [5, L2("Gigante di 5 m", "5 m giant")], [60, L2("Titano Colossale", "Colossal Titan")], [120, "Godzilla 2019"]];
    el.innerHTML = `<div class="w-row">${PR.map((p, i) => wBtn("p" + i, p[1], true)).join("")}</div><input type="range" class="w-slider" min="0" max="1000" id="sq-r" aria-label="${esc(L2("Altezza", "Height"))}"><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W } = wCanvas(el, 136), H = 136, r = el.querySelector("#sq-r"), lo = Math.log10(1.7), hi = Math.log10(120);
    const posOf = (m) => Math.round((Math.log10(m) - lo) / (hi - lo) * 1000), hOf = (v) => Math.pow(10, lo + (hi - lo) * v / 1000);
    const num = (v) => { if (v < 10) return fmt(v, 1); if (v < 1000) return fmt(v, 0); const p = Math.pow(10, Math.floor(Math.log10(v)) - 2); return fmt(Math.round(v / p) * p); };
    let h = 60;
    const show = () => {
      PR.forEach((p, i) => el.querySelector(`[data-a="p${i}"]`).classList.toggle("ghost", Math.abs(Math.log10(h / p[0])) > 0.004));
      const k = h / 1.7, rows = [[L2("altezza", "height"), k, "#7cbcff"], [L2("forza delle ossa", "bone strength"), k * k, "#86dc93"], [L2("peso", "weight"), k * k * k, "#ff7a6b"]];
      el.querySelector(".w-big").textContent = k < 1.05 ? L2("Alto 1,7 m: sei tu", "1.7 m tall: that’s you") : L2(`Alto ${fmt(h, h < 10 ? 1 : 0)} m: ${num(k)} volte te`, `${fmt(h, h < 10 ? 1 : 0)} m tall: ${num(k)} times you`);
      el.querySelector(".w-note").textContent = k < 1.05 ? L2("Sei tu, alto 1,7 m: le tue ossa reggono bene il tuo peso.", "This is you, 1.7 m tall: your bones carry your weight well.") :
        L2(`Il peso cresce ${num(k * k * k)} volte, la forza delle ossa solo ${num(k * k)}: ogni osso deve reggere ${num(k)} volte più carico di oggi.`, `Weight grows ${num(k * k * k)} times, bone strength only ${num(k * k)}: each bone has to carry ${num(k)} times more load than now.`);
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H);
      const max = 3 * Math.log10(120 / 1.7), bx0 = 118, bx1 = W - 12;
      ctx.font = "12px Atkinson Hyperlegible, system-ui";
      rows.forEach(([lab, v, c], i) => {
        const y = 16 + i * 36, w = Math.max(3, Math.log10(v) / max * (bx1 - bx0)), label = "× " + num(v);
        ctx.textAlign = "left"; ctx.fillStyle = "#a3acbd"; ctx.fillText(lab, 10, y + 13);
        ctx.fillStyle = "rgba(238,241,246,.08)"; ctx.fillRect(bx0, y, bx1 - bx0, 18); ctx.fillStyle = c; ctx.fillRect(bx0, y, w, 18);
        if (bx0 + w + 74 > bx1) { ctx.textAlign = "right"; ctx.fillStyle = "#070a12"; ctx.fillText(label, bx0 + w - 6, y + 13); } else { ctx.textAlign = "left"; ctx.fillStyle = "#eef1f6"; ctx.fillText(label, bx0 + w + 6, y + 13); }
      });
      ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "right"; ctx.fillStyle = "#6c7486"; ctx.fillText(L2("scala logaritmica", "log scale"), bx1, H - 8);
    };
    r.value = posOf(h); r.oninput = () => { h = hOf(+r.value); show(); };
    PR.forEach((p, i) => { el.querySelector(`[data-a="p${i}"]`).onclick = () => { h = p[0]; r.value = posOf(h); show(); }; });
    show(); return null;
  },
  lightspeed(el) {
    // Time dilation, gamma = 1 / sqrt(1 - v²/c²). The slider goes from standing still to 99.999% of the speed of light.
    el.innerHTML = `<input type="range" class="w-slider" min="0" max="1000" value="400" id="ls-r" aria-label="${esc(L2("Velocità", "Speed"))}"><p class="w-big"></p><p class="w-note"></p>`;
    const { ctx, W } = wCanvas(el, 96), H = 96, r = el.querySelector("#ls-r");
    const beta = (v) => 1 - Math.pow(10, -v / 200), lap = (sec) => sec < 1 ? L2(`${fmt(sec, 2)} secondi`, `${fmt(sec, 2)} seconds`) : fmtDur(sec);
    const earth = (g) => g < 1.0005 ? L2("sulla Terra passa quasi esattamente un anno", "almost exactly one year passes on Earth") : g < 2 ? L2(`sulla Terra passano 1 anno e ${fmt(Math.round((g - 1) * 365))} giorni`, `1 year and ${fmt(Math.round((g - 1) * 365))} days pass on Earth`) : L2(`sulla Terra passano ${fmt(g, g < 10 ? 1 : 0)} anni`, `${fmt(g, g < 10 ? 1 : 0)} years pass on Earth`);
    const show = () => {
      const b = beta(+r.value), g = 1 / Math.sqrt(1 - b * b), dec = b < 0.9 ? 0 : Math.min(3, Math.round(-Math.log10(1 - b)) - 1);
      el.querySelector(".w-big").textContent = L2(`Velocità: ${fmt(b * 100, dec)}% della luce`, `Speed: ${fmt(b * 100, dec)}% of light`);
      el.querySelector(".w-note").textContent = b < 1e-6 ? L2("Fermo: per Flash e per la Terra il tempo scorre uguale.", "Standing still: time flows the same for the Flash and for the Earth.") :
        L2(`${fmt(b * 299792, 0)} km al secondo: il giro della Terra in ${lap(40075 / (b * 299792))}. Mentre per Flash passa un anno, ${earth(g)}.`, `${fmt(b * 299792, 0)} km per second: once around the Earth in ${lap(40075 / (b * 299792))}. While one year passes for the Flash, ${earth(g)}.`);
      ctx.fillStyle = "#070a12"; ctx.fillRect(0, 0, W, H); const bx0 = 74, bx1 = W - 12, full = bx1 - bx0;
      ctx.font = "12px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "left";
      [["Flash", 1 / g, "#ff7a6b"], [L2("Terra", "Earth"), 1, "#7cbcff"]].forEach(([lab, f, c], i) => { const y = 14 + i * 34; ctx.fillStyle = "#a3acbd"; ctx.fillText(lab, 10, y + 13); ctx.fillStyle = "rgba(238,241,246,.08)"; ctx.fillRect(bx0, y, full, 18); ctx.fillStyle = c; ctx.fillRect(bx0, y, Math.max(2, f * full), 18); });
      ctx.font = "10px Atkinson Hyperlegible, system-ui"; ctx.textAlign = "right"; ctx.fillStyle = "#6c7486"; ctx.fillText(L2("tempo che passa per ognuno", "time that passes for each"), bx1, H - 8);
    };
    r.oninput = show; show(); return null;
  }
};
