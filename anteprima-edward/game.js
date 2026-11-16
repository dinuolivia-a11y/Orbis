(() => {
  'use strict';

  const game = document.querySelector('#game');
  const title = game.querySelector('#title');
  const copy = game.querySelector('#copy');
  const action = game.querySelector('#action');
  const inventory = game.querySelector('#inventory');
  const slots = [...game.querySelectorAll('[data-slot]')];
  const ingredients = [...inventory.querySelectorAll('[data-ingredient]')];
  const announce = game.querySelector('#announce');
  const replayLight = game.querySelector('#replay-light');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveKey = 'orbis-anteprima-edward-lampada-v1';
  const labels = { water: 'Acqua', salt: 'Sale', vinegar: 'Aceto', bicarbonate: 'Bicarbonato' };
  const observations = {
    'salt+water': 'Il sale si scioglie nell’acqua. Il liquido resta limpido: qui non si è formato un gas.',
    'vinegar+water': 'L’acqua diluisce l’aceto. Ora è meno concentrato, ma nella beuta non nascono bolle.',
    'salt+vinegar': 'I granelli di sale si sciolgono nell’aceto. Prova a cambiare polvere e guarda che succede.',
    'bicarbonate+water': 'Nell’acqua il bicarbonato può sciogliersi. Per produrre bolle gli serve anche un acido.',
    'bicarbonate+salt': 'Due polveri bianche sul fondo. Prova a tenere il bicarbonato e a versargli sopra un liquido.'
  };
  let selected = [];
  let phase = '';
  let visit = 0;

  const delay = ms => new Promise(resolve => window.setTimeout(resolve, ms));

  function hasReward() {
    try { return localStorage.getItem(saveKey) === 'lit'; } catch { return false; }
  }

  function rememberReward() {
    try { localStorage.setItem(saveKey, 'lit'); } catch { /* Play also works without storage. */ }
  }

  function screen(next, scene, heading, line, verb, interactive = true) {
    phase = next;
    game.dataset.phase = next;
    game.dataset.scene = scene;
    title.textContent = heading;
    copy.textContent = line;
    action.textContent = verb;
    action.disabled = !interactive;
    replayLight.hidden = next !== 'reward';
    for (const button of ingredients) button.disabled = next !== 'choose';
  }

  function focusTitle() {
    title.focus({ preventScroll: true });
  }

  function drawSelection() {
    for (const button of ingredients) {
      button.setAttribute('aria-pressed', String(selected.includes(button.dataset.ingredient)));
    }
    slots.forEach((slot, i) => {
      slot.textContent = labels[selected[i]] || (i === 0 ? 'Primo ingrediente' : 'Secondo ingrediente');
      slot.dataset.filled = String(Boolean(selected[i]));
    });
    game.dataset.count = String(selected.length);
    action.disabled = phase !== 'choose' || selected.length !== 2;
  }

  function welcome() {
    game.dataset.lit = 'false';
    game.dataset.fx = 'idle';
    screen('intro', 'room', 'La stanza delle ampolle',
      'Con questa luce ho già scambiato il sale per lo zucchero! Aiutami a far eruttare il vulcano e riaccendiamo la lampada.',
      'Avvicinati al banco');
  }

  function choose() {
    visit++;
    selected = [];
    game.dataset.lit = 'false';
    game.dataset.fx = 'idle';
    game.dataset.mixture = '';
    game.dataset.pour = '';
    announce.textContent = '';
    screen('choose', 'bench', 'Il vulcano di schiuma',
      'Quali due ingredienti faranno traboccare la beuta? Sceglili dal banco.',
      'Mescola');
    drawSelection();
    focusTitle();
  }

  function pick(button) {
    if (phase !== 'choose') return;
    const id = button.dataset.ingredient;
    const index = selected.indexOf(id);
    if (index !== -1) selected.splice(index, 1);
    else if (selected.length < 2) selected.push(id);
    else selected[1] = id;
    drawSelection();
    announce.textContent = selected.length === 2
      ? selected.map(k => labels[k]).join(' e ') + '. Puoi mescolare.'
      : selected.length ? labels[selected[0]] + '. Scegli un secondo ingrediente.' : 'Scegli due ingredienti.';
  }

  async function pour(id, number) {
    game.dataset.pour = id;
    game.dataset.pourStep = String(number);
    const isLiquid = id === 'water' || id === 'vinegar';
    if (isLiquid) game.dataset.mixture = 'wet';
    else if (!game.dataset.mixture) game.dataset.mixture = 'dry';
    game.dataset.fx = 'pour';
    if (reduceMotion.matches) return;
    const source = ingredients.find(b => b.dataset.ingredient === id)?.querySelector('img');
    const anchor = game.querySelector('#flask-mouth');
    if (!source || !anchor || !source.animate) return delay(350);
    const from = source.getBoundingClientRect();
    const to = anchor.getBoundingClientRect();
    if (!from.width || !from.height) return delay(350);
    const prop = source.cloneNode(false);
    prop.removeAttribute('id');
    prop.className = '';
    prop.alt = '';
    prop.setAttribute('aria-hidden', 'true');
    Object.assign(prop.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '100', objectFit: 'contain',
      left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px'
    });
    document.body.append(prop);
    const x = to.left + to.width / 2 - from.left - from.width * .45;
    const y = to.top - from.top - from.height * .82;
    const move = 'translate(' + x + 'px, ' + y + 'px)';
    const motion = prop.animate([
      { transform: 'translate(0, 0) scale(.9)', opacity: .6 },
      { transform: move + ' rotate(-12deg)', opacity: 1, offset: .48 },
      { transform: move + ' rotate(-78deg)', opacity: 1, offset: .78 },
      { transform: move + ' rotate(-78deg)', opacity: 0 }
    ], { duration: 720, easing: 'ease-in-out' });
    try { await motion.finished; } catch { /* System animation preferences may interrupt a pour. */ }
    finally { prop.remove(); }
  }

  async function mix() {
    if (phase !== 'choose' || selected.length !== 2) return;
    const turn = ++visit;
    const [first, second] = selected;
    const mixture = [first, second].sort().join('+');
    const reacts = mixture === 'bicarbonate+vinegar';
    game.dataset.mixture = '';
    screen('mixing', 'bench', 'Occhi sulla beuta!', labels[first] + '… e poi ' + labels[second].toLocaleLowerCase('it') + '.', 'Osserva', false);
    await pour(first, 1);
    if (visit !== turn) return;
    await pour(second, 2);
    if (visit !== turn) return;
    game.dataset.fx = reacts ? 'foam' : 'still';
    await delay(reduceMotion.matches ? 120 : reacts ? 1500 : 600);
    if (visit !== turn) return;
    if (reacts) {
      screen('success', 'bench', 'Il vulcano si è svegliato!',
        'L’acido dell’aceto reagisce con il bicarbonato. Si forma anidride carbonica: sono le sue bolle a sollevare la schiuma!',
        'Accendi la lampada');
    } else {
      screen('retry', 'bench', 'Niente eruzione, stavolta…', observations[mixture], 'Prova un’altra coppia');
    }
    focusTitle();
  }

  function reward(focus = true) {
    game.dataset.lit = 'true';
    game.dataset.fx = 'idle';
    screen('reward', 'room', 'Finalmente ci vedo!',
      'Guarda i riflessi sul vetro. Ecco dov’erano finite le mie ampolle! La lampada della stanza è tua.',
      'Rigioca il vulcano');
    if (focus) focusTitle();
  }

  async function reveal() {
    const turn = ++visit;
    rememberReward();
    game.dataset.fx = 'idle';
    game.dataset.lit = 'false';
    screen('revealing', 'room', 'La lampada di Edward', 'E adesso… luce!', 'Accensione…', false);
    focusTitle();
    await delay(reduceMotion.matches ? 70 : 750);
    if (visit !== turn) return;
    game.dataset.lit = 'true';
    await delay(reduceMotion.matches ? 100 : 1450);
    if (visit !== turn) return;
    reward();
  }

  for (const button of ingredients) button.addEventListener('click', () => pick(button));
  action.addEventListener('click', () => {
    if (phase === 'intro' || phase === 'retry' || phase === 'reward') choose();
    else if (phase === 'choose') mix();
    else if (phase === 'success') reveal();
  });
  replayLight.addEventListener('click', () => { if (phase === 'reward') reveal(); });

  if (hasReward()) reward(false);
  else welcome();
})();

// Refresh an existing Orbis offline worker when a returning player follows the preview link.
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  navigator.serviceWorker.getRegistration().then(registration => registration?.update()).catch(() => {});
}
