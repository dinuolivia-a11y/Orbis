/* Stage dressing for Edward’s laboratory. The original game owns every decision,
   score, clue, navigation event and save; the artwork follows those decisions. */
(() => {
  const assets = new URL("./assets/", location.href);
  const tex = new URL("../tex/", location.href);
  const art = name => new URL(name, assets).href;
  const gifts = [
    { cx: 351, cy: 272 },
    { cx: 535, cy: 459, x: 455, y: 374, w: 160, h: 160, frame: [0, 0] },
    { cx: 206, cy: 323, x: 118, y: 235, w: 176, h: 176, frame: [1, 0] },
    { cx: 802, cy: 534, x: 662, y: 378, w: 283, h: 283, frame: [0, 1] },
    { cx: 368, cy: 1035, x: 291, y: 960, w: 154, h: 154, frame: [1, 1] }
  ];
  function prizeInRoom(g, i) {
    if (!g.frame) return "";
    // Clip in room coordinates. Orbis intentionally gives *all* svg elements visible
    // overflow, so a nested svg viewport on its own would leak the other three sprites.
    const clip = "ed-crop-" + i;
    return `<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}"/></clipPath></defs>
      <g class="r${i + 1} ed-prize"><g clip-path="url(#${clip})"><image href="${esc(art("reward-art.webp"))}"
      x="${g.x - g.frame[0]*g.w}" y="${g.y - g.frame[1]*g.h}" width="${2*g.w}" height="${2*g.h}" preserveAspectRatio="none"/></g></g>`;
  }
  gameRoomSvg = function paintedLaboratory(stage) {
    return `<svg class="g-room s${stage}" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(t(GUI.room1))}">
      <image href="${esc(art("room.webp"))}" width="1024" height="1536"/>
      <image class="r1 ed-lit" href="${esc(art("room-lit.webp"))}" width="1024" height="1536"/>
      ${gifts.map(prizeInRoom).join("")}
      ${gifts.map((g, i) => `<circle id="g-f${i + 1}" cx="${g.cx}" cy="${g.cy}" r="2" fill="none"/>`).join("")}
    </svg>`;
  };

  const originalHome = renderGameHome;
  renderGameHome = function paintedHome(opt) {
    originalHome(opt);
    const stage = $("g-stage");
    if (!stage || !stage.classList.contains("g-home")) return;
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
