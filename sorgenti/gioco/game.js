/* =========================================================
   THE LABORATORY (the game)
   A room to bring back to life. Each room is a path of steps: experiments to do with your
   hands (bet first, then try, then find out why) and riddles whose answers are hidden around
   Orbis, in the lessons, the planets and the creatures. The steps live in GAME_STEPS and the
   experiments in GEXP. It looks like a game of its own: the room fills the screen, the professor
   speaks over it, and after each step a short cutscene shows what has come back to life.
   Progress is kept in localStorage "orbis-game".
   ========================================================= */
const GUI = {
  eyebrow: { it: "Orbis · Il Laboratorio", en: "Orbis · The Laboratory" },
  title: { it: "Il Laboratorio", en: "The Laboratory" },
  lead: { it: "Il laboratorio del professor Edward, lo scienziato più distratto del mondo. Fai gli esperimenti, risolvi gli enigmi e guardalo tornare a vivere. Le risposte agli enigmi sono nascoste in giro per Orbis: nelle lezioni, tra i pianeti, tra le creature.", en: "The laboratory of Professor Edward, the most absent-minded scientist in the world. Do the experiments, solve the riddles and watch it come back to life. The answers to the riddles are hidden around Orbis: in the lessons, among the planets, among the creatures." },
  prof: { it: "Prof. Edward", en: "Prof. Edward" },
  sub: { it: "del professor Edward", en: "of Professor Edward" }, tap: { it: "Tocca per continuare", en: "Tap to continue" },
  rooms: { it: "Le stanze", en: "The rooms" }, room1: { it: "La stanza delle ampolle", en: "The room of flasks" },
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
  { e: "⚛️", k: "quanti", n: { it: "La stanza dei quanti", en: "The quantum room" }, c: "#b9a4ff" },
  { e: "🔭", k: "osservatorio", n: { it: "L’osservatorio", en: "The observatory" }, c: "#ffd479" },
  { e: "🧬", k: "serra", n: { it: "La serra della vita", en: "The greenhouse of life" }, c: "#86dc93" }
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
let gameStep = null, gameStop = null, gamePhase = null, gameReturn = null, gamePushed = false, gameFresh = false, gameTimers = [];
function gameState() { try { const s = JSON.parse(localStorage.getItem("orbis-game") || "{}"); return { done: s.done || {}, said: s.said }; } catch (e) { return { done: {} }; } }
function gameSave(s) { try { localStorage.setItem("orbis-game", JSON.stringify(s)); } catch (e) {} }
const gameStars = (s) => GAME_STEPS.reduce((a, x) => a + (s.done[x.id] || 0), 0);
const gameStage = (s) => GAME_STEPS.filter((x) => s.done[x.id]).length;
const starRow = (n, max) => `<span class="g-stars" aria-label="${n}/${max}">${"★".repeat(n)}<i>${"★".repeat(Math.max(0, max - n))}</i></span>`;
function gameAward(id, n) { const s = gameState(), first = !s.done[id]; s.done[id] = Math.max(s.done[id] || 0, n); gameSave(s); return first; }
const gLater = (fn, ms) => { const id = setTimeout(fn, ms); gameTimers.push(id); return id; };
function stopGame() { gameTimers.forEach(clearTimeout); gameTimers = []; if (gameStop) { try { gameStop(); } catch (e) {} gameStop = null; } }
const gScroll = () => $("g-scroll") || $("game");

/* ---------- drawings: icons and the professor (one ink outline for everything) ---------- */
const gFl = (c) => `<path d="M19 6h10v13l10.500 18.500A4.500 4.500 0 0 1 35.500 44h-23A4.500 4.500 0 0 1 8.500 37.500L19 19z" fill="#eaf3ff"/><path class="n" d="M14 30.500h20l4.300 7.600a2.600 2.600 0 0 1-2.300 3.900H12a2.600 2.600 0 0 1-2.300-3.900z" fill="${c}"/><rect x="16.500" y="3" width="15" height="5" rx="2" fill="#eaf3ff"/>`;
const GSTAR = "M24 5l5.300 12.700L43 18.800l-10.400 9 3.200 13.400L24 34l-11.800 7.200 3.200-13.400L5 18.800l13.700-1.100z";
const GICO = {
  star: `<path d="${GSTAR}" fill="#ffd166"/>`,
  lock: `<path d="M15 22v-7a9 9 0 0 1 18 0v7" fill="none" style="stroke-width:5"/><rect x="9" y="21" width="30" height="22" rx="6" fill="#ffb22e"/><circle class="n" cx="24" cy="30" r="3.400" fill="#2b1f4a"/><path d="M24 31v5.500" fill="none"/>`,
  gift: `<rect x="8" y="21" width="32" height="22" rx="4" fill="#ff5fa2"/><rect x="5" y="14" width="38" height="10" rx="4" fill="#ff8fbf"/><path d="M24 14v29" fill="none"/><path d="M24 14c-9-11-16-2-7 0zM24 14c9-11 16-2 7 0z" fill="#ffd166"/>`,
  back: `<path d="M29 9L14 24l15 15" fill="none" style="stroke-width:6"/>`,
  play: `<path d="M14 7l26 17-26 17z" fill="#fff"/>`,
  door: `<path d="M11 44V8a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v36z" fill="#c98a52"/><rect x="16" y="10" width="16" height="12" rx="2" fill="#e8b47c"/><circle class="n" cx="31" cy="28" r="2.600" fill="#ffd166"/><path d="M5 44h38" fill="none"/>`,
  book: `<path d="M5 11c7-3 13-3 19 1 6-4 12-4 19-1v27c-7-3-13-3-19 1-6-4-12-4-19-1z" fill="#fff"/><path d="M24 12v27" fill="none"/>`,
  bulb: `<path d="M24 4a14 14 0 0 0-8 25.500c2 1.600 3 3.600 3 5.500h10c0-1.900 1-3.900 3-5.500A14 14 0 0 0 24 4z" fill="#ffd166"/><path d="M19 40h10M21 44.500h6" fill="none"/>`,
  compass: `<circle cx="24" cy="24" r="19" fill="#bfe8ff"/><path d="M33 15l-5.500 12.500L15 33l5.500-12.500z" fill="#ff5fa2"/><circle class="n" cx="24" cy="24" r="2" fill="#2b1f4a"/>`,
  medal: `<path d="M14 26l-6 18 10-5 6 7 6-7 10 5-6-18z" fill="#ff5fa2"/><circle cx="24" cy="19" r="15" fill="#ffd166"/><path class="n" d="M24 9l2.600 6.400 6.900.500-5.200 4.500 1.600 6.700L24 23.500l-5.900 3.600 1.600-6.700-5.200-4.500 6.900-.500z" fill="#f0a93b"/>`,
  flask: gFl("#39b5ff"),
  vulcano: gFl("#ff5fa2") + `<path d="M16 10c-5 0-6-6-2-7 1.500-3.500 7-3.500 9-.500 3-2 8 .500 7 4 4 1 3 5.500-2 5.500z" fill="#fff"/><circle cx="38" cy="8" r="2.600" fill="#fff"/><circle cx="8" cy="16" r="2.200" fill="#fff"/>`,
  lucchetto: `<path d="M15 22v-7a9 9 0 0 1 18 0v7" fill="none" style="stroke-width:5"/><rect x="9" y="21" width="30" height="22" rx="6" fill="#ffb22e"/><circle class="n" cx="24" cy="30" r="3.400" fill="#2b1f4a"/><path d="M24 31v5.500" fill="none"/>`,
  cavolo: `<circle cx="24" cy="27" r="17" fill="#9a55d6"/><path d="M24 10c-10 7-10 27 0 34M24 10c10 7 10 27 0 34M9 21c9 6 21 6 30 0" fill="none" style="stroke:#e6ccff;stroke-width:2"/><path d="M24 11c1-5 7-8 12-6-1 5-6 8-12 6z" fill="#57d977"/>`,
  chisono: `<circle cx="20" cy="20" r="14" fill="#bfe8ff"/><path d="M31 31l11 11" fill="none" style="stroke-width:7"/><path d="M15.500 16.500c0-6.500 9-6.500 9-.500 0 3.500-4.500 4-4.500 7.500M20 28.500v.400" fill="none" style="stroke-width:3.400"/>`,
  torre: `<rect x="13" y="6" width="22" height="38" rx="5" fill="#eaf3ff"/><path class="n" d="M15.500 32h17v7.500a2.500 2.500 0 0 1-2.500 2.500H18a2.500 2.500 0 0 1-2.500-2.500z" fill="#e3a21c"/><rect class="n" x="15.500" y="21" width="17" height="11" fill="#3aa0f0"/><rect class="n" x="15.500" y="12" width="17" height="9" fill="#f0df6a"/><rect x="10" y="3" width="28" height="5" rx="2" fill="#eaf3ff"/>`,
  acqua: `<path d="M24 4c9 12 14 19 14 26a14 14 0 0 1-28 0c0-7 5-14 14-26z" fill="#5cc2ff"/><path class="h" d="M16 30a8 8 0 0 0 5.500 7.500"/>`,
  aceto: `<path d="M20 5h8v8c5 3 8 7 8 12v15a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V25c0-5 3-9 8-12z" fill="#eaf3ff"/><path class="n" d="M14.500 27h19v13a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill="#f2dc7a"/><rect x="18.500" y="2" width="11" height="5" rx="2" fill="#c9a27a"/>`,
  bicarbonato: `<path d="M27 26l15 15" fill="none" style="stroke-width:8.500"/><path d="M27 26l15 15" fill="none" style="stroke:#cfd6e4;stroke-width:3.400"/><ellipse cx="18" cy="20" rx="14" ry="9" fill="#cfd6e4" transform="rotate(20 18 20)"/><path d="M7 16c3-11 19-9 23 2-7 3-17 2-23-2z" fill="#fff"/>`,
  sale: `<path d="M15 17h18l3 23a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#f4f6fb"/><path d="M14 17a10 10 0 0 1 20 0z" fill="#9aa6bd"/><circle class="n" cx="20" cy="12.500" r="1.300" fill="#2b1f4a"/><circle class="n" cx="24" cy="10.500" r="1.300" fill="#2b1f4a"/><circle class="n" cx="28" cy="12.500" r="1.300" fill="#2b1f4a"/>`,
  limone: `<path d="M7 27c0-11 10-18 21-16 3-3 8-2 9 2-1 2 2 5 2 9 1 12-10 20-21 18-3 3-8 2-9-2 1-2-2-5-2-11z" fill="#ffe34d"/><path class="h" d="M14 25c1-5 5-8 10-9"/>`,
  sapone: `<rect x="6" y="24" width="30" height="18" rx="7" fill="#9fdcff"/><circle cx="33" cy="15" r="7" fill="#fff"/><circle cx="20" cy="13" r="4.500" fill="#fff"/><circle cx="42" cy="27" r="3.500" fill="#fff"/>`,
  miele: `<rect x="10" y="16" width="28" height="28" rx="8" fill="#e3a21c"/><rect x="12" y="7" width="24" height="10" rx="4" fill="#b0703f"/><rect class="n" x="16" y="25" width="16" height="10" rx="3" fill="#fff4dc"/>`,
  olio: `<path d="M21 6h6v9c5 2 8 6 8 11v14a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V26c0-5 3-9 8-11z" fill="#f0df6a"/><rect x="19.500" y="2" width="9" height="6" rx="2" fill="#57d977"/><path class="h" d="M18 27v10"/>`,
  moneta: `<circle cx="24" cy="24" r="19" fill="#ffd166"/><circle cx="24" cy="24" r="12" fill="#ffb22e"/><path d="M21.500 20l3.500-2.500v13" fill="none"/>`,
  uva: `<circle cx="24" cy="28" r="16" fill="#8a4fc0"/><path d="M24 12c0-4 2.500-7 7-8" fill="none"/><path class="h" d="M15 27a9 9 0 0 1 6-8"/>`,
  tappo: `<path d="M14 9h20l3 30H11z" fill="#c9a27a"/><path d="M17 17h3M26 22h4M19 30h3M27 34h3" fill="none" style="stroke:#9a7450;stroke-width:2.400"/>`,
  quanti: `<ellipse cx="24" cy="24" rx="20" ry="8" fill="none" transform="rotate(35 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="8" fill="none" transform="rotate(-35 24 24)"/><circle cx="24" cy="24" r="5.500" fill="#b9a4ff"/>`,
  osservatorio: `<path d="M24 28l-8 16M24 28l8 16M24 28v16" fill="none"/><g transform="rotate(-25 24 22)"><rect x="6" y="15" width="32" height="13" rx="5" fill="#eaf3ff"/><rect x="34" y="11" width="8" height="21" rx="3" fill="#ffd166"/></g>`,
  serra: `<path d="M24 44V24" fill="none"/><path d="M24 27C10 27 6 15 8 6c12 0 18 9 16 21zM24 33c12 0 16-10 15-17-10 0-16 7-15 17z" fill="#57d977"/>`
};
const ico = (k, cls) => `<svg class="g-ico${cls ? " " + cls : ""}" viewBox="0 0 48 48" aria-hidden="true">${GICO[k] || GICO.flask}</svg>`;
const gameProf = (cls) => `<svg class="g-prof${cls ? " " + cls : ""}" viewBox="0 0 200 208" aria-hidden="true">
  <path d="M35 87L8 66l32 5-17-37 32 24-3-40 26 31L90 13l12.500 36 26-31-3 40 32-24-17 37 32-5-27 21z" fill="#f3f4fa"/>
  <path d="M20 208c0-40 30-62 80-62s80 22 80 62z" fill="#f7f8fc"/><path class="n" d="M82 148l18 27 18-27z" fill="#9fdcff"/><path d="M100 174l-15 34M100 174l15 34" fill="none"/>
  <path d="M100 160l-17-10v20zM100 160l17-10v20z" fill="#ff5fa2"/><circle cx="100" cy="160" r="5.500" fill="#ff8fbf"/>
  <circle cx="55" cy="102" r="9" fill="#f0bf95"/><circle cx="145" cy="102" r="9" fill="#f0bf95"/><circle cx="100" cy="98" r="46" fill="#f6cfa8"/>
  <circle class="n" cx="68" cy="121" r="8" fill="#ff8f8f" opacity=".45"/><circle class="n" cx="132" cy="121" r="8" fill="#ff8f8f" opacity=".45"/>
  <path d="M53 95l6-3M147 95l-6-3" fill="none" style="stroke:#3a3560;stroke-width:5"/>
  <circle cx="80" cy="92" r="21" fill="#b6ffd0" style="stroke:#3a3560;stroke-width:6"/><circle cx="120" cy="92" r="21" fill="#b6ffd0" style="stroke:#3a3560;stroke-width:6"/>
  <g class="eyes"><circle class="n" cx="82" cy="94" r="7.500" fill="#2b1f4a"/><circle class="n" cx="118" cy="92" r="7.500" fill="#2b1f4a"/><circle class="n" cx="84.500" cy="91" r="2.600" fill="#fff"/><circle class="n" cx="120.500" cy="89" r="2.600" fill="#fff"/></g>
  <path d="M66 82a16 16 0 0 1 9-7M106 82a16 16 0 0 1 9-7" fill="none" style="stroke:#fff;stroke-width:4;opacity:.8"/>
  <path d="M60 62l24 7M140 59l-24 8" fill="none" style="stroke:#a4a9bd;stroke-width:7"/>
  <g class="m-smile"><path d="M78 122c12 17 32 17 44 0-12 5-32 5-44 0z" fill="#7a2d3d"/><path class="n" d="M85 126c9 3 21 3 30 0v3.500c-9 3.500-21 3.500-30 0z" fill="#fff"/></g>
  <ellipse class="m-wow" cx="100" cy="130" rx="9" ry="11" fill="#7a2d3d"/><path class="m-think" d="M86 130c8-4 18-3 26 2" fill="none"/></svg>`;
const profSay = (txt) => `<div class="g-say">${gameProf()}<p class="g-bubble"><b>${esc(t(GUI.prof))}</b>${esc(txt)}</p></div>`;

/* ---------- small pleasures: sparks, confetti, a line that types itself ---------- */
const GFXC = ["#ffd166", "#ff5fa2", "#57d977", "#39b5ff", "#b98bff", "#fff"];
function gBurst(x, y, n) {
  const S = $("g-stage"); if (REDUCED || !S) return;
  const b = S.getBoundingClientRect(), box = document.createElement("div"); box.className = "g-fx";
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, d = 46 + Math.random() * 96, p = document.createElement("i");
    p.style.cssText = `left:${x - b.left}px;top:${y - b.top}px;--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d - 34).toFixed(0)}px;--c:${GFXC[i % GFXC.length]};--s:${(10 + Math.random() * 12).toFixed(0)}px;animation-delay:${(Math.random() * 140).toFixed(0)}ms`; box.appendChild(p); }
  S.appendChild(box); setTimeout(() => box.remove(), 1400);
}
function gConfetti() {
  const S = $("g-stage"); if (REDUCED || !S) return;
  const box = document.createElement("div"); box.className = "g-fx";
  for (let i = 0; i < 46; i++) { const p = document.createElement("i"); p.className = "cf";
    p.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;--c:${GFXC[i % GFXC.length]};--r:${(Math.random() * 720 - 360).toFixed(0)}deg;--x:${(Math.random() * 90 - 45).toFixed(0)}px;animation-duration:${(1.7 + Math.random() * 1.4).toFixed(2)}s;animation-delay:${(Math.random() * 0.5).toFixed(2)}s`; box.appendChild(p); }
  S.appendChild(box); setTimeout(() => box.remove(), 3800);
}
function gType(el, txt, done) {   // returns a function that finishes the line at once
  el.setAttribute("aria-label", txt);
  if (REDUCED) { el.textContent = txt; if (done) done(); return () => {}; }
  el.innerHTML = `<span></span><span class="off"></span>`; const a = el.firstChild, b = el.lastChild; let i = 0, over = false; b.textContent = txt;
  const end = () => { if (over) return; over = true; clearInterval(id); a.textContent = txt; b.textContent = ""; if (done) done(); };
  const id = setInterval(() => { i = Math.min(txt.length, i + 2); a.textContent = txt.slice(0, i); b.textContent = txt.slice(i); if (i >= txt.length) end(); }, 26);
  gameTimers.push(id); return end;
}

function gameBanner() {
  const s = gameState(), n = gameStars(s);
  return `<button type="button" class="g-banner" id="g-banner"><span class="g-b-art" aria-hidden="true">${gameProf()}</span>
    <span class="g-b-txt"><strong><span>${esc(t(GUI.banner))}</span>${n ? "" : ` <em class="l-new">${esc(t(GUI.bannerNew))}</em>`}</strong><span>${n ? ico("star") + " " + esc(t(GUI.stars).replace("{n}", n).replace("{m}", GAME_MAX)) : esc(t(GUI.bannerSub))}</span></span>
    <span class="g-b-go">${ico("play")}<span>${esc(t(GUI.play))}</span></span></button>`;
}
function openGame(stepId, push) {
  if ($("lessons").hidden) openLessons(null); else if (lessonOpen) renderLessonList();
  $("game").hidden = false; overlayOpen = "game"; $("game-return").hidden = true; gameReturn = null;
  try { if (push) { history.pushState({ orbisGame: 1 }, "", "#gioco"); gamePushed = true; } else history.replaceState(null, "", "#gioco"); } catch (e) {}
  const st = stepId && GAME_STEPS.find((x) => x.id === stepId);
  if (st && gameUnlocked(st.id)) renderGameStep(st.id); else renderGameHome({ splash: true });
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

/* ---------- the room, which wakes up as you play ----------
   Three layers: the room itself, the darkness of the night over it (it lifts step by step), and
   on top the things that shine: the window, the lamp and its light, the coloured liquids.
   Groups r1…r5 appear when that many steps are done; r0 (cobwebs) is there only at the start. */
const GAME_FOCUS = [[262, 350, 1.7], [196, 285, 1.9], [262, 440, 1.25], [452, 350, 1.5], [290, 400, 1.9]];   // where the camera goes for each gift
function gameRoomSvg(stage) {
  const K = "#1c1436", O = `stroke="${K}" stroke-width="3" stroke-linejoin="round"`, G = `fill="#dbe6ff" fill-opacity=".2" stroke="#e6eeff" stroke-width="3"`;
  const FX = [100, 148, 196, 244, 292], FC = ["#ff5fa2", "#ffb22e", "#57d977", "#39b5ff", "#b98bff"];
  const glass = FX.map((x) => `<path d="M${x - 6} 246v14l-11 28a5 5 0 0 0 5 7h24a5 5 0 0 0 5-7l-11-28v-14z" ${G}/><rect x="${x - 8}" y="241" width="16" height="6" rx="2.500" fill="#e6eeff"/>`).join("");
  const juice = FX.map((x, i) => `<path d="M${x - 11} 277h22l4 11a4 4 0 0 1-4 5.500h-22a4 4 0 0 1-4-5.500z" fill="${FC[i]}"/>`).join("");
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let stripes = "", planks = "", stars = "", cells = "", motes = "";
  for (let x = 30; x < 600; x += 60) stripes += `<rect x="${x - 12}" width="24" height="640" fill="#44357f"/>`;
  for (let x = 50; x < 600; x += 50) planks += `M${x} 646v126`;
  for (let i = 0; i < 22; i++) { const a = rnd() * 6.283, d = Math.sqrt(rnd()) * 64; stars += `<circle class="g-tw" style="animation-delay:${(rnd() * 2.4).toFixed(2)}s" cx="${(440 + Math.cos(a) * d).toFixed(0)}" cy="${(220 + Math.sin(a) * d).toFixed(0)}" r="${(1 + rnd() * 1.6).toFixed(1)}" fill="#fff"/>`; }
  const cc = ["#ff7fa3", "#ffb45e", "#ffd479", "#86dc93", "#5fd3c6", "#7cbcff", "#b98bff"];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) if (!(r === 0 && c > 0 && c < 7)) cells += `<rect x="${96 + c * 13.5}" y="${364 + r * 16}" width="11" height="13" rx="2" fill="${cc[(c + r) % 7]}"/>`;
  for (let i = 0; i < 7; i++) motes += `<circle class="g-mote" style="animation-delay:${(i * 1.05).toFixed(2)}s" cx="${(190 + rnd() * 150).toFixed(0)}" cy="${(300 + rnd() * 230).toFixed(0)}" r="${(1.4 + rnd() * 1.4).toFixed(1)}" fill="#fff3c4"/>`;
  const web = `<path d="M0 0h70C52 12 26 30 0 70zM0 22c18-2 34-10 46-22M0 44c26-6 50-22 62-44M12 0c0 22-6 40-12 52M34 0c-2 16-14 30-34 36" fill="none" stroke="#b9b4d6" stroke-width="1"/>`;
  return `<svg class="g-room s${stage}" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMin slice" role="img" aria-label="${esc(t({ it: "Il laboratorio", en: "The laboratory" }))}">
    <defs><linearGradient id="g-lamp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></linearGradient>
      <radialGradient id="g-halo"><stop offset="0" stop-color="#fff1b8" stop-opacity=".9"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
      <radialGradient id="g-pink"><stop offset="0" stop-color="#ff8cc0" stop-opacity=".6"/><stop offset="1" stop-color="#ff5fa2" stop-opacity="0"/></radialGradient>
      <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f3a"/><stop offset="1" stop-color="#3a40a6"/></linearGradient>
      <radialGradient id="g-vig" cx=".5" cy=".4" r=".78"><stop offset=".5" stop-color="#0c0828" stop-opacity="0"/><stop offset="1" stop-color="#0c0828" stop-opacity=".62"/></radialGradient></defs>
    <rect width="600" height="1000" fill="#3b2d73"/>${stripes}
    <rect y="640" width="600" height="136" fill="#6b4226"/><path d="${planks}" stroke="#55331d" stroke-width="3"/><rect x="-6" y="630" width="612" height="16" rx="4" fill="#8a5632" ${O}/>
    <rect y="774" width="600" height="226" fill="#4a2e1c"/><path d="M0 774h600" stroke="${K}" stroke-width="4"/><path d="M0 834h600M0 906h600M140 774v60M420 774v60M260 834v72M520 834v72" stroke="#38220f" stroke-width="3"/>
    <ellipse cx="264" cy="808" rx="214" ry="24" fill="#8c3f73" opacity=".75"/>
    <rect x="66" y="196" width="150" height="10" rx="4" fill="#c98a52" ${O}/><rect x="78" y="152" width="16" height="44" rx="2" fill="#ff5fa2" ${O}/><rect x="96" y="160" width="13" height="36" rx="2" fill="#39b5ff" ${O}/><rect x="111" y="146" width="18" height="50" rx="2" fill="#ffd166" ${O}/><rect x="136" y="158" width="14" height="38" rx="2" fill="#57d977" ${O} transform="rotate(16 143 196)"/>
    <path d="M84 307v24l24-24zM300 307v24l-24-24z" fill="#9a6238" ${O}/><rect x="62" y="295" width="260" height="12" rx="4" fill="#c98a52" ${O}/>${glass}
    <g class="r3"><g transform="rotate(-3 154 390)"><rect x="84" y="340" width="140" height="100" rx="6" fill="#fff4dc" ${O}/><rect x="96" y="350" width="56" height="6" rx="3" fill="#9a8fb8"/>${cells}<circle cx="154" cy="343" r="5" fill="#ff5fa2" ${O}/></g></g>
    <g class="r5"><path d="M276 408l-12 42 18-9 8 14 8-14 18 9-12-42z" fill="#ff5fa2" ${O}/><circle cx="290" cy="392" r="27" fill="#ffd166" ${O}/><path transform="translate(290 392) scale(.92) translate(-24 -25)" d="${GSTAR}" fill="#f0a93b" stroke="${K}" stroke-width="2.600" stroke-linejoin="round"/></g>
    <path d="M260 0v124" stroke="${K}" stroke-width="4"/><path d="M226 172l16-50h36l16 50z" fill="#4b3f7a" ${O}/><ellipse cx="260" cy="174" rx="27" ry="8" fill="#7d75a8" ${O}/>
    <g class="r4"><path d="M446 772l32-292M510 772l-32-292M478 772v-292" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M446 772l32-292M510 772l-32-292M478 772v-292" fill="none" stroke="#a9b1c6" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(478 478) rotate(-125) scale(1.4)"><rect x="-42" y="-11" width="84" height="22" rx="8" fill="#eef1f8" stroke="${K}" stroke-width="2.200"/><rect x="34" y="-15" width="16" height="30" rx="5" fill="#ffd166" stroke="${K}" stroke-width="2.200"/><rect x="-56" y="-6" width="16" height="12" rx="4" fill="#9aa3b8" stroke="${K}" stroke-width="2.200"/></g></g>
    <rect x="112" y="600" width="20" height="176" fill="#7b4a2d" ${O}/><rect x="394" y="600" width="20" height="176" fill="#7b4a2d" ${O}/><rect x="106" y="576" width="314" height="30" rx="4" fill="#9a6238" ${O}/><rect x="214" y="582" width="98" height="18" rx="4" fill="#b0703f" ${O}/><circle cx="263" cy="591" r="4" fill="#ffd166" ${O}/><rect x="92" y="558" width="342" height="20" rx="7" fill="#d39a62" ${O}/>
    <path d="M249 452v34l-39 62a7 7 0 0 0 6 10h92a7 7 0 0 0 6-10l-39-62v-34z" ${G} stroke-width="3.500"/><rect x="243" y="445" width="38" height="9" rx="3.500" fill="#e6eeff"/>
    <g class="r2"><rect x="155" y="520" width="30" height="40" rx="5" ${G}/><rect x="337" y="510" width="26" height="50" rx="5" ${G}/></g>
    <g class="r3"><g transform="translate(400 538) scale(.82) translate(-558 -262)"><path d="M556 262c-4-30-22-46-34-50 10 16 14 32 16 50zM556 262c2-36 18-56 30-62-8 20-10 40-12 62zM558 262c0-28-4-52-12-70 14 14 20 40 20 70z" fill="#4fc16c" ${O}/><path d="M536 262h44l-5 34h-34z" fill="#e07a4d" ${O}/></g></g>
    <rect class="g-dark" width="600" height="1000" fill="#0c0828"/>
    <path d="M392 282L170 1000h300L500 276z" fill="#a9c1ff" opacity=".09"/>
    <circle cx="440" cy="220" r="88" fill="#7b4a2d" stroke="${K}" stroke-width="4"/><circle cx="440" cy="220" r="72" fill="url(#g-sky)" stroke="${K}" stroke-width="3"/>
    <circle cx="398" cy="186" r="1.400" fill="#fff" opacity=".6"/><circle cx="420" cy="262" r="1.200" fill="#fff" opacity=".5"/><circle cx="486" cy="250" r="1.500" fill="#fff" opacity=".6"/><circle cx="430" cy="168" r="1.200" fill="#fff" opacity=".5"/>
    <g class="r4">${stars}<circle cx="408" cy="252" r="9" fill="#ffb86b"/><ellipse cx="408" cy="252" rx="17" ry="4.500" fill="none" stroke="#ffe3b8" stroke-width="2" transform="rotate(-20 408 252)"/></g>
    <circle cx="468" cy="192" r="20" fill="#fdf3c4"/><circle cx="460" cy="186" r="19" fill="#141a52"/>
    <path d="M440 148v144M368 220h144" stroke="${K}" stroke-width="9"/><path d="M440 148v144M368 220h144" stroke="#7b4a2d" stroke-width="5"/>
    <g class="r1"><circle cx="260" cy="178" r="78" fill="url(#g-halo)"/><path d="M236 180L92 800h352L284 180z" fill="url(#g-lamp)"/><path d="M226 172l16-50h36l16 50z" fill="#ffcf5c" ${O}/><ellipse cx="260" cy="174" rx="27" ry="8" fill="#fff6d0" ${O}/>
      <circle cx="262" cy="512" r="80" fill="url(#g-pink)"/><path d="M231 520h62l17 27.500a5 5 0 0 1-4.300 7.500h-87.400a5 5 0 0 1-4.300-7.500z" fill="#ff5fa2"/><path d="M231 520h62" stroke="#ffc0dc" stroke-width="3" stroke-linecap="round"/>${motes}</g>
    <g class="r2">${juice}</g><g class="r2"><rect x="158" y="532" width="24" height="25" rx="3" fill="#39b5ff"/><rect x="340" y="526" width="20" height="31" rx="3" fill="#57d977"/></g>
    <g class="r5 g-bub"><circle cx="254" cy="502" r="5" fill="#ffd0e4"/><circle cx="270" cy="490" r="4" fill="#ffd0e4"/><circle cx="261" cy="474" r="4.500" fill="#ffd0e4"/></g>
    <rect width="600" height="1000" fill="url(#g-vig)"/>
    <g class="r0"><g transform="scale(1.7)">${web}</g><g transform="translate(600 0) scale(-1.7 1.7)">${web}</g><g transform="translate(322 300) scale(-.9 .9)">${web}</g></g>
    ${GAME_FOCUS.map((f, i) => `<circle id="g-f${i + 1}" cx="${f[0]}" cy="${f[1]}" r="1" fill="none"/>`).join("")}</svg>`;
}
function gameSay(txt, then) {   // the professor speaks over the room; a tap finishes the line, another one closes it
  const S = $("g-stage"), T = $("g-talk"); if (!S || !T) { if (then) then(); return; }
  S.classList.add("talking"); T.hidden = false; const P = T.querySelector(".g-prof"); P.classList.add("talk");
  let typing = true; const fin = gType($("g-line"), txt, () => { typing = false; P.classList.remove("talk"); });
  const next = () => { if (typing) { fin(); return; } T.hidden = true; T.onclick = T.onkeydown = null; S.classList.remove("talking"); if (then) then(); };
  T.onclick = next; T.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } }; T.focus({ preventScroll: true });
}
function gameSplash(then) {
  const S = $("g-stage"), el = document.createElement("div"), w = t(GUI.title).split(" "); el.className = "g-splash";
  el.innerHTML = `<p class="g-logo"><small>${esc(w[0])}</small>${esc(w.slice(1).join(" "))}</p><p class="g-logo-sub">${esc(t(GUI.sub))}</p>`;
  S.appendChild(el); let over = false;
  const end = () => { if (over) return; over = true; el.classList.add("out"); S.classList.remove("g-intro"); setTimeout(() => el.remove(), 600); then(); };
  el.onclick = end; gLater(end, 2000);
}
function gameReveal(k, then) {   // the cutscene after a step: the camera goes to the new thing, it lights up, the camera comes back
  const S = $("g-stage"), sc = $("g-scene"), svg = sc.querySelector("svg"), F = GAME_FOCUS[k - 1];
  const show = () => svg.setAttribute("class", "g-room s" + k);
  if (REDUCED) { show(); then(); return; }
  let over = false, at = [0, 0];
  const end = () => { if (over) return; over = true; gameTimers.forEach(clearTimeout); gameTimers = []; show(); svg.style.transform = ""; S.classList.remove("cine"); S.onclick = null; setTimeout(() => sc.classList.remove("pop"), 900); then(); };
  S.classList.add("cine"); S.onclick = end;
  gLater(() => { const m = svg.querySelector("#g-f" + k).getBoundingClientRect(), b = sc.getBoundingClientRect(), px = m.left + m.width / 2 - b.left, py = m.top + m.height / 2 - b.top;
    const z = F[2], cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v)), tx = cl(b.width / 2 - px, (z - 1) * (px - b.width), (z - 1) * px), ty = cl(b.height * 0.46 - py, (z - 1) * (py - b.height), (z - 1) * py);
    at = [b.left + px + tx, b.top + py + ty]; svg.style.transformOrigin = `${px}px ${py}px`; svg.style.transform = `translate(${tx}px,${ty}px) scale(${z})`; }, 450);
  gLater(() => { sc.classList.add("pop"); show(); gBurst(at[0], at[1], 18); if (k === GAME_STEPS.length) gConfetti(); }, 1550);
  gLater(() => { svg.style.transform = ""; }, 3000);
  gLater(end, 3900);
}
function gameRooms() {
  const S = $("g-stage"), M = document.createElement("div"); M.className = "g-modal";
  M.innerHTML = `<div class="g-sheet" role="dialog" aria-label="${esc(t(GUI.rooms))}"><h2>${esc(t(GUI.rooms))}</h2><p>${esc(t(GUI.lead))}</p><ul class="g-rooms">
    <li>${ico("flask")}<strong>${esc(t(GUI.room1))}</strong><small>${ico("star")} ${gameStars(gameState())}/${GAME_MAX}</small></li>
    ${GAME_SOON.map((r) => `<li class="lock">${ico(r.k)}<strong>${esc(t(r.n))}</strong><small>${ico("lock")} ${esc(t(GUI.soon))}</small></li>`).join("")}</ul>
    <button type="button" class="g-btn" id="g-modal-x">${esc(t(GUI.retClose))}</button></div>`;
  S.appendChild(M); M.onclick = (e) => { if (e.target === M || e.target.closest("#g-modal-x")) M.remove(); }; $("g-modal-x").focus();
}
function renderGameHome(opt) {
  stopGame(); gameStep = null; gamePhase = null; opt = opt || {};
  const s = gameState(), stage = gameStage(s), n = gameStars(s), N = GAME_STEPS.length, cur = GAME_STEPS[stage];
  const reveal = gameFresh && stage > 0, splash = !!opt.splash && !reveal && !REDUCED; gameFresh = false;
  const nodes = GAME_STEPS.map((x, i) => { const done = s.done[x.id], open = gameUnlocked(x.id);
    return `<li class="g-step${done ? " done" : ""}${open && !done ? " now" : ""}${open ? "" : " lock"}"><button type="button" data-id="${x.id}" ${open ? "" : `aria-disabled="true"`} aria-label="${i + 1}. ${esc(t(x.t))}">${ico(open ? x.id : "lock")}</button>${done ? `<span class="g-node-st">${starRow(done, x.max)}</span>` : ""}</li>`; }).join("");
  const mission = cur
    ? `<div class="g-m-txt"><small>${esc(t(cur.kind === "exp" ? GUI.exp : GUI.riddle))} ${stage + 1}/${N}</small><strong>${esc(t(cur.t))}</strong><em>${ico("gift")}${esc(t(GUI.nextGift))}: ${esc(t(GAME_GIFTS[stage]))}</em></div><button type="button" class="g-btn go" id="g-play">${esc(t(GUI.play))}</button>`
    : `<div class="g-m-txt"><strong>${esc(t(GUI.allDone))}</strong><em>${ico("medal")}${esc(t(GUI.badge))}</em></div>`;
  $("game-inner").innerHTML = `<div class="g-stage g-home${splash ? " g-intro" : ""}" id="g-stage">
    <div class="g-scene" id="g-scene">${gameRoomSvg(reveal ? stage - 1 : stage)}</div><div class="g-bars" aria-hidden="true"><i></i><i></i></div>
    <header class="g-hud"><button type="button" class="g-round" id="g-back" aria-label="${esc(t(GUI.backLessons))}">${ico("back")}</button><span class="sp"></span>
      <button type="button" class="g-round" id="g-rooms" aria-label="${esc(t(GUI.rooms))}">${ico("door")}</button><span class="g-pill" id="g-count" aria-label="${esc(t(GUI.stars).replace("{n}", n).replace("{m}", GAME_MAX))}">${ico("star")}<b>${n}</b>/${GAME_MAX}</span></header>
    <div class="g-talk" id="g-talk" role="button" tabindex="0" hidden>${gameProf()}<div class="g-bubble"><b>${esc(t(GUI.prof))}</b><p id="g-line"></p><span class="g-tap">${esc(t(GUI.tap))}</span></div></div>
    <div class="g-dock" id="g-card"><button type="button" class="g-peek" id="g-prof-btn" aria-label="${esc(t(GUI.prof))}">${gameProf()}</button><section class="g-card"><ol class="g-path">${nodes}</ol><div class="g-mission">${mission}</div></section></div></div>`;
  $("g-back").onclick = () => { if (gamePushed) { try { history.back(); return; } catch (e) {} } closeGame(); };
  $("g-rooms").onclick = gameRooms;
  $("game-inner").querySelectorAll(".g-step button").forEach((b) => b.onclick = () => { if (b.getAttribute("aria-disabled")) { toast(t(GUI.locked)); return; } renderGameStep(b.dataset.id); });
  if (cur) $("g-play").onclick = () => renderGameStep(cur.id);
  $("g-prof-btn").onclick = () => gameSay(t(GUI.hello[stage]));
  const hello = () => { const st = gameState(); if (st.said !== stage) { st.said = stage; gameSave(st); gameSay(t(GUI.hello[stage])); } };
  if (reveal) gameReveal(stage, hello); else if (splash) gameSplash(hello); else hello();
}

/* ---------- one step ---------- */
function gameShell(st, inner) {
  const i = GAME_STEPS.indexOf(st);
  $("game-inner").innerHTML = `<div class="g-stage g-stepv" id="g-stage"><header class="g-hud"><button type="button" class="g-round" id="g-back" aria-label="${esc(t(GUI.back))}">${ico("back")}</button>
    <h1 class="g-title">${ico(st.id)}<span>${esc(t(st.t))}</span></h1><span class="g-pill">${i + 1}/${GAME_STEPS.length}</span></header>
    <div class="g-scroll" id="g-scroll"><article class="g-play">${inner}</article></div></div>`;
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
const phaseBar = (k) => `<ol class="g-phases">${["step1", "step2", "step3"].map((p, i) => `<li${i === k ? ' aria-current="step"' : ""}${i < k ? ' class="ok"' : ""}><i>${i + 1}</i>${esc(t(GUI[p]).split("·").pop().trim())}</li>`).join("")}</ol>`;
function gameLearn(st, stars, extra) {
  const first = gameAward(st.id, stars), i = GAME_STEPS.indexOf(st); if (first) gameFresh = true;
  const big = Array.from({ length: st.max }, (_, j) => ico("star", j < stars ? "" : "off")).join("");
  const gift = first ? `<p class="g-giftline">${ico("gift")}<span>${esc(t(i === GAME_STEPS.length - 1 ? GUI.badge : { it: "Nel Laboratorio: " + GAME_GIFTS[i].it + "!", en: "In the Laboratory: " + GAME_GIFTS[i].en + "!" }))}</span></p>` : "";
  return `<section class="g-learn"><div class="g-award"><span>${esc(t(GUI.earned))}</span><div class="g-bigst" role="img" aria-label="${stars}/${st.max}">${big}</div></div>${extra || ""}${gift}
    <div class="g-paper"><h2>${esc(t(GUI.why))}</h2>${st.why.map((p) => `<p>${esc(t(p))}</p>`).join("")}</div>
    ${st.home ? `<aside class="g-sticky"><strong>${esc(t(GUI.home))}</strong><p>${esc(t(st.home))}</p></aside>` : ""}
    <div class="g-actions">${st.lesson ? `<button type="button" class="g-btn alt" id="g-lesson">${ico("book")}${esc(t(GUI.readLesson))}</button>` : ""}
    <button type="button" class="g-btn go" id="g-next">${esc(t(GUI.toRoom))}</button></div></section>`;
}
function bindLearn(st) {
  const l = $("g-lesson"); if (l) l.onclick = () => gameTrip({ v: "lesson", id: st.lesson }, st.id);
  $("g-next").onclick = () => { gamePhase = null; renderGameHome(); };
  gLater(() => { const b = $("game-inner").querySelector(".g-bigst"); if (b) { const r = b.getBoundingClientRect(); gBurst(r.left + r.width / 2, r.top + r.height / 2, 14); } }, 420);
}
/* leave the game to look for an answer in Orbis; a small button brings you back */
function gameTrip(go, stepId) {
  gameReturn = stepId || gameStep; const keep = gamePhase;
  closeGame(); gamePhase = keep;
  goTo(go);
  const R = $("game-return"); R.hidden = false;
  R.innerHTML = `<button type="button" id="g-ret-go">${ico("flask")}<span>${esc(t(GUI.ret))}</span></button><button type="button" id="g-ret-x" aria-label="${esc(t(GUI.retClose))}">✕</button>`;
  $("g-ret-go").onclick = () => { const id = gameReturn; openGame(id, false); };
  $("g-ret-x").onclick = () => { R.hidden = true; gameReturn = null; gamePhase = null; };
}

/* ---------- experiments: bet, try, find out ---------- */
function gameExp(st, ph) {
  gamePhase = ph;
  if (ph.phase === "bet") {
    gameShell(st, `${phaseBar(0)}${profSay(t(GUI.betSay) + t(st.bet.q))}
      <div class="g-opts">${st.bet.o.map((o, i) => `<button type="button" class="g-opt" data-i="${i}"><i>${"ABC"[i]}</i><span>${esc(t(o))}</span></button>`).join("")}</div><div class="g-note" id="g-note"></div>`);
    $("game-inner").querySelectorAll(".g-opt").forEach((b) => b.onclick = () => {
      ph.bet = +b.dataset.i; $("game-inner").querySelectorAll(".g-opt").forEach((x) => { x.disabled = true; x.classList.toggle("pick", x === b); });
      $("g-note").innerHTML = `<span>${esc(t(GUI.betKeep))}</span><button type="button" class="g-btn go" id="g-go">${esc(t(GUI.betGo))}</button>`;
      $("g-go").onclick = () => { ph.phase = "do"; gameExp(st, ph); }; $("g-go").focus(); $("g-go").scrollIntoView({ block: "nearest" });
    });
  } else if (ph.phase === "do") {
    gameShell(st, `${phaseBar(1)}${profSay(t(st.goal))}<div class="g-bench" id="g-bench"></div>
      <div class="g-doneline" id="g-doneline" hidden><strong>${esc(t(GUI.done))}</strong><button type="button" class="g-btn go" id="g-learn">${esc(t(GUI.toLearn))}</button></div>`);
    $("g-learn").onclick = () => { ph.phase = "learn"; gameExp(st, ph); };
    gameStop = GEXP[st.id]($("g-bench"), () => { const d = $("g-doneline"); if (d && d.hidden) { d.hidden = false; d.scrollIntoView({ block: "nearest", behavior: REDUCED ? "auto" : "smooth" }); const r = d.getBoundingClientRect(); gBurst(r.left + r.width / 2, r.top + 24, 16); } });
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
const gIngr = (list) => `<div class="g-ingr">${list.map((x) => `<button type="button" class="g-in" data-k="${x.k}">${GICO[x.k] ? ico(x.k) : `<span aria-hidden="true">${x.e}</span>`}<span>${esc(t(x.n))}</span></button>`).join("")}</div>`;
const GEXP = {
  vulcano(host, onGoal) {
    const ING = [
      { k: "acqua", e: "💧", n: { it: "Acqua", en: "Water" }, c: "#5cc2ff", liquid: true },
      { k: "aceto", e: "🧴", n: { it: "Aceto", en: "Vinegar" }, c: "#f2dc7a", liquid: true },
      { k: "bicarbonato", e: "🥄", n: { it: "Bicarbonato", en: "Baking soda" }, c: "#f4f6fb" },
      { k: "sale", e: "🧂", n: { it: "Sale", en: "Salt" }, c: "#d9dee8" }
    ];
    host.innerHTML = `<p class="g-status" id="g-status" role="status">${esc(L2("L’ampolla è vuota. Che cosa versi per primo?", "The flask is empty. What do you pour first?"))}</p>${gIngr(ING)}<div class="g-row"><button type="button" class="w-btn ghost" id="g-empty">↺ ${esc(t(GUI.empty))}</button></div>`;
    const F = gFlask(host, 270), { ctx } = F;
    let items = [], lv = 0, lvT = 0, col = "#5cc2ff", pour = null, fizz = 0, foam = 0, pile = 0, bub = [], drops = [], told = false, time = 0;
    const has = (k) => items.includes(k), liquids = () => items.filter((k) => ING.find((x) => x.k === k).liquid);
    const say = (s) => { $("g-status").textContent = s; };
    function settle(k) {
      items.push(k); const L = liquids();
      lvT = Math.min(0.5, L.length * 0.2);
      if (L.length) col = L.includes("aceto") && L.includes("acqua") ? "#a9d6c0" : L.includes("aceto") ? "#f2dc7a" : "#5cc2ff";
      const react = has("aceto") && has("bicarbonato");
      if (react && fizz <= 0 && !told) {
        fizz = 1; told = true; host.classList.add("boom"); gLater(() => host.classList.remove("boom"), 700);
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
    const F = gFlask(host, 270), { ctx } = F;
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
    const { ctx, W, H } = wCanvas(host, 300), cx = W / 2, hw = Math.min(70, W * 0.2), top = 30, bot = H - 22, LH = 78;
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
        <div class="g-row"><button type="button" class="w-btn" data-go="${i}">${ico("book")}${esc(t(GUI.goSee))}</button><button type="button" class="w-btn ghost" data-tell="${i}">${esc(t(GUI.reveal))} (−★)</button></div>`
        : `<button type="button" class="w-btn ghost" data-where="${i}">${ico("bulb")}${esc(t(GUI.where))}</button>`}</div></li>`; }).join("");
  gameShell(st, `${profSay(t(st.goal))}
    <div class="g-lock" id="g-lock"><div class="g-dials">${dials}</div><button type="button" class="g-btn go" id="g-open">${ico("lock")}${esc(t(GUI.open))}</button></div>
    <p class="g-status" id="g-status" role="status"></p><ol class="g-clues">${clues}</ol>`);
  const Q = (s) => $("game-inner").querySelectorAll(s);
  Q(".g-dial button").forEach((b) => b.onclick = () => { const i = +b.dataset.i; ph.digits[i] = (ph.digits[i] + +b.dataset.d + 10) % 10; $("g-d" + i).textContent = ph.digits[i]; });
  Q("[data-where]").forEach((b) => b.onclick = () => { ph.shown[+b.dataset.where] = true; const y = gScroll().scrollTop; gameLock(st, ph); gScroll().scrollTop = y; });
  Q("[data-tell]").forEach((b) => b.onclick = () => { ph.told[+b.dataset.tell] = true; const y = gScroll().scrollTop; gameLock(st, ph); gScroll().scrollTop = y; });
  Q("[data-go]").forEach((b) => b.onclick = () => gameTrip({ v: "lesson", id: st.clues[+b.dataset.go].lesson }, st.id));
  $("g-open").onclick = () => {
    const ok = st.clues.filter((c, i) => c.a === ph.digits[i]).length;
    if (ok < 3) { $("g-status").textContent = t(GUI.lockNo).replace("{n}", ok); const L = $("g-lock"); L.classList.remove("shake"); void L.offsetWidth; L.classList.add("shake"); return; }
    const stars = Math.max(1, 3 - ph.told.filter(Boolean).length);
    gameShell(st, gameLearn(st, stars, `<p class="g-bet ok">${esc(t(GUI.lockYes))} <b>7 · 8 · 2</b></p>`)); bindLearn(st);
  };
}

/* ---------- riddle: who am I? ---------- */
const GAME_PLANET = { mercury: ["#b9b2a8", "#6f6a63"], venus: ["#f3dfa6", "#c9a35b"], mars: ["#e0714a", "#8f3b22"], jupiter: ["#e9c9a0", "#b5774a"] };
function gameWho(st, ph) {
  gamePhase = ph;
  if (ph.i >= st.who.length) { const stars = Math.max(1, 3 - ph.miss); gameShell(st, gameLearn(st, stars, `<p class="g-bet ok">${esc(L2("Li hai trovati tutti e due: Venere e il gipeto.", "You found them both: Venus and the bearded vulture."))}</p>`)); bindLearn(st); return; }
  const w = st.who[ph.i], names = {}; for (const k in DIVES) for (const c of DIVES[k].creatures) names[c.id] = c.name;
  const tile = (id) => {
    const nm = w.type === "planet" ? t((PLANETS.find((p) => p.id === id) || {}).name) : t(names[id]);
    const src = w.type === "creature" ? imgFor(id) : null, g = GAME_PLANET[id];
    const pic = w.type === "planet" ? `<span class="g-planet${id === "jupiter" ? " band" : ""}" style="--a:${g[0]};--b:${g[1]}"></span>` : src ? `<img src="${esc(src)}" alt="" loading="lazy">` : `<span class="g-planet" style="--a:#3a4560;--b:#1d2536"></span>`;
    return `<button type="button" class="g-tile${ph.cut[ph.i].includes(id) ? " was" : ""}" data-id="${id}" ${ph.cut[ph.i].includes(id) ? "disabled" : ""}>${pic}<strong>${esc(nm)}</strong></button>`;
  };
  gameShell(st, `${profSay(t(st.goal))}
    <blockquote class="g-quote"><small>${ph.i + 1}/${st.who.length}</small>«${esc(t(w.q))}»</blockquote><div class="g-tiles">${w.o.map(tile).join("")}</div>
    <p class="g-status" id="g-status" role="status"></p>
    ${ph.hint[ph.i] ? `<div class="g-hintbox"><p>${esc(t(w.where))}</p><button type="button" class="w-btn" id="g-go">${ico("compass")}${esc(t(GUI.goSee))}</button></div>` : `<button type="button" class="w-btn ghost" id="g-where">${ico("bulb")}${esc(t(GUI.where))}</button>`}`);
  $("game-inner").querySelectorAll(".g-tile").forEach((b) => b.onclick = () => {
    if (b.dataset.id === w.a) { b.classList.add("yes"); $("g-status").textContent = t(GUI.whoYes); $("game-inner").querySelectorAll(".g-tile").forEach((x) => { x.disabled = true; });
      const r = b.getBoundingClientRect(); gBurst(r.left + r.width / 2, r.top + r.height / 2, 16);
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
  e.stopImmediatePropagation(); const m = $("game").querySelector(".g-modal"); if (m) { m.remove(); return; }
  if (gameStep) renderGameHome(); else if (gamePushed) { try { history.back(); } catch (x) { closeGame(); } } else closeGame();
}, true);
window.addEventListener("popstate", () => {
  const h = (location.hash || "").replace("#", "");
  if (h === "gioco") { if ($("game").hidden) openGame(null, false); }
  else if (!$("game").hidden) closeGame();
});
