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
      label: "Books",
      value: Object.keys(data.books || {}).length,
      border: "#ec4899",
      color: "#f472b6",
      href: "./books.html",
    },
    {
      label: "Chapters",
      value: Object.values(data.books).reduce((sum, b) => sum + (b.chapters?.length ?? 0), 0),
      border: "#059669",
      color: "#34d399",
      href: "./books.html",
    },
    {
      label: "Characters",
      value: data.characters.human.length + data.characters.polyan.length,
      border: "#7c3aed",
      color: "#a78bfa",
      href: "./characters.html",
    },
    {
      label: "Polyan Species",
      value: (data.polyans?.caste_system?.length ?? 0) + (data.polyans?.energy ? Object.keys(data.polyans.energy).length : 0) + (data.polyans?.sensors ? Object.keys(data.polyans.sensors).length : 0) + Object.keys(data.polyans?.overview || {}).length,
      border: "#8b5cf6",
      color: "#c4b5fd",
      href: "./polyans.html",
    },
    {
      label: "World Facts",
      value: (data.world?.geography?.length ?? 0) + Object.keys(data.world?.physics || {}).length + (data.world?.source_colors?.length ?? 0),
      border: "#0ea5e9",
      color: "#38bdf8",
      href: "./world.html",
    },
    {
      label: "Flora/Fauna",
      value: (data.flora_fauna?.fauna?.length ?? 0) + (data.flora_fauna?.flora?.length ?? 0) + (data.flora_fauna?.crystals?.length ?? 0),
      border: "#22c55e",
      color: "#4ade80",
      href: "./flora-fauna.html",
    },
    {
      label: "Places",
      value: data.settings.earth.length + data.settings.spheria.length,
      border: "#2563eb",
      color: "#60a5fa",
      href: "./settings.html",
    },
    {
      label: "Factions",
      value: data.factions.length,
      border: "#d97706",
      color: "#fbbf24",
      href: "./factions.html",
    },
    {
      label: "Items",
      value: data.objects.length,
      border: "#dc2626",
      color: "#f87171",
      href: "./items.html",
    },
    {
      label: "Mythos",
      value: Object.values(data.mythos || {}).reduce((sum, v) => sum + (Array.isArray(v) ? v.length : typeof v === "object" ? Object.keys(v).length : 1), 0),
      border: "#f59e0b",
      color: "#fbbf24",
      href: "./mythos.html",
    },
    {
      label: "Timeline Events",
      value: (data.timeline || []).length,
      border: "#a78bfa",
      color: "#c4b5fd",
      href: "./timeline.html",
    },
  ];

  const statsHtml = stats
    .map(
      (s) => `
    <a class="stat-card" href="${s.href}" style="border-top-color:${s.border}">
      <div class="stat-num" style="color:${s.color}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </a>
  `,
    )
    .join("");

  const themesHtml = data.themes
    .map((theme) => `<div class="theme-item">${escapeHtml(theme)}</div>`)
    .join("");

  const plotHtml = Array.isArray(data.overall_plot)
    ? data.overall_plot.map(p => `<p>${escapeHtml(p)}</p>`).join("")
    : `<p>${escapeHtml(data.overall_plot)}</p>`;

  return `
    <div class="overview-layout">
      <div class="overview-body">
        <h3 class="book-section-header" style="margin-top:0">Premise</h3>
        <img src="../images/Background-Light.jpg" alt="Spheria" class="premise-image" />
        <div class="plot-box">
          ${plotHtml}
        </div>
        <h3 class="book-section-header">Themes</h3>
        <div class="themes-box">
          ${themesHtml}
        </div>
      </div>
      <div style="width:200px;flex-shrink:0">
        <h3 class="book-section-header" style="margin-top:0">Stats</h3>
        <div class="overview-stats">
          ${stats.map(s => `
            <a class="stat-card" href="${s.href}" style="border-top-color:${s.border}">
              <div class="stat-num" style="color:${s.color}">${s.value}</div>
              <div class="stat-label">${s.label}</div>
            </a>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function characterCard(c, border) {
  const updates = (c.updates || [])
    .map((u) => `<div class="card-arc">-> ${escapeHtml(u)}</div>`)
    .join("");
  const roleLabel = c.caste_or_role || c.role;
  const rolePill = roleLabel ? `<span class="pill">${escapeHtml(roleLabel)}</span>` : "";
  const fields = [
    c.caste != null ? `<span class="pill">${escapeHtml(c.caste)}</span>` : "",
    c.Legs != null ? `<span class="pill">${escapeHtml(String(c.Legs))} Legs</span>` : c.age != null ? `<span class="pill">${escapeHtml(String(c.age))} years old</span>` : "",
    c.gender != null ? `<span class="pill">${escapeHtml(c.gender)}</span>` : "",
  ].filter(Boolean).join("");
  const fieldRow = fields ? `<div class="pill-row">${fields}</div>` : "";
  return `
    <div class="card" style="border-top:3px solid var(--page-color, ${border})">
      <div class="card-name">${escapeHtml(c.name)}</div>
      <div class="pill-row" style="margin-top:6px;justify-content:space-between;align-items:center">
        <div>${rolePill}</div>
        <div class="card-meta" style="margin:0">Ch.${escapeHtml(c.first_chapter)}</div>
      </div>
      <div class="card-body" style="margin-top:8px">${escapeHtml(c.description)}</div>
      ${fieldRow}
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
    return `<h3 class="book-section-header">${label}</h3><div class="card-grid">${chars.map((c) => characterCard(c, color)).join("")}</div>`;
  }

  return `
    <h3 class="book-section-header">🌍 Human Characters (${characters.human.length})</h3>
    ${section("Major Characters", humanMajor, "#2563eb")}
    ${section("Minor Characters", humanMinor, "#2563eb")}
    <h3 class="book-section-header">🔮 Polyan Characters (${characters.polyan.length})</h3>
    ${section("Major Characters", polyanMajor, "#7c3aed")}
    ${section("Minor Characters", polyanMinor, "#7c3aed")}
  `;
}

function renderHumans(characters) {
  const major = characters.human.filter((c) => c.major);
  const minor = characters.human.filter((c) => !c.major);
  return `
    <h3 class="book-section-header">Major Characters</h3>
    <div class="card-grid">${major.map((c) => characterCard(c, "#2563eb")).join("")}</div>
    <h3 class="book-section-header">Minor Characters</h3>
    <div class="card-grid">${minor.map((c) => characterCard(c, "#2563eb")).join("")}</div>
  `;
}

function renderPolyanCharacters(characters) {
  const major = characters.polyan.filter((c) => c.major);
  const minor = characters.polyan.filter((c) => !c.major);
  return `
    <h3 class="book-section-header">Major Characters</h3>
    <div class="card-grid">${major.map((c) => characterCard(c, "#7c3aed")).join("")}</div>
    <h3 class="book-section-header">Minor Characters</h3>
    <div class="card-grid">${minor.map((c) => characterCard(c, "#7c3aed")).join("")}</div>
  `;
}

function locationCard(item, border) {
  return `
    <div class="card" style="border-top:3px solid var(--page-color, ${border})">
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
    <div class="faction-card" style="border-top:3px solid var(--page-color, ${color})">
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
  return `<div class="info-grid">${objects.filter((o) => isHumanWorld(o.world)).map(objectCard).join("")}</div>`;
}

function renderSpheriaObjects(objects) {
  return `<div class="info-grid">${objects.filter((o) => !isHumanWorld(o.world)).map(objectCard).join("")}</div>`;
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
  const coverImgTag = book.cover
    ? `<img class="book-cover-float" src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.title)} cover" />`
    : "";
  const coverImg = coverImgTag && book.get_link
    ? `<a href="${escapeHtml(book.get_link)}" target="_blank" rel="noopener noreferrer">${coverImgTag}</a>`
    : coverImgTag;
  const synopsis = synopsisBody
    ? `<div class="book-synopsis">${coverImg}${synopsisBody}</div>`
    : '<div class="status-msg">Synopsis coming soon...</div>';
  const chapters = book.chapters.length
    ? renderChapters(book.chapters)
    : `<div class="status-msg">${placeholderMsg}</div>`;
  const getBtn = book.get_link
    ? `<a class="book-get-btn" href="${escapeHtml(book.get_link)}" target="_blank" rel="noopener noreferrer">Get Book</a>`
    : "";
  return `
    <h3 class="book-section-header">Overall Synopsis ${getBtn}</h3>
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
  function bookSeparator(bookKey) {
    const title = books?.[bookKey]?.title ?? bookKey ?? "";
    return `<div class="tl-book-separator"><span class="tl-book-title">${escapeHtml(title)}</span></div>`;
  }
  let currentBook = null;
  let eventNum = 0;
  const parts = [];
  items.forEach((item, idx) => {
    if (item.book !== currentBook) {
      currentBook = item.book;
      parts.push(bookSeparator(currentBook));
    }
    eventNum++;
    const isLast = idx === items.length - 1;
    parts.push(`
    <div class="tl-item">
      <div class="tl-dot">
        <div class="tl-circle">${eventNum}</div>
        ${!isLast ? '<div class="tl-line"></div>' : ""}
      </div>
      <div class="tl-text">
        ${escapeHtml(item.text ?? item)}${bookLabel(item)}
      </div>
    </div>`);
  });
  return `<div class="timeline">${parts.join("")}</div>`;
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
      <div class="info-card">
        <div class="info-title">${escapeHtml(item.name)}</div>
        ${item.image ? `<img class="card-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />` : ""}
        <div class="info-body">${body}</div>
      </div>
    `;
  }).join("")}</div>`;
}

function renderWorldPhysics(world) {
  const physics = world.physics || {};
  const html = Object.keys(physics)
    .map((key) => {
      const node = typeof physics[key] === "object" ? physics[key] : { description: physics[key] };
      const title = node.use ? `${titleFromKey(key)} - ${node.use}` : titleFromKey(key);
      const effectPill = node.effect ? `<div class="pill-row" style="margin-top:6px"><span class="pill">${escapeHtml(node.effect)}</span></div>` : "";
      const notes = node.notes ? `<div class="source-color-trigger">Notes: ${escapeHtml(node.notes)}</div>` : "";
      return `
        <div class="info-card">
          <div class="info-title">${escapeHtml(title)}</div>
          ${effectPill}
          <div class="info-body" style="margin-top:8px">${escapeHtml(node.description)}</div>
          ${notes}
        </div>
      `;
    })
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
  const ov = polyans.overview || {};
  return `
    <div class="info-grid">
      <div class="info-card"><div class="info-title icon-title"><span class="icon">🧬</span>Biology</div><div class="info-body">${escapeHtml(ov.biology)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">⚥</span>Gender</div><div class="info-body">${escapeHtml(ov.gender)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">🏷</span>Naming Convention</div><div class="info-body">${escapeHtml(ov.naming_convention)}</div></div>
    </div>
  `;
}

function renderPolyanCasteSystem(polyans) {
  const cards = (polyans.caste_system || [])
    .map((item) => `
      <div class="info-card">
        <div class="info-title icon-title"><span class="icon">🔷</span>${escapeHtml(item.caste_name)} ${renderLegDots(item.legs)}</div>
        <div class="pill-row"><span class="pill">${escapeHtml(String(item.legs))} Legs</span></div>
        <div class="info-body">${escapeHtml(item.role)}</div>
        ${item.name_suffix ? `<div class="source-color-trigger">Name Suffix: ·${escapeHtml(item.name_suffix)}</div>` : ""}
        <div class="source-color-trigger">Rank: ${escapeHtml(item.social_rank)}</div>
        <div class="source-color-trigger">Behavior: ${escapeHtml(item.behaviors)}</div>
      </div>
    `)
    .join("");
  return `<div class="info-grid">${cards}</div>`;
}

function renderPolyanEnergy(polyans) {
  const energy = polyans.energy || {};
  return `
    <div class="info-grid">
      <div class="info-card"><div class="info-title icon-title"><span class="icon">🍽</span>How They Feed</div><div class="info-body">${escapeHtml(energy.how_they_feed)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">💠</span>Crystal Colors</div><div class="info-body">${escapeHtml(energy.crystal_colors)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">📊</span>Feeding Hierarchy</div><div class="info-body">${escapeHtml(energy.hierarchy_of_feeding)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">🕯</span>Death State</div><div class="info-body">${escapeHtml(energy.death_state)}</div></div>
    </div>
  `;
}

function renderPolyanSensors(polyans) {
  const sensors = polyans.sensors || {};
  return `
    <div class="info-grid">
      <div class="info-card"><div class="info-title icon-title"><span class="icon">📡</span>Description</div><div class="info-body">${escapeHtml(sensors.description)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">🧭</span>Types</div><div class="info-body">${escapeHtml(sensors.types)}</div></div>
      <div class="info-card"><div class="info-title icon-title"><span class="icon">🔱</span>Artifact Sensor</div><div class="info-body">${escapeHtml(sensors.artifact_sensor)}</div></div>
    </div>
  `;
}

function renderMythosGods(mythos) {
  const gods = (mythos.gods || []).map((g) => `
    <div class="info-card">
      <div class="info-title icon-title"><span class="icon">✨</span>${escapeHtml(g.name)} (${escapeHtml(g.color)})</div>
      <div class="info-body">${escapeHtml(g.domain)}</div>
      <div class="object-sig" style="margin-top:8px">Creation Role: ${escapeHtml(g.role_in_creation)}</div>
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
      <div class="info-card">
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
    `<div class="info-card"><div class="info-title icon-title"><span class="icon">📜</span>${escapeHtml(titleFromKey(key))}</div><div class="info-body">${escapeHtml(lumen[key])}</div></div>`
  ).join("");
  return `<div class="info-grid">${html}</div>`;
}

function renderMythosLegends(mythos) {
  const cards = (mythos.legends || []).map((l) =>
    `<div class="object-card"><div class="object-name">${escapeHtml(l.name)}</div><div class="object-body">${escapeHtml(l.description)}</div></div>`
  ).join("");
  return `<div class="object-grid">${cards}</div>`;
}

function renderMythosRituals(mythos) {
  const cards = (mythos.rituals || []).map((r) =>
    `<div class="object-card"><div class="object-name">${escapeHtml(r.name)}</div><div class="object-body">${escapeHtml(r.description)}</div></div>`
  ).join("");
  return `<div class="object-grid">${cards}</div>`;
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
      <div class="info-card">
        <div class="info-title icon-title"><span class="icon">🦴</span>${escapeHtml(item.name)}</div>
        ${item.image ? `<img class="card-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />` : ""}
        <div class="info-body">${escapeHtml(item.description)}</div>
        <div class="source-color-trigger">Behavior: ${escapeHtml(item.behavior)}</div>
        <div class="source-color-trigger">Danger: ${escapeHtml(item.danger_level)}</div>
        <div class="source-color-trigger">Energy Role: ${escapeHtml(item.energy_role)}</div>
      </div>
    `)
    .join("");
  return `<div class="info-grid">${cards}</div>`;
}

function renderFlora(data) {
  const cards = (data.flora || [])
    .map((item) => `
      <div class="info-card">
        <div class="info-title icon-title"><span class="icon">🌿</span>${escapeHtml(item.name)}</div>
        ${item.image ? `<img class="card-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />` : ""}
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
      <div class="source-color-card">
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

async function loadFooter(containerId = "footer-container") {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const response = await fetch("./_includes/footer.html", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    container.innerHTML = await response.text();
  } catch (e) {
    console.warn("Footer failed to load:", e);
  }
}

async function loadNav(containerId = "nav-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch("./_includes/nav.html", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    container.innerHTML = await response.text();
    setActiveNav();

    const hamburger = container.querySelector(".nav-hamburger");
    const navEl = container.querySelector("nav");
    if (hamburger && navEl) {
      hamburger.addEventListener("click", () => {
        const isOpen = navEl.classList.toggle("nav-open");
        hamburger.setAttribute("aria-expanded", String(isOpen));
      });
      navEl.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navEl.classList.remove("nav-open");
          hamburger.setAttribute("aria-expanded", "false");
        });
      });
    }
  } catch (err) {
    console.error("Could not load nav include:", err);
  }
}

async function initPage(pageKey, containerId) {
  try {
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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

    initMobileSubMenus();
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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
    const response = await fetch("../data/Spheria_Wiki.json", { cache: "no-store" });
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

function initMobileSubMenus() {
  document.querySelectorAll(".sub-menu").forEach((menu) => {
    // Don't double-wrap
    if (menu.parentElement.classList.contains("sub-menu-wrapper")) return;
    // Skip menus with no buttons yet (dynamically populated)
    if (!menu.querySelector(".sub-menu-btn")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "sub-menu-wrapper";
    menu.parentNode.insertBefore(wrapper, menu);
    wrapper.appendChild(menu);

    const activeBtn = menu.querySelector(".sub-menu-btn.active");
    const toggle = document.createElement("button");
    toggle.className = "sub-menu-accordion-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = `<span class="sub-menu-active-label">${activeBtn ? activeBtn.textContent.trim() : "Menu"}</span><span class="sub-menu-chevron">▾</span>`;
    wrapper.insertBefore(toggle, menu);

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", (e) => {
      const btn = e.target.closest(".sub-menu-btn");
      if (!btn) return;
      const label = wrapper.querySelector(".sub-menu-active-label");
      if (label) label.textContent = btn.textContent.trim();
      wrapper.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".sub-menu-wrapper.open").forEach((w) => {
      w.classList.remove("open");
      const t = w.querySelector(".sub-menu-accordion-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", initMobileSubMenus);

window.SpheriaWiki = {
  loadNav,
  loadFooter,
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
