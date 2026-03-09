function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function chapterStyle(perspective){
  const p = (perspective || "").toLowerCase();
  if(p === "spherian") return { color: "#7c3aed", icon: "\ud83d\udd2e" };
  if(p === "mixed") return { color: "#d97706", icon: "\ud83c\udf13" };
  return { color: "#2563eb", icon: "\ud83c\udf0d" };
}

function isHumanWorld(world){
  const w = (world || "").toLowerCase();
  return w === "earth" || w === "human" || w === "humans";
}

function renderOverview(data){
  const stats = [
    { label: "Characters", value: data.characters.length, border: "#7c3aed", color: "#a78bfa" },
    { label: "Locations", value: data.settings.length, border: "#2563eb", color: "#60a5fa" },
    { label: "Chapters", value: data.chapters.length, border: "#059669", color: "#34d399" },
    { label: "Factions", value: data.factions.length, border: "#d97706", color: "#fbbf24" },
    { label: "Key Objects", value: data.objects.length, border: "#dc2626", color: "#f87171" }
  ];

  const statsHtml = stats.map(s => `
    <div class="stat-card" style="border-top-color:${s.border}">
      <div class="stat-num" style="color:${s.color}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");

  const themesHtml = data.themes.map(theme => `<div class="theme-item">${escapeHtml(theme)}</div>`).join("");

  return `
    <div class="plot-box">${escapeHtml(data.overall_plot)}</div>
    <div class="stats-grid">${statsHtml}</div>
    <div class="themes-box">
      <h3 style="color:#60a5fa;margin-top:0;margin-bottom:16px">Themes</h3>
      ${themesHtml}
    </div>
  `;
}

function renderCharacters(characters){
  const byWorld = {
    Human: characters.filter(c => isHumanWorld(c.world)),
    Spheria: characters.filter(c => c.world === "Spheria")
  };

  function characterCard(c, border){
    const updates = (c.updates || []).map(u => `<div class="card-arc">-> ${escapeHtml(u)}</div>`).join("");
    return `
      <div class="card" style="border-left:4px solid ${border}">
        <div class="card-name">${escapeHtml(c.name)}</div>
        <div class="card-meta">${escapeHtml(c.caste_or_role)} | ${escapeHtml(c.species)} | Ch.${escapeHtml(c.first_chapter)}</div>
        <div class="card-body">${escapeHtml(c.description)}</div>
        ${updates}
      </div>
    `;
  }

  const humanCards = byWorld.Human.map(c => characterCard(c, "#2563eb")).join("");
  const spheriaCards = byWorld.Spheria.map(c => characterCard(c, "#7c3aed")).join("");

  return `
    <div class="world-header"><span>\ud83c\udf0d</span><h3 style="color:#2563eb">Human Characters (${byWorld.Human.length})</h3></div>
    <div class="card-grid">${humanCards}</div>
    <div class="world-header"><span>\ud83d\udd2e</span><h3 style="color:#7c3aed">Polyan Characters (${byWorld.Spheria.length})</h3></div>
    <div class="card-grid">${spheriaCards}</div>
  `;
}

function renderSettings(settings){
  const human = settings.filter(s => isHumanWorld(s.world));
  const spheria = settings.filter(s => s.world === "Spheria");

  function locationCard(item, border){
    return `
      <div class="card" style="border-left:4px solid ${border}">
        <div class="card-name">${escapeHtml(item.name)}</div>
        <div class="card-body">${escapeHtml(item.description)}</div>
      </div>
    `;
  }

  return `
    <div class="world-header"><span>\ud83c\udf0d</span><h3 style="color:#2563eb">Human</h3></div>
    <div class="card-grid">${human.map(s => locationCard(s, "#2563eb")).join("")}</div>
    <div class="world-header"><span>\ud83d\udd2e</span><h3 style="color:#7c3aed">Spheria</h3></div>
    <div class="card-grid">${spheria.map(s => locationCard(s, "#7c3aed")).join("")}</div>
  `;
}

function renderFactions(factions){
  return `<div class="faction-grid">${factions.map(f => `
    <div class="faction-card" style="border-top:3px solid ${isHumanWorld(f.world) ? "#2563eb" : "#7c3aed"}">
      <div class="faction-name">${escapeHtml(f.name)}</div>
      <div class="faction-world">${escapeHtml(f.world)}</div>
      <div class="faction-body">${escapeHtml(f.description)}</div>
      <div class="faction-members">Members: ${escapeHtml((f.members || []).join(", "))}</div>
    </div>
  `).join("")}</div>`;
}

function renderObjects(objects){
  return objects.map(o => `
    <div class="object-card">
      <div class="object-name">${escapeHtml(o.name)}</div>
      <div class="object-body">${escapeHtml(o.description)}</div>
      <div class="object-sig">Significance: ${escapeHtml(o.significance)}</div>
    </div>
  `).join("");
}

function renderChapters(chapters){
  return chapters.map(ch => {
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
  }).join("");
}

function renderTimeline(items){
  return `<div class="timeline">${items.map((item, idx) => `
    <div class="tl-item">
      <div class="tl-dot">
        <div class="tl-circle">${idx + 1}</div>
        ${idx < items.length - 1 ? '<div class="tl-line"></div>' : ""}
      </div>
      <div class="tl-text">${escapeHtml(item)}</div>
    </div>
  `).join("")}</div>`;
}

function showLoadError(containerId, message){
  const el = document.getElementById(containerId);
  if(el){
    el.classList.add("error");
    el.innerHTML = escapeHtml(message);
  }
}

function setActiveNav(){
  const file = (location.pathname.split("/").pop() || "overview.html").toLowerCase();
  document.querySelectorAll("nav a").forEach(a => {
    const hrefFile = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", hrefFile === file);
  });
}

async function initPage(pageKey, containerId){
  try{
    const response = await fetch("./Spheria_Wiki.json", { cache: "no-store" });
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const subtitle = document.getElementById("header-subtitle");
    if(subtitle) subtitle.textContent = `Novel Wiki · by Cody Leet · ${data.chapters.length} Chapters`;

    const container = document.getElementById(containerId);
    if(!container) return;

    if(pageKey === "overview") container.innerHTML = renderOverview(data);
    else if(pageKey === "characters") container.innerHTML = renderCharacters(data.characters);
    else if(pageKey === "settings") container.innerHTML = renderSettings(data.settings);
    else if(pageKey === "factions") container.innerHTML = renderFactions(data.factions);
    else if(pageKey === "objects") container.innerHTML = renderObjects(data.objects);
    else if(pageKey === "chapters") container.innerHTML = renderChapters(data.chapters);
    else if(pageKey === "timeline") container.innerHTML = renderTimeline(data.timeline);
    else container.innerHTML = renderOverview(data);
  }catch(err){
    showLoadError(containerId, "Could not load Spheria_Wiki.json. Run a local web server (npm run dev) and refresh.");
    console.error(err);
  }
}

window.SpheriaWiki = { initPage, setActiveNav };
