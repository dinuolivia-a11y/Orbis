/* =========================================================
   THE LABORATORY (the game)
   A room to bring back to life. Each room is a path of steps: experiments to do with your
   hands (bet first, then try, then find out why) and riddles whose answers are hidden around
   Orbis, in the lessons, the planets and the creatures. Rooms live in GAME_ROOMS: add a room,
   or steps to a room, and the rest follows. Progress is kept in localStorage "orbis-game".
   ========================================================= */
const GUI = {
  eyebrow: { it: "Orbis · Il Laboratorio", en: "Orbis · The Laboratory" },
  title: { it: "Il Laboratorio", en: "The Laboratory" },
  lead: { it: "Il laboratorio del professor Edward, lo scienziato più distratto del mondo. Fai gli esperimenti, risolvi gli enigmi e guardalo tornare a vivere. Le risposte agli enigmi sono nascoste in giro per Orbis: nelle lezioni, tra i pianeti, tra le creature.", en: "The laboratory of Professor Edward, the most absent-minded scientist in the world. Do the experiments, solve the riddles and watch it come back to life. The answers to the riddles are hidden around Orbis: in the lessons, among the planets, among the creatures." },
  prof: { it: "Prof. Edward", en: "Prof. Edward" },
  hello: [
    { it: "Eccoti, finalmente! Sono il professor Edward. Ho combinato un pasticcio: il laboratorio è al buio, pieno di polvere, e ho perfino dimenticato il codice del mio armadietto. Mi aiuti a rimetterlo in funzione?", en: "There you are at last! I am Professor Edward. I have made a mess: the laboratory is dark, full of dust, and I have even forgotten the code to my own cabinet. Will you help me get it working again?" },
    { it: "Luce! Finalmente ci vedo. Che eruzione, eh? Adesso però mi serve il succo magico… e l’ho chiuso nell’armadietto.", en: "Light! I can see at last. What an eruption, eh? But now I need the magic juice… and I locked it in the cabinet." },
    { it: "Sette, otto, due! Come ho fatto a dimenticarlo? Lo scaffale è di nuovo pieno di colori. Prendi il succo e proviamolo.", en: "Seven, eight, two! How could I forget? The shelf is full of colour again. Take the juice and let’s try it." },
    { it: "Magnifico! Acidi di qua, basi di là. A proposito di acidi: ne conosco due fortissimi che non stanno in cucina…", en: "Magnificent! Acids here, bases there. Speaking of acids: I know two very strong ones that are not in a kitchen…" },
    { it: "Bravissimo, li hai trovati! Ho rimontato il telescopio per festeggiare. Manca un ultimo esperimento, il mio preferito.", en: "Well done, you found them! I have put the telescope back up to celebrate. One last experiment to go, my favourite." },
    { it: "Ce l’abbiamo fatta! Il laboratorio non è mai stato così bello, e tu sei un vero Piccolo Chimico. Io intanto sto preparando una stanza nuova…", en: "We did it! The laboratory has never looked so good, and you are a real Little Chemist. Meanwhile I am getting a new room ready…" }
  ],
  betSay: { it: "Scommettiamo? ", en: "Shall we bet? " },
  banner: { it: "Il Laboratorio", en: "The Laboratory" },
  bannerSub: { it: "Esperimenti da fare ed enigmi da risolvere. Gioca e impara!", en: "Experiments to do and riddles to solve. Play and learn!" },
  bannerGo: { it: "Entra", en: "Enter" }, bannerNew: { it: "Novità", en: "New" },
  back: { it: "Il Laboratorio", en: "The Laboratory" }, backLessons: { it: "Lezioni", en: "Lessons" },
  exp: { it: "Esperimento", en: "Experiment" }, riddle: { it: "Enigma", en: "Riddle" },
  play: { it: "Gioca", en: "Play" }, again: { it: "Rigioca", en: "Play again" }, locked: { it: "Prima completa il passo precedente", en: "Finish the previous step first" },
  stars: { it: "{n} stelline su {m}", en: "{n} of {m} stars" },
  step1: { it: "1 · Scommetti", en: "1 · Bet" }, step2: { it: "2 · Prova", en: "2 · Try" }, step3: { it: "3 · Scopri", en: "3 · Find out" },
  betRight: { it: "Scommessa vinta!", en: "You won your bet!" }, betWrong: { it: "Sorpresa! Non era così.", en: "Surprise! It wasn’t that." },
  betGo: { it: "Adesso provalo tu", en: "Now try it yourself" }, betKeep: { it: "Vediamo se hai ragione…", en: "Let’s see if you’re right…" },
  goal: { it: "Missione", en: "Mission" }, done: { it: "Missione compiuta!", en: "Mission accomplished!" },
  toLearn: { it: "Scopri perché", en: "Find out why" }, empty: { it: "Svuota", en: "Empty it" }, fresh: { it: "Nuovo succo", en: "Fresh juice" },
  why: { it: "Perché succede", en: "Why it happens" }, home: { it: "Rifallo a casa", en: "Do it at home" },
  readLesson: { it: "Leggi la lezione", en: "Read the lesson" }, next: { it: "Avanti", en: "Continue" }, toRoom: { it: "Torna nel Laboratorio", en: "Back to the Laboratory" },
  earned: { it: "Hai guadagnato", en: "You earned" },
  where: { it: "Dove lo trovo?", en: "Where do I find it?" }, goSee: { it: "Vai a vedere", en: "Go and look" }, reveal: { it: "Dimmelo tu", en: "Just tell me" },
  seen: { it: "già letta", en: "already read" },
  open: { it: "Apri", en: "Open" }, lockNo: { it: "Non si apre: {n} cifre giuste su 3.", en: "It won’t open: {n} of 3 digits are right." }, lockYes: { it: "Clic! L’armadietto si apre.", en: "Click! The cabinet opens." },
  whoNo: { it: "Non sono io. Riprova, oppure vai a cercarmi!", en: "That’s not me. Try again, or go and look for me!" }, whoYes: { it: "Esatto, sono io!", en: "Yes, that’s me!" },
  ret: { it: "Torna al Laboratorio", en: "Back to the Laboratory" }, retClose: { it: "Chiudi", en: "Close" },
  soon: { it: "Presto", en: "Soon" }, others: { it: "Altre stanze in arrivo", en: "More rooms on the way" },
  nextGift: { it: "Prossima sorpresa", en: "Next surprise" }, allDone: { it: "Stanza completata! Sei un Piccolo Chimico.", en: "Room complete! You are a Little Chemist." },
  badge: { it: "Distintivo: Piccolo Chimico", en: "Badge: Little Chemist" },
  full: { it: "L’ampolla è piena: svuotala per riprovare.", en: "The flask is full: empty it to try again." }
};
const GAME_GIFTS = [
  { it: "accendi la lampada", en: "switch on the lamp" }, { it: "riempi lo scaffale di ampolle colorate", en: "fill the shelf with coloured flasks" },
  { it: "appendi la tavola periodica e porta una pianta", en: "hang the periodic table and bring in a plant" }, { it: "monta il telescopio alla finestra", en: "set up the telescope at the window" },
  { it: "il distintivo di Piccolo Chimico", en: "the Little Chemist badge" }
];
const GAME_SOON = [
  { e: "⚛️", n: { it: "La stanza dei quanti", en: "The quantum room" }, c: "#b9a4ff" },
  { e: "🔭", n: { it: "L’osservatorio", en: "The observatory" }, c: "#ffd479" },
  { e: "🧬", n: { it: "La serra della vita", en: "The greenhouse of life" }, c: "#86dc93" }
];
const GAME_STEPS = [
  { id: "vulcano", kind: "exp", e: "🌋", max: 2,
    t: { it: "Il vulcano di schiuma", en: "The foam volcano" },
    goal: { it: "Fai eruttare l’ampolla! Hai quattro ingredienti di cucina: scegli tu cosa versare e in che ordine.", en: "Make the flask erupt! You have four kitchen ingredients: you choose what to pour, and in what order." },
    bet: { q: { it: "Che cosa succede se nell’ampolla si incontrano aceto e bicarbonato?", en: "What happens when vinegar and baking soda meet in the flask?" },
      o: [{ it: "Tanta schiuma e bollicine", en: "Lots of foam and bubbles" }, { it: "Diventa tutto ghiaccio", en: "It all turns to ice" }, { it: "Non succede niente", en: "Nothing happens" }], a: 0 },
    why: [{ it: "L’aceto è un acido, il bicarbonato è una base. Quando si incontrano reagiscono e nasce una sostanza nuova che prima non c’era: un gas, l’anidride carbonica. È lo stesso gas delle bollicine dell’acqua frizzante.", en: "Vinegar is an acid, baking soda is a base. When they meet they react, and a new substance appears that was not there before: a gas, carbon dioxide. It is the same gas as the bubbles in fizzy water." },
      { it: "Il gas vuole uscire, spinge il liquido verso l’alto e fa la schiuma. Con acqua e sale invece non nasce niente di nuovo: il sale si scioglie e basta. Questa è la differenza tra mescolare e reagire.", en: "The gas wants out, pushes the liquid up and makes the foam. With water and salt nothing new is born: the salt just dissolves. That is the difference between mixing and reacting." }],
    home: { it: "Con un adulto: metti un bicchiere dentro una teglia, versa due cucchiai di bicarbonato e poi mezzo bicchiere di aceto. Per un vulcano più bello aggiungi prima una goccia di detersivo per piatti e un po’ di colorante rosso.", en: "With an adult: stand a glass in a baking tray, add two spoonfuls of baking soda and then half a glass of vinegar. For a better volcano, first add a drop of washing-up liquid and a little red food colouring." },
    lesson: "acidi-basi" },
  { id: "lucchetto", kind: "lock", e: "🔐", max: 3,
    t: { it: "Il lucchetto dell’armadietto", en: "The cabinet lock" },
    goal: { it: "Che testa! Ho chiuso il succo magico nell’armadietto e ho dimenticato il codice. Ricordo solo che ogni cifra è la risposta a una domanda, e che le risposte sono scritte nelle lezioni di Orbis.", en: "Silly me! I locked the magic juice in the cabinet and forgot the code. All I remember is that each digit answers a question, and that the answers are written in the Orbis lessons." },
    clues: [
      { q: { it: "Il pH dell’acqua pura", en: "The pH of pure water" }, a: 7, lesson: "acidi-basi", c: "#ff7fa3" },
      { q: { it: "I protoni nel nucleo dell’ossigeno", en: "The protons in the nucleus of oxygen" }, a: 8, lesson: "tavola-periodica", c: "#7cbcff" },
      { q: { it: "Gli atomi di idrogeno in una molecola d’acqua", en: "The hydrogen atoms in one molecule of water" }, a: 2, lesson: "acqua", c: "#86dc93" }
    ],
    why: [{ it: "Sette, otto, due. L’acqua pura è neutra, esattamente a metà della scala del pH. L’ossigeno è l’elemento numero 8 perché ha 8 protoni. E ogni molecola d’acqua è fatta di due idrogeni e un ossigeno: H₂O.", en: "Seven, eight, two. Pure water is neutral, right in the middle of the pH scale. Oxygen is element number 8 because it has 8 protons. And every water molecule is made of two hydrogens and one oxygen: H₂O." }] },
  { id: "cavolo", kind: "exp", e: "🥬", max: 2,
    t: { it: "Il succo che cambia colore", en: "The colour-changing juice" },
    goal: { it: "Nell’ampolla c’è succo di cavolo rosso. Trova tutti e quattro i suoi colori aggiungendo gli ingredienti giusti.", en: "The flask holds red cabbage juice. Find all four of its colours by adding the right ingredients." },
    bet: { q: { it: "Il succo di cavolo rosso è viola. Di che colore diventa con il succo di limone?", en: "Red cabbage juice is purple. What colour does it turn with lemon juice?" },
      o: [{ it: "Verde", en: "Green" }, { it: "Rosa", en: "Pink" }, { it: "Resta viola", en: "It stays purple" }], a: 1 },
    why: [{ it: "Il cavolo rosso contiene pigmenti chiamati antociani. La loro forma cambia a seconda di quanto è acido o basico il liquido, e cambiando forma riflettono una luce diversa: rosa negli acidi come limone e aceto, viola nel neutro, blu e verde nelle basi come bicarbonato e sapone.", en: "Red cabbage contains pigments called anthocyanins. Their shape changes with how acidic or basic the liquid is, and as it changes they reflect different light: pink in acids such as lemon and vinegar, purple when neutral, blue and green in bases such as baking soda and soap." },
      { it: "Hai appena costruito un indicatore: un liquido che ti dice con un colore se una cosa è acida o basica. I chimici usano lo stesso trucco con le cartine al tornasole.", en: "You have just built an indicator: a liquid that tells you by its colour whether something is acidic or basic. Chemists use the same trick with litmus paper." }],
    home: { it: "Con un adulto: fai bollire per 10 minuti qualche foglia di cavolo rosso tagliata, filtra l’acqua viola e dividila in bicchieri. Prova con limone, aceto, bicarbonato, e poi con quello che trovi in cucina: latte, acqua frizzante, sale.", en: "With an adult: boil a few chopped red cabbage leaves for 10 minutes, strain the purple water and share it between glasses. Try lemon, vinegar, baking soda, and then whatever you find in the kitchen: milk, fizzy water, salt." },
    lesson: "acidi-basi" },
  { id: "chisono", kind: "who", e: "🕵️", max: 3,
    t: { it: "Chi sono? Due acidi misteriosi", en: "Who am I? Two mysterious acids" },
    goal: { it: "Gli acidi non stanno solo nella mia cucina! Due abitanti di Orbis ne nascondono di fortissimi. Scopri chi sono: se non lo sai, vai a esplorare!", en: "Acids are not only found in my kitchen! Two inhabitants of Orbis hide very strong ones. Work out who they are: if you don’t know, go exploring!" },
    who: [
      { q: { it: "Sono un pianeta. Le mie nuvole sono fatte di acido solforico e sono il più caldo di tutti, anche se non sono il più vicino al Sole.", en: "I am a planet. My clouds are made of sulphuric acid and I am the hottest of all, even though I am not the closest to the Sun." },
        o: ["mercury", "venus", "mars", "jupiter"], a: "venus", type: "planet",
        where: { it: "Cerca tra i pianeti del Sistema solare: tocca quelli vicini al Sole e leggi le loro schede.", en: "Look among the planets of the Solar System: tap the ones near the Sun and read their cards." }, go: { v: "solar" } },
      { q: { it: "Sono un uccello delle montagne più alte. Mangio quasi solo ossa: il mio stomaco è così acido che riesce a digerirle.", en: "I am a bird of the highest mountains. I eat almost nothing but bones: my stomach is so acidic it can digest them." },
        o: ["snowleopard", "monal", "lammergeier", "redpanda"], a: "lammergeier", type: "creature",
        where: { it: "Vivo sull’Himalaya. Scendi dalla cima e leggi le schede degli animali che incontri.", en: "I live in the Himalayas. Climb down from the summit and read the cards of the animals you meet." }, go: { v: "dive", id: "himalaya" } }
    ],
    why: [{ it: "Venere è avvolta da nuvole di acido solforico, e la sua aria densa trattiene il calore come una serra: per questo è più calda di Mercurio. Il gipeto invece ha nello stomaco un acido tra i più forti del mondo animale, che scioglie le ossa in circa un giorno.", en: "Venus is wrapped in clouds of sulphuric acid, and its dense air traps heat like a greenhouse: that is why it is hotter than Mercury. The bearded vulture has one of the strongest stomach acids in the animal world, which dissolves bones in about a day." },
      { it: "Anche il tuo stomaco contiene un acido forte: ti aiuta a digerire e uccide molti microbi.", en: "Your stomach holds a strong acid too: it helps you digest and kills many microbes." }] },
  { id: "torre", kind: "exp", e: "🍯", max: 2,
    t: { it: "La torre dei liquidi", en: "The liquid tower" },
    goal: { it: "Versa nel cilindro i tre liquidi nell’ordine che vuoi, poi lascia cadere dentro i tre oggetti. Guarda dove si ferma ognuno.", en: "Pour the three liquids into the cylinder in any order you like, then drop in the three objects. Watch where each one stops." },
    bet: { q: { it: "Versi prima l’olio e poi l’acqua. Alla fine chi sta sopra?", en: "You pour the oil first and then the water. Which ends up on top?" },
      o: [{ it: "L’acqua, perché è arrivata dopo", en: "The water, because it came second" }, { it: "L’olio, sempre", en: "The oil, always" }, { it: "Si mescolano", en: "They mix together" }], a: 1 },
    why: [{ it: "Ogni liquido ha la sua densità: quanta materia è stipata nello stesso spazio. Il miele è il più denso e va sul fondo, l’olio è il meno denso e sale in cima, qualunque sia l’ordine in cui li versi. Acqua e olio poi non si mescolano, perché le molecole d’acqua si attirano tra loro e lasciano fuori quelle dell’olio.", en: "Every liquid has its own density: how much matter is packed into the same space. Honey is the densest and goes to the bottom, oil is the least dense and rises to the top, whatever order you pour them in. And water and oil do not mix, because water molecules cling to each other and leave the oil molecules out." },
      { it: "Lo stesso vale per gli oggetti: ognuno scende finché trova un liquido più denso di lui. La moneta è più densa di tutti e tocca il fondo, l’acino d’uva si ferma sul miele, il tappo di sughero galleggia sopra l’olio.", en: "The same goes for objects: each one sinks until it meets a liquid denser than itself. The coin is denser than everything and hits the bottom, the grape stops on the honey, the cork floats on the oil." }],
    home: { it: "Con un adulto: in un bicchiere alto e stretto versa piano miele, poi acqua colorata con un po’ di colorante, poi olio. Lascia cadere una monetina, un acino d’uva e un pezzetto di tappo.", en: "With an adult: in a tall narrow glass, slowly pour honey, then water tinted with a little food colouring, then oil. Drop in a small coin, a grape and a piece of cork." },
    lesson: "acqua" }
];
const GAME_MAX = GAME_STEPS.reduce((a, s) => a + s.max, 0);
let gameStep = null, gameStop = null, gamePhase = null, gameReturn = null, gamePushed = false;
function gameState() { try { const s = JSON.parse(localStorage.getItem("orbis-game") || "{}"); return { done: s.done || {} }; } catch (e) { return { done: {} }; } }
function gameSave(s) { try { localStorage.setItem("orbis-game", JSON.stringify(s)); } catch (e) {} }
const gameStars = (s) => GAME_STEPS.reduce((a, x) => a + (s.done[x.id] || 0), 0);
const gameStage = (s) => GAME_STEPS.filter((x) => s.done[x.id]).length;
const starRow = (n, max) => `<span class="g-stars" aria-label="${n}/${max}">${"★".repeat(n)}<i>${"★".repeat(Math.max(0, max - n))}</i></span>`;
function gameAward(id, n) { const s = gameState(), first = !s.done[id]; s.done[id] = Math.max(s.done[id] || 0, n); gameSave(s); return first; }
function stopGame() { if (gameStop) { try { gameStop(); } catch (e) {} gameStop = null; } }
const gameProf = () => `<svg class="g-prof" viewBox="0 0 80 80" aria-hidden="true"><path d="M12 80c0-16 12-24 28-24s28 8 28 24z" fill="#f4f6fb"/><path d="M34 58l6 10 6-10z" fill="#ff5fa2"/>
  <path d="M14 34l-10-8 12 2-6-14 12 9-1-15 10 12 5-14 5 14 10-12-1 15 12-9-6 14 12-2-10 8z" fill="#e8ecf4"/><circle cx="40" cy="38" r="20" fill="#f2c9a5"/>
  <path d="M26 50c8 9 20 9 28 0-8 3-20 3-28 0z" fill="#7a2d2d"/><path d="M29 51c7 3 15 3 22 0v2c-7 3-15 3-22 0z" fill="#fff"/>
  <path d="M18 34h44" stroke="#3a4560" stroke-width="4"/><circle cx="31" cy="35" r="9" fill="#9dffb0" stroke="#3a4560" stroke-width="3.5"/><circle cx="50" cy="35" r="9" fill="#9dffb0" stroke="#3a4560" stroke-width="3.5"/>
  <circle cx="32" cy="36" r="3" fill="#1d2536"/><circle cx="49" cy="34" r="3" fill="#1d2536"/><path d="M22 23l10 3M58 21l-10 4" stroke="#8b93a5" stroke-width="3" stroke-linecap="round"/></svg>`;
const profSay = (txt) => `<div class="g-say">${gameProf()}<p><b>${esc(t(GUI.prof))}</b> ${esc(txt)}</p></div>`;
function gameBanner() {
  const s = gameState(), n = gameStars(s);
  return `<button type="button" class="g-banner" id="g-banner"><span class="g-b-ico" aria-hidden="true">🧪</span>
    <span class="g-b-txt"><strong>${esc(t(GUI.banner))}${n ? "" : ` <em class="l-new">${esc(t(GUI.bannerNew))}</em>`}</strong><span>${esc(n ? t(GUI.stars).replace("{n}", n).replace("{m}", GAME_MAX) : t(GUI.bannerSub))}</span></span>
    <span class="g-b-go">${esc(t(GUI.bannerGo))} →</span></button>`;
}
function openGame(stepId, push) {
  if ($("lessons").hidden) openLessons(null); else if (lessonOpen) renderLessonList();
  $("game").hidden = false; overlayOpen = "game"; $("game-return").hidden = true; gameReturn = null;
  try { if (push) { history.pushState({ orbisGame: 1 }, "", "#gioco"); gamePushed = true; } else history.replaceState(null, "", "#gioco"); } catch (e) {}
  const st = stepId && GAME_STEPS.find((x) => x.id === stepId);
  if (st && gameUnlocked(st.id)) renderGameStep(st.id); else renderGameHome();
}
function closeGame() {
  if ($("game").hidden) return;
  stopGame(); $("game").hidden = true; gameStep = null; gamePushed = false;
  overlayOpen = !$("lessons").hidden ? "lessons" : diveEl.hidden ? null : "dive";
  if ((location.hash || "") === "#gioco") setHash("lezioni");
  if (!$("lessons").hidden && !lessonOpen) renderLessonList();
}
function renderGame() { if (gameStep) renderGameStep(gameStep); else renderGameHome(); }
function gameUnlocked(id) { const i = GAME_STEPS.findIndex((x) => x.id === id), s = gameState(); return i === 0 || !!s.done[GAME_STEPS[i - 1].id] || !!s.done[id]; }

/* ---------- the room, which wakes up as you play ---------- */
function gameRoomSvg(stage) {
  const flask = (x, c) => `<g transform="translate(${x} 0)"><path d="M-7 62v14l-13 26a5 5 0 0 0 4 7h32a5 5 0 0 0 4-7L7 76V62z" fill="#39404f" stroke="#6d7688" stroke-width="1.5"/><path class="r2" d="M-12 90l-8 13a4 4 0 0 0 4 5h32a4 4 0 0 0 4-5l-8-13z" fill="${c}"/><rect x="-9" y="58" width="18" height="5" rx="2" fill="#6d7688"/></g>`;
  let stars = ""; let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 16; i++) stars += `<circle cx="${(412 + rnd() * 136).toFixed(0)}" cy="${(46 + rnd() * 100).toFixed(0)}" r="${(0.8 + rnd() * 1.2).toFixed(1)}" fill="#fff" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
  let cells = ""; const cc = ["#ff7fa3", "#ffb45e", "#ffd479", "#86dc93", "#5fd3c6", "#7cbcff", "#b9a4ff"];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) if (!(r === 0 && c > 0 && c < 6)) cells += `<rect x="${283 + c * 11}" y="${72 + r * 11}" width="9" height="9" rx="1.5" fill="${cc[(c + r) % 7]}"/>`;
  return `<svg class="g-room s${stage}" viewBox="0 0 600 340" role="img" aria-label="${esc(t({ it: "Il laboratorio", en: "The laboratory" }))}">
    <rect width="600" height="340" rx="14" fill="#141a28"/><rect y="262" width="600" height="78" fill="#1d2536"/><path d="M0 262h600" stroke="#2c3650" stroke-width="2"/>
    <g><rect x="402" y="36" width="156" height="120" rx="6" fill="#070b18" stroke="#3a4560" stroke-width="5"/><g class="r4">${stars}<circle cx="528" cy="62" r="13" fill="#fdf3c4"/><circle cx="523" cy="58" r="13" fill="#070b18"/></g><path d="M480 36v120M402 96h156" stroke="#3a4560" stroke-width="3"/></g>
    <g class="r4"><path d="M452 262l22-74M496 262l-22-74M474 262v-74" stroke="#8b93a5" stroke-width="4" stroke-linecap="round"/><g transform="rotate(-28 474 186)"><rect x="436" y="174" width="84" height="22" rx="8" fill="#e8ecf4"/><rect x="514" y="170" width="16" height="30" rx="5" fill="#ffd479"/><rect x="424" y="179" width="16" height="12" rx="4" fill="#8b93a5"/></g></g>
    <g><rect x="34" y="110" width="226" height="8" rx="3" fill="#4a556d"/>${flask(64, "#ff5fa2")}${flask(108, "#ffb22e")}${flask(152, "#57d977")}${flask(196, "#39b5ff")}${flask(238, "#b98bff")}</g>
    <g class="r3" transform="translate(-232 84)"><rect x="276" y="62" width="92" height="62" rx="5" fill="#f4f1e8"/>${cells}<rect x="283" y="116" width="50" height="3" rx="1.5" fill="#9aa3b5"/></g>
    <g class="r3"><path d="M556 262c-4-30-22-46-34-50 10 16 14 32 16 50zM556 262c2-36 18-56 30-62-8 20-10 40-12 62zM558 262c0-28-4-52-12-70 14 14 20 40 20 70z" fill="#57c26f"/><path d="M536 262h44l-5 34h-34z" fill="#c9764a"/></g>
    <g><path d="M300 0v48" stroke="#6d7688" stroke-width="3"/><path d="M270 78l14-30h32l14 30z" fill="#4a556d"/><path class="r1" d="M270 78l14-30h32l14 30z" fill="#ffcf5c"/><ellipse class="r1" cx="300" cy="80" rx="22" ry="6" fill="#fff4c9"/>
      <path class="r1 g-glow" d="M274 82L150 340h300L326 82z" fill="url(#g-lamp)"/></g>
    <g><rect x="150" y="226" width="300" height="14" rx="4" fill="#5b4a3c"/><rect x="166" y="240" width="12" height="60" fill="#463a30"/><rect x="422" y="240" width="12" height="60" fill="#463a30"/>
      <path d="M288 150v30l-34 42a8 8 0 0 0 6 13h80a8 8 0 0 0 6-13l-34-42v-30z" fill="#2b3345" stroke="#8b93a5" stroke-width="2.5"/><rect x="282" y="144" width="36" height="8" rx="3" fill="#8b93a5"/>
      <path class="r1" d="M270 206l-14 17a6 6 0 0 0 5 10h78a6 6 0 0 0 5-10l-14-17z" fill="#ff5fa2"/>
      <g class="r5 g-bub"><circle cx="292" cy="196" r="4" fill="#ffd0e4"/><circle cx="306" cy="184" r="3" fill="#ffd0e4"/><circle cx="298" cy="168" r="3.5" fill="#ffd0e4"/></g>
      <g class="r2"><rect x="186" y="196" width="26" height="30" rx="4" fill="#39b5ff" opacity=".85"/><rect x="384" y="188" width="22" height="38" rx="4" fill="#57d977" opacity=".85"/></g></g>
    <g class="r5"><path d="M60 250l9 18 20 3-14 14 3 20-18-9-18 9 3-20-14-14 20-3z" fill="#ffd479" stroke="#e09a2b" stroke-width="2"/></g>
    <g class="r0"><rect width="600" height="340" rx="14" fill="#05070c" opacity=".5"/><path d="M0 0h70C52 12 26 30 0 70zM0 22c18-2 34-10 46-22M0 44c26-6 50-22 62-44M12 0c0 22-6 40-12 52" fill="none" stroke="#8b93a5" stroke-width="1" opacity=".7"/><path d="M600 0h-60c16 12 40 28 60 62zM600 20c-16-2-30-10-40-20M600 40c-22-6-42-20-52-40" fill="none" stroke="#8b93a5" stroke-width="1" opacity=".7"/></g>
    <defs><linearGradient id="g-lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".34"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></linearGradient></defs></svg>`;
}
function renderGameHome() {
  stopGame(); gameStep = null; gamePhase = null;
  const s = gameState(), stage = gameStage(s), n = gameStars(s);
  const steps = GAME_STEPS.map((x, i) => {
    const done = s.done[x.id], open = gameUnlocked(x.id), cur = open && !done;
    return `<li class="g-step${done ? " done" : ""}${cur ? " now" : ""}${open ? "" : " lock"}"><button type="button" data-id="${x.id}" ${open ? "" : `aria-disabled="true"`}>
      <span class="g-s-ico" aria-hidden="true">${open ? x.e : "🔒"}</span>
      <span class="g-s-txt"><small>${i + 1} · ${esc(t(x.kind === "exp" ? GUI.exp : GUI.riddle))}</small><strong>${esc(t(x.t))}</strong></span>
      <span class="g-s-end">${done ? starRow(done, x.max) : cur ? `<em>${esc(t(GUI.play))} →</em>` : ""}</span></button></li>`;
  }).join("");
  const soon = GAME_SOON.map((r) => `<div class="g-soon" style="--sc:${r.c}"><span aria-hidden="true">${r.e}</span><strong>${esc(t(r.n))}</strong><small>🔒 ${esc(t(GUI.soon))}</small></div>`).join("");
  $("game-inner").innerHTML = `<div class="l-backrow"><button type="button" class="l-back" id="g-back">← ${esc(t(GUI.backLessons))}</button></div>
    <header class="l-head"><p class="l-eyebrow">${esc(t(GUI.eyebrow))}</p><h1>${esc(t(GUI.title))}</h1><p class="lead">${esc(t(GUI.lead))}</p></header>
    ${profSay(t(GUI.hello[stage]))}
    <figure class="g-roomwrap">${gameRoomSvg(stage)}
      <figcaption><span class="g-count">★ ${esc(t(GUI.stars).replace("{n}", n).replace("{m}", GAME_MAX))}</span>
      <span class="g-gift">${stage >= GAME_STEPS.length ? `🏅 ${esc(t(GUI.allDone))}` : `🎁 ${esc(t(GUI.nextGift))}: ${esc(t(GAME_GIFTS[stage]))}`}</span></figcaption></figure>
    <h2 class="g-h2"><span aria-hidden="true">🧪</span> ${esc(t({ it: "La stanza delle ampolle", en: "The room of flasks" }))} <small>${esc(t(SUBJ.chimica))}</small></h2>
    <ol class="g-path">${steps}</ol>
    <h2 class="g-h2 dim">${esc(t(GUI.others))}</h2><div class="g-soons">${soon}</div>`;
  $("game").scrollTop = 0;
  $("g-back").onclick = () => { if (gamePushed) { try { history.back(); return; } catch (e) {} } closeGame(); };
  $("game-inner").querySelectorAll(".g-step button").forEach((b) => b.onclick = () => { if (b.getAttribute("aria-disabled")) { toast(t(GUI.locked)); return; } renderGameStep(b.dataset.id); });
}

/* ---------- one step ---------- */
function gameShell(st, inner) {
  const i = GAME_STEPS.indexOf(st);
  $("game-inner").innerHTML = `<div class="l-backrow"><button type="button" class="l-back" id="g-back">← ${esc(t(GUI.back))}</button></div>
    <article class="g-play"><p class="l-eyebrow">${i + 1} / ${GAME_STEPS.length} · ${esc(t(st.kind === "exp" ? GUI.exp : GUI.riddle))}</p>
    <h1><span aria-hidden="true">${st.e}</span> ${esc(t(st.t))}</h1>${inner}</article>`;
  $("game").scrollTop = 0;
  $("g-back").onclick = () => renderGameHome();
}
function renderGameStep(id) {
  stopGame();
  const st = GAME_STEPS.find((x) => x.id === id); if (!st) { renderGameHome(); return; }
  gameStep = id;
  if (st.kind === "exp") gameExp(st, gamePhase && gamePhase.id === id ? gamePhase : { id, phase: "bet", bet: null });
  else if (st.kind === "lock") gameLock(st, gamePhase && gamePhase.id === id ? gamePhase : { id, digits: [0, 0, 0], shown: [false, false, false], told: [false, false, false] });
  else gameWho(st, gamePhase && gamePhase.id === id ? gamePhase : { id, i: 0, miss: 0, cut: [[], []], hint: [false, false], found: [false, false] });
}
const phaseBar = (k) => `<ol class="g-phases">${["step1", "step2", "step3"].map((p, i) => `<li${i === k ? ' aria-current="step"' : ""}${i < k ? ' class="ok"' : ""}>${esc(t(GUI[p]))}</li>`).join("")}</ol>`;
function gameLearn(st, stars, extra) {
  const first = gameAward(st.id, stars), i = GAME_STEPS.indexOf(st), nx = GAME_STEPS[i + 1], s = gameState(), stage = gameStage(s);
  const gift = first ? `<p class="g-giftline">🎁 ${esc(t(i === GAME_STEPS.length - 1 ? GUI.badge : { it: "Nel Laboratorio: " + GAME_GIFTS[i].it + "!", en: "In the Laboratory: " + GAME_GIFTS[i].en + "!" }))}</p>` : "";
  return `<section class="g-learn"><p class="g-earn">${esc(t(GUI.earned))} ${starRow(stars, st.max)}</p>${gift}${extra || ""}
    <h2>${esc(t(GUI.why))}</h2>${st.why.map((p) => `<p>${esc(t(p))}</p>`).join("")}
    ${st.home ? `<aside class="l-box l-try" style="--sc:#ffb45e"><strong>${esc(t(GUI.home))}</strong><p>${esc(t(st.home))}</p></aside>` : ""}
    <div class="g-row">${st.lesson ? `<button type="button" class="w-btn ghost" id="g-lesson">📖 ${esc(t(GUI.readLesson))}</button>` : ""}
    <button type="button" class="cta" id="g-next">${esc(t(nx && stage < GAME_STEPS.length ? GUI.next : GUI.toRoom))} →</button></div></section>`;
}
function bindLearn(st) {
  const i = GAME_STEPS.indexOf(st), nx = GAME_STEPS[i + 1];
  const l = $("g-lesson"); if (l) l.onclick = () => gameTrip({ v: "lesson", id: st.lesson }, st.id);
  $("g-next").onclick = () => { gamePhase = null; if (nx && gameStage(gameState()) < GAME_STEPS.length) renderGameStep(nx.id); else renderGameHome(); };
}
/* leave the game to look for an answer in Orbis; a small button brings you back */
function gameTrip(go, stepId) {
  gameReturn = stepId || gameStep; const keep = gamePhase;
  closeGame(); gamePhase = keep;
  goTo(go);
  const R = $("game-return"); R.hidden = false;
  R.innerHTML = `<button type="button" id="g-ret-go">🧪 ${esc(t(GUI.ret))}</button><button type="button" id="g-ret-x" aria-label="${esc(t(GUI.retClose))}">✕</button>`;
  $("g-ret-go").onclick = () => { const id = gameReturn; openGame(id, false); };
  $("g-ret-x").onclick = () => { R.hidden = true; gameReturn = null; gamePhase = null; };
}

/* ---------- experiments: bet, try, find out ---------- */
function gameExp(st, ph) {
  gamePhase = ph;
  if (ph.phase === "bet") {
    gameShell(st, `${phaseBar(0)}${profSay(t(GUI.betSay) + t(st.bet.q))}
      <div class="g-opts">${st.bet.o.map((o, i) => `<button type="button" class="g-opt" data-i="${i}">${esc(t(o))}</button>`).join("")}</div><p class="g-note" id="g-note"></p>`);
    $("game-inner").querySelectorAll(".g-opt").forEach((b) => b.onclick = () => {
      ph.bet = +b.dataset.i; $("game-inner").querySelectorAll(".g-opt").forEach((x) => { x.disabled = true; x.classList.toggle("pick", x === b); });
      $("g-note").innerHTML = `${esc(t(GUI.betKeep))} <button type="button" class="cta" id="g-go">${esc(t(GUI.betGo))} →</button>`;
      $("g-go").onclick = () => { ph.phase = "do"; gameExp(st, ph); }; $("g-go").focus();
    });
  } else if (ph.phase === "do") {
    gameShell(st, `${phaseBar(1)}${profSay(t(st.goal))}<div class="g-bench" id="g-bench"></div>
      <div class="g-doneline" id="g-doneline" hidden><strong>🎉 ${esc(t(GUI.done))}</strong><button type="button" class="cta" id="g-learn">${esc(t(GUI.toLearn))} →</button></div>`);
    $("g-learn").onclick = () => { ph.phase = "learn"; gameExp(st, ph); };
    gameStop = GEXP[st.id]($("g-bench"), () => { const d = $("g-doneline"); if (d && d.hidden) { d.hidden = false; d.scrollIntoView({ block: "nearest", behavior: REDUCED ? "auto" : "smooth" }); } });
  } else {
    const right = ph.bet === st.bet.a;
    gameShell(st, `${phaseBar(2)}${gameLearn(st, right ? 2 : 1, `<p class="g-bet ${right ? "ok" : "no"}">${esc(t(right ? GUI.betRight : GUI.betWrong))} ${esc(t({ it: "La risposta era:", en: "The answer was:" }))} <b>${esc(t(st.bet.o[st.bet.a]))}</b>.</p>`)}`);
    bindLearn(st);
  }
}
const gMix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
/* an Erlenmeyer flask on a canvas: returns helpers to draw liquid, bubbles and foam inside it */
function gFlask(host, H) {
  const { cv, ctx, W } = wCanvas(host, H), cx = W / 2, top = 46, neckB = 118, base = H - 26, nw = 26, bw = Math.min(118, W * 0.34);
  const path = () => { ctx.beginPath(); ctx.moveTo(cx - nw, top); ctx.lineTo(cx - nw, neckB); ctx.lineTo(cx - bw, base - 14); ctx.quadraticCurveTo(cx - bw - 4, base, cx - bw + 14, base); ctx.lineTo(cx + bw - 14, base); ctx.quadraticCurveTo(cx + bw + 4, base, cx + bw, base - 14); ctx.lineTo(cx + nw, neckB); ctx.lineTo(cx + nw, top); };
  const yOf = (lv) => base - lv * (base - top);
  const halfAt = (y) => y <= neckB ? nw : nw + (bw - nw) * Math.min(1, (y - neckB) / (base - 14 - neckB));
  return { cv, ctx, W, H, cx, top, neckB, base, nw, bw, yOf, halfAt,
    clear() { ctx.clearRect(0, 0, W, H); },
    liquid(lv, col, alpha) { if (lv <= 0) return; ctx.save(); path(); ctx.clip(); ctx.globalAlpha = alpha == null ? 0.9 : alpha; ctx.fillStyle = col; ctx.fillRect(0, yOf(lv), W, H); ctx.globalAlpha = 0.25; ctx.fillStyle = "#fff"; ctx.fillRect(0, yOf(lv), W, 3); ctx.restore(); },
    inside(fn) { ctx.save(); path(); ctx.clip(); fn(); ctx.restore(); },
    glass() { ctx.save(); path(); ctx.strokeStyle = "rgba(220,232,255,.75)"; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.stroke(); ctx.fillStyle = "rgba(220,232,255,.75)"; ctx.fillRect(cx - nw - 5, top - 6, nw * 2 + 10, 7);
      ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - nw + 9, top + 12); ctx.lineTo(cx - nw + 9, neckB - 4); ctx.lineTo(cx - bw * 0.66, base - 34); ctx.stroke(); ctx.restore(); },
    stream(col, k) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, Math.min(base - 8, top + k * (base - top))); ctx.stroke(); ctx.restore(); },
    grains(col, k, seed) { ctx.save(); ctx.fillStyle = col; for (let i = 0; i < 26; i++) { const r = Math.sin((i + seed) * 91.7) * 0.5 + 0.5, y = ((k * 1.4 + r) % 1) * (base - 10); ctx.beginPath(); ctx.arc(cx + Math.sin((i + seed) * 37.1) * 12, y, 2.2, 0, 7); ctx.fill(); } ctx.restore(); }
  };
}
const gIngr = (list) => `<div class="g-ingr">${list.map((x) => `<button type="button" class="g-in" data-k="${x.k}" style="--ic:${x.c}"><span aria-hidden="true">${x.e}</span>${esc(t(x.n))}</button>`).join("")}</div>`;
const GEXP = {
  vulcano(host, onGoal) {
    const ING = [
      { k: "acqua", e: "💧", n: { it: "Acqua", en: "Water" }, c: "#5cc2ff", liquid: true },
      { k: "aceto", e: "🧴", n: { it: "Aceto", en: "Vinegar" }, c: "#f2dc7a", liquid: true },
      { k: "bicarbonato", e: "🥄", n: { it: "Bicarbonato", en: "Baking soda" }, c: "#f4f6fb" },
      { k: "sale", e: "🧂", n: { it: "Sale", en: "Salt" }, c: "#d9dee8" }
    ];
    host.innerHTML = `<p class="g-status" id="g-status" role="status">${esc(L2("L’ampolla è vuota. Che cosa versi per primo?", "The flask is empty. What do you pour first?"))}</p>${gIngr(ING)}<div class="g-row"><button type="button" class="w-btn ghost" id="g-empty">↺ ${esc(t(GUI.empty))}</button></div>`;
    const F = gFlask(host, 320), { ctx } = F;
    let items = [], lv = 0, lvT = 0, col = "#5cc2ff", pour = null, fizz = 0, foam = 0, pile = 0, bub = [], drops = [], told = false, time = 0;
    const has = (k) => items.includes(k), liquids = () => items.filter((k) => ING.find((x) => x.k === k).liquid);
    const say = (s) => { $("g-status").textContent = s; };
    function settle(k) {
      items.push(k); const L = liquids();
      lvT = Math.min(0.5, L.length * 0.2);
      if (L.length) col = L.includes("aceto") && L.includes("acqua") ? "#a9d6c0" : L.includes("aceto") ? "#f2dc7a" : "#5cc2ff";
      const react = has("aceto") && has("bicarbonato");
      if (react && fizz <= 0 && !told) {
        fizz = 1; told = true;
        say(items.indexOf("bicarbonato") < items.indexOf("aceto")
          ? L2("FSSSS! L’aceto cade sulla polvere tutta insieme e la schiuma sale di colpo: è nato un gas!", "FSSSS! The vinegar hits all the powder at once and the foam shoots up: a gas is born!")
          : L2("FSSSS! Appena la polvere tocca l’aceto partono le bolle: è nato un gas!", "FSSSS! As soon as the powder touches the vinegar the bubbles start: a gas is born!"));
        setTimeout(onGoal, 2600);
      } else if (react) say(L2("Ancora un po’ di schiuma: finché ci sono aceto e bicarbonato, il gas continua a nascere.", "A little more foam: as long as there is vinegar and baking soda, gas keeps forming."));
      else if (k === "acqua") say(has("sale") || has("bicarbonato") ? L2("La polvere si scioglie nell’acqua e sparisce alla vista. Niente schiuma.", "The powder dissolves in the water and vanishes from sight. No foam.") : L2("Acqua: tranquilla e trasparente. E adesso?", "Water: calm and clear. What now?"));
      else if (k === "aceto") say(has("sale") ? L2("Il sale si scioglie nell’aceto. Niente schiuma: non è lui l’ingrediente giusto.", "The salt dissolves in the vinegar. No foam: it is not the right ingredient.") : L2("Aceto: un acido leggero, dall’odore pungente. Cerca chi lo fa arrabbiare!", "Vinegar: a mild acid with a sharp smell. Find what sets it off!"));
      else if (k === "sale") say(L.length ? L2("Il sale si scioglie e basta. Nessuna reazione.", "The salt just dissolves. No reaction.") : L2("Un mucchietto di sale sul fondo. Serve un liquido.", "A little heap of salt at the bottom. It needs a liquid."));
      else say(L.length ? L2("Il bicarbonato si scioglie nell’acqua. Niente schiuma: l’acqua non è un acido.", "The baking soda dissolves in the water. No foam: water is not an acid.") : L2("Bicarbonato: una polverina bianca sul fondo. Che cosa gli versi sopra?", "Baking soda: a white powder at the bottom. What do you pour on it?"));
      if (react && fizz < 0.5) fizz = 0.6;
    }
    host.querySelectorAll(".g-in").forEach((b) => b.onclick = () => {
      if (pour) return; if (items.length >= 4) { say(t(GUI.full)); return; }
      const x = ING.find((i) => i.k === b.dataset.k); pour = { x, k: 0 };
    });
    $("g-empty").onclick = () => { items = []; lv = lvT = 0; fizz = foam = pile = 0; bub = []; drops = []; told = false; pour = null; say(L2("Ampolla pulita. Riprova con un’altra coppia!", "Clean flask. Try another pair!")); };
    const stop = wLoop((dt) => {
      time += dt;
      if (pour) { pour.k += dt / 0.7; if (pour.k >= 1) { const k = pour.x.k; pour = null; settle(k); } }
      lv += (lvT - lv) * Math.min(1, dt * 4);
      const dry = items.some((k) => k === "sale" || k === "bicarbonato") && !liquids().length;
      pile += ((dry ? 1 : 0) - pile) * Math.min(1, dt * 3);
      if (fizz > 0) {
        fizz = Math.max(0, fizz - dt / 7);
        for (let i = 0; i < 3; i++) bub.push({ x: F.cx + (Math.random() - 0.5) * F.bw * 1.5, y: F.base - 6, r: 2 + Math.random() * 5, v: 60 + Math.random() * 90 });
        if (fizz > 0.35 && Math.random() < 0.5) drops.push({ s: Math.random() < 0.5 ? -1 : 1, y: F.top - 4, r: 5 + Math.random() * 6, v: 26 + Math.random() * 30 });
      }
      foam += ((fizz > 0.05 ? Math.min(1, fizz * 2.4) : 0) - foam) * Math.min(1, dt * (fizz > 0.05 ? 2.2 : 0.7));
      F.clear();
      F.liquid(lv, col, 0.85);
      F.inside(() => {
        if (pile > 0.02) { ctx.globalAlpha = pile; ctx.fillStyle = "#f4f6fb"; ctx.beginPath(); ctx.ellipse(F.cx, F.base - 2, 46, 16, 0, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1; }
        if (foam > 0.02) { const yT = F.yOf(lv) - foam * (F.yOf(lv) - F.top + 14); ctx.fillStyle = "rgba(255,250,240,.93)"; ctx.fillRect(0, yT, F.W, F.yOf(lv) - yT + 4);
          for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.arc(F.cx + Math.sin(i * 2.4 + time * 2) * F.halfAt(yT) * 0.9, yT + Math.cos(i * 1.7 + time * 3) * 5, 8, 0, 7); ctx.fill(); } }
        ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.4;
        bub = bub.filter((b) => { b.y -= b.v * dt; b.x += Math.sin(time * 6 + b.r) * 0.6; if (b.y < F.yOf(lv) - foam * 120) return false; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.stroke(); return true; });
      });
      ctx.fillStyle = "rgba(255,250,240,.95)";
      drops = drops.filter((d) => { d.y += d.v * dt; const x = F.cx + d.s * (F.halfAt(d.y) + d.r * 0.5); if (d.y > F.base) return false; ctx.beginPath(); ctx.arc(x, d.y, d.r, 0, 7); ctx.fill(); return true; });
      if (foam > 0.8) { ctx.beginPath(); ctx.ellipse(F.cx, F.top - 8, F.nw + 12, 12 + Math.sin(time * 5) * 2, 0, 0, 7); ctx.fill(); }
      F.glass();
      if (pour) { if (pour.x.liquid) F.stream(pour.x.c, pour.k); else F.grains(pour.x.c, pour.k, 3); }
    });
    return stop;
  },
  cavolo(host, onGoal) {
    const ING = [
      { k: "limone", e: "🍋", n: { it: "Limone", en: "Lemon" }, c: "#ffe34d", liquid: true },
      { k: "aceto", e: "🧴", n: { it: "Aceto", en: "Vinegar" }, c: "#f2dc7a", liquid: true },
      { k: "acqua", e: "💧", n: { it: "Acqua", en: "Water" }, c: "#5cc2ff", liquid: true },
      { k: "bicarbonato", e: "🥄", n: { it: "Bicarbonato", en: "Baking soda" }, c: "#f4f6fb" },
      { k: "sapone", e: "🧼", n: { it: "Sapone", en: "Soap" }, c: "#bfe8ff", liquid: true }
    ];
    const BANDS = [
      { k: "rosa", n: { it: "Rosa", en: "Pink" }, c: "#f04d8a", w: { it: "acido", en: "acidic" } }, { k: "viola", n: { it: "Viola", en: "Purple" }, c: "#8448c0", w: { it: "neutro", en: "neutral" } },
      { k: "blu", n: { it: "Blu", en: "Blue" }, c: "#3f72d9", w: { it: "un po’ basico", en: "slightly basic" } }, { k: "verde", n: { it: "Verde", en: "Green" }, c: "#3fae5a", w: { it: "basico", en: "basic" } }
    ];
    const STOPS = [[2, "#ee3a5c"], [4.2, "#f04d8a"], [5.6, "#b04fc4"], [7, "#8448c0"], [8.5, "#3f72d9"], [9.3, "#2a9fb0"], [10, "#3fae5a"]];
    const colOf = (p) => { for (let i = 1; i < STOPS.length; i++) if (p <= STOPS[i][0]) return gMix(STOPS[i - 1][1], STOPS[i][1], Math.max(0, (p - STOPS[i - 1][0]) / (STOPS[i][0] - STOPS[i - 1][0]))); return STOPS[STOPS.length - 1][1]; };
    const band = (p) => p <= 4.8 ? "rosa" : p <= 7.6 ? "viola" : p <= 9.2 ? "blu" : "verde";
    host.innerHTML = `<div class="g-found" id="g-found"></div><p class="g-status" id="g-status" role="status">${esc(L2("Succo di cavolo rosso: viola. Che cosa aggiungi?", "Red cabbage juice: purple. What will you add?"))}</p>${gIngr(ING)}<div class="g-row"><button type="button" class="w-btn ghost" id="g-empty">↺ ${esc(t(GUI.fresh))}</button></div>`;
    const F = gFlask(host, 320), { ctx } = F;
    let ph = 7, shown = 7, lv = 0.3, lvT = 0.3, n = 0, pour = null, fizz = 0, bub = [], time = 0, goal = false, base = 0;
    const found = new Set(["viola"]);
    const say = (s) => { $("g-status").textContent = s; };
    const chips = () => { $("g-found").innerHTML = BANDS.map((b) => `<span class="g-chip${found.has(b.k) ? " on" : ""}" style="--ic:${b.c}"><i></i>${esc(t(b.n))}${found.has(b.k) ? ` <small>${esc(t(b.w))}</small>` : ""}</span>`).join(""); };
    chips();
    function settle(k) {
      const before = band(ph); n++; lvT = Math.min(0.52, 0.3 + n * 0.045);
      if (k === "limone") { if (base > 0 && ph > 7) fizz = 0.5; ph = Math.max(2.2, ph - 3); base = Math.max(0, base - 1); }
      else if (k === "aceto") { if (base > 0 && ph > 7) fizz = 0.5; ph = Math.max(3, ph - 2.5); base = Math.max(0, base - 1); }
      else if (k === "bicarbonato") { if (ph < 6) fizz = 0.5; if (ph < 8.5) ph = Math.min(8.5, ph + 1.6); base++; }
      else if (k === "sapone") { if (ph < 10) ph = Math.min(10, ph + 3); }
      else ph += (7 - ph) * 0.15;
      const b = band(ph), B = BANDS.find((x) => x.k === b), isNew = !found.has(b); found.add(b); chips();
      const name = t(B.n).toLowerCase(), why = t(B.w);
      if (k === "acqua") say(L2("L’acqua lo rende più chiaro, ma il colore resta quello: non è né acida né basica.", "Water makes it paler, but the colour stays: water is neither acidic nor basic."));
      else if (b === before) say(fizz > 0.3 ? L2("Bollicine! Acido e bicarbonato si stanno neutralizzando. Aggiungine ancora per cambiare colore.", "Bubbles! Acid and baking soda are neutralising each other. Add more to change the colour.") : L2(`Resta ${name}. Prova un ingrediente diverso, oppure aggiungine ancora.`, `It stays ${name}. Try a different ingredient, or add more.`));
      else say((isNew ? L2("Nuovo colore! ", "New colour! ") : "") + L2(`Ora è ${name}: il liquido è ${why}.`, `Now it is ${name}: the liquid is ${why}.`) + (fizz > 0.3 ? L2(" E quelle bollicine? Acido e bicarbonato che reagiscono.", " And those bubbles? Acid and baking soda reacting.") : ""));
      if (found.size === 4 && !goal) { goal = true; setTimeout(onGoal, 1400); }
    }
    host.querySelectorAll(".g-in").forEach((b) => b.onclick = () => {
      if (pour) return; if (n >= 5) { say(L2("L’ampolla è piena: prendi del succo nuovo. I colori trovati restano.", "The flask is full: take some fresh juice. The colours you found are kept.")); return; }
      pour = { x: ING.find((i) => i.k === b.dataset.k), k: 0 };
    });
    $("g-empty").onclick = () => { ph = 7; n = 0; base = 0; lvT = 0.3; fizz = 0; pour = null; say(L2("Succo nuovo, di nuovo viola.", "Fresh juice, purple again.")); };
    return wLoop((dt) => {
      time += dt;
      if (pour) { pour.k += dt / 0.7; if (pour.k >= 1) { const k = pour.x.k; pour = null; settle(k); } }
      lv += (lvT - lv) * Math.min(1, dt * 4); shown += (ph - shown) * Math.min(1, dt * 2.2);
      if (fizz > 0) { fizz = Math.max(0, fizz - dt / 5); for (let i = 0; i < 2; i++) bub.push({ x: F.cx + (Math.random() - 0.5) * F.bw * 1.5, y: F.base - 6, r: 2 + Math.random() * 3.5, v: 50 + Math.random() * 70 }); }
      F.clear(); F.liquid(lv, colOf(shown), 0.95);
      F.inside(() => { ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1.3; bub = bub.filter((b) => { b.y -= b.v * dt; if (b.y < F.yOf(lv)) return false; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.stroke(); return true; }); });
      F.glass();
      if (pour) { if (pour.x.liquid) F.stream(pour.x.c, pour.k); else F.grains(pour.x.c, pour.k, 5); }
    });
  },
  torre(host, onGoal) {
    const LIQ = [
      { k: "miele", e: "🍯", n: { it: "Miele", en: "Honey" }, c: "#e3a21c", d: 1.4 },
      { k: "acqua", e: "💧", n: { it: "Acqua blu", en: "Blue water" }, c: "#3aa0f0", d: 1 },
      { k: "olio", e: "🫒", n: { it: "Olio", en: "Oil" }, c: "#f0df6a", d: 0.92 }
    ];
    const OBJ = [
      { k: "moneta", e: "🪙", n: { it: "Moneta", en: "Coin" }, c: "#d9a441", d: 8 },
      { k: "uva", e: "🍇", n: { it: "Acino d’uva", en: "Grape" }, c: "#8a4fc0", d: 1.1 },
      { k: "tappo", e: "🍾", n: { it: "Tappo di sughero", en: "Cork" }, c: "#c9a27a", d: 0.25 }
    ];
    host.innerHTML = `<p class="g-status" id="g-status" role="status">${esc(L2("Il cilindro è vuoto. Scegli tu da quale liquido cominciare.", "The cylinder is empty. You choose which liquid to start with."))}</p>${gIngr(LIQ)}${gIngr(OBJ)}<div class="g-row"><button type="button" class="w-btn ghost" id="g-empty">↺ ${esc(t(GUI.empty))}</button></div>`;
    const { ctx, W, H } = wCanvas(host, 340), cx = W / 2, hw = Math.min(70, W * 0.2), top = 30, bot = H - 22, LH = 78;
    let layers = [], objs = [], pour = null, goal = false, time = 0;
    const say = (s) => { $("g-status").textContent = s; };
    const sorted = () => layers.slice().sort((a, b) => b.x.d - a.x.d);
    const retarget = () => { sorted().forEach((l, i) => { l.t = i * LH; }); };
    const surf = () => bot - layers.reduce((a, l) => a + l.h, 0);
    function rest(o) {  // an object sinks until it meets a liquid denser than itself (layers sorted densest first)
      const S = sorted();
      if (!S.length || S[0].x.d < o.x.d) return bot - o.r;          // nothing denser below: the bottom
      const idx = S.findIndex((l) => l.x.d < o.x.d);                // first layer, from the bottom, lighter than the object
      if (idx === -1) return bot - S.length * LH + o.r * 0.25;      // lighter than everything: floats at the surface
      return bot - idx * LH - o.r * 0.9;                            // rests on the denser layer below
    }
    const check = () => { if (!goal && layers.length === 3 && objs.length === 3) { goal = true; setTimeout(onGoal, 2200); } };
    host.querySelectorAll(".g-in").forEach((b) => b.onclick = () => {
      if (pour) return;
      const L = LIQ.find((i) => i.k === b.dataset.k), O = OBJ.find((i) => i.k === b.dataset.k);
      if (L) { if (layers.some((l) => l.x === L)) return; pour = { x: L, k: 0 }; b.disabled = true; }
      else if (O) { if (objs.some((o) => o.x === O)) return; b.disabled = true;
        objs.push({ x: O, y: 0, r: O.k === "moneta" ? 11 : 12, dx: (objs.length - 1) * 30 });
        const S = sorted();
        say(!S.length ? L2("Senza liquidi cade dritto sul fondo. Versa qualcosa e guarda se si sposta!", "With no liquid it drops straight to the bottom. Pour something and see if it moves!")
          : O.k === "moneta" ? L2("La moneta è più densa di tutti i liquidi: va giù fino in fondo.", "The coin is denser than every liquid: it goes all the way down.")
          : O.k === "uva" ? (layers.some((l) => l.x.k === "miele") ? L2("L’acino affonda nell’olio e nell’acqua, ma il miele è più denso di lui e lo ferma.", "The grape sinks through oil and water, but honey is denser than it and stops it.") : L2("L’acino è più denso di acqua e olio: scende fino in fondo. Prova ad aggiungere il miele!", "The grape is denser than water and oil: it sinks to the bottom. Try adding honey!"))
          : L2("Il sughero è leggerissimo: galleggia sopra a tutto.", "Cork is very light: it floats on top of everything."));
        check(); }
    });
    $("g-empty").onclick = () => { layers = []; objs = []; pour = null; goal = false; host.querySelectorAll(".g-in").forEach((b) => { b.disabled = false; }); say(L2("Cilindro vuoto. Prova a versarli in un altro ordine: finiranno uguali?", "Empty cylinder. Try pouring them in a different order: will they end up the same?")); };
    return wLoop((dt) => {
      time += dt;
      if (pour) { pour.k += dt / 0.8; if (pour.k >= 1) { const x = pour.x; pour = null;
        layers.push({ x, y: layers.length * LH, t: 0, h: LH }); retarget();
        const S = sorted(), i = S.findIndex((l) => l.x === x);
        say(layers.length === 1 ? L2(`${t(x.n)}: per ora è da solo.`, `${t(x.n)}: on its own for now.`) : i === S.length - 1 ? L2(`${t(x.n)} resta sopra: è il meno denso.`, `${t(x.n)} stays on top: it is the least dense.`) : L2(`Guarda! ${t(x.n)} scivola sotto: è più denso di quello che c’era sopra.`, `Look! ${t(x.n)} slides underneath: it is denser than what was above it.`));
        check(); } }
      ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.roundRect(cx - hw, top, hw * 2, bot - top, [0, 0, 14, 14]); ctx.clip();
      for (const l of layers) { l.y += (l.t - l.y) * Math.min(1, dt * 1.6); ctx.globalAlpha = 0.88; ctx.fillStyle = l.x.c; const yb = bot - l.y;
        ctx.beginPath(); ctx.moveTo(cx - hw, yb); ctx.lineTo(cx - hw, yb - l.h); for (let x = -hw; x <= hw; x += 10) ctx.lineTo(cx + x, yb - l.h + Math.sin(x * 0.12 + time * 2 + l.y) * (Math.abs(l.t - l.y) > 2 ? 5 : 1.2)); ctx.lineTo(cx + hw, yb); ctx.closePath(); ctx.fill(); }
      ctx.globalAlpha = 1;
      for (const o of objs) { const ty = rest(o); o.y = o.y || top - 10; o.y += (ty - o.y) * Math.min(1, dt * (ty > o.y ? 2.2 : 1.6));
        ctx.fillStyle = o.x.c; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1.5; const x = cx + o.dx;
        if (o.x.k === "tappo") { ctx.beginPath(); ctx.roundRect(x - 10, o.y - 12, 20, 24, 5); ctx.fill(); ctx.stroke(); }
        else { ctx.beginPath(); ctx.ellipse(x, o.y, o.r, o.x.k === "moneta" ? 5 : o.r, 0, 0, 7); ctx.fill(); ctx.stroke(); if (o.x.k === "uva") { ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.arc(x - 4, o.y - 4, 3, 0, 7); ctx.fill(); } } }
      ctx.restore();
      ctx.strokeStyle = "rgba(220,232,255,.75)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(cx - hw, top, hw * 2, bot - top, [0, 0, 14, 14]); ctx.stroke();
      ctx.fillStyle = "rgba(220,232,255,.75)"; ctx.fillRect(cx - hw - 6, top - 5, hw * 2 + 12, 6);
      ctx.font = "600 12px Atkinson Hyperlegible, system-ui, sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#d6dbe5";
      for (const l of layers) if (Math.abs(l.t - l.y) < 3) ctx.fillText(t(l.x.n), cx + hw + 12, bot - l.y - l.h / 2 + 4);
      if (pour) { ctx.strokeStyle = pour.x.c; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, Math.min(surf(), top + pour.k * (surf() - top) + 20)); ctx.stroke(); }
    });
  }
};

/* ---------- riddle: the three-digit lock ---------- */
function gameLock(st, ph) {
  gamePhase = ph;
  const read = lessonsRead();
  const dials = st.clues.map((c, i) => `<div class="g-dial" style="--ic:${c.c}"><button type="button" data-i="${i}" data-d="1" aria-label="+">▲</button><output id="g-d${i}">${ph.digits[i]}</output><button type="button" data-i="${i}" data-d="-1" aria-label="−">▼</button></div>`).join("");
  const clues = st.clues.map((c, i) => { const L = LESSONS.find((l) => l.id === c.lesson);
    return `<li style="--ic:${c.c}"><span class="g-num">${i + 1}</span><div><p>${esc(t(c.q))}</p>
      ${ph.told[i] ? `<p class="g-hint">→ <b>${c.a}</b></p>` : ph.shown[i] ? `<p class="g-hint">${esc(L2("Lo trovi nella lezione", "You will find it in the lesson"))} «${esc(t(L.t))}»${read.has(L.id) ? ` <small>(${esc(t(GUI.seen))})</small>` : ""}.</p>
        <div class="g-row"><button type="button" class="w-btn" data-go="${i}">📖 ${esc(t(GUI.goSee))}</button><button type="button" class="w-btn ghost" data-tell="${i}">${esc(t(GUI.reveal))} (−★)</button></div>`
        : `<button type="button" class="w-btn ghost" data-where="${i}">💡 ${esc(t(GUI.where))}</button>`}</div></li>`; }).join("");
  gameShell(st, `${profSay(t(st.goal))}
    <div class="g-lock" id="g-lock"><div class="g-dials">${dials}</div><button type="button" class="cta" id="g-open">🔓 ${esc(t(GUI.open))}</button></div>
    <p class="g-status" id="g-status" role="status"></p><ol class="g-clues">${clues}</ol>`);
  const Q = (s) => $("game-inner").querySelectorAll(s);
  Q(".g-dial button").forEach((b) => b.onclick = () => { const i = +b.dataset.i; ph.digits[i] = (ph.digits[i] + +b.dataset.d + 10) % 10; $("g-d" + i).textContent = ph.digits[i]; });
  Q("[data-where]").forEach((b) => b.onclick = () => { ph.shown[+b.dataset.where] = true; const y = $("game").scrollTop; gameLock(st, ph); $("game").scrollTop = y; });
  Q("[data-tell]").forEach((b) => b.onclick = () => { ph.told[+b.dataset.tell] = true; const y = $("game").scrollTop; gameLock(st, ph); $("game").scrollTop = y; });
  Q("[data-go]").forEach((b) => b.onclick = () => gameTrip({ v: "lesson", id: st.clues[+b.dataset.go].lesson }, st.id));
  $("g-open").onclick = () => {
    const ok = st.clues.filter((c, i) => c.a === ph.digits[i]).length;
    if (ok < 3) { $("g-status").textContent = t(GUI.lockNo).replace("{n}", ok); const L = $("g-lock"); L.classList.remove("shake"); void L.offsetWidth; L.classList.add("shake"); return; }
    const stars = Math.max(1, 3 - ph.told.filter(Boolean).length);
    gameShell(st, `<p class="g-bet ok">${esc(t(GUI.lockYes))} <b>7 · 8 · 2</b></p>${gameLearn(st, stars)}`); bindLearn(st);
  };
}

/* ---------- riddle: who am I? ---------- */
const GAME_PLANET = { mercury: ["#b9b2a8", "#6f6a63"], venus: ["#f3dfa6", "#c9a35b"], mars: ["#e0714a", "#8f3b22"], jupiter: ["#e9c9a0", "#b5774a"] };
function gameWho(st, ph) {
  gamePhase = ph;
  if (ph.i >= st.who.length) { const stars = Math.max(1, 3 - ph.miss); gameShell(st, `<p class="g-bet ok">${esc(L2("Li hai trovati tutti e due: Venere e il gipeto.", "You found them both: Venus and the bearded vulture."))}</p>${gameLearn(st, stars)}`); bindLearn(st); return; }
  const w = st.who[ph.i], names = {}; for (const k in DIVES) for (const c of DIVES[k].creatures) names[c.id] = c.name;
  const tile = (id) => {
    const nm = w.type === "planet" ? t((PLANETS.find((p) => p.id === id) || {}).name) : t(names[id]);
    const src = w.type === "creature" ? imgFor(id) : null, g = GAME_PLANET[id];
    const pic = w.type === "planet" ? `<span class="g-planet${id === "jupiter" ? " band" : ""}" style="--a:${g[0]};--b:${g[1]}"></span>` : src ? `<img src="${esc(src)}" alt="" loading="lazy">` : `<span class="g-planet" style="--a:#3a4560;--b:#1d2536"></span>`;
    return `<button type="button" class="g-tile" data-id="${id}" ${ph.cut[ph.i].includes(id) ? "disabled" : ""}>${pic}<strong>${esc(nm)}</strong></button>`;
  };
  gameShell(st, `${profSay(t(st.goal))}<p class="l-eyebrow">${ph.i + 1} / ${st.who.length}</p>
    <blockquote class="g-quote">«${esc(t(w.q))}»</blockquote><div class="g-tiles">${w.o.map(tile).join("")}</div>
    <p class="g-status" id="g-status" role="status"></p>
    ${ph.hint[ph.i] ? `<div class="g-hintbox"><p>💡 ${esc(t(w.where))}</p><button type="button" class="w-btn" id="g-go">🧭 ${esc(t(GUI.goSee))}</button></div>` : `<button type="button" class="w-btn ghost" id="g-where">💡 ${esc(t(GUI.where))}</button>`}`);
  $("game-inner").querySelectorAll(".g-tile").forEach((b) => b.onclick = () => {
    if (b.dataset.id === w.a) { b.classList.add("yes"); $("g-status").textContent = t(GUI.whoYes); $("game-inner").querySelectorAll(".g-tile").forEach((x) => { x.disabled = true; });
      setTimeout(() => { if (gamePhase === ph && gameStep === st.id) { ph.i++; gameWho(st, ph); } }, 1100); }
    else { b.classList.add("no"); b.disabled = true; ph.cut[ph.i].push(b.dataset.id); ph.miss++; $("g-status").textContent = t(GUI.whoNo); }
  });
  const wb = $("g-where"); if (wb) wb.onclick = () => { ph.hint[ph.i] = true; gameWho(st, ph); };
  const go = $("g-go"); if (go) go.onclick = () => gameTrip(w.go, st.id);
}

/* ---------- wiring into the rest of Orbis ---------- */
$("nav").addEventListener("click", () => { if (!$("game").hidden) closeGame(); $("game-return").hidden = true; gameReturn = null; }, true);
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || $("game").hidden) return;
  e.stopImmediatePropagation(); if (gameStep) renderGameHome(); else if (gamePushed) { try { history.back(); } catch (x) { closeGame(); } } else closeGame();
}, true);
window.addEventListener("popstate", () => {
  const h = (location.hash || "").replace("#", "");
  if (h === "gioco") { if ($("game").hidden) openGame(null, false); }
  else if (!$("game").hidden) closeGame();
});
