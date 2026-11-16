/* Stage dressing for Edward’s laboratory. The original game owns every decision,
   score, clue, navigation event and save; the artwork follows those decisions. */
(() => {
  const assets = new URL("assets/", edwardSceneRoot);
  const tex = new URL("../tex/", edwardSceneRoot);
  const art = name => new URL(name, assets).href;
  // Each piece is a registered part of the same finished painting, including its
  // contact shadows and reflections on the furniture already in the empty room.
  const gifts = [
    { file: "ed-lamp", x: 0, y: 0, w: 1024, h: 1536, cx: 312, cy: 338, title: {it:"Lampada accesa", en:"Lamp switched on"} },
    { file: "ed-glass", x: 401, y: 595, w: 291, h: 229, cx: 546, cy: 737, title: {it:"Ampolle sullo scaffale", en:"Flasks on the shelf"} },
    { file: "ed-table", x: 355, y: 108, w: 365, h: 420, cx: 574, cy: 313, title: {it:"Tavola periodica e pianta", en:"Periodic table and plant"} },
    { file: "ed-scope", x: 760, y: 460, w: 260, h: 194, cx: 894, cy: 559, title: {it:"Telescopio alla finestra", en:"Telescope at the window"} },
    { file: "ed-medal", x: 550, y: 976, w: 171, h: 141, cx: 635, cy: 1050, title: {it:"Distintivo di Piccolo Chimico", en:"Little Chemist badge"} }
  ];
  function paintedRoom(stage, withFocusMarkers) {
    return `<svg class="g-room s${stage}" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(t(GUI.room1))}">
      <image href="${esc(art("ed-room-empty.webp"))}" width="1024" height="1536"/>
      ${gifts.map((g, i) => `<image class="r${i + 1} ed-prize" href="${esc(art(g.file + ".webp"))}" x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}"/>`).join("")}
      ${withFocusMarkers ? gifts.map((g, i) => `<circle id="g-f${i + 1}" cx="${g.cx}" cy="${g.cy}" r="2" fill="none"/>`).join("") : ""}
    </svg>`;
  }
  gameRoomSvg = stage => paintedRoom(stage, true);

  function frameRoom(scene) {
    const {clientWidth:width, clientHeight:height} = scene;
    if (!width || !height) return;
    // On wide screens crop excess ceiling and foreground first. Never crop the
    // telescope at the right edge, the wall hook, or the case on the desk.
    const viewHeight = Math.max(1200, Math.min(1536, 1024 * height / width));
    const top = (1536 - viewHeight) * .16;
    scene.querySelector(".g-room").setAttribute("viewBox", `0 ${top} 1024 ${viewHeight}`);
  }
  const roomObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.target.isConnected) frameRoom(entry.target);
      else roomObserver.unobserve(entry.target);
    }
  });

  const originalRooms = gameRooms;
  gameRooms = function roomsWithRestoration() {
    originalRooms();
    const earned = gameStage(gameState());
    if (!earned) return;
    const close = $("g-modal-x"), modal = close.closest(".g-modal");
    const start = document.createElement("button");
    start.type = "button";
    start.className = "g-btn";
    start.id = "ed-replay";
    start.textContent = L2("Rivedi i premi", "Revisit your rewards");
    close.before(start);
    start.onclick = () => {
      modal.classList.add("ed-review");
      modal.innerHTML = `<section class="ed-review-panel" role="dialog" aria-modal="true" aria-labelledby="ed-review-title">
        <header><h2 id="ed-review-title">${esc(start.textContent)}</h2>
        <button type="button" class="g-round" id="g-modal-x" aria-label="${esc(L2("Chiudi", "Close"))}">×</button></header>
        <div class="ed-review-scene">${paintedRoom(0, false)}</div>
        <footer><p role="status" aria-live="polite" aria-atomic="true"></p><div>
        <button type="button" class="w-btn ghost" id="ed-prev">${esc(L2("Indietro", "Previous"))}</button>
        <button type="button" class="w-btn" id="ed-next">${esc(L2("Avanti", "Next"))}</button></div></footer></section>`;
      const scene = modal.querySelector(".ed-review-scene"), status = modal.querySelector("[role=status]");
      const prev = $("ed-prev"), next = $("ed-next");
      frameRoom(scene);
      roomObserver.observe(scene);
      let current = 0;
      const display = step => {
        const focused = document.activeElement;
        current = step;
        scene.querySelector("svg").setAttribute("class", "g-room s" + step);
        status.textContent = `${step} / ${earned} · ${step ? t(gifts[step - 1].title) : L2("Stanza iniziale", "Starting room")}`;
        prev.disabled = step === 0;
        next.disabled = step === earned;
        if (next.disabled && focused === next) prev.focus();
        if (prev.disabled && focused === prev) next.focus();
      };
      display(0);
      prev.onclick = () => display(current - 1);
      next.onclick = () => display(current + 1);
      // Escape and clicks on the close button both use the original modal's
      // dismissal path. Return keyboard focus after that dialog leaves the stage.
      const dismiss = new MutationObserver(() => {
        if (modal.isConnected) return;
        dismiss.disconnect();
        roomObserver.unobserve(scene);
        const opener = $("g-rooms");
        if (opener && !$("game").hidden) opener.focus({preventScroll:true});
      });
      dismiss.observe(modal.parentNode, {childList:true});
      next.focus({preventScroll:true});
      modal.onkeydown = e => {
        if (e.key !== "Tab") return;
        const buttons = [...modal.querySelectorAll("button:enabled")];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); buttons[0].focus(); }
      };
    };
  };

  const originalHome = renderGameHome;
  renderGameHome = function paintedHome(opt) {
    originalHome(opt);
    const stage = $("g-stage");
    if (!stage || !stage.classList.contains("g-home")) return;
    roomObserver.disconnect();
    const scene = $("g-scene");
    frameRoom(scene);
    roomObserver.observe(scene);
    const bar = stage.querySelector(".g-hud .sp");
    bar.textContent = t(GUI.title);
    bar.classList.add("ed-nameplate");
    const speak = $("g-prof-btn");
    speak.innerHTML = `<span class="ed-chat-mark" aria-hidden="true">···</span><span>${esc(t(GUI.prof))}</span>`;
  };

  const originalTrip = gameTrip;
  gameTrip = function visitClue(go, stepId) {
    const alreadySolar = go && go.v === "solar" && VIEW === "solar";
    originalTrip(go, stepId);
    // When the solar view was already underneath the game, goTo does not call
    // setView. Keep the address in sync with the visible map as on a normal visit.
    if (alreadySolar && VIEW === "solar" && $("game").hidden && $("lessons").hidden && location.hash === "#lezioni") {
      setHash("sistema");
    }
  };

  // Orbis already has real surface maps for all four entries in this riddle.
  // Sample each equirectangular image on a lit sphere instead of drawing a striped circle.
  const sphereCache = new Map();
  const longitudes = { mercury: .7, venus: -.85, mars: .8, jupiter: 1.3 };
  function planetImage(id) {
    if (sphereCache.has(id)) return sphereCache.get(id);
    const src = new URL(id + ".webp", tex).href;
    const result = new Promise((resolve, reject) => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        try {
          const sheet = document.createElement("canvas"), W = 512, H = 256, D = 180;
          sheet.width = W; sheet.height = H;
          const source = sheet.getContext("2d", {willReadFrequently:true});
          source.drawImage(im, 0, 0, W, H);
          const a = source.getImageData(0, 0, W, H).data;
          const c = document.createElement("canvas");
          c.width = c.height = D;
          const ctx = c.getContext("2d"), pixels = ctx.createImageData(D,D);
          const radius = D/2-1.5;
          for (let j=0; j<D; j++) for (let i=0; i<D; i++) {
            const x=(i+.5-D/2)/radius, y=(D/2-j-.5)/radius, rr=x*x+y*y;
            if (rr>=1) continue;
            const z=Math.sqrt(1-rr), lon=Math.atan2(x,z)+longitudes[id];
            const u=Math.floor(((.5+lon/(Math.PI*2))%1+1)%1*W), v=Math.min(H-1, Math.floor((.5-Math.asin(y)/Math.PI)*H));
            const si=(v*W+u)*4, ti=(j*D+i)*4;
            const light=.18+.93*Math.sqrt(Math.max(0,-.58*x+.42*y+.69*z));
            for (let k=0;k<3;k++) pixels.data[ti+k]=a[si+k]*light;
            pixels.data[ti+3]=255*Math.min(1,(1-Math.sqrt(rr))*radius);
          }
          ctx.putImageData(pixels,0,0);
          resolve(c.toDataURL("image/png"));
        } catch (err) { reject(err); }
      };
      im.src = src;
    });
    sphereCache.set(id, result);
    return result;
  }

  const originalShell = gameShell;
  gameShell = function paintedStep(st, inner) {
    originalShell(st, inner);
    const stage = $("g-stage");
    stage.dataset.edStep = st.id;
    const options = stage.querySelector(".g-opts");
    if (options) {
      const scene = document.createElement("div");
      scene.className = "ed-bet-scene";
      scene.setAttribute("aria-hidden","true");
      options.before(scene);
    }
    stage.querySelectorAll(".g-dial button").forEach(b => {
      const n = Number(b.dataset.i) + 1;
      b.setAttribute("aria-label", (b.dataset.d === "1" ? L2("Aumenta la cifra ", "Increase digit ") : L2("Diminuisci la cifra ", "Decrease digit ")) + n);
    });
    for (const tile of stage.querySelectorAll(".g-tile")) {
      const globe = tile.querySelector(".g-planet"), id = tile.dataset.id;
      if (!globe || !Object.hasOwn(longitudes, id)) continue;
      globe.className = "g-planet ed-globe";
      globe.setAttribute("aria-hidden","true");
      globe.style.setProperty("--ed-texture", `url("${new URL(id + ".webp", tex).href}")`);
      planetImage(id).then(src => {
        if (!globe.isConnected) return;
        const photo = document.createElement("img");
        photo.alt = "";
        photo.src = src;
        globe.append(photo);
        globe.classList.add("rendered");
      }).catch(() => {}); // The map and its lighting are still visible without pixel access.
    }
  };
})();
