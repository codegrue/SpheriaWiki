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
      value: data.characters.length,
      border: "#7c3aed",
      color: "#a78bfa",
    },
    {
      label: "Locations",
      value: data.settings.length,
      border: "#2563eb",
      color: "#60a5fa",
    },
    {
      label: "Chapters",
      value: data.chapters.length,
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
  const byWorld = {
    Human: characters.filter((c) => isHumanWorld(c.world)),
    Spheria: characters.filter((c) => c.world === "Spheria"),
  };

  const humanCards = byWorld.Human.map((c) => characterCard(c, "#2563eb")).join(
    "",
  );
  const spheriaCards = byWorld.Spheria.map((c) =>
    characterCard(c, "#7c3aed"),
  ).join("");

  return `
    <div class="world-header"><span>\ud83c\udf0d</span><h3 style="color:#2563eb">Human Characters (${byWorld.Human.length})</h3></div>
    <div class="card-grid">${humanCards}</div>
    <div class="world-header"><span>\ud83d\udd2e</span><h3 style="color:#7c3aed">Polyan Characters (${byWorld.Spheria.length})</h3></div>
    <div class="card-grid">${spheriaCards}</div>
  `;
}

function renderHumans(characters) {
  const humans = characters.filter((c) => isHumanWorld(c.world));
  const humanCards = humans.map((c) => characterCard(c, "#2563eb")).join("");

  return `<div class="card-grid">${humanCards}</div>`;
}

function renderPolyanCharacters(characters) {
  const polyans = characters.filter((c) => c.world === "Spheria");
  const polyanCards = polyans.map((c) => characterCard(c, "#7c3aed")).join("");

  return `<div class="card-grid">${polyanCards}</div>`;
}

function renderSettings(settings) {
  const human = settings.filter((s) => isHumanWorld(s.world));
  const spheria = settings.filter((s) => s.world === "Spheria");

  function locationCard(item, border) {
    return `
      <div class="card" style="border-left:4px solid ${border}">
        <div class="card-name">${escapeHtml(item.name)}</div>
        <div class="card-body">${escapeHtml(item.description)}</div>
      </div>
    `;
  }

  return `
    <div class="world-header"><span>\ud83c\udf0d</span><h3 style="color:#2563eb">Human</h3></div>
    <div class="card-grid">${human.map((s) => locationCard(s, "#2563eb")).join("")}</div>
    <div class="world-header"><span>\ud83d\udd2e</span><h3 style="color:#7c3aed">Spheria</h3></div>
    <div class="card-grid">${spheria.map((s) => locationCard(s, "#7c3aed")).join("")}</div>
  `;
}

function renderFactions(factions) {
  return `<div class="faction-grid">${factions
    .map(
      (f) => `
    <div class="faction-card" style="border-top:3px solid ${isHumanWorld(f.world) ? "#2563eb" : "#7c3aed"}">
      <div class="faction-name">${escapeHtml(f.name)}</div>
      <div class="faction-world">${escapeHtml(f.world)}</div>
      <div class="faction-body">${escapeHtml(f.description)}</div>
      <div class="faction-members">Members: ${escapeHtml((f.members || []).join(", "))}</div>
    </div>
  `,
    )
    .join("")}</div>`;
}

function renderObjects(objects) {
  return objects
    .map(
      (o) => `
    <div class="object-card">
      <div class="object-name">${escapeHtml(o.name)}</div>
      <div class="object-body">${escapeHtml(o.description)}</div>
      <div class="object-sig">Significance: ${escapeHtml(o.significance)}</div>
    </div>
  `,
    )
    .join("");
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

function renderBook1(chapters) {
  // All current chapters are Book 1
  return renderChapters(chapters);
}

function renderOliviasLog() {
  // Placeholder for Olivia's Log chapters
  return '<div class="status-msg">Olivia\'s Log chapters coming soon...</div>';
}

function renderBook2() {
  // Placeholder for Book 2 chapters
  return '<div class="status-msg">Book 2 chapters coming soon...</div>';
}

function renderTimeline(items) {
  return `<div class="timeline">${items
    .map(
      (item, idx) => `
    <div class="tl-item">
      <div class="tl-dot">
        <div class="tl-circle">${idx + 1}</div>
        ${idx < items.length - 1 ? '<div class="tl-line"></div>' : ""}
      </div>
      <div class="tl-text">${escapeHtml(item)}</div>
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

function renderWorld(world) {
  if (!world)
    return `<div class="status-msg error">World data is missing.</div>`;

  const physics = world.physics || {};
  const physicsHtml = Object.keys(physics)
    .map(
      (key) => `
    <div class="info-card" style="border-top-color:#60a5fa">
      <div class="info-title">${escapeHtml(titleFromKey(key))}</div>
      <div class="info-body">${escapeHtml(physics[key])}</div>
    </div>
  `,
    )
    .join("");

  const sourceColors = (world.source_colors || [])
    .map(
      (item) => `
    <div class="source-color-card">
      <div class="source-color-name">${escapeHtml(item.color)}</div>
      <div class="source-color-effect">${escapeHtml(item.effect)}</div>
      <div class="source-color-trigger">Triggered By: ${escapeHtml(item.triggered_by)}</div>
    </div>
  `,
    )
    .join("");

  return `
    <div class="plot-box"><strong>World Shape:</strong> ${escapeHtml(world.world_shape)}</div>
    <div class="plot-box"><strong>Creation Story:</strong> ${escapeHtml(world.creation_story)}</div>
    <h3 style="color:#60a5fa">Physics</h3>
    <div class="info-grid">${physicsHtml}</div>
    <h3 style="color:#a78bfa">Source Colors</h3>
    <div class="source-color-grid">${sourceColors}</div>
  `;
}

function renderPolyans(polyans) {
  if (!polyans)
    return `<div class="status-msg error">Polyan data is missing.</div>`;

  const casteSystem = (polyans.caste_system || [])
    .map(
      (item) => `
    <div class="info-card" style="border-top-color:#7c3aed">
      <div class="info-title icon-title"><span class="icon">🔷</span>${escapeHtml(item.caste_name)} (${escapeHtml(item.legs)} legs) ${renderLegDots(item.legs)}</div>
      <div class="info-body">${escapeHtml(item.role)}</div>
      <div class="pill-row">
        <span class="pill">Rank: ${escapeHtml(item.social_rank)}</span>
        <span class="pill">Behavior: ${escapeHtml(item.behaviors)}</span>
      </div>
    </div>
  `,
    )
    .join("");

  const energy = polyans.energy || {};
  const sensors = polyans.sensors || {};

  return `
    <div class="polyans-hero">
      <div class="plot-box"><strong>🧬 Biology:</strong> ${escapeHtml(polyans.biology)}</div>
      <div class="plot-box"><strong>⚥ Gender:</strong> ${escapeHtml(polyans.gender)}</div>
      <div class="plot-box"><strong>🏷 Naming Convention:</strong> ${escapeHtml(polyans.naming_convention)}</div>
    </div>
    <h3 style="color:#a78bfa">🔢 Caste System</h3>
    <div class="info-grid">${casteSystem}</div>
    <h3 style="color:#34d399">⚡ Energy</h3>
    <div class="info-grid">
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">🍽</span>How They Feed</div><div class="info-body">${escapeHtml(energy.how_they_feed)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">💠</span>Crystal Colors</div><div class="info-body">${escapeHtml(energy.crystal_colors)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">📊</span>Feeding Hierarchy</div><div class="info-body">${escapeHtml(energy.hierarchy_of_feeding)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">🕯</span>Death State</div><div class="info-body">${escapeHtml(energy.death_state)}</div></div>
    </div>
    <h3 style="color:#60a5fa">🛰 Sensors</h3>
    <div class="info-grid">
      <div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">📡</span>Description</div><div class="info-body">${escapeHtml(sensors.description)}</div></div>
      <div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">🧭</span>Types</div><div class="info-body">${escapeHtml(sensors.types)}</div></div>
      <div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">🔱</span>Artifact Sensor</div><div class="info-body">${escapeHtml(sensors.artifact_sensor)}</div></div>
    </div>
  `;
}

function renderMythos(mythos) {
  if (!mythos)
    return `<div class="status-msg error">Mythos data is missing.</div>`;

  const gods = (mythos.gods || [])
    .map(
      (g) => `
    <div class="info-card" style="border-top-color:#f59e0b">
      <div class="info-title icon-title"><span class="icon">✨</span>${escapeHtml(g.name)} (${escapeHtml(g.color)})</div>
      <div class="info-body">${escapeHtml(g.domain)}</div>
      <div class="source-color-trigger">Creation Role: ${escapeHtml(g.role_in_creation)}</div>
    </div>
  `,
    )
    .join("");

  const legends = (mythos.legends || [])
    .map(
      (l) => `
    <div class="object-card"><div class="object-name">${escapeHtml(l.name)}</div><div class="object-body">${escapeHtml(l.description)}</div></div>
  `,
    )
    .join("");

  const rituals = (mythos.rituals || [])
    .map(
      (r) => `
    <div class="object-card"><div class="object-name">${escapeHtml(r.name)}</div><div class="object-body">${escapeHtml(r.description)}</div></div>
  `,
    )
    .join("");

  const afterlife = mythos.afterlife || {};
  const lumen = mythos.lumen_tradition || {};

  return `
    <h3 style="color:#f59e0b">👑 Gods</h3>
    <div class="info-grid">${gods}</div>
    <h3 style="color:#34d399">🌌 Afterlife</h3>
    <div class="info-grid">
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">🕊</span>${escapeHtml(afterlife.name)}</div><div class="info-body">${escapeHtml(afterlife.description)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">🧭</span>How To Reach</div><div class="info-body">${escapeHtml(afterlife.how_to_reach)}</div></div>
      <div class="info-card" style="border-top-color:#34d399"><div class="info-title icon-title"><span class="icon">⚠</span>Warning</div><div class="info-body">${escapeHtml(afterlife.warning)}</div></div>
    </div>
    <h3 style="color:#60a5fa">🔮 Lumen Tradition</h3>
    <div class="info-grid">
      ${Object.keys(lumen)
        .map(
          (key) =>
            `<div class="info-card" style="border-top-color:#60a5fa"><div class="info-title icon-title"><span class="icon">📜</span>${escapeHtml(titleFromKey(key))}</div><div class="info-body">${escapeHtml(lumen[key])}</div></div>`,
        )
        .join("")}
    </div>
    <h3 style="color:#a78bfa">📖 Legends</h3>
    ${legends}
    <h3 style="color:#a78bfa">🕯 Rituals</h3>
    ${rituals}
  `;
}

function renderFloraFauna(data) {
  if (!data)
    return `<div class="status-msg error">Flora/Fauna data is missing.</div>`;

  const fauna = (data.fauna || [])
    .map(
      (item) => `
    <div class="info-card" style="border-top-color:#ef4444">
      <div class="info-title icon-title"><span class="icon">🦴</span>${escapeHtml(item.name)}</div>
      <div class="info-body">${escapeHtml(item.description)}</div>
      <div class="pill-row">
        <span class="pill">Behavior: ${escapeHtml(item.behavior)}</span>
        <span class="pill">Danger: ${escapeHtml(item.danger_level)}</span>
        <span class="pill">Energy Role: ${escapeHtml(item.energy_role)}</span>
      </div>
    </div>
  `,
    )
    .join("");

  const flora = (data.flora || [])
    .map(
      (item) => `
    <div class="info-card" style="border-top-color:#22c55e">
      <div class="info-title icon-title"><span class="icon">🌿</span>${escapeHtml(item.name)}</div>
      <div class="info-body">${escapeHtml(item.description)}</div>
      <div class="source-color-trigger">Properties: ${escapeHtml(item.properties)}</div>
      <div class="source-color-trigger">Uses: ${escapeHtml(item.uses)}</div>
    </div>
  `,
    )
    .join("");

  const crystals = (data.crystals || [])
    .map(
      (item) => `
    <div class="source-color-card" style="border-left-color:#a78bfa">
      <div class="source-color-name">💎 ${escapeHtml(item.color)} Crystal</div>
      <div class="source-color-effect">${escapeHtml(item.properties)}</div>
      <div class="source-color-trigger">Found In: ${escapeHtml(item.found_in)}</div>
      <div class="source-color-trigger">Significance: ${escapeHtml(item.significance)}</div>
    </div>
  `,
    )
    .join("");

  return `
    <h3 style="color:#ef4444">🦖 Fauna</h3>
    <div class="info-grid">${fauna}</div>
    <h3 style="color:#22c55e">🌱 Flora</h3>
    <div class="info-grid">${flora}</div>
    <h3 style="color:#a78bfa">💠 Crystals</h3>
    <div class="source-color-grid">${crystals}</div>
  `;
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
    const hrefFile = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", hrefFile === file);
  });
}

async function initPage(pageKey, containerId) {
  try {
    const response = await fetch("../Spheria_Wiki.json", { cache: "no-store" });
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
    else if (pageKey === "factions")
      container.innerHTML = renderFactions(data.factions);
    else if (pageKey === "objects")
      container.innerHTML = renderObjects(data.objects);
    else if (pageKey === "chapters")
      container.innerHTML = renderChapters(data.chapters);
    else if (pageKey === "timeline")
      container.innerHTML = renderTimeline(data.timeline);
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
    const response = await fetch("../Spheria_Wiki.json", { cache: "no-store" });
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
  try {
    const response = await fetch("../Spheria_Wiki.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // Render all tabs
    const book1Container = document.getElementById("book1-content");
    const oliviasLogContainer = document.getElementById("olivias-log-content");
    const book2Container = document.getElementById("book2-content");

    if (book1Container) {
      book1Container.innerHTML = renderBook1(data.chapters);
    }
    if (oliviasLogContainer) {
      oliviasLogContainer.innerHTML = renderOliviasLog();
    }
    if (book2Container) {
      book2Container.innerHTML = renderBook2();
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
    const book1Container = document.getElementById("book1-content");
    if (book1Container) {
      book1Container.classList.add("error");
      book1Container.innerHTML =
        "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.";
    }
    console.error(err);
  }
}

window.SpheriaWiki = {
  initPage,
  setActiveNav,
  initCharacterTabs,
  initChapterTabs,
};
