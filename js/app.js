/* ============================================================
   EL TEMPLO — Motor del viaje (v2)
   Máquina de escenas:
     umbral (acceso secreto) → filtro (5 pruebas del aspirante)
     → veredicto (Índice de Compromiso + Expediente)
     → cámara de reflexión → salas de grado → ceremonias → luz.
   Progreso y métricas persistidos en localStorage.
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "templo.v3";
  const D = TEMPLE_DATA;

  /* ---------- Estado ---------- */

  const defaultState = () => ({
    scene: "umbral",          // umbral | filtro | veredicto | camara | apertura | campus | hall | ceremony | finale
    name: "",
    boveda: "",               // bóveda elegida en la apertura (libertad de conciencia)
    gradeIndex: 0,
    opened: {},               // { doorId: true }
    sealed: {},               // { pruebaId: true }
    bodiesDone: {},           // { bodyId: true } — cuerpos del rito completados
    light: 0,
    journal: [],              // { at, title, text }
    voices: [],               // ids de Voces del Oriente reveladas
    propuesta: null,          // { proposal, talents, beneficiaries, commitment }
    metrics: {
      filtroStart: null,
      filtroEnd: null,
      retries: {},            // { pruebaId: n }
      holdReleases: 0
    },
    gymBest: 0,               // mejor racha del Gimnasio Neuronal
    audio: { channel: "off", volume: 0.5 },
    score: null,
    startedAt: null
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const st = Object.assign(defaultState(), parsed);
        st.metrics = Object.assign(defaultState().metrics, parsed.metrics || {});
        st.audio = Object.assign(defaultState().audio, parsed.audio || {});
        return st;
      }
    } catch (e) { /* estado corrupto: se reinicia */ }
    return defaultState();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* sin persistencia */ }
  }

  /* ---------- Utilidades ---------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const root = $("#scene-root");

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9ñ\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchesAnswer(input, keys) {
    const norm = normalize(input);
    if (!norm) return false;
    return keys.some((k) => norm.includes(normalize(k)));
  }

  function addRetry(pruebaId) {
    state.metrics.retries[pruebaId] = (state.metrics.retries[pruebaId] || 0) + 1;
    save();
  }

  function addLight(points) {
    state.light += points;
    save();
    updateHUD();
    const badge = $("#hud-light");
    if (badge) {
      badge.parentElement.classList.remove("pulse");
      void badge.parentElement.offsetWidth;
      badge.parentElement.classList.add("pulse");
    }
  }

  function currentGrade() { return D.grades[state.gradeIndex]; }

  function memberTitle() {
    // Título más alto alcanzado en el Sendero de los 33 grados
    for (let i = D.bodies.length - 1; i >= 0; i--) {
      if (state.bodiesDone[D.bodies[i].id]) return D.bodies[i].title33;
    }
    return null;
  }

  function gradeTitle() {
    if (state.scene === "umbral") return "";
    if (state.scene === "filtro" || state.scene === "veredicto") return "Aspirante";
    if (state.scene === "camara" || state.scene === "apertura") return "Aspirante aceptado";
    const t = memberTitle();
    if (state.scene === "finale") return t || "Inspector General · 33°";
    if (state.scene === "hall" || state.scene === "ceremony") return currentGrade().name;
    return t || "Iniciado";
  }

  function updateHUD() {
    const hud = $("#hud");
    if (state.scene === "umbral") { hud.classList.add("hidden"); return; }
    hud.classList.remove("hidden");
    $("#hud-name").textContent = state.name || "Buscador";
    $("#hud-grade").textContent = gradeTitle();
    $("#hud-light").textContent = state.light;
  }

  function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------- Render de escenas ---------- */

  function render() {
    root.innerHTML = "";
    updateHUD();
    switch (state.scene) {
      case "umbral":    return renderUmbral();
      case "filtro":    return renderFiltro();
      case "veredicto": return renderVeredicto();
      case "camara":    return renderCamara();
      case "apertura":  return renderApertura();
      case "campus":    return renderCampus();
      case "hall":      return renderHall();
      case "ceremony":  return renderCeremony();
      case "finale":    return renderFinale();
    }
  }

  function go(scene) {
    // Las puertas del Templo se cierran y se abren entre cámaras
    const veil = $("#veil");
    veil.classList.add("closing");
    setTimeout(() => {
      state.scene = scene;
      save();
      render();
      window.scrollTo(0, 0);
      veil.classList.remove("closing");
    }, 560);
  }

  /* ============================================================
     ARMONÍAS DEL TEMPLO — audio generativo (Web Audio API)
     Todo se sintetiza en vivo: sin archivos, sin red.
     ============================================================ */

  const AudioEngine = (function () {
    let ctx = null, master = null, wet = null;
    let nodes = [], timers = [];
    let current = "off";

    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = state.audio.volume;
        master.connect(ctx.destination);
        // Eco suave compartido: espacio de "nave de templo"
        wet = ctx.createDelay(1.0);
        wet.delayTime.value = 0.31;
        const fb = ctx.createGain(); fb.gain.value = 0.34;
        const wetGain = ctx.createGain(); wetGain.gain.value = 0.35;
        wet.connect(fb); fb.connect(wet);
        wet.connect(wetGain); wetGain.connect(master);
      }
      if (ctx.state === "suspended") ctx.resume();
      return true;
    }

    function track(n) { nodes.push(n); return n; }
    function later(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }

    function stopAll() {
      timers.forEach(clearTimeout); timers = [];
      nodes.forEach((n) => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) { /* ya detenido */ } });
      nodes = [];
      current = "off";
    }

    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

    function pluck(midi, when, gainVal, pan) {
      const t = ctx.currentTime + when;
      const osc = track(ctx.createOscillator());
      osc.type = "triangle";
      osc.frequency.value = mtof(midi);
      const g = track(ctx.createGain());
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gainVal, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      const p = track(ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain());
      if (p.pan) p.pan.value = pan || 0;
      osc.connect(g); g.connect(p); p.connect(master); p.connect(wet);
      osc.start(t); osc.stop(t + 1.1);
    }

    function playBarroco() {
      // Progresión del canon: D A Bm F#m G D G A — arpegios a 72 ppm
      const prog = [
        [62, 66, 69], [57, 61, 64], [59, 62, 66], [54, 58, 61],
        [55, 59, 62], [50, 54, 57], [55, 59, 62], [57, 61, 64]
      ];
      let step = 0;
      const beat = 60 / 72 / 2 * 1000; // corcheas
      (function loop() {
        if (current !== "barroco") return;
        const chord = prog[Math.floor(step / 8) % prog.length];
        const idx = [0, 1, 2, 1, 0, 1, 2, 1][step % 8];
        const octave = step % 16 >= 8 ? 12 : 0;
        pluck(chord[idx] + octave, 0, 0.16, (idx - 1) * 0.4);
        if (step % 8 === 0) pluck(chord[0] - 24, 0, 0.22, 0); // bajo
        step++;
        later(loop, beat);
      })();
    }

    function sustained(midis, t0, dur) {
      midis.forEach((m, i) => {
        const osc = track(ctx.createOscillator());
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.value = mtof(m);
        const det = track(ctx.createOscillator());
        det.type = "sine";
        det.frequency.value = mtof(m) * 1.003;
        const g = track(ctx.createGain());
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.055, t0 + 1.6);
        g.gain.setValueAtTime(0.055, t0 + dur - 1.6);
        g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
        const f = track(ctx.createBiquadFilter());
        f.type = "lowpass"; f.frequency.value = 1200;
        osc.connect(g); det.connect(g); g.connect(f); f.connect(master); f.connect(wet);
        osc.start(t0); det.start(t0);
        osc.stop(t0 + dur + 0.1); det.stop(t0 + dur + 0.1);
      });
    }

    function playOrgano() {
      const chords = [
        [50, 57, 62, 66], [45, 52, 57, 60], [43, 50, 55, 59], [45, 52, 57, 61]
      ];
      let i = 0;
      (function loop() {
        if (current !== "organo") return;
        sustained(chords[i % chords.length], ctx.currentTime + 0.05, 8.5);
        i++;
        later(loop, 8000);
      })();
    }

    function noiseSource() {
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02; // aproximación de ruido rosa
        d[i] = last * 3.5;
      }
      const src = track(ctx.createBufferSource());
      src.buffer = buf; src.loop = true;
      return src;
    }

    function playBinaural(baseHz, beatHz) {
      const mk = (freq, pan) => {
        const osc = track(ctx.createOscillator());
        osc.type = "sine"; osc.frequency.value = freq;
        const g = track(ctx.createGain()); g.gain.value = 0.09;
        const p = track(ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain());
        if (p.pan) p.pan.value = pan;
        osc.connect(g); g.connect(p); p.connect(master);
        osc.start();
      };
      mk(baseHz, -1);
      mk(baseHz + beatHz, 1);
      // Colchón suave de ruido filtrado
      const src = noiseSource();
      const f = track(ctx.createBiquadFilter());
      f.type = "lowpass"; f.frequency.value = 320;
      const g = track(ctx.createGain()); g.gain.value = 0.05;
      src.connect(f); f.connect(g); g.connect(master);
      src.start();
    }

    function playLluvia() {
      const src = noiseSource();
      const f = track(ctx.createBiquadFilter());
      f.type = "lowpass"; f.frequency.value = 900;
      const g = track(ctx.createGain()); g.gain.value = 0.22;
      const lfo = track(ctx.createOscillator());
      lfo.frequency.value = 0.09;
      const lfoG = track(ctx.createGain()); lfoG.gain.value = 260;
      lfo.connect(lfoG); lfoG.connect(f.frequency);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(); lfo.start();
    }

    return {
      play(channel) {
        if (!ensure()) return false;
        stopAll();
        current = channel;
        if (channel === "barroco") playBarroco();
        else if (channel === "organo") playOrgano();
        else if (channel === "alfa") playBinaural(200, 10);
        else if (channel === "theta") playBinaural(180, 6);
        else if (channel === "lluvia") playLluvia();
        return true;
      },
      stop() { stopAll(); },
      setVolume(v) { if (master) master.gain.value = v; },
      get current() { return current; }
    };
  })();

  function openAudio() {
    const A = D.audio;
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title", A.title));
    card.appendChild(el("p", "muted small", A.intro));

    const list = el("div", "options");
    A.channels.forEach((ch) => {
      const btn = el("button", "btn btn-option audio-option" + (state.audio.channel === ch.id ? " chosen" : ""),
        "<strong>" + ch.name + "</strong><span class='chip-sub'>" + ch.desc + "</span>");
      btn.addEventListener("click", () => {
        state.audio.channel = ch.id;
        save();
        if (ch.id === "off") AudioEngine.stop();
        else AudioEngine.play(ch.id);
        list.querySelectorAll("button").forEach((b) => b.classList.remove("chosen"));
        btn.classList.add("chosen");
      });
      list.appendChild(btn);
    });
    card.appendChild(list);

    const volWrap = el("div", "field");
    volWrap.appendChild(el("label", "field-label", "Volumen de la nave"));
    const vol = el("input", "vol-slider");
    vol.type = "range"; vol.min = "0"; vol.max = "1"; vol.step = "0.05";
    vol.value = String(state.audio.volume);
    vol.addEventListener("input", () => {
      state.audio.volume = parseFloat(vol.value);
      AudioEngine.setVolume(state.audio.volume);
      save();
    });
    volWrap.appendChild(vol);
    card.appendChild(volWrap);

    card.appendChild(el("p", "neuro-note", "🧠 " + A.note));
    const close = el("button", "btn btn-ghost", "Cerrar");
    close.addEventListener("click", closeModal);
    card.appendChild(close);
    $("#modal").classList.remove("hidden");
  }

  /* ============================================================
     PLANO DEL TEMPLO — tablero navegable (a lo CLUE)
     ============================================================ */

  function templeRooms() {
    const accepted = state.score !== null && state.score >= D.veredicto.threshold;
    const inTemple = !!state.boveda;
    const gradeDone = (gi) => D.grades[gi].doors.every((d) => state.opened[d.id]);
    const bodyUnlocked = (i) => i === 0 || state.bodiesDone[D.bodies[i - 1].id];
    const allBodies = D.bodies.every((b) => state.bodiesDone[b.id]);

    return [
      { id: "cumbre",    x: 115, y: 15,  w: 150, h: 55, label: "Oriente · Cumbre 33°",
        status: state.scene === "finale" ? "current" : allBodies ? "open" : "locked",
        nav: () => { if (allBodies) go("finale"); } },
      { id: "kadosh",    x: 15,  y: 85,  w: 170, h: 60, label: "Kadosh · 19–30",
        status: state.bodiesDone.kadosh ? "done" : (inTemple && bodyUnlocked(3)) ? "open" : "locked",
        nav: () => { if (inTemple && bodyUnlocked(3)) { closeMap(); openBodyModal(D.bodies[3], !!state.bodiesDone.kadosh); } } },
      { id: "supremo",   x: 195, y: 85,  w: 170, h: 60, label: "Supremo · 31–33",
        status: state.bodiesDone.supremo ? "done" : (inTemple && bodyUnlocked(4)) ? "open" : "locked",
        nav: () => { if (inTemple && bodyUnlocked(4)) { closeMap(); openBodyModal(D.bodies[4], !!state.bodiesDone.supremo); } } },
      { id: "perfeccion", x: 15, y: 160, w: 170, h: 60, label: "Perfección · 4–14",
        status: state.bodiesDone.perfeccion ? "done" : (inTemple && bodyUnlocked(1)) ? "open" : "locked",
        nav: () => { if (inTemple && bodyUnlocked(1)) { closeMap(); openBodyModal(D.bodies[1], !!state.bodiesDone.perfeccion); } } },
      { id: "rosacruz",  x: 195, y: 160, w: 170, h: 60, label: "Rosa Cruz · 15–18",
        status: state.bodiesDone.rosacruz ? "done" : (inTemple && bodyUnlocked(2)) ? "open" : "locked",
        nav: () => { if (inTemple && bodyUnlocked(2)) { closeMap(); openBodyModal(D.bodies[2], !!state.bodiesDone.rosacruz); } } },
      { id: "norte",     x: 15,  y: 235, w: 110, h: 60, label: "C. del Norte · 1°",
        status: gradeDone(0) ? "done" : (inTemple && state.gradeIndex === 0 && (state.scene === "hall" || state.scene === "ceremony")) ? "current" : inTemple ? "open" : "locked",
        nav: () => { if (inTemple && !state.bodiesDone.azul && state.gradeIndex === 0) go("hall"); } },
      { id: "medio",     x: 135, y: 235, w: 110, h: 60, label: "C. del Medio · 3°",
        status: gradeDone(2) ? "done" : (inTemple && state.gradeIndex === 2 && (state.scene === "hall" || state.scene === "ceremony")) ? "current" : (inTemple && state.gradeIndex >= 2) ? "open" : "locked",
        nav: () => { if (inTemple && !state.bodiesDone.azul && state.gradeIndex === 2) go("hall"); } },
      { id: "mediodia",  x: 255, y: 235, w: 110, h: 60, label: "C. del Mediodía · 2°",
        status: gradeDone(1) ? "done" : (inTemple && state.gradeIndex === 1 && (state.scene === "hall" || state.scene === "ceremony")) ? "current" : (inTemple && state.gradeIndex >= 1) ? "open" : "locked",
        nav: () => { if (inTemple && !state.bodiesDone.azul && state.gradeIndex === 1) go("hall"); } },
      { id: "sendero",   x: 95,  y: 310, w: 190, h: 60, label: "Atrio · Sendero 33",
        status: state.scene === "campus" ? "current" : inTemple ? "open" : "locked",
        nav: () => { if (inTemple) go("campus"); } },
      { id: "reflexion", x: 200, y: 385, w: 165, h: 55, label: "Cámara de Reflexión",
        status: state.scene === "camara" ? "current" : inTemple ? "done" : accepted ? "open" : "locked",
        nav: () => { if (accepted && !state.boveda) go("camara"); } },
      { id: "pruebas",   x: 15,  y: 385, w: 165, h: 55, label: "Cámara de Pruebas",
        status: (state.scene === "filtro" || state.scene === "veredicto") ? "current" : accepted ? "done" : "open",
        nav: () => { if (!accepted && state.scene !== "umbral") go("filtro"); } },
      { id: "umbral",    x: 130, y: 452, w: 120, h: 40, label: "Umbral",
        status: state.scene === "umbral" ? "current" : "done", nav: () => {} }
    ];
  }

  function closeMap() { $("#modal").classList.add("hidden"); }

  function openMap() {
    const rooms = templeRooms();
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title", "Plano del Templo"));
    card.appendChild(el("p", "muted small", "Toca una cámara iluminada para dirigirte a ella. El punto dorado señala dónde estás."));

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 380 505");
    svg.setAttribute("class", "temple-map");

    rooms.forEach((r) => {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "map-room map-" + r.status);
      const rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", r.x); rect.setAttribute("y", r.y);
      rect.setAttribute("width", r.w); rect.setAttribute("height", r.h);
      rect.setAttribute("rx", 8);
      g.appendChild(rect);
      const label = document.createElementNS(NS, "text");
      label.setAttribute("x", r.x + r.w / 2);
      label.setAttribute("y", r.y + r.h / 2 + 4);
      label.setAttribute("text-anchor", "middle");
      label.textContent = (r.status === "done" ? "✓ " : r.status === "locked" ? "🔒 " : "") + r.label;
      g.appendChild(label);
      if (r.status === "current") {
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("cx", r.x + r.w - 14);
        dot.setAttribute("cy", r.y + 14);
        dot.setAttribute("r", 6);
        dot.setAttribute("class", "map-you");
        g.appendChild(dot);
      }
      g.addEventListener("click", () => { closeMap(); r.nav(); });
      svg.appendChild(g);
    });

    card.appendChild(svg);
    const close = el("button", "btn btn-ghost", "Cerrar el plano");
    close.addEventListener("click", closeModal);
    card.appendChild(close);
    $("#modal").classList.remove("hidden");
  }

  function narrative(lines, fast) {
    const box = el("div", "narrative");
    lines.forEach((line, i) => {
      const p = el("p", "narrative-line", line);
      p.style.animationDelay = (fast ? 0.12 : 0.35) * i + "s";
      box.appendChild(p);
    });
    return box;
  }

  /* ============================================================
     EL UMBRAL — acceso secreto, discreto, hay que descubrirlo
     ============================================================ */

  function renderUmbral() {
    const scene = el("section", "scene scene-umbral");
    const whisper = el("p", "umbral-whisper", D.umbral.whisper);
    scene.appendChild(whisper);

    const door = el("div", "umbral-door");
    door.setAttribute("role", "button");
    door.setAttribute("tabindex", "0");
    door.setAttribute("aria-label", "Una puerta apenas visible. Llama tres veces.");
    const glow = el("div", "umbral-glow");
    door.appendChild(glow);
    scene.appendChild(door);

    const linesBox = el("div", "umbral-lines hidden");
    D.umbral.lines.forEach((l) => linesBox.appendChild(el("p", "narrative-line-static", l)));
    scene.appendChild(linesBox);

    const hint = el("p", "umbral-hint hidden", D.umbral.hint);
    scene.appendChild(hint);

    const dots = el("div", "knock-dots umbral-dots hidden", "○ ○ ○");
    scene.appendChild(dots);

    // La puerta se revela con el tiempo o al acercarse
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      door.classList.add("revealed");
      linesBox.classList.remove("hidden");
      setTimeout(() => { hint.classList.remove("hidden"); dots.classList.remove("hidden"); }, 1800);
    };
    setTimeout(reveal, 4500);
    door.addEventListener("mouseenter", reveal);
    door.addEventListener("touchstart", reveal, { passive: true });

    let knocks = 0;
    const doKnock = () => {
      reveal();
      if (knocks >= 3) return;
      knocks++;
      door.classList.remove("knocked");
      void door.offsetWidth;
      door.classList.add("knocked");
      dots.textContent = "●".repeat(knocks) + (knocks < 3 ? " " + "○ ".repeat(3 - knocks).trim() : "");
      if (knocks === 3) setTimeout(() => umbralQuestion(scene), 700);
    };
    door.addEventListener("click", doKnock);
    door.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doKnock(); } });

    root.appendChild(scene);
  }

  function umbralQuestion(scene) {
    scene.querySelectorAll(".umbral-hint, .umbral-dots").forEach((n) => n.classList.add("hidden"));
    const box = el("div", "umbral-question");
    box.appendChild(el("p", "prompt", D.umbral.question));
    const opts = el("div", "options");
    const reply = el("p", "teaching hidden", "");

    D.umbral.answers.forEach((a) => {
      const btn = el("button", "btn btn-option", a.label);
      btn.addEventListener("click", () => {
        reply.classList.remove("hidden");
        reply.textContent = a.reply;
        if (a.accept) {
          opts.querySelectorAll("button").forEach((b) => (b.disabled = true));
          btn.classList.add("chosen");
          const enter = el("button", "btn btn-gold btn-big", "Entrar a la Cámara de Pruebas");
          enter.addEventListener("click", () => {
            state.startedAt = state.startedAt || Date.now();
            state.metrics.filtroStart = state.metrics.filtroStart || Date.now();
            save();
            go("filtro");
          });
          box.appendChild(enter);
        } else {
          btn.classList.add("rejected");
          btn.disabled = true;
        }
      });
      opts.appendChild(btn);
    });

    box.appendChild(opts);
    box.appendChild(reply);
    scene.appendChild(box);
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ============================================================
     EL FILTRO — cinco sellos, cinco pruebas
     ============================================================ */

  function renderFiltro() {
    const scene = el("section", "scene scene-filtro");
    scene.appendChild(el("h1", "title-main", D.filtro.title));
    scene.appendChild(narrative(D.filtro.intro));

    const path = el("div", "seals");
    D.filtro.pruebas.forEach((prueba, i) => {
      const sealed = !!state.sealed[prueba.id];
      const locked = i > 0 && !state.sealed[D.filtro.pruebas[i - 1].id];
      path.appendChild(sealCard(prueba, i + 1, sealed, locked));
    });
    scene.appendChild(path);

    const allSealed = D.filtro.pruebas.every((p) => state.sealed[p.id]);
    if (allSealed) {
      const btn = el("button", "btn btn-gold btn-big", "Presentarse al Veredicto");
      btn.addEventListener("click", () => {
        if (!state.metrics.filtroEnd) { state.metrics.filtroEnd = Date.now(); }
        state.score = computeScore();
        save();
        go("veredicto");
      });
      scene.appendChild(btn);
    }

    root.appendChild(scene);
  }

  function sealCard(prueba, num, sealed, locked) {
    const card = el("div", "seal" + (sealed ? " seal-done" : "") + (locked ? " seal-locked" : ""));
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", locked ? "-1" : "0");
    card.appendChild(el("div", "seal-ring", sealed ? "✦" : String(num)));
    card.appendChild(el("div", "seal-title", prueba.title));
    card.appendChild(el("div", "seal-state", sealed ? "Sello grabado" : locked ? "🔒 Sella el anterior" : "Toca para enfrentar la prueba"));
    if (!locked && !sealed) {
      const open = () => openPrueba(prueba);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    }
    return card;
  }

  function openPrueba(prueba) {
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title", prueba.title));
    card.appendChild(narrative(prueba.narrative, true));

    const bodies = {
      ordenar: ordenarBody,
      completar: completarBody,
      unir: unirBody,
      constancia: constanciaBody,
      propuesta: propuestaBody
    };
    card.appendChild(bodies[prueba.type](prueba));

    const close = el("button", "btn btn-ghost", "Retirarse por ahora");
    close.addEventListener("click", closeModal);
    card.appendChild(close);

    $("#modal").classList.remove("hidden");
  }

  function sealPrueba(prueba, reward) {
    state.sealed[prueba.id] = true;
    addLight(reward || 3);
    save();

    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title gold", "✦ El sello se graba"));
    if (prueba.teaching) card.appendChild(el("p", "success-text", prueba.teaching));
    card.appendChild(el("p", "reward", "+" + (reward || 3) + " de Luz"));
    const btn = el("button", "btn btn-gold", "Continuar");
    btn.addEventListener("click", () => { closeModal(); render(); });
    card.appendChild(btn);
  }

  /* --- Mecánica compartida: arrastrar fichas a ranuras --- */
  /* Soporta arrastre nativo (escritorio) y tocar-para-colocar (móvil). */

  function chipSlotBoard(pieces, slots, onCheck) {
    const board = el("div", "board");
    const pool = el("div", "chip-pool");
    const slotsBox = el("div", "slots");
    const feedback = el("p", "feedback", "");
    const checkBtn = el("button", "btn btn-gold", "Comprobar");
    checkBtn.disabled = true;

    let selected = null;

    function deselect() {
      if (selected) selected.classList.remove("chip-selected");
      selected = null;
    }

    function updateCheck() {
      const filled = slotsBox.querySelectorAll(".slot .chip").length;
      checkBtn.disabled = filled < slots.length;
    }

    function placeChip(chip, slot) {
      const occupant = slot.querySelector(".chip");
      if (occupant) pool.appendChild(occupant);
      slot.appendChild(chip);
      slot.classList.remove("slot-wrong");
      deselect();
      updateCheck();
    }

    pieces.forEach((piece) => {
      const chip = el("div", "chip", '<strong>' + piece.label + "</strong>" + (piece.sub ? '<span class="chip-sub">' + piece.sub + "</span>" : ""));
      chip.dataset.id = piece.id;
      chip.draggable = true;
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", piece.id);
        deselect();
      });
      const pick = () => {
        if (selected === chip) { deselect(); return; }
        deselect();
        selected = chip;
        chip.classList.add("chip-selected");
      };
      chip.addEventListener("click", pick);
      chip.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      pool.appendChild(chip);
    });

    slots.forEach((slotDef) => {
      const slot = el("div", "slot");
      slot.dataset.expect = slotDef.expect;
      slot.appendChild(el("div", "slot-label", slotDef.label));
      slot.addEventListener("dragover", (e) => e.preventDefault());
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const chip = board.querySelector('.chip[data-id="' + id + '"]');
        if (chip) placeChip(chip, slot);
      });
      slot.addEventListener("click", (e) => {
        if (e.target.closest(".chip")) return; // el clic en la ficha la selecciona
        if (selected) placeChip(selected, slot);
        else {
          const occupant = slot.querySelector(".chip");
          if (occupant) { pool.appendChild(occupant); updateCheck(); }
        }
      });
      slotsBox.appendChild(slot);
    });

    // Devolver ficha al banco al tocarla estando colocada y seleccionada dos veces
    pool.addEventListener("dragover", (e) => e.preventDefault());
    pool.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const chip = board.querySelector('.chip[data-id="' + id + '"]');
      if (chip) { pool.appendChild(chip); updateCheck(); }
    });

    checkBtn.addEventListener("click", () => {
      const placements = Array.from(slotsBox.querySelectorAll(".slot")).map((slot) => ({
        slot,
        ok: slot.querySelector(".chip") && slot.querySelector(".chip").dataset.id === slot.dataset.expect
      }));
      onCheck(placements, feedback);
    });

    board.append(pool, slotsBox, checkBtn, feedback);
    return board;
  }

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* --- Prueba: ordenar (el Caballete) --- */

  function ordenarBody(prueba) {
    const wrap = el("div", "challenge");
    wrap.appendChild(el("p", "board-hint", "Arrastra cada pilar a su lugar — o tócalo y luego toca la ranura."));
    const slots = prueba.correctOrder.map((id, i) => ({ expect: id, label: prueba.slotLabels[i] }));
    wrap.appendChild(chipSlotBoard(shuffled(prueba.pieces), slots, (placements, feedback) => {
      if (placements.every((p) => p.ok)) {
        sealPrueba(prueba, 4);
      } else {
        addRetry(prueba.id);
        placements.forEach((p) => { if (!p.ok) p.slot.classList.add("slot-wrong"); });
        feedback.textContent = prueba.failText;
      }
    }));
    return wrap;
  }

  /* --- Prueba: completar frases --- */

  function completarBody(prueba) {
    const wrap = el("div", "challenge");
    const inputs = [];

    prueba.quotes.forEach((q) => {
      const quoteBox = el("div", "quote-plate");
      const line = el("p", "quote-line");
      line.append(document.createTextNode(q.before));
      const input = el("input", "input input-inline");
      input.type = "text";
      input.setAttribute("aria-label", "Palabra que falta");
      inputs.push({ input, answers: q.answers });
      line.appendChild(input);
      line.append(document.createTextNode(q.after));
      quoteBox.appendChild(line);
      quoteBox.appendChild(el("p", "quote-author", "— " + q.author));
      wrap.appendChild(quoteBox);
    });

    const feedback = el("p", "feedback", "");
    const btn = el("button", "btn btn-gold", "Devolver las palabras");
    btn.addEventListener("click", () => {
      let allOk = true;
      inputs.forEach(({ input, answers }) => {
        const ok = matchesAnswer(input.value, answers);
        input.classList.toggle("shake", !ok);
        if (!ok) { allOk = false; setTimeout(() => input.classList.remove("shake"), 500); }
      });
      if (allOk) sealPrueba(prueba, 3);
      else { addRetry(prueba.id); feedback.textContent = prueba.failText; }
    });

    wrap.append(btn, feedback);
    return wrap;
  }

  /* --- Prueba: unir símbolos y significados --- */

  function unirBody(prueba) {
    const wrap = el("div", "challenge");
    wrap.appendChild(el("p", "board-hint", "Arrastra cada significado bajo su herramienta — o tócalo y luego toca la ranura."));
    const pieces = shuffled(prueba.pairs.map((p, i) => ({ id: "m" + i, label: p.meaning })));
    const slots = prueba.pairs.map((p, i) => ({
      expect: "m" + i,
      label: '<span class="tool-symbol">' + p.symbol + "</span> " + p.name
    }));
    wrap.appendChild(chipSlotBoard(pieces, slots, (placements, feedback) => {
      if (placements.every((p) => p.ok)) {
        sealPrueba(prueba, 4);
      } else {
        addRetry(prueba.id);
        placements.forEach((p) => { if (!p.ok) p.slot.classList.add("slot-wrong"); });
        feedback.textContent = prueba.failText;
      }
    }));
    return wrap;
  }

  /* --- Prueba: constancia (sostener el cincel) --- */

  function constanciaBody(prueba) {
    const wrap = el("div", "challenge");
    const totalMs = prueba.holdSeconds * 1000;
    let heldMs = 0;
    let holding = false;
    let timer = null;
    let done = false;
    let shownCarvings = 0;

    const stone = el("div", "stone");
    const bar = el("div", "hold-bar", '<div class="hold-fill"></div>');
    const fill = bar.firstChild;
    const carvingsBox = el("div", "carvings");
    const chisel = el("button", "btn btn-gold btn-big hold-btn", "🔨 Sostener el cincel");
    chisel.setAttribute("aria-label", "Mantén presionado " + prueba.holdSeconds + " segundos");
    const feedback = el("p", "feedback", "");

    function tick() {
      heldMs += 100;
      const pct = Math.min(100, (heldMs / totalMs) * 100);
      fill.style.width = pct + "%";
      const shouldShow = Math.floor((pct / 100) * prueba.carvings.length);
      while (shownCarvings < shouldShow && shownCarvings < prueba.carvings.length) {
        carvingsBox.appendChild(el("p", "carving", prueba.carvings[shownCarvings]));
        shownCarvings++;
      }
      if (heldMs >= totalMs && !done) {
        done = true;
        stop();
        chisel.disabled = true;
        setTimeout(() => sealPrueba(prueba, 5), 600);
      }
    }

    function start(e) {
      if (done || holding) return;
      e.preventDefault();
      if (e.pointerId !== undefined && chisel.setPointerCapture) {
        try { chisel.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
      }
      holding = true;
      stone.classList.add("carving-now");
      timer = setInterval(tick, 100);
    }

    function stop() {
      if (!holding && !done) return;
      if (holding && !done && heldMs > 0) {
        state.metrics.holdReleases++;
        save();
        feedback.textContent = "Soltaste el cincel. La piedra lo recuerda… pero te deja continuar donde ibas.";
      }
      holding = false;
      stone.classList.remove("carving-now");
      if (timer) { clearInterval(timer); timer = null; }
    }

    chisel.addEventListener("pointerdown", start);
    chisel.addEventListener("pointerup", stop);
    chisel.addEventListener("pointerleave", stop);
    chisel.addEventListener("pointercancel", stop);
    chisel.addEventListener("contextmenu", (e) => e.preventDefault());

    wrap.append(stone, bar, carvingsBox, chisel, feedback);
    return wrap;
  }

  /* --- Prueba: la Propuesta del Aspirante --- */

  function propuestaBody(prueba) {
    const f = prueba.fields;
    const wrap = el("div", "challenge propuesta-form");

    function field(label) {
      const box = el("div", "field");
      box.appendChild(el("label", "field-label", label));
      return box;
    }

    const nameBox = field(f.name.label);
    const nameInput = el("input", "input full");
    nameInput.type = "text";
    nameInput.maxLength = 40;
    nameInput.placeholder = f.name.placeholder;
    nameInput.value = state.name || "";
    nameBox.appendChild(nameInput);

    const propBox = field(f.proposal.label);
    const propTa = el("textarea", "textarea");
    propTa.rows = 6;
    propTa.placeholder = f.proposal.placeholder;
    const propCount = el("p", "counter", "0 / " + f.proposal.min);
    propBox.append(propTa, propCount);

    const talBox = field(f.talents.label);
    const talTa = el("textarea", "textarea");
    talTa.rows = 3;
    talTa.placeholder = f.talents.placeholder;
    const talCount = el("p", "counter", "0 / " + f.talents.min);
    talBox.append(talTa, talCount);

    const benBox = field(f.beneficiaries.label);
    const benInput = el("input", "input full");
    benInput.type = "text";
    benInput.placeholder = f.beneficiaries.placeholder;
    benBox.appendChild(benInput);

    const comBox = field(f.commitment.label);
    const comSel = el("select", "input full");
    comSel.appendChild(el("option", null, "Elige tu compromiso…")).value = "";
    f.commitment.options.forEach((o) => { const op = el("option", null, o); op.value = o; comSel.appendChild(op); });
    comBox.appendChild(comSel);

    const feedback = el("p", "feedback", "");
    const btn = el("button", "btn btn-gold btn-big", "Presentar mi obra");

    function validate() {
      const okName = nameInput.value.trim().length >= 2;
      const okProp = propTa.value.trim().length >= f.proposal.min;
      const okTal = talTa.value.trim().length >= f.talents.min;
      const okBen = benInput.value.trim().length >= 3;
      const okCom = !!comSel.value;
      btn.disabled = !(okName && okProp && okTal && okBen && okCom);
    }

    [nameInput, benInput].forEach((i) => i.addEventListener("input", validate));
    comSel.addEventListener("change", validate);
    propTa.addEventListener("input", () => {
      const len = propTa.value.trim().length;
      propCount.textContent = len + " / " + f.proposal.min;
      propCount.classList.toggle("done", len >= f.proposal.min);
      validate();
    });
    talTa.addEventListener("input", () => {
      const len = talTa.value.trim().length;
      talCount.textContent = len + " / " + f.talents.min;
      talCount.classList.toggle("done", len >= f.talents.min);
      validate();
    });
    btn.disabled = true;

    btn.addEventListener("click", () => {
      state.name = nameInput.value.trim();
      state.propuesta = {
        proposal: propTa.value.trim(),
        talents: talTa.value.trim(),
        beneficiaries: benInput.value.trim(),
        commitment: comSel.value
      };
      save();
      sealPrueba(prueba, 5);
    });

    wrap.append(nameBox, propBox, talBox, benBox, comBox, btn, feedback);
    return wrap;
  }

  /* ============================================================
     EL VEREDICTO — Índice de Compromiso y Expediente
     ============================================================ */

  function computeScore() {
    const m = state.metrics;
    const totalRetries = Object.values(m.retries).reduce((a, b) => a + b, 0);
    let score = 40;
    score += Math.max(0, 18 - totalRetries * 4);
    score += Math.max(0, 14 - m.holdReleases * 3);
    if (state.propuesta) {
      score += Math.min(18, Math.floor(state.propuesta.proposal.length / 60));
      score += Math.min(6, Math.floor(state.propuesta.talents.length / 40));
      if (state.propuesta.commitment === "3–5 horas") score += 2;
      if (state.propuesta.commitment === "6 o más horas") score += 4;
    }
    return Math.min(100, score);
  }

  function sealFor(score) {
    return D.veredicto.seals.find((s) => score >= s.min) || null;
  }

  function renderVeredicto() {
    const accepted = state.score >= D.veredicto.threshold;
    const v = accepted ? D.veredicto.accepted : D.veredicto.rejected;
    const seal = sealFor(state.score);

    const scene = el("section", "scene scene-veredicto");
    scene.appendChild(el("h1", "title-main", v.title));

    const gauge = el("div", "gauge");
    gauge.appendChild(el("div", "gauge-score", String(state.score)));
    gauge.appendChild(el("div", "gauge-label", "Índice de Compromiso"));
    if (seal) gauge.appendChild(el("div", "gauge-seal", seal.symbol + " " + seal.name));
    scene.appendChild(gauge);

    scene.appendChild(narrative(v.lines));

    if (accepted) {
      const row = el("div", "form-row center");
      const dl = el("button", "btn btn-gold", "⬇ Descargar mi Expediente");
      dl.addEventListener("click", downloadExpediente);
      const send = el("a", "btn", "✉ Enviarlo al Maestro");
      send.href = "mailto:" + D.lodge.contactEmail + "?subject=" + encodeURIComponent("Expediente del Aspirante — " + state.name);
      const cont = el("button", "btn btn-gold btn-big", "Descender a la Cámara de Reflexión");
      cont.addEventListener("click", () => go("camara"));
      row.append(dl, send);
      scene.appendChild(row);
      scene.appendChild(el("p", "muted small", "Descarga tu expediente y hazlo llegar al Venerable Maestro: él decidirá tu iniciación. Puedes continuar el recorrido mientras tanto."));
      scene.appendChild(cont);
    } else {
      const retry = el("button", "btn btn-gold btn-big", "Volver a la Cámara de Pruebas");
      retry.addEventListener("click", () => {
        state.sealed = {};
        state.metrics.retries = {};
        state.metrics.holdReleases = 0;
        state.metrics.filtroStart = Date.now();
        state.metrics.filtroEnd = null;
        state.score = null;
        save();
        go("filtro");
      });
      scene.appendChild(retry);
    }
    root.appendChild(scene);
  }

  function expedienteText() {
    const m = state.metrics;
    const totalRetries = Object.values(m.retries).reduce((a, b) => a + b, 0);
    const durMin = m.filtroEnd && m.filtroStart ? (m.filtroEnd - m.filtroStart) / 60000 : null;
    const dur = durMin === null ? "?" : durMin < 1 ? "menos de 1" : String(Math.round(durMin));
    const seal = sealFor(state.score);
    const p = state.propuesta || {};
    const lines = [
      "══════════════════════════════════════════",
      "  " + D.lodge.name.toUpperCase() + " · EXPEDIENTE DEL ASPIRANTE",
      "══════════════════════════════════════════",
      "",
      "Nombre simbólico : " + state.name,
      "Fecha            : " + new Date().toLocaleString("es"),
      "Índice de Compromiso : " + state.score + "/100" + (seal ? "  (" + seal.name + ")" : ""),
      "Rito             : " + D.lodge.rite,
      "Bóveda de trabajo: " + (state.boveda || "aún no declarada"),
      "Grado alcanzado  : " + (memberTitle() || "Aspirante"),
      "Insignias        : " + (D.bodies.filter((b) => state.bodiesDone[b.id]).map((b) => b.badge.name).join(", ") || "ninguna aún"),
      "",
      "— MÉTRICAS DEL FILTRO —",
      "Tiempo en pruebas      : ~" + dur + " min",
      "Reintentos totales     : " + totalRetries,
      "Prueba de constancia   : " + m.holdReleases + " interrupciones del cincel",
      "Compromiso declarado   : " + (p.commitment || "—") + " semanales",
      "",
      "— LA PROPUESTA (Sello V) —",
      "Obra / proyecto:",
      p.proposal || "—",
      "",
      "Aporta (talentos, experiencia, recursos):",
      p.talents || "—",
      "",
      "Beneficiarios: " + (p.beneficiaries || "—"),
      ""
    ];
    if (state.journal.length) {
      lines.push("— DIARIO DEL INICIADO —");
      state.journal.forEach((e) => {
        lines.push("· " + e.title + " (" + new Date(e.at).toLocaleDateString("es") + ")", e.text, "");
      });
    }
    if (state.voices.length) {
      lines.push("— VOCES DEL ORIENTE REVELADAS —");
      state.voices.forEach((id) => {
        const v = D.voices[id];
        if (v) lines.push("· " + v.author + ": «" + v.quote + "»");
      });
      lines.push("");
    }
    lines.push("Luz acumulada: " + state.light, "", D.lodge.motto, "V.I.T.R.I.O.L.");
    return lines.join("\n");
  }

  function downloadExpediente() {
    const blob = new Blob([expedienteText()], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "expediente-" + normalize(state.name).replace(/\s+/g, "-") + ".txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ============================================================
     CÁMARA DE REFLEXIÓN
     ============================================================ */

  function renderCamara() {
    const scene = el("section", "scene scene-camara");
    scene.appendChild(el("div", "candle", '<div class="flame"></div><div class="wax"></div>'));
    scene.appendChild(el("h1", "title-main", D.camara.title));
    scene.appendChild(narrative(D.camara.lines));

    const area = reflectionArea(D.camara.prompt, D.camara.minChars, (text) => {
      state.journal.push({ at: Date.now(), title: "Testamento del profano", text });
      addLight(D.camara.reward);
      save();
      go("apertura");
    }, D.camara.cta);
    scene.appendChild(area);
    root.appendChild(scene);
  }

  /* ============================================================
     APERTURA DE LOS TRABAJOS — Masonería Liberal
     ============================================================ */

  function renderApertura() {
    const A = D.apertura;
    const scene = el("section", "scene scene-apertura");
    scene.appendChild(el("div", "rite-tag", D.lodge.rite));
    scene.appendChild(el("h1", "title-main", A.title));
    scene.appendChild(narrative(A.lines));

    const box = el("div", "umbral-question");
    box.appendChild(el("p", "prompt", A.question));
    const opts = el("div", "options");
    const reply = el("p", "teaching hidden", "");

    A.options.forEach((o) => {
      const btn = el("button", "btn btn-option", o.label);
      btn.addEventListener("click", () => {
        opts.querySelectorAll("button").forEach((b) => { b.disabled = true; b.classList.remove("chosen"); });
        btn.classList.add("chosen");
        reply.classList.remove("hidden");
        reply.textContent = o.reply;
        state.boveda = o.label;
        save();
        if (!box.querySelector(".btn-gold")) {
          const enter = el("button", "btn btn-gold btn-big", "Abrir el Sendero de los 33 Grados");
          enter.addEventListener("click", () => go("campus"));
          box.appendChild(enter);
        }
      });
      opts.appendChild(btn);
    });

    box.append(opts, reply);
    scene.appendChild(box);
    scene.appendChild(el("p", "muted small", A.note));
    root.appendChild(scene);
  }

  /* ============================================================
     EL CAMPUS — Sendero de los 33 Grados (LMS)
     ============================================================ */

  function bodyProgress(body) {
    if (state.bodiesDone[body.id]) return 100;
    if (body.kind === "grades") {
      const total = D.grades.reduce((n, g) => n + g.doors.length, 0);
      const done = Object.keys(state.opened).length;
      return Math.round((done / total) * 100);
    }
    return 0;
  }

  function renderCampus() {
    const scene = el("section", "scene scene-campus");
    scene.appendChild(el("div", "rite-tag", D.lodge.rite));
    scene.appendChild(el("h1", "title-main", D.campus.title));
    if (state.boveda) scene.appendChild(el("p", "boveda-line", "Trabajos abiertos: " + escapeHTML(state.boveda) + "."));
    scene.appendChild(narrative(D.campus.intro, true));

    const path = el("div", "bodies");
    D.bodies.forEach((body, i) => {
      const done = !!state.bodiesDone[body.id];
      const locked = i > 0 && !state.bodiesDone[D.bodies[i - 1].id];
      path.appendChild(bodyCard(body, i, done, locked));
    });
    scene.appendChild(path);

    const allDone = D.bodies.every((b) => state.bodiesDone[b.id]);
    if (allDone) {
      const btn = el("button", "btn btn-gold btn-big", "Ascender a la Cumbre · 33°");
      btn.addEventListener("click", () => go("finale"));
      scene.appendChild(btn);
    }
    root.appendChild(scene);
  }

  function bodyCard(body, index, done, locked) {
    const card = el("div", "body-card" + (done ? " body-done" : "") + (locked ? " body-locked" : ""));
    card.style.setProperty("--accent", body.accent);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", locked ? "-1" : "0");

    const head = el("div", "body-head");
    head.appendChild(el("span", "body-range", body.range));
    if (done) head.appendChild(el("span", "body-badge", body.badge.symbol + " " + body.badge.name));
    card.appendChild(head);
    card.appendChild(el("h3", "body-name", body.name));
    card.appendChild(el("p", "body-sub", body.subtitle));

    const pct = bodyProgress(body);
    const bar = el("div", "body-bar", '<div class="body-fill" style="width:' + pct + '%"></div>');
    card.appendChild(bar);
    card.appendChild(el("p", "body-state", done ? "✓ Cámara completada — " + body.title33 : locked ? "🔒 Completa la cámara anterior" : (pct > 0 ? "En curso · " + pct + "%" : "Toca para entrar")));

    if (!locked) {
      const open = () => {
        if (body.kind === "grades" && !done) go("hall");
        else openBodyModal(body, done);
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    }
    return card;
  }

  function openBodyModal(body, done) {
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("div", "modal-type", body.range + " · " + (done ? body.badge.symbol + " " + body.badge.name : "Cámara en curso")));
    card.appendChild(el("h2", "modal-title", body.name));
    card.appendChild(el("p", "success-text", body.description));

    const obj = el("div", "objectives");
    obj.appendChild(el("h3", "journal-section", "Objetivos de aprendizaje"));
    body.objectives.forEach((o) => obj.appendChild(el("p", "objective", "◦ " + o)));
    card.appendChild(obj);

    card.appendChild(el("p", "neuro-note", "🧠 " + body.neuro));

    const degs = el("div", "degree-list");
    body.degrees.forEach((d) => degs.appendChild(el("span", "degree-pill", d)));
    card.appendChild(degs);

    if (!done && body.kind === "lesson") {
      const btn = el("button", "btn btn-gold btn-big", "Entrar a la lección insignia");
      btn.addEventListener("click", () => openLesson(body));
      card.appendChild(btn);
    } else if (done) {
      card.appendChild(el("p", "reward", "Cámara completada — " + body.title33));
    }

    const close = el("button", "btn btn-ghost", "Volver al Sendero");
    close.addEventListener("click", closeModal);
    card.appendChild(close);
    $("#modal").classList.remove("hidden");
  }

  function openLesson(body) {
    const lesson = body.lesson;
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title", lesson.title));
    card.appendChild(el("div", "modal-type", typeLabel(lesson.type)));
    card.appendChild(narrative(lesson.narrative, true));

    const onDone = (journalText) => {
      if (journalText !== undefined) {
        state.journal.push({ at: Date.now(), title: lesson.title, text: journalText });
      }
      completeBody(body, lesson);
    };

    if (lesson.type === "enigma") card.appendChild(lessonEnigma(lesson, onDone));
    if (lesson.type === "dilema") card.appendChild(lessonDilema(lesson, onDone));
    if (lesson.type === "reflexion") card.appendChild(reflectionArea(lesson.prompt, lesson.minChars, (t) => onDone(t), "Sellar la lección"));

    const close = el("button", "btn btn-ghost", "Retirarse por ahora");
    close.addEventListener("click", closeModal);
    card.appendChild(close);
    $("#modal").classList.remove("hidden");
  }

  function lessonEnigma(lesson, onDone) {
    const wrap = el("div", "challenge");
    const form = el("form", "form-row");
    const input = el("input", "input");
    input.type = "text";
    input.placeholder = "Tu respuesta…";
    const btn = el("button", "btn btn-gold", "Responder");
    btn.type = "submit";
    form.append(input, btn);
    const feedback = el("p", "feedback", "");
    let tries = 0;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (matchesAnswer(input.value, lesson.answerKeys)) onDone();
      else {
        tries++;
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
        feedback.textContent = tries >= 2 ? "Pista: " + lesson.hint : "Aún no. Escucha de nuevo el enigma: se describe a sí mismo.";
      }
    });
    wrap.append(form, feedback);
    return wrap;
  }

  function lessonDilema(lesson, onDone) {
    const wrap = el("div", "challenge");
    wrap.appendChild(el("p", "prompt", lesson.prompt));
    const list = el("div", "options");
    lesson.options.forEach((opt) => {
      const btn = el("button", "btn btn-option", opt.label);
      btn.addEventListener("click", () => {
        list.querySelectorAll("button").forEach((b) => (b.disabled = true));
        btn.classList.add("chosen");
        wrap.appendChild(el("p", "teaching", opt.teaching));
        const cont = el("button", "btn btn-gold", "Sellar la lección");
        cont.addEventListener("click", () => onDone());
        wrap.appendChild(cont);
      });
      list.appendChild(btn);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function completeBody(body, lesson) {
    state.bodiesDone[body.id] = true;
    addLight(lesson ? lesson.reward : 5);
    save();

    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title gold", body.badge.symbol + " Insignia conquistada"));
    if (lesson) card.appendChild(el("p", "success-text", lesson.success));
    card.appendChild(el("div", "gauge-seal", body.badge.symbol + " " + body.badge.name + " · " + body.title33));
    card.appendChild(el("p", "reward", "+" + (lesson ? lesson.reward : 5) + " de Luz"));
    const btn = el("button", "btn btn-gold", "Volver al Sendero");
    btn.addEventListener("click", () => { closeModal(); render(); });
    card.appendChild(btn);
  }

  /* ============================================================
     GIMNASIO NEURONAL — repaso por recuperación activa
     ============================================================ */

  function openGym() {
    const G = D.gym;
    const questions = shuffled(G.bank).slice(0, 3);
    let index = 0;
    let correct = 0;

    const card = $("#modal-card");

    function renderQuestion() {
      card.innerHTML = "";
      card.appendChild(el("h2", "modal-title", G.title));
      if (index === 0) card.appendChild(el("p", "muted small", G.intro));
      card.appendChild(el("div", "modal-type", "Repetición " + (index + 1) + " de 3 · mejor racha: " + state.gymBest));
      const q = questions[index];
      card.appendChild(el("p", "prompt", q.q));
      const opts = el("div", "options");
      q.options.forEach((o, i) => {
        const btn = el("button", "btn btn-option", o);
        btn.addEventListener("click", () => {
          opts.querySelectorAll("button").forEach((b) => (b.disabled = true));
          const ok = i === q.answer;
          btn.classList.add(ok ? "chosen" : "rejected");
          if (!ok) opts.children[q.answer].classList.add("chosen");
          if (ok) { correct++; addLight(1); }
          const next = el("button", "btn btn-gold", index < questions.length - 1 ? "Siguiente repetición" : "Ver resultado");
          next.addEventListener("click", () => { index++; index < questions.length ? renderQuestion() : renderResult(); });
          card.appendChild(next);
        });
        opts.appendChild(btn);
      });
      card.appendChild(opts);
      const close = el("button", "btn btn-ghost", "Salir del gimnasio");
      close.addEventListener("click", closeModal);
      card.appendChild(close);
    }

    function renderResult() {
      if (correct > state.gymBest) { state.gymBest = correct; save(); }
      card.innerHTML = "";
      card.appendChild(el("h2", "modal-title gold", correct === 3 ? "🧠 Sinapsis de oro" : "Sesión registrada"));
      card.appendChild(el("p", "success-text", "Aciertos: " + correct + " de 3." + (correct === 3 ? " La memoria que se recupera, se queda." : " Fallar recordando también fortalece: vuelve mañana.")));
      card.appendChild(el("p", "neuro-note", "🧠 " + G.note));
      const again = el("button", "btn btn-gold", "Otra serie");
      again.addEventListener("click", openGym);
      const close = el("button", "btn btn-ghost", "Cerrar");
      close.addEventListener("click", closeModal);
      card.append(again, close);
    }

    renderQuestion();
    $("#modal").classList.remove("hidden");
  }

  /* ============================================================
     SALAS DE GRADO Y PUERTAS (retos del Templo)
     ============================================================ */

  function renderHall() {
    const grade = currentGrade();
    const scene = el("section", "scene scene-hall");

    // Inmersión: columnas a los flancos y emblema del grado como marca de agua
    scene.appendChild(el("div", "pillar pillar-left", '<div class="pillar-capital"></div><div class="pillar-shaft"></div><div class="pillar-base"></div><div class="pillar-letter">B</div>'));
    scene.appendChild(el("div", "pillar pillar-right", '<div class="pillar-capital"></div><div class="pillar-shaft"></div><div class="pillar-base"></div><div class="pillar-letter">J</div>'));
    scene.appendChild(el("div", "hall-watermark", gradeEmblem(grade.id)));

    const head = el("div", "hall-head");
    head.appendChild(el("div", "hall-emblem", gradeEmblem(grade.id)));
    head.appendChild(el("div", "grade-badge", grade.symbol + " " + grade.name + " · " + grade.column));
    head.appendChild(el("h1", "title-main", grade.hall));
    scene.appendChild(head);
    scene.appendChild(narrative(grade.intro));

    const doorsWrap = el("div", "doors");
    grade.doors.forEach((door, i) => {
      const opened = !!state.opened[door.id];
      const locked = i > 0 && !state.opened[grade.doors[i - 1].id];
      doorsWrap.appendChild(doorCard(door, i + 1, opened, locked));
    });
    scene.appendChild(doorsWrap);

    const allOpen = grade.doors.every((d) => state.opened[d.id]);
    if (allOpen) {
      const btn = el("button", "btn btn-gold btn-big", "Pedir el paso ▸ " + (state.gradeIndex < D.grades.length - 1 ? D.grades[state.gradeIndex + 1].name : "Ceremonia final de la Azul"));
      btn.addEventListener("click", () => go("ceremony"));
      scene.appendChild(btn);
    }

    const back = el("button", "btn btn-ghost", "◂ Volver al Sendero");
    back.addEventListener("click", () => go("campus"));
    scene.appendChild(back);

    scene.appendChild(el("div", "floor", ""));
    root.appendChild(scene);
  }

  function doorCard(door, num, opened, locked) {
    const card = el("div", "door" + (opened ? " door-open" : "") + (locked ? " door-locked" : ""));
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", locked ? "-1" : "0");
    card.setAttribute("aria-label", door.title + (locked ? " (cerrada)" : opened ? " (abierta)" : ""));

    const frame = el("div", "door-frame");
    const glyph = { enigma: "❖", reflexion: "✎", dilema: "⚖" }[door.type] || "◆";
    frame.appendChild(el("div", "door-leaf", '<span class="door-num">' + roman(num) + '</span><span class="door-glyph">' + glyph + "</span>"));
    card.appendChild(frame);
    card.appendChild(el("div", "door-title", door.title));
    card.appendChild(el("div", "door-type", typeLabel(door.type)));
    if (opened) card.appendChild(el("div", "door-state open", "✓ Abierta"));
    else if (locked) card.appendChild(el("div", "door-state", "🔒 Abre la puerta anterior"));
    else card.appendChild(el("div", "door-state ready", "Toca para enfrentar el reto"));

    if (!locked && !opened) {
      const openIt = () => openChallenge(door);
      card.addEventListener("click", openIt);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIt(); } });
    }
    return card;
  }

  function typeLabel(type) {
    return { enigma: "❖ Enigma", reflexion: "✎ Reflexión", dilema: "⚖ Dilema simbólico" }[type] || type;
  }

  function roman(n) { return ["I", "II", "III", "IV", "V"][n - 1] || n; }

  function openChallenge(door) {
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title", door.title));
    card.appendChild(el("div", "modal-type", typeLabel(door.type)));
    card.appendChild(narrative(door.narrative, true));

    if (door.type === "enigma") card.appendChild(enigmaBody(door));
    if (door.type === "reflexion") card.appendChild(reflexionBody(door));
    if (door.type === "dilema") card.appendChild(dilemaBody(door));

    const close = el("button", "btn btn-ghost", "Retirarse por ahora");
    close.addEventListener("click", closeModal);
    card.appendChild(close);

    $("#modal").classList.remove("hidden");
  }

  function enigmaBody(door) {
    const wrap = el("div", "challenge");
    const form = el("form", "form-row");
    const input = el("input", "input");
    input.type = "text";
    input.placeholder = "Tu respuesta…";
    input.setAttribute("aria-label", "Respuesta al enigma");
    const btn = el("button", "btn btn-gold", "Responder");
    btn.type = "submit";
    form.append(input, btn);

    const feedback = el("p", "feedback", "");
    let tries = 0;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (matchesAnswer(input.value, door.answerKeys)) {
        completeDoor(door);
      } else {
        tries++;
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
        feedback.textContent = tries >= 2
          ? "Pista: " + door.hint
          : "La puerta permanece cerrada. Piensa de nuevo: el símbolo dice más de lo que nombra.";
      }
    });

    wrap.append(form, feedback);
    return wrap;
  }

  function reflexionBody(door) {
    return reflectionArea(door.prompt, door.minChars, (text) => {
      state.journal.push({ at: Date.now(), title: door.title, text });
      completeDoor(door);
    }, "Sellar la reflexión");
  }

  function reflectionArea(prompt, minChars, onDone, ctaLabel) {
    const wrap = el("div", "challenge");
    wrap.appendChild(el("p", "prompt", prompt));
    const ta = el("textarea", "textarea");
    ta.rows = 6;
    ta.placeholder = "Escribe con honestidad; esto formará parte de tu expediente…";
    ta.setAttribute("aria-label", "Espacio de reflexión");
    const counter = el("p", "counter", "0 / " + minChars + " caracteres para sellar");
    const btn = el("button", "btn btn-gold", ctaLabel || "Continuar");
    btn.disabled = true;

    ta.addEventListener("input", () => {
      const len = ta.value.trim().length;
      counter.textContent = Math.min(len, 9999) + " / " + minChars + " caracteres para sellar";
      btn.disabled = len < minChars;
      counter.classList.toggle("done", len >= minChars);
    });
    btn.addEventListener("click", () => onDone(ta.value.trim()));

    wrap.append(ta, counter, btn);
    return wrap;
  }

  function dilemaBody(door) {
    const wrap = el("div", "challenge");
    wrap.appendChild(el("p", "prompt", door.prompt));
    const list = el("div", "options");
    door.options.forEach((opt) => {
      const btn = el("button", "btn btn-option", opt.label);
      btn.addEventListener("click", () => {
        list.querySelectorAll("button").forEach((b) => (b.disabled = true));
        btn.classList.add("chosen");
        wrap.appendChild(el("p", "teaching", opt.teaching));
        const cont = el("button", "btn btn-gold", "Cruzar la puerta");
        cont.addEventListener("click", () => completeDoor(door));
        wrap.appendChild(cont);
      });
      list.appendChild(btn);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function completeDoor(door) {
    state.opened[door.id] = true;
    addLight(door.reward || 1);
    if (door.voice && !state.voices.includes(door.voice)) state.voices.push(door.voice);
    save();

    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title gold", "✦ La puerta se abre"));
    card.appendChild(el("p", "success-text", door.success));
    card.appendChild(el("p", "reward", "+" + (door.reward || 1) + " de Luz"));

    if (door.voice && D.voices[door.voice]) {
      const v = D.voices[door.voice];
      const voice = el("div", "voice-card");
      voice.appendChild(el("div", "voice-tag", "✧ Voz del Oriente revelada"));
      voice.appendChild(el("p", "voice-quote", "«" + v.quote + "»"));
      voice.appendChild(el("p", "voice-author", "— " + v.author + ", " + v.role));
      card.appendChild(voice);
    }

    const btn = el("button", "btn btn-gold", "Continuar el camino");
    btn.addEventListener("click", () => { closeModal(); render(); });
    card.appendChild(btn);
  }

  function closeModal() {
    $("#modal").classList.add("hidden");
  }

  /* ============================================================
     CEREMONIAS Y FINAL
     ============================================================ */

  function renderCeremony() {
    const grade = currentGrade();
    const cer = grade.ceremony;
    const isLast = state.gradeIndex >= D.grades.length - 1;

    const scene = el("section", "scene scene-ceremony");
    scene.appendChild(el("h1", "title-main", cer.title));
    scene.appendChild(narrative(cer.lines));

    let knocks = 0;
    const knockZone = el("div", "knock-zone");
    knockZone.setAttribute("role", "button");
    knockZone.setAttribute("tabindex", "0");
    const dots = el("div", "knock-dots", "○ ○ ○");
    knockZone.appendChild(el("div", "knock-door"));
    knockZone.appendChild(dots);
    knockZone.appendChild(el("p", "muted small", "Golpea la puerta tres veces"));

    const oathWrap = el("div", "oath hidden");
    oathWrap.appendChild(el("p", "oath-text", "«" + cer.oath + "»"));
    const oathBtn = el("button", "btn btn-gold btn-big", isLast ? "Cerrar la Masonería Azul" : "Prestar juramento y ascender");
    oathBtn.addEventListener("click", () => {
      addLight(2);
      if (isLast) {
        state.bodiesDone.azul = true;
        save();
        go("campus");
      } else {
        state.gradeIndex++;
        save();
        go("hall");
      }
    });
    oathWrap.appendChild(oathBtn);

    const doKnock = () => {
      if (knocks >= 3) return;
      knocks++;
      knockZone.classList.remove("knocked");
      void knockZone.offsetWidth;
      knockZone.classList.add("knocked");
      dots.textContent = "●".repeat(knocks) + (knocks < 3 ? " " + "○ ".repeat(3 - knocks).trim() : "");
      if (knocks === 3) setTimeout(() => oathWrap.classList.remove("hidden"), 400);
    };
    knockZone.addEventListener("click", doKnock);
    knockZone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doKnock(); } });

    scene.append(knockZone, oathWrap);
    root.appendChild(scene);
  }

  function renderFinale() {
    const scene = el("section", "scene scene-finale");
    scene.appendChild(el("div", "portal-symbol big-eye", symbolEye()));
    scene.appendChild(el("h1", "title-main", D.finale.title));
    scene.appendChild(narrative(D.finale.lines));

    // Perfil de miembro: la piedra del hermano en la catedral global
    const card = el("div", "member-card");
    card.appendChild(el("div", "member-name", escapeHTML(state.name || "Buscador")));
    card.appendChild(el("div", "member-title", (memberTitle() || "Maestro Masón") + " · " + D.lodge.name));
    if (state.boveda) card.appendChild(el("p", "member-boveda", escapeHTML(state.boveda)));
    const badges = el("div", "member-badges");
    D.bodies.forEach((b) => {
      if (state.bodiesDone[b.id]) badges.appendChild(el("span", "degree-pill badge-pill", b.badge.symbol + " " + b.badge.name));
    });
    card.appendChild(badges);
    card.appendChild(el("p", "member-stats", "☀ " + state.light + " de Luz · ✧ " + state.voices.length + "/9 Voces · 🧠 racha " + state.gymBest + "/3"));
    scene.appendChild(card);

    scene.appendChild(el("h3", "journal-section", D.finale.networkTitle));
    scene.appendChild(el("p", "success-text", D.finale.networkText));
    scene.appendChild(el("p", "vitriol", D.finale.signature));

    const row = el("div", "form-row center");
    const dl = el("button", "btn btn-gold", "⬇ Expediente completo");
    dl.addEventListener("click", downloadExpediente);
    const journalBtn = el("button", "btn", "Abrir mi Diario");
    journalBtn.addEventListener("click", openJournal);
    const gymBtn = el("button", "btn", "🧠 Gimnasio Neuronal");
    gymBtn.addEventListener("click", openGym);
    const againBtn = el("button", "btn btn-ghost", "Recorrer el Templo de nuevo");
    againBtn.addEventListener("click", resetJourney);
    row.append(dl, journalBtn, gymBtn, againBtn);
    scene.appendChild(row);
    root.appendChild(scene);
  }

  /* ============================================================
     DIARIO, TABLA DE TRAZAR Y ARRANQUE
     ============================================================ */

  function openJournal() {
    const box = $("#journal-entries");
    box.innerHTML = "";
    if (!state.journal.length && !state.voices.length) {
      box.appendChild(el("p", "muted", "Aún no has sellado ninguna reflexión."));
    }
    state.journal.forEach((entry) => {
      const item = el("div", "journal-entry");
      item.appendChild(el("h3", null, escapeHTML(entry.title)));
      item.appendChild(el("p", "journal-date", new Date(entry.at).toLocaleString("es")));
      item.appendChild(el("p", "journal-text", escapeHTML(entry.text)));
      box.appendChild(item);
    });
    if (state.voices.length) {
      box.appendChild(el("h3", "journal-section", "✧ Voces del Oriente reveladas"));
      state.voices.forEach((id) => {
        const v = D.voices[id];
        if (!v) return;
        const item = el("div", "journal-entry");
        item.appendChild(el("p", "voice-quote", "«" + v.quote + "»"));
        item.appendChild(el("p", "voice-author", "— " + v.author + ", " + v.role));
        box.appendChild(item);
      });
    }
    $("#journal").classList.remove("hidden");
  }

  function openTabla() {
    const c = D.caballete;
    const box = $("#tabla-content");
    box.innerHTML = "";
    box.appendChild(el("h2", "modal-title", c.title));
    box.appendChild(el("p", "tabla-intro", c.intro));

    const tri = el("div", "tabla-triangle", symbolTriangle());
    box.appendChild(tri);

    c.pillars.forEach((p, i) => {
      const pill = el("div", "tabla-pillar");
      pill.appendChild(el("h3", null, (i + 1) + " · " + p.title + ' <span class="pillar-sub">' + p.sub + "</span>"));
      pill.appendChild(el("p", null, p.text));
      box.appendChild(pill);
    });

    box.appendChild(el("p", "tabla-center", "△ " + c.center));
    box.appendChild(el("p", "tabla-closing", c.closing));
    $("#tabla").classList.remove("hidden");
  }

  function resetJourney() {
    if (!confirm("¿Reiniciar el viaje? Tu Diario, tu Expediente y tu Luz volverán a cero.")) return;
    const audio = state.audio; // la atmósfera elegida sobrevive al reinicio
    AudioEngine.stop();
    state = defaultState();
    state.audio = audio;
    state.audio.channel = "off";
    save();
    render();
  }

  function gradeEmblem(gradeId) {
    if (gradeId === "aprendiz") return symbolSquareCompass();
    if (gradeId === "companero") return symbolBlazingStar();
    return symbolEye();
  }

  function symbolSquareCompass() {
    return (
      '<svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M60 18 L24 92 M60 18 L96 92" />' +
      '<circle cx="60" cy="18" r="5" fill="currentColor" />' +
      '<path d="M30 66 L60 96 L90 66" />' +
      "</g>" +
      '<text x="60" y="66" text-anchor="middle" font-size="22" fill="currentColor" font-family="Cinzel, serif">G</text>' +
      "</svg>"
    );
  }

  function symbolBlazingStar() {
    // Estrella flamígera de cinco puntas con la G al centro
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 52 : 21;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push((60 + r * Math.cos(a)).toFixed(1) + "," + (62 + r * Math.sin(a)).toFixed(1));
    }
    return (
      '<svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true">' +
      '<polygon points="' + pts.join(" ") + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" />' +
      '<text x="60" y="70" text-anchor="middle" font-size="20" fill="currentColor" font-family="Cinzel, serif">G</text>' +
      "</svg>"
    );
  }

  function symbolEye() {
    return (
      '<svg viewBox="0 0 120 90" width="130" height="98" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M60 10 L15 82 L105 82 Z" />' +
      '<path d="M38 58 Q60 42 82 58 Q60 74 38 58 Z" />' +
      '<circle cx="60" cy="58" r="6" fill="currentColor" />' +
      "</g></svg>"
    );
  }

  function symbolTriangle() {
    return (
      '<svg viewBox="0 0 200 150" width="220" height="165" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">' +
      '<path d="M100 12 L14 138 L186 138 Z" />' +
      "</g>" +
      '<text x="100" y="34" text-anchor="middle" font-size="11" fill="currentColor" font-family="Cinzel, serif">1 ME EDUCO</text>' +
      '<text x="158" y="132" text-anchor="middle" font-size="11" fill="currentColor" font-family="Cinzel, serif">2 TRABAJO</text>' +
      '<text x="44" y="132" text-anchor="middle" font-size="11" fill="currentColor" font-family="Cinzel, serif">3 AYUDO</text>' +
      '<text x="100" y="100" text-anchor="middle" font-size="9" fill="currentColor" font-family="Cinzel, serif" opacity="0.8">IA COMO</text>' +
      '<text x="100" y="112" text-anchor="middle" font-size="9" fill="currentColor" font-family="Cinzel, serif" opacity="0.8">INFRAESTRUCTURA</text>' +
      "</svg>"
    );
  }

  function generateStars() {
    const holder = $("#stars");
    for (let i = 0; i < 70; i++) {
      const s = el("span", "star");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 6) + "s";
      s.style.transform = "scale(" + (0.4 + Math.random()) + ")";
      holder.appendChild(s);
    }
  }

  /* ---------- Arranque ---------- */

  $("#btn-journal").addEventListener("click", openJournal);
  $("#btn-tabla").addEventListener("click", openTabla);
  $("#btn-gym").addEventListener("click", openGym);
  $("#btn-audio").addEventListener("click", openAudio);
  $("#btn-map").addEventListener("click", openMap);

  // El navegador exige un gesto del usuario para iniciar audio:
  // si había una atmósfera elegida, se reanuda en la primera interacción.
  const resumeAudio = () => {
    if (state.audio.channel !== "off" && AudioEngine.current === "off") {
      AudioEngine.play(state.audio.channel);
    }
    document.removeEventListener("pointerdown", resumeAudio);
  };
  document.addEventListener("pointerdown", resumeAudio);
  $("#journal-close").addEventListener("click", () => $("#journal").classList.add("hidden"));
  $("#tabla-close").addEventListener("click", () => $("#tabla").classList.add("hidden"));
  $("#btn-reset").addEventListener("click", resetJourney);
  document.querySelectorAll(".modal-backdrop").forEach((b) =>
    b.addEventListener("click", () => b.parentElement.classList.add("hidden"))
  );

  generateStars();
  render();
})();
