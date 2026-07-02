/* ============================================================
   EL TEMPLO — Motor del viaje (v1)
   Máquina de escenas: portal → vestíbulo → cámara de reflexión
   → salas de grado (puertas/retos) → ceremonias → luz final.
   Progreso persistido en localStorage.
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "templo.v1";
  const D = TEMPLE_DATA;

  /* ---------- Estado ---------- */

  const defaultState = () => ({
    scene: "portal",          // portal | vestibulo | camara | hall | ceremony | finale
    name: "",
    gradeIndex: 0,            // índice en D.grades mientras scene = hall/ceremony
    opened: {},               // { doorId: true }
    light: 0,
    journal: [],              // { at, title, text }
    startedAt: null
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
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

  function addLight(points) {
    state.light += points;
    save();
    updateHUD();
    const badge = $("#hud-light");
    if (badge) {
      badge.parentElement.classList.remove("pulse");
      void badge.parentElement.offsetWidth; // reinicia la animación
      badge.parentElement.classList.add("pulse");
    }
  }

  function currentGrade() {
    return D.grades[state.gradeIndex];
  }

  function gradeTitle() {
    if (state.scene === "portal" || state.scene === "vestibulo" || state.scene === "camara") return "Profano";
    if (state.scene === "finale") return "Maestro ∴";
    return currentGrade().name;
  }

  function updateHUD() {
    const hud = $("#hud");
    if (state.scene === "portal") { hud.classList.add("hidden"); return; }
    hud.classList.remove("hidden");
    $("#hud-name").textContent = state.name || "Buscador";
    $("#hud-grade").textContent = gradeTitle();
    $("#hud-light").textContent = state.light;
  }

  /* ---------- Render de escenas ---------- */

  function render() {
    root.innerHTML = "";
    updateHUD();
    switch (state.scene) {
      case "portal":    return renderPortal();
      case "vestibulo": return renderVestibulo();
      case "camara":    return renderCamara();
      case "hall":      return renderHall();
      case "ceremony":  return renderCeremony();
      case "finale":    return renderFinale();
    }
  }

  function go(scene) {
    state.scene = scene;
    save();
    render();
    window.scrollTo(0, 0);
  }

  function narrative(lines) {
    const box = el("div", "narrative");
    lines.forEach((line, i) => {
      const p = el("p", "narrative-line", line);
      p.style.animationDelay = (0.35 * i) + "s";
      box.appendChild(p);
    });
    return box;
  }

  /* --- Portal de entrada --- */

  function renderPortal() {
    const scene = el("section", "scene scene-portal");
    scene.appendChild(el("div", "portal-symbol", symbolSquareCompass()));
    scene.appendChild(el("h1", "title-main", D.intro.title));
    scene.appendChild(narrative(D.intro.lines));

    const btn = el("button", "btn btn-gold btn-big", D.intro.cta);
    btn.addEventListener("click", () => {
      knockEffect(() => go(state.name ? "hall" : "vestibulo"));
    });
    scene.appendChild(btn);

    if (state.name) {
      const note = el("p", "muted small", "Se reconoce tu paso anterior, " + escapeHTML(state.name) + ". La puerta recuerda.");
      scene.appendChild(note);
    }
    root.appendChild(scene);
  }

  /* --- Vestíbulo: nombre simbólico --- */

  function renderVestibulo() {
    const scene = el("section", "scene");
    scene.appendChild(el("h1", "title-main", D.vestibulo.title));
    scene.appendChild(narrative(D.vestibulo.lines));

    const form = el("form", "form-row");
    const input = el("input", "input");
    input.type = "text";
    input.maxLength = 40;
    input.placeholder = D.vestibulo.placeholder;
    input.setAttribute("aria-label", "Nombre simbólico");
    const btn = el("button", "btn btn-gold", D.vestibulo.cta);
    btn.type = "submit";
    form.append(input, btn);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); return; }
      state.name = val;
      state.startedAt = state.startedAt || Date.now();
      save();
      go("camara");
    });
    scene.appendChild(form);
    root.appendChild(scene);
    input.focus();
  }

  /* --- Cámara de Reflexión --- */

  function renderCamara() {
    const scene = el("section", "scene scene-camara");
    scene.appendChild(el("div", "candle", '<div class="flame"></div><div class="wax"></div>'));
    scene.appendChild(el("h1", "title-main", D.camara.title));
    scene.appendChild(narrative(D.camara.lines));

    const area = reflectionArea(D.camara.prompt, D.camara.minChars, (text) => {
      state.journal.push({ at: Date.now(), title: "Testamento del profano", text });
      addLight(D.camara.reward);
      save();
      go("hall");
    }, D.camara.cta);
    scene.appendChild(area);
    root.appendChild(scene);
  }

  /* --- Sala de grado con puertas --- */

  function renderHall() {
    const grade = currentGrade();
    const scene = el("section", "scene scene-hall");

    const head = el("div", "hall-head");
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
      const btn = el("button", "btn btn-gold btn-big", "Pedir el paso ▸ " + (state.gradeIndex < D.grades.length - 1 ? D.grades[state.gradeIndex + 1].name : "La Luz"));
      btn.addEventListener("click", () => go("ceremony"));
      scene.appendChild(btn);
    }

    scene.appendChild(el("div", "floor", ""));
    root.appendChild(scene);
  }

  function doorCard(door, num, opened, locked) {
    const card = el("div", "door" + (opened ? " door-open" : "") + (locked ? " door-locked" : ""));
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", locked ? "-1" : "0");
    card.setAttribute("aria-label", door.title + (locked ? " (cerrada)" : opened ? " (abierta)" : ""));

    const frame = el("div", "door-frame");
    frame.appendChild(el("div", "door-leaf", '<span class="door-num">' + roman(num) + "</span>"));
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

  /* --- Retos (modal) --- */

  function openChallenge(door) {
    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title", door.title));
    card.appendChild(el("div", "modal-type", typeLabel(door.type)));
    card.appendChild(narrative(door.narrative));

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
    ta.placeholder = "Escribe con honestidad; nadie más leerá esto…";
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
        const teach = el("p", "teaching", opt.teaching);
        wrap.appendChild(teach);
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
    save();

    const card = $("#modal-card");
    card.innerHTML = "";
    card.appendChild(el("h2", "modal-title gold", "✦ La puerta se abre"));
    card.appendChild(el("p", "success-text", door.success));
    card.appendChild(el("p", "reward", "+" + (door.reward || 1) + " de Luz"));
    const btn = el("button", "btn btn-gold", "Continuar el camino");
    btn.addEventListener("click", () => { closeModal(); render(); });
    card.appendChild(btn);
  }

  function closeModal() {
    $("#modal").classList.add("hidden");
  }

  /* --- Ceremonia de paso (tres golpes + juramento) --- */

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
    const oathBtn = el("button", "btn btn-gold btn-big", isLast ? "Recibir la Luz" : "Prestar juramento y ascender");
    oathBtn.addEventListener("click", () => {
      addLight(2);
      if (isLast) {
        go("finale");
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
      if (knocks === 3) {
        setTimeout(() => oathWrap.classList.remove("hidden"), 400);
      }
    };
    knockZone.addEventListener("click", doKnock);
    knockZone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doKnock(); } });

    scene.append(knockZone, oathWrap);
    root.appendChild(scene);
  }

  /* --- Final --- */

  function renderFinale() {
    const scene = el("section", "scene scene-finale");
    scene.appendChild(el("div", "portal-symbol big-eye", symbolEye()));
    scene.appendChild(el("h1", "title-main", D.finale.title));
    scene.appendChild(narrative(D.finale.lines.concat([
      "Luz reunida en el viaje: ☀ " + state.light + "."
    ])));
    scene.appendChild(el("p", "vitriol", D.finale.signature));

    const row = el("div", "form-row center");
    const journalBtn = el("button", "btn btn-gold", "Abrir mi Diario");
    journalBtn.addEventListener("click", openJournal);
    const againBtn = el("button", "btn btn-ghost", "Recorrer el Templo de nuevo");
    againBtn.addEventListener("click", resetJourney);
    row.append(journalBtn, againBtn);
    scene.appendChild(row);
    root.appendChild(scene);
  }

  /* --- Diario --- */

  function openJournal() {
    const box = $("#journal-entries");
    box.innerHTML = "";
    if (!state.journal.length) {
      box.appendChild(el("p", "muted", "Aún no has sellado ninguna reflexión."));
    } else {
      state.journal.forEach((entry) => {
        const item = el("div", "journal-entry");
        item.appendChild(el("h3", null, escapeHTML(entry.title)));
        item.appendChild(el("p", "journal-date", new Date(entry.at).toLocaleString("es")));
        item.appendChild(el("p", "journal-text", escapeHTML(entry.text)));
        box.appendChild(item);
      });
    }
    $("#journal").classList.remove("hidden");
  }

  function resetJourney() {
    if (!confirm("¿Reiniciar el viaje? Tu Diario y tu Luz volverán a cero.")) return;
    state = defaultState();
    save();
    render();
  }

  /* --- Efectos y símbolos --- */

  function knockEffect(after) {
    document.body.classList.add("flash");
    setTimeout(() => {
      document.body.classList.remove("flash");
      after();
    }, 450);
  }

  function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function symbolSquareCompass() {
    return (
      '<svg viewBox="0 0 120 120" width="110" height="110" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M60 18 L24 92 M60 18 L96 92" />' +           // compás
      '<circle cx="60" cy="18" r="5" fill="currentColor" />' +
      '<path d="M30 66 L60 96 L90 66" />' +                   // escuadra
      '</g>' +
      '<text x="60" y="66" text-anchor="middle" font-size="22" fill="currentColor" font-family="Cinzel, serif">G</text>' +
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
  $("#journal-close").addEventListener("click", () => $("#journal").classList.add("hidden"));
  $("#btn-reset").addEventListener("click", resetJourney);
  document.querySelectorAll(".modal-backdrop").forEach((b) =>
    b.addEventListener("click", () => b.parentElement.classList.add("hidden"))
  );

  generateStars();
  render();
})();
