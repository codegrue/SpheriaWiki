function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function chapterStyle(perspective) {
  const p = (perspective || "").toLowerCase();
  if (p === "spherian") return { color: "#7c3aed", icon: "\ud83d\udd2e" };
  if (p === "mixed") return { color: "#d97706", icon: "\ud83c\udf13" };
  return { color: "#2563eb", icon: "\ud83c\udf0d" };
}

function isHumanWorld(world) {
  const w = (world || "").toLowerCase();
  return w === "earth" || w === "human" || w === "humans";
}

function renderOverview(data) {
  const stats = [
    {
      label: "Characters",
      value: data.characters.human.length + data.characters.polyan.length,
      border: "#7c3aed",
      color: "#a78bfa",
    },
    {
      label: "Locations",
      value: data.settings.earth.length + data.settings.spheria.length,
      border: "#2563eb",
      color: "#60a5fa",
    },
    {
      label: "Chapters",
      value: data.books.book1.chapters.length,
      border: "#059669",
      color: "#34d399",
    },
    {
      label: "Factions",
      value: data.factions.length,
      border: "#d97706",
      color: "#fbbf24",
    },
    {
      label: "Key Objects",
      value: data.objects.length,
      border: "#dc2626",
      color: "#f87171",
    },
    {
      label: "World Facts",
      value: Object.keys(data.world || {}).length,
      border: "#0ea5e9",
      color: "#38bdf8",
    },
    {
      label: "Polyan Lore",
      value: Object.keys(data.polyans || {}).length,
      border: "#8b5cf6",
      color: "#c4b5fd",
    },
    {
      label: "Mythos",
      value: Object.keys(data.mythos || {}).length,
      border: "#f59e0b",
      color: "#fbbf24",
    },
    {
      label: "Flora/Fauna",
      value: Object.keys(data.flora_fauna || {}).length,
      border: "#22c55e",
      color: "#4ade80",
    },
  ];

  const statsHtml = stats
    .map(
      (s) => `
    <div class="stat-card" style="border-top-color:${s.border}">
      <div class="stat-num" style="color:${s.color}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `,
    )
    .join("");

  const themesHtml = data.themes
    .map((theme) => `<div class="theme-item">${escapeHtml(theme)}</div>`)
    .join("");

  return `
    <div class="plot-box">${escapeHtml(data.overall_plot)}</div>
    <div class="stats-grid">${statsHtml}</div>
    <div class="themes-box">
      <h3 style="color:#60a5fa;margin-top:0;margin-bottom:16px">Themes</h3>
      ${themesHtml}
    </div>
  `;
}

function characterCard(c, border) {
  const updates = (c.updates || [])
    .map((u) => `<div class="card-arc">-> ${escapeHtml(u)}</div>`)
    .join("");
  return `
    <div class="card" style="border-left:4px solid ${border}">
      <div class="card-name">${escapeHtml(c.name)}</div>
      <div class="card-meta">${escapeHtml(c.caste_or_role)} | ${escapeHtml(c.species)} | Ch.${escapeHtml(c.first_chapter)}</div>
      <div class="card-body">${escapeHtml(c.description)}</div>
      ${updates}
    </div>
  `;
}

function renderCharacters(characters) {
  const humanMajor = characters.human.filter((c) => c.major);
  const humanMinor = characters.human.filter((c) => !c.major);
  const polyanMajor = characters.polyan.filter((c) => c.major);
  const polyanMinor = characters.polyan.filter((c) => !c.major);

  function section(label, chars, color) {
    if (!chars.length) return "";
    return `<h4 style="color:${color};margin:12px 0 6px">${label}</h4><div class="card-grid">${chars.map((c) => characterCard(c, color)).join("")}</div>`;
  }

  return `
    <div class="world-header"><span>🌍</span><h3 style="color:#2563eb">Human Characters (${characters.human.length})</h3></div>
    ${section("Major Characters", humanMajor, "#2563eb")}
    ${section("Minor Characters", humanMinor, "#2563eb")}
    <div class="world-header"><span>🔮</span><h3 style="color:#7c3aed">Polyan Characters (${characters.polyan.length})</h3></div>
    ${section("Major Characters", polyanMajor, "#7c3aed")}
    ${section("Minor Characters", polyanMinor, "#7c3aed")}
  `;
}

function renderHumans(characters) {
  const major = characters.human.filter((c) => c.major);
  const minor = characters.human.filter((c) => !c.major);
  return `
    <h4 style="color:#2563eb;margin:12px 0 6px">Major Characters</h4>
    <div class="card-grid">${major.map((c) => characterCard(c, "#2563eb")).join("")}</div>
    <h4 style="color:#6b7280;margin:12px 0 6px">Minor Characters</h4>
    <div class="card-grid">${minor.map((c) => characterCard(c, "#2563eb")).join("")}</div>
  `;
}

function renderPolyanCharacters(characters) {
  const major = characters.polyan.filter((c) => c.major);
  const minor = characters.polyan.filter((c) => !c.major);
  return `
    <h4 style="color:#7c3aed;margin:12px 0 6px">Major Characters</h4>
    <div class="card-grid">${major.map((c) => characterCard(c, "#7c3aed")).join("")}</div>
    <h4 style="color:#6b7280;margin:12px 0 6px">Minor Characters</h4>
    <div class="card-grid">${minor.map((c) => characterCard(c, "#7c3aed")).join("")}</div>
  `;
}

function locationCard(item, border) {
  return `
    <div class="card" style="border-left:4px solid ${border}">
      <div class="card-name">${escapeHtml(item.name)}</div>
      <div class="card-body">${escapeHtml(item.description)}</div>
    </div>
  `;
}

function renderSettings(settings) {
  return `
    <div class="world-header"><span>🌍</span><h3 style="color:#2563eb">Earth (${settings.earth.length})</h3></div>
    <div class="card-grid">${settings.earth.map((s) => locationCard(s, "#2563eb")).join("")}</div>
    <div class="world-header"><span>🔮</span><h3 style="color:#7c3aed">Spheria (${settings.spheria.length})</h3></div>
    <div class="card-grid">${settings.spheria.map((s) => locationCard(s, "#7c3aed")).join("")}</div>
  `;
}

function renderHumanSettings(settings) {
  return `<div class="card-grid">${settings.earth.map((s) => locationCard(s, "#2563eb")).join("")}</div>`;
}

function renderSpheriaSettings(settings) {
  return `<div class="card-grid">${settings.spheria.map((s) => locationCard(s, "#7c3aed")).join("")}</div>`;
}

function factionCard(f, color) {
  return `
    <div class="faction-card" style="border-top:3px solid ${color}">
      <div class="faction-name">${escapeHtml(f.name)}</div>
      <div class="faction-world">${escapeHtml(f.world)}</div>
      <div class="faction-body">${escapeHtml(f.description)}</div>
      <div class="faction-members">Members: ${escapeHtml((f.members || []).join(", "))}</div>
    </div>
  `;
}

function renderFactions(factions) {
  return `<div class="faction-grid">${factions.map((f) => factionCard(f, isHumanWorld(f.world) ? "#2563eb" : "#7c3aed")).join("")}</div>`;
}

function renderHumanFactions(factions) {
  const human = factions.filter((f) => isHumanWorld(f.world));
  return `<div class="faction-grid">${human.map((f) => factionCard(f, "#2563eb")).join("")}</div>`;
}

function renderPolyanFactions(factions) {
  const polyan = factions.filter((f) => !isHumanWorld(f.world));
  return `<div class="faction-grid">${polyan.map((f) => factionCard(f, "#7c3aed")).join("")}</div>`;
}

function objectCard(o) {
  return `
    <div class="object-card">
      <div class="object-name">${escapeHtml(o.name)}</div>
      <div class="object-body">${escapeHtml(o.description)}</div>
      <div class="object-sig">Significance: ${escapeHtml(o.significance)}</div>
    </div>
  `;
}

function renderObjects(objects) {
  return objects.map(objectCard).join("");
}

function renderEarthObjects(objects) {
  return objects.filter((o) => isHumanWorld(o.world)).map(objectCard).join("");
}

function renderSpheriaObjects(objects) {
  return objects.filter((o) => !isHumanWorld(o.world)).map(objectCard).join("");
}

function renderChapters(chapters) {
  return chapters
    .map((ch) => {
      const style = chapterStyle(ch.perspective);
      return `
      <div class="chapter-row" style="border-left:4px solid ${style.color}">
        <div class="ch-header">
          <span class="ch-icon">${style.icon}</span>
          <span class="ch-num" style="color:${style.color}">Ch. ${escapeHtml(ch.number)}</span>
          <span class="ch-title">${escapeHtml(ch.title)}</span>
          <span class="ch-tag" style="background:${style.color}22;color:${style.color}">${escapeHtml(ch.perspective)}</span>
        </div>
        <div class="ch-synopsis">${escapeHtml(ch.synopsis)}</div>
      </div>
    `;
    })
    .join("");
}

function renderBookSection(book, placeholderMsg) {
  const synopsisBody = Array.isArray(book.synopsis)
    ? book.synopsis.map(p => `<p>${escapeHtml(p)}</p>`).join("")
    : book.synopsis
      ? `<p>${escapeHtml(book.synopsis)}</p>`
      : null;
  const synopsis = synopsisBody
    ? `<div class="book-synopsis">${synopsisBody}</div>`
    : '<div class="status-msg">Synopsis coming soon...</div>';
  const chapters = book.chapters.length
    ? renderChapters(book.chapters)
    : `<div class="status-msg">${placeholderMsg}</div>`;
  return `
    <h3 class="book-section-header">Overall Synopsis</h3>
    ${synopsis}
    <h3 class="book-section-header">Chapter Synopses</h3>
    ${chapters}
  `;
}


function renderTimeline(items, books) {
  function bookLabel(item) {
    if (item.chapter == null) return "";
    const shortTitle = books?.[item.book]?.short_title ?? item.book ?? "";
    const label = shortTitle ? `${shortTitle} - Ch. ${item.chapter}` : `Ch. ${item.chapter}`;
    return ` <span class="tl-chapter">${escapeHtml(label)}</span>`;
  }
  return `<div class="timeline">${items
    .map(
      (item, idx) => `
    <div class="tl-item">
      <div class="tl-dot">
        <div class="tl-circle">${idx + 1}</div>
        ${idx < items.length - 1 ? '<div class="tl-line"></div>' : ""}
      </div>
      <div class="tl-text">
        ${escapeHtml(item.text ?? item)}${bookLabel(item)}
      </div>
    </div>
  `,
    )
    .join("")}</div>`;
}

function titleFromKey(key) {
  return String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderLegDots(legs) {
  const count = Math.max(0, Number(legs) || 0);
  const dots = Array.from(
    { length: 7 },
    (_, i) => `<span class="leg-dot${i < count ? " active" : ""}"></span>`,
  ).join("");
  return `<span class="leg-dots" aria-label="${count} legs">${dots}</span>`;
}

function renderWorldGeography(world) {
  return `<div class="info-grid">${(world.geography || []).map((item) => {
    const body = escapeHtml(item.description).replace(
      "see Source Colors for these effects.",
      `<a href="#" class="tab-link" onclick="event.preventDefault();document.querySelector('.sub-menu-btn[data-tab=source-colors]').click()">see Source Colors for these effects.</a>`
    );
    return `
      <div class="info-card" style="border-top-color:#60a5fa">
        <div class="info-title">${escapeHtml(item.name)}</div>
        <div class="info-body">${body}</div>
      </div>
    `;
  }).join("")}</div>`;
}

function renderWorldPhysics(world) {
  const physics = world.physics || {};
  const html = Object.keys(physics)
    .map((key) => `
      <div class="info-card" style="border-top-color:#60a5fa">
        <div class="info-title">${escapeHtml(titleFromKey(key))}</div>
        <div class="info-body">${escapeHtml(physics[key])}</div>
      </div>
    `)
    .join("");
  return `<div class="info-grid">${html}</div>`;
}

function renderWorldSourceColors(world) {
  const html = (world.source_colors || [])
    .map((item) => `
      <div class="source-color-card">
        <div class="source-color-name">${escapeHtml(item.color)}</div>
        <div class="source-color-effect">${escapeHtml(item.effect)}</div>
        <div class="source-color-trigger">Triggered By: ${escapeHtml(item.triggered_by)}</div>
      </div>
    `)
    .join("");
  return `<div class="source-color-grid">${html}</div>`;
}

function renderWorld(world) {
  if (!world) return `<div class="status-msg error">World data is missing.</div>`;
  return renderWorldGeography(world) + renderWorldPhysics(world) + renderWorldSourceColors(world);
}

function renderPolyanOverview(polyans) {
  return `
    <div class="info-grid">
      <div class="info-card" style="border-top-color:#a78bfa"><div class="info-title icon-title"><span class="icon">🧬</span>Biology</div><div class="info-body">${escapeHtml(polyans.biology)}</div></div>
      <div class="info-card" style="border-top-color:#a78bfa"><div class="info-title icon-title"><span class="icon">⚥</span>Gender</div><div class="info-body">${escapeHtml(polyans.gender)}</div></div>
      <div class="info-card" style="border-top-color:#a78bfa"><div class="info-title icon-title"><span class="icon">🏷</span>Naming Convention</div><div class="info-body">${escapeHtml(polyans.naming_convention)}</div></div>
    </div>
  `;
}

function renderPolyanCasteSystem(polyans) {
  const cards = (polyans.caste_system || [])
    .map((item) => `
      <div class="info-card" style="border-top-color:#7c3aed">
        <div class="info-title icon-title"><span class="icon">🔷</span>${escapeHtml(item.caste_name)} (${escapeHtml(String(item.legs))} legs) ${renderLegDots(item.legs)}</div>
        <div class="info-body">${escapeHtml(item.role)}</div>
        <div class="pill-row">
          <span class="pill">Rank: ${escapeHtml(item.social_rank)}</span>
          <span class="pill">Behavior: ${escapeHtml(item.behaviors)}</span>
        </div>
      </div>
    `)
    .join("");
  return `<div class="info-grid">${cards}</div>`;
}

function renderPolyanEnergy(polyans) {
  const energy = polyans.energy || {};
  return `
    <div class="info-grid">
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">🍽</span>How They Feed</div><div class="info-body">${escapeHtml(energy.how_they_feed)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">💠</span>Crystal Colors</div><div class="info-body">${escapeHtml(energy.crystal_colors)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">📊</span>Feeding Hierarchy</div><div class="info-body">${escapeHtml(energy.hierarchy_of_feeding)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">🕯</span>Death State</div><div class="info-body">${escapeHtml(energy.death_state)}</div></div>
    </div>
  `;
}

function renderPolyanSensors(polyans) {
  const sensors = polyans.sensors || {};
  return `
    <div class="info-grid">
      <div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">📡</span>Description</div><div class="info-body">${escapeHtml(sensors.description)}</div></div>
      <div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">🧭</span>Types</div><div class="info-body">${escapeHtml(sensors.types)}</div></div>
      <div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">🔱</span>Artifact Sensor</div><div class="info-body">${escapeHtml(sensors.artifact_sensor)}</div></div>
    </div>
  `;
}

function renderMythosGods(mythos) {
  const gods = (mythos.gods || []).map((g) => `
    <div class="info-card" style="border-top-color:#f59e0b">
      <div class="info-title icon-title"><span class="icon">✨</span>${escapeHtml(g.name)} (${escapeHtml(g.color)})</div>
      <div class="info-body">${escapeHtml(g.domain)}</div>
      <div class="source-color-trigger">Creation Role: ${escapeHtml(g.role_in_creation)}</div>
    </div>
  `).join("");
  return `<div class="info-grid">${gods}</div>`;
}

function renderMythosAfterlife(mythos) {
  const items = Array.isArray(mythos.afterlife) ? mythos.afterlife : [mythos.afterlife];
  const html = items.map((item) => {
    const title = item.name || (item.how_to_reach ? "How To Reach" : item.warning ? "Warning" : "");
    const body = item.description || item.how_to_reach || item.warning || "";
    return `
      <div class="info-card" style="border-top-color:#34d399">
        <div class="info-title">${escapeHtml(title)}</div>
        <div class="info-body">${escapeHtml(body)}</div>
      </div>
    `;
  }).join("");
  return `<div class="info-grid">${html}</div>`;
}

function renderMythosLumen(mythos) {
  const lumen = mythos.lumen_tradition || {};
  const html = Object.keys(lumen).map((key) =>
    `<div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">📜</span>${escapeHtml(titleFromKey(key))}</div><div class="info-body">${escapeHtml(lumen[key])}</div></div>`
  ).join("");
  return `<div class="info-grid">${html}</div>`;
}

function renderMythosLegends(mythos) {
  return (mythos.legends || []).map((l) =>
    `<div class="object-card"><div class="object-name">${escapeHtml(l.name)}</div><div class="object-body">${escapeHtml(l.description)}</div></div>`
  ).join("");
}

function renderMythosRituals(mythos) {
  return (mythos.rituals || []).map((r) =>
    `<div class="object-card"><div class="object-name">${escapeHtml(r.name)}</div><div class="object-body">${escapeHtml(r.description)}</div></div>`
  ).join("");
}

function renderMythos(mythos) {
  if (!mythos) return `<div class="status-msg error">Mythos data is missing.</div>`;
  return `
    <h3 style="color:#f59e0b">👑 Gods</h3>${renderMythosGods(mythos)}
    <h3 style="color:#34d399">🌌 Afterlife</h3>${renderMythosAfterlife(mythos)}
    <h3 style="color:#60a5fa">🔮 Lumen Tradition</h3>${renderMythosLumen(mythos)}
    <h3 style="color:#a78bfa">📖 Legends</h3>${renderMythosLegends(mythos)}
    <h3 style="color:#a78bfa">🕯 Rituals</h3>${renderMythosRituals(mythos)}
  `;
}

function renderFauna(data) {
  const cards = (data.fauna || [])
    .map((item) => `
      <div class="info-card" style="border-top-color:#ef4444">
        <div class="info-title icon-title"><span class="icon">🦴</span>${escapeHtml(item.name)}</div>
        <div class="info-body">${escapeHtml(item.description)}</div>
        <div class="pill-row">
          <span class="pill">Behavior: ${escapeHtml(item.behavior)}</span>
          <span class="pill">Danger: ${escapeHtml(item.danger_level)}</span>
          <span class="pill">Energy Role: ${escapeHtml(item.energy_role)}</span>
        </div>
      </div>
    `)
    .join("");
  return `<div class="info-grid">${cards}</div>`;
}

function renderFlora(data) {
  const cards = (data.flora || [])
    .map((item) => `
      <div class="info-card" style="border-top-color:#22c55e">
        <div class="info-title icon-title"><span class="icon">🌿</span>${escapeHtml(item.name)}</div>
        <div class="info-body">${escapeHtml(item.description)}</div>
        <div class="source-color-trigger">Properties: ${escapeHtml(item.properties)}</div>
        <div class="source-color-trigger">Uses: ${escapeHtml(item.uses)}</div>
      </div>
    `)
    .join("");
  return `<div class="info-grid">${cards}</div>`;
}

function renderCrystals(data) {
  const cards = (data.crystals || [])
    .map((item) => `
      <div class="source-color-card" style="border-left-color:#a78bfa">
        <div class="source-color-name">💎 ${escapeHtml(item.color)} Crystal</div>
        <div class="source-color-effect">${escapeHtml(item.properties)}</div>
        <div class="source-color-trigger">Found In: ${escapeHtml(item.found_in)}</div>
        <div class="source-color-trigger">Significance: ${escapeHtml(item.significance)}</div>
      </div>
    `)
    .join("");
  return `<div class="source-color-grid">${cards}</div>`;
}

function showLoadError(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) {
    el.classList.add("error");
    el.innerHTML = escapeHtml(message);
  }
}

function setActiveNav() {
  const file = (
    location.pathname.split("/").pop() || "overview.html"
  ).toLowerCase();
  document.querySelectorAll("nav a").forEach((a) => {
    const hrefFile = (
      (a.getAttribute("href") || "").split("/").pop() || ""
    ).toLowerCase();
    a.classList.toggle("active", hrefFile === file);
  });
}

async function loadNav(containerId = "nav-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch("/pages/_includes/nav.html", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    container.innerHTML = await response.text();
    setActiveNav();
  } catch (err) {
    console.error("Could not load nav include:", err);
  }
}

async function initPage(pageKey, containerId) {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const container = document.getElementById(containerId);
    if (!container) return;

    if (pageKey === "overview") container.innerHTML = renderOverview(data);
    else if (pageKey === "characters")
      container.innerHTML = renderCharacters(data.characters);
    else if (pageKey === "humans")
      container.innerHTML = renderHumans(data.characters);
    else if (pageKey === "polyan-characters")
      container.innerHTML = renderPolyanCharacters(data.characters);
    else if (pageKey === "settings")
      container.innerHTML = renderSettings(data.settings);
    else if (pageKey === "human-settings")
      container.innerHTML = renderHumanSettings(data.settings);
    else if (pageKey === "spheria-settings")
      container.innerHTML = renderSpheriaSettings(data.settings);
    else if (pageKey === "factions")
      container.innerHTML = renderFactions(data.factions);
    else if (pageKey === "objects")
      container.innerHTML = renderObjects(data.objects);
    else if (pageKey === "chapters")
      container.innerHTML = renderChapters(data.books.book1.chapters);
    else if (pageKey === "timeline")
      container.innerHTML = renderTimeline(data.timeline, data.books);
    else if (pageKey === "world") container.innerHTML = renderWorld(data.world);
    else if (pageKey === "polyans")
      container.innerHTML = renderPolyans(data.polyans);
    else if (pageKey === "mythos")
      container.innerHTML = renderMythos(data.mythos);
    else if (pageKey === "flora-fauna")
      container.innerHTML = renderFloraFauna(data.flora_fauna);
    else container.innerHTML = renderOverview(data);
  } catch (err) {
    showLoadError(
      containerId,
      "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.",
    );
    console.error(err);
  }
}

async function initCharacterTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // Render both tabs
    const humansContainer = document.getElementById("humans-content");
    const polyansContainer = document.getElementById("polyans-content");

    if (humansContainer) {
      humansContainer.innerHTML = renderHumans(data.characters);
    }
    if (polyansContainer) {
      polyansContainer.innerHTML = renderPolyanCharacters(data.characters);
    }

    // Set up tab switching
    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");

        // Update button states
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Update content visibility
        tabContents.forEach((content) => {
          content.classList.remove("active");
        });
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const humansContainer = document.getElementById("humans-content");
    if (humansContainer) {
      humansContainer.classList.add("error");
      humansContainer.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initChapterTabs() {
  const subMenu = document.getElementById("books-sub-menu");
  const tabContentsEl = document.getElementById("books-tab-contents");
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const keys = Object.keys(data.books);

    // Build tab buttons and content divs dynamically
    subMenu.innerHTML = keys
      .map((key, i) => `<button class="sub-menu-btn${i === 0 ? " active" : ""}" data-tab="${key}">📖 ${escapeHtml(data.books[key].title)}</button>`)
      .join("");

    tabContentsEl.innerHTML = keys
      .map((key, i) => `<div id="${key}-content" class="tab-content${i === 0 ? " active" : ""}"></div>`)
      .join("");

    // Render each book
    keys.forEach((key) => {
      document.getElementById(`${key}-content`).innerHTML =
        renderBookSection(data.books[key], "Chapters coming soon...");
    });

    // Set up tab switching
    const tabButtons = subMenu.querySelectorAll(".sub-menu-btn");
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContentsEl.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    if (subMenu) {
      subMenu.innerHTML = "";
    }
    if (tabContentsEl) {
      tabContentsEl.classList.add("error");
      tabContentsEl.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initSettingsTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const humanContainer = document.getElementById("human-content");
    const spheriaContainer = document.getElementById("spheria-content");

    if (humanContainer) humanContainer.innerHTML = renderHumanSettings(data.settings);
    if (spheriaContainer) spheriaContainer.innerHTML = renderSpheriaSettings(data.settings);

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const humanContainer = document.getElementById("human-content");
    if (humanContainer) {
      humanContainer.classList.add("error");
      humanContainer.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initFactionTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const humanContainer = document.getElementById("human-content");
    const polyanContainer = document.getElementById("polyan-content");

    if (humanContainer) humanContainer.innerHTML = renderHumanFactions(data.factions);
    if (polyanContainer) polyanContainer.innerHTML = renderPolyanFactions(data.factions);

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const humanContainer = document.getElementById("human-content");
    if (humanContainer) {
      humanContainer.classList.add("error");
      humanContainer.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initObjectTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const earthContainer = document.getElementById("earth-content");
    const spheriaContainer = document.getElementById("spheria-content");

    if (earthContainer) earthContainer.innerHTML = renderEarthObjects(data.objects);
    if (spheriaContainer) spheriaContainer.innerHTML = renderSpheriaObjects(data.objects);

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const earthContainer = document.getElementById("earth-content");
    if (earthContainer) {
      earthContainer.classList.add("error");
      earthContainer.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initWorldTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const geoContainer = document.getElementById("geography-content");
    const physicsContainer = document.getElementById("physics-content");
    const colorsContainer = document.getElementById("source-colors-content");

    if (geoContainer) geoContainer.innerHTML = renderWorldGeography(data.world);
    if (physicsContainer) physicsContainer.innerHTML = renderWorldPhysics(data.world);
    if (colorsContainer) colorsContainer.innerHTML = renderWorldSourceColors(data.world);

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const geoContainer = document.getElementById("geography-content");
    if (geoContainer) {
      geoContainer.classList.add("error");
      geoContainer.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initMythosTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const tabs = {
      "gods-content": renderMythosGods,
      "afterlife-content": renderMythosAfterlife,
      "lumen-content": renderMythosLumen,
      "legends-content": renderMythosLegends,
      "rituals-content": renderMythosRituals,
    };

    Object.entries(tabs).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = fn(data.mythos);
    });

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const el = document.getElementById("gods-content");
    if (el) {
      el.classList.add("error");
      el.innerHTML = "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initFloraFaunaTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const tabs = {
      "fauna-content": renderFauna,
      "flora-content": renderFlora,
      "crystals-content": renderCrystals,
    };

    Object.entries(tabs).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = fn(data.flora_fauna);
    });

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const el = document.getElementById("fauna-content");
    if (el) {
      el.classList.add("error");
      el.innerHTML = "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

async function initPolyanTabs() {
  try {
    const response = await fetch("/Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const tabs = {
      "overview-content": renderPolyanOverview,
      "caste-content": renderPolyanCasteSystem,
      "energy-content": renderPolyanEnergy,
      "sensors-content": renderPolyanSensors,
    };

    Object.entries(tabs).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = fn(data.polyans);
    });

    const tabButtons = document.querySelectorAll(".sub-menu-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.getAttribute("data-tab");
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-content`).classList.add("active");
      });
    });
  } catch (err) {
    const el = document.getElementById("overview-content");
    if (el) {
      el.classList.add("error");
      el.innerHTML = "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

window.SpheriaWiki = {
  loadNav,
  initPage,
  setActiveNav,
  initCharacterTabs,
  initChapterTabs,
  initSettingsTabs,
  initFactionTabs,
  initObjectTabs,
  initWorldTabs,
  initMythosTabs,
  initPolyanTabs,
  initFloraFaunaTabs,
};
