// ========= Toggle “More” / “Show Less” for coursework, skills & projects =========
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Sets up a show-more / show-less toggle for a given list.
   * listSelector:  selector for the <ul>
   * buttonSelector: selector for the associated <button>
   * visibleCount: number of items to show before clamping
   */
  function setupToggle(listSelector, buttonSelector, visibleCount) {
    const list   = document.querySelector(listSelector);
    const button = document.querySelector(buttonSelector);
    if (!list || !button) return; // graceful no-op if markup is missing

    const items = Array.from(list.querySelectorAll("li"));

    // Hide all items after visibleCount by adding .hidden
    const clamp = () => items.forEach((li, i) => {
      if (i >= visibleCount) li.classList.add("hidden");
      else li.classList.remove("hidden");
    });

    // Initial collapsed state
    clamp();
    button.setAttribute("aria-expanded", "false");
    button.textContent = "More";

    // Toggle expanded / collapsed state on click
    button.addEventListener("click", () => {
      const anyHidden = items
        .slice(visibleCount)
        .some(li => li.classList.contains("hidden"));

      if (anyHidden) {
        // Expand: show all items
        items.forEach(li => li.classList.remove("hidden"));
        button.textContent = "Show Less";
        button.setAttribute("aria-expanded", "true");
      } else {
        // Collapse: clamp back to visibleCount
        clamp();
        button.textContent = "More";
        button.setAttribute("aria-expanded", "false");
      }
    });
  } // <-- this closing brace for setupToggle was missing

  // Apply toggle behavior to the coursework list (skills are grouped and always fully shown)
  setupToggle("#course-list", "#toggle-courses", 3);

  // ========= Featured projects “More projects” / “Show less” =========
  const title = document.getElementById("projects-title");
  const grid  = document.getElementById("featured-projects-grid");
  const btn   = document.getElementById("toggle-projects");

  // Only run if all elements exist
  if (title && grid && btn) {
    const tiles = Array.from(grid.querySelectorAll(".project-tile"));
    const PROJECT_VISIBLE_COUNT = 3;

    function clampProjects() {
      tiles.forEach((tile, i) => {
        if (i >= PROJECT_VISIBLE_COUNT) tile.classList.add("hidden");
        else tile.classList.remove("hidden");
      });
    }

    // Initial collapsed state
    clampProjects();
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "More projects";
    title.textContent = "Featured Projects";

    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      if (!isExpanded) {
        // Expand: show all tiles
        tiles.forEach(t => t.classList.remove("hidden"));
        btn.setAttribute("aria-expanded", "true");
        btn.textContent = "Show less";
        title.textContent = "My Projects";
      } else {
        // Collapse back to first 3
        clampProjects();
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "More projects";
        title.textContent = "Featured Projects";

        // Nice UX: bring the user back to the top of the section
        title.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });

    // Optional: if you ever have <= 3 projects, hide the button
    if (tiles.length <= PROJECT_VISIBLE_COUNT) {
      btn.classList.add("hidden");
    }
  }
});

// ========= Sticky top banner behavior =========
(function () {
  const banner = document.querySelector(".site-banner");
  if (!banner) return; // no banner on this page

  /**
   * Show/hide the banner based on scroll position.
   * Also toggles a body class so CSS can add top padding.
   */
  function update() {
    const show = window.scrollY > 50;
    banner.classList.toggle("show", show);
    document.body.classList.toggle("banner-visible", show);
  }

  // Update on scroll + on page load, and once immediately
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("load", update);
  document.addEventListener("DOMContentLoaded", update);
  update();
})();

// =====================================================================
// Project data. Each card: title, meta (role/context), summary (one line),
// points ([label, text] pairs), tools (keys from js/tools.js), tilePills
// (what the card shows; items are tool keys or {text}), topics (concepts, not tools), link, private.
// =====================================================================
const PRIVATE_NOTE = "Source code and project data are not public, to protect client confidentiality.";

const projectData = {
  "video-automation": {
    title: "Video Automation Pipeline",
    meta: "Independent contractor · Solo · Jan–Aug 2026",
    summary: "Windows desktop app that picks the best clips from a client's monthly event videos.",
    points: [
      ["Problem", "Choosing clips by hand was the biggest time cost in the client's editing workflow."],
      ["Built", "Whisper transcription, BM25 retrieval and the Groq API find and rank the matching moments."],
      ["My role", "Solo, from requirements to delivery and support. Built on macOS, packaged for Windows."],
      ["Status", "In monthly production use."]
    ],
    tools: ["python", "whisper", "bm25", "groq", "windows"],
    tilePills: ["python", {text: "Speech-to-text"}, {text: "Retrieval"}],
    link: null, private: true
  },
  "commission-tracker": {
    title: "Commission & Opportunity Tracker",
    meta: "Davidson College Consulting Group · Project lead · Sep–Oct 2026",
    summary: "Self-hosted tool that replaced an insurance agency's Excel commission tracking.",
    points: [
      ["My role", "Led a 4-person team through kickoff, options proposal and the client's decision, then built it with one teammate."],
      ["Built", "NocoDB, Caddy and a Python auth service on a GCP VM with Docker Compose, plus a custom reporting dashboard."],
      ["Hardened", "Fixed forged-cookie, open-redirect and open-signup flaws found in a security review."],
      ["Result", "~100 clients, $0 ongoing hosting cost, 33 unit tests and 28 Playwright end-to-end tests."]
    ],
    tools: ["gcp", "docker", "nocodb", "caddy", "python", "playwright"],
    tilePills: ["gcp", "docker", "python"],
    link: null, private: true
  },
  "secure-file-transfer": {
    title: "Secure File Transfer System",
    meta: "Applied Cryptography · Team of two · Nov–Dec 2025",
    summary: "Encrypted client–server file transfer protocol.",
    points: [
      ["Built", "RSA-OAEP key exchange, HKDF key derivation, AES-256-GCM encryption and replay protection, on an instructor-provided base."],
      ["My part", "The server-side message layer, the RSA key-generation tool and most end-to-end testing."],
      ["Size", "About 3,100 lines of Python."]
    ],
    tools: ["python", "pycryptodome", "sockets", "aes"],
    tilePills: ["python", {text: "Applied cryptography"}],
    link: "https://github.com/jackbray287/Cryptography"
  },
  "airport-connectivity-map": {
    title: "Global Airport Connectivity Bubble Map",
    meta: "Data Visualization · Team of two · Spring 2025",
    summary: "Interactive world map of airport connectivity.",
    points: [
      ["Features", "Bubbles sized and colored by route count, hover details, a connection-range filter and a colorblind-safe palette."],
      ["Data", "OpenFlights: 7,698 airports and 67,663 routes, cleaned down to ~3,400 route-serving airports."],
      ["My part", "All data processing, tooling choices and accessibility checks. My partner wrote the report."]
    ],
    tools: ["d3", "leaflet", "javascript", "python"],
    topics: ["Data cleaning", "Accessibility"],
    tilePills: ["d3", "leaflet", {text: "Data cleaning"}],
    link: "projects/airport-vis/index.html",
    image: { src: "images/airport-visualization.webp", width: 1200, height: 662, alt: "Bubble map of the world where each airport is a circle sized and colored by its number of routes." }
  },
  "student-hub": {
    title: "Student Hub Platform",
    meta: "Class project · Team of four · Spring 2025",
    summary: "Campus platform for course reviews, professor ratings, clubs and resources.",
    points: [
      ["My part", "Front end (React, Vite, Tailwind, Zustand) and the Supabase back end (Auth and PostgreSQL)."],
      ["Process", "Four-person team working in Agile/Scrum."]
    ],
    tools: ["react", "vite", "tailwind", "zustand", "supabase", "postgres", "agile"],
    tilePills: ["react", "supabase", "agile"],
    link: "https://github.com/N-Pacis/Student-Hub"
  },

  // ---- Research ----
  "fpga-riscv": {
    title: "RISC-V Processor on an FPGA",
    meta: "Independent study · Fall 2026 · In progress",
    summary: "Building a RISC-V CPU in SystemVerilog and running it on an FPGA.",
    points: [
      ["Goal", "Implement the CPU and SoC, then add pipelining or speculative execution. Target: an ECP5 FPGA with the open-source Yosys toolchain."],
      ["So far", "ALU and memory modules passing 36/36 self-checking tests, a Python assembler, and a first SoC skeleton."],
      ["Next", "Instruction decode, branches, load/store and UART, then pipelining."]
    ],
    tools: ["systemverilog", "riscv", "fpga", "ecp5", "yosys", "python"],
    tilePills: ["systemverilog", "riscv", "fpga"],
    link: "https://github.com/castellanossfelipe/riscv-fpga", linkLabel: "View repository on GitHub"
  },
  "critical-section-granularity": {
    title: "Single-Resource Critical-Section Granularity in a Mixed-Criticality System with the PCP-A",
    meta: "First author · Accepted to RTNS 2026 · Presenting Nov 2026",
    summary: "How to group a shared resource's accesses into critical sections when tasks differ in criticality.",
    points: [
      ["Protocol", "Extends the Priority Ceiling Protocol so a low-criticality task can be safely aborted at a mode change (the PCP-A)."],
      ["Analysis", "Bounds the blocking this causes, then uses the bounds in a heuristic that performed well against simpler approaches."]
    ],
    tools: ["latex"],
    topics: ["Real-time systems", "Schedulability analysis"],
    tilePills: [{text: "Real-time systems"}, {text: "RTNS 2026"}, {text: "First author"}],
    link: null
  }
};

// =====================================================================
// Tool icons + chips
// =====================================================================
const escapeHtml = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const icon = key => `<i class="ti" data-tool="${key}" aria-hidden="true"></i>`;

// Static (non-clickable) pill, e.g. inside a project tile (a tile is itself a button)
const staticPill = item => typeof item === "string"
  ? `<span class="pill" data-key="${item}">${icon(item)}${escapeHtml(TOOLS[item].label)}</span>`
  : `<span class="pill">${escapeHtml(item.text)}</span>`;

// Clickable pill: selecting it filters the page to everything that uses the tool
const filterPill = key =>
  `<button type="button" class="pill tool-pill" data-filter="${key}" data-label="${escapeHtml(TOOLS[key].label)}">${icon(key)}${escapeHtml(TOOLS[key].label)}</button>`;

// Auto-icon known tool names inside a sentence
const aliasToKey = {};
Object.entries(TOOLS).forEach(([key, t]) => t.aliases.forEach(a => { aliasToKey[a] = key; }));
const aliasRegex = new RegExp("\\b(" + Object.keys(aliasToKey)
  .sort((a, b) => b.length - a.length)
  .map(a => a.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&")).join("|") + ")\\b", "g");

function iconizeText(text, clickable) {
  return escapeHtml(text).replace(aliasRegex, name => {
    const key = aliasToKey[name];
    return clickable
      ? `<button type="button" class="tool-inline" data-filter="${key}" data-label="${escapeHtml(TOOLS[key].label)}">${icon(key)}${name}</button>`
      : `<span class="tool-inline">${icon(key)}${name}</span>`;
  });
}

// Fill each tile's pills and icon the tool names in its description
document.querySelectorAll(".project-tile").forEach(tile => {
  const data = projectData[tile.getAttribute("data-project")];
  if (!data) return;
  const pills = tile.querySelector(".project-tile-pills");
  if (pills) pills.innerHTML = data.tilePills.map(staticPill).join("");
  const desc = tile.querySelector(".project-tile-desc");
  if (desc) desc.innerHTML = iconizeText(desc.textContent.trim(), false);
});

// =====================================================================
// Coursework: one icon-only tool chip after each course, "+N" for the rest
// =====================================================================
const COURSE_ICON_CAP = 1;
document.querySelectorAll('#course-list li[data-tools]').forEach(li => {
  const keys = li.getAttribute('data-tools').split(' ').filter(k => TOOLS[k]);
  const shown = keys.slice(0, COURSE_ICON_CAP);
  const rest = keys.slice(COURSE_ICON_CAP);
  const wrap = document.createElement('span');
  wrap.className = 'course-tools';
  wrap.innerHTML = shown.map(k =>
    `<button type="button" class="course-tool" data-filter="${k}" data-label="${escapeHtml(TOOLS[k].label)}"
       title="${escapeHtml(TOOLS[k].label)}" aria-label="${escapeHtml(TOOLS[k].label)}">${icon(k)}</button>`).join('') +
    (rest.length ? `<span class="course-more" title="${escapeHtml(rest.map(k => TOOLS[k].label).join(', '))}">+${rest.length}</span>` : '');
  li.appendChild(wrap);
});

// =====================================================================
// Skills & Tools search
// =====================================================================
(function () {
  const input = document.getElementById('skill-search');
  const list = document.getElementById('skills-list');
  const groups = Array.from(list.querySelectorAll('.skill-group'));
  const empty = document.getElementById('skill-empty');
  if (!input || !list) return;
  const items = Array.from(list.querySelectorAll('li'));
  items.forEach(li => {
    const b = li.querySelector('[data-filter]');
    const keys = b.getAttribute('data-filter').split(' ');
    li.dataset.search = (b.getAttribute('data-label') + ' ' + keys.map(k => TOOLS[k] ? TOOLS[k].label : k).join(' ') + ' ' + keys.join(' ')).toLowerCase();
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    list.classList.toggle('searching', q !== '');
    let hits = 0;
    items.forEach(li => {
      const miss = q !== '' && !li.dataset.search.includes(q);
      li.classList.toggle('search-miss', miss);
      if (!miss) hits++;
    });
    groups.forEach(g => g.classList.toggle('search-miss', q !== '' && !g.querySelector('li:not(.search-miss)')));
    empty.hidden = !(q !== '' && hits === 0);
  });
})();

// =====================================================================
// Modal
// =====================================================================
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-modal');
const projectTiles = document.querySelectorAll('.project-tile');
let lastFocus = null;

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const points = data.points
    .map(([label, text]) => `<li><span class="modal-label">${label}</span><span>${iconizeText(text, true)}</span></li>`)
    .join('');

  const isExternal = data.link && /^https?:/.test(data.link);
  const buttonHtml = (data.link && !data.private)
    ? `<a href="${data.link}" class="toggle-btn modal-link"
          ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${data.linkLabel || "View Project Data"}</a>`
    : '';
  // Optional screenshot; if the file is not there yet the figure removes itself.
  const imageHtml = data.image
    ? `<figure class="modal-figure"><img src="${data.image.src}" width="${data.image.width || ''}" height="${data.image.height || ''}" alt="${escapeHtml(data.image.alt)}" loading="lazy"
         onerror="this.closest('figure').remove()"></figure>`
    : '';
  const noteHtml = data.private ? `<p class="modal-note">${PRIVATE_NOTE}</p>` : '';

  modalBody.innerHTML = `
    <h2 id="modal-title">${escapeHtml(data.title)}</h2>
    <p class="modal-meta">${data.meta}</p>
    ${imageHtml}
    <p class="modal-summary">${iconizeText(data.summary, true)}</p>
    <ul class="modal-points">${points}</ul>
    <div class="modal-section-label">Tools &amp; skills <span>(click one to see everything that uses it)</span></div>
    <div class="modal-pills">${data.tools.map(filterPill).join('')}</div>
    ${data.topics ? `<div class="modal-section-label">Topics</div><div class="modal-pills">${data.topics.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    ${buttonHtml}
    ${noteHtml}
  `;

  presentModal();
}

function presentModal(compact) {
  modal.querySelector('.modal-content').classList.toggle('is-compact', compact === true);
  modal.querySelector('.modal-content').classList.toggle('is-story', compact === 'story');
  lastFocus = document.activeElement;
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-content').scrollTop = 0;
  closeBtn.focus();
}

function closeModal() {
  const wasOpen = modal.classList.contains('is-visible');
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (location.hash === '#story') history.replaceState(null, '', location.pathname + location.search);
  // Return focus to the control that opened the dialog
  if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  lastFocus = null;
}

// Keep Tab focus inside the open dialog
modal.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const items = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'))
    .filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

projectTiles.forEach(tile => {
  tile.addEventListener('click', () => openModal(tile.getAttribute('data-project')));
});
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// =====================================================================
// Tool / skill filter: click any tool or skill to highlight what uses it
// =====================================================================
const filterBar = document.getElementById('filter-bar');
const filterText = document.getElementById('filter-bar-text');
let activeFilter = null; // { keys: [...], label }

// Everything that can match, with the tool keys it uses
function filterTargets() {
  const targets = [];
  document.querySelectorAll('.project-tile').forEach(el => {
    const data = projectData[el.getAttribute('data-project')];
    const group = el.closest('#featured-projects-grid') ? 'project' : 'research';
    if (data) targets.push({ el, group, tools: data.tools });
  });
  document.querySelectorAll('.lab-item').forEach(el => {
    targets.push({ el, group: 'lab', tools: (el.getAttribute('data-tools') || '').split(' ') });
  });
  document.querySelectorAll('#course-list li').forEach(el => {   // courses without tools just dim
    targets.push({ el, group: 'course', tools: (el.getAttribute('data-tools') || '').split(' ') });
  });
  return targets;
}

function plural(n, one, many) { return `${n} ${n === 1 ? one : many}`; }

function applyFilter(keys, label) {
  const same = activeFilter && activeFilter.label === label;
  if (same) { clearFilter(); return; }          // clicking the active tool again turns it off
  activeFilter = { keys, label };
  closeModal();

  const counts = { project: 0, research: 0, lab: 0, course: 0 };
  let first = null;
  filterTargets().forEach(t => {
    const hit = t.tools.some(k => keys.includes(k));
    t.el.classList.toggle('is-match', hit);
    t.el.classList.toggle('is-dim', !hit);
    if (hit) { counts[t.group]++; first = first || t.el; }
  });

  // Reveal collapsed project cards if one of them matches
  const toggle = document.getElementById('toggle-projects');
  if (toggle && toggle.getAttribute('aria-expanded') === 'false' &&
      document.querySelector('#featured-projects-grid .project-tile.is-match.hidden')) {
    toggle.click();
  }

  // Reveal collapsed coursework if one of those courses matches
  const courseToggle = document.getElementById('toggle-courses');
  if (courseToggle && courseToggle.getAttribute('aria-expanded') === 'false' &&
      document.querySelector('#course-list li.is-match.hidden')) {
    courseToggle.click();
  }

  // Highlight every chip for this tool/skill
  document.querySelectorAll('[data-filter]').forEach(el => {
    const ks = el.getAttribute('data-filter').split(' ');
    const on = ks.some(k => keys.includes(k));
    el.classList.toggle('is-active', on);
    const skill = el.closest('#skills-list li');   // skills are pills (li) wrapping a button
    if (skill) skill.classList.toggle('is-active', on);
  });
  document.querySelectorAll('.pill[data-key]').forEach(el => {
    el.classList.toggle('is-active', keys.includes(el.getAttribute('data-key')));
  });

  const parts = [];
  if (counts.project)  parts.push(plural(counts.project, 'project', 'projects'));
  if (counts.research) parts.push(plural(counts.research, 'research item', 'research items'));
  if (counts.lab)      parts.push(plural(counts.lab, 'lab', 'labs'));
  if (counts.course)   parts.push(plural(counts.course, 'course', 'courses'));
  filterText.innerHTML = `${icon(keys[0])}<strong>${escapeHtml(label)}</strong> ` +
    (parts.length ? `used in ${parts.join(', ')}`
                  : 'is used in work not featured here');
  filterBar.hidden = false;
  document.body.classList.add('filtering');

  if (first) setTimeout(() => first.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
}

function clearFilter() {
  activeFilter = null;
  filterBar.hidden = true;
  document.body.classList.remove('filtering');
  document.querySelectorAll('.is-match, .is-dim, .is-active').forEach(el => {
    el.classList.remove('is-match', 'is-dim', 'is-active');
  });
}

document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-filter]');
  if (!trigger) return;
  e.preventDefault();
  applyFilter(trigger.getAttribute('data-filter').split(' '), trigger.getAttribute('data-label'));
});
document.getElementById('filter-clear').addEventListener('click', clearFilter);

// Escape closes the modal first, then clears an active filter
window.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modal.classList.contains('is-visible')) closeModal();
  else if (activeFilter) clearFilter();
});


// =====================================================================
// Résumé dialog: a short list of downloadable versions (edit js/config.js)
// =====================================================================
(function () {
  const list = (window.SITE_CONFIG && window.SITE_CONFIG.resumes) || [];
  const trigger = document.getElementById('request-resume');
  if (!trigger) return;
  if (!list.length) { trigger.hidden = true; return; }

  const ARROW = '<svg class="resume-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg>';

  trigger.addEventListener('click', () => {
    modalBody.innerHTML = `
      <h2 id="modal-title">Résumé</h2>
      <p class="resume-lede">${list.length > 1 ? 'Choose the version that fits.' : 'Download as a PDF.'}</p>
      <ul class="resume-list">
        ${list.map(r => `
          <li><a class="resume-row" href="${escapeHtml(r.file)}" download>
            <span class="resume-text">
              <span class="resume-name">${escapeHtml(r.label)}</span>
              ${r.note ? `<span class="resume-note">${escapeHtml(r.note)}</span>` : ''}
            </span>
            <span class="resume-get"><span class="resume-type">PDF</span>${ARROW}<span class="visually-hidden">Download ${escapeHtml(r.label)} résumé</span></span>
          </a></li>`).join('')}
      </ul>`;
    presentModal(true);
  });
})();


// =====================================================================
// "Behind the portfolio": the story, a map of the places lived, and a shelf of books and albums.
// Copy lives in index.html (#story-template); homes, books, albums and reviews in js/config.js.
// Opens from the headshot, the footer link or #story.
// =====================================================================
(function () {
  const tpl = document.getElementById('story-template');
  if (!tpl) return;
  const cfg = window.SITE_CONFIG || {};

  // ---------------------------------------------------------------
  // Homes: simplified vector map + list + live clocks
  // ---------------------------------------------------------------
  const homes = cfg.homes || [];
  let clockTimer = null;

  const years = h => h.to ? `${h.from} – ${h.to}` : h.from;
  const place = h => `${h.name}${h.region ? ', ' + h.region : ''}`;
  const clock = tz => {
    try { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date()).replace(' AM', ' am').replace(' PM', ' pm'); }
    catch (e) { return ''; }
  };
  function km(a, b) {
    const R = 6371, rad = d => d * Math.PI / 180;
    const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function mapSvg() {
    const M = window.STORY_MAP;
    if (!M) return '';
    const X = lon => (lon - M.lon0) * M.k, Y = lat => (M.latN - lat) * M.k;
    // Unique cities in order of first appearance, remembering which stops (1-based) are theirs
    const cities = [];
    homes.forEach((h, i) => {
      let c = cities.find(c => c.name === h.name);
      if (!c) { c = { ...h, nums: [] }; cities.push(c); }
      c.nums.push(i + 1);
    });
    // Arcs between consecutive stops; a return trip bows the other way so out and back don't overlap
    const seen = {};
    const arcs = [];
    for (let i = 1; i < homes.length; i++) {
      const a = homes[i - 1], b = homes[i];
      if (a.name === b.name) continue;
      const x1 = X(a.lon), y1 = Y(a.lat), x2 = X(b.lon), y2 = Y(b.lat);
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      let nx = -dy / len, ny = dx / len;
      if (ny > 0.0001) { nx = -nx; ny = -ny; }       // bow toward the north...
      const key = [a.name, b.name].sort().join('|');
      const sign = (seen[key] = (seen[key] || 0) + 1) % 2 ? 1 : -1;   // ...and the other way coming back
      const bulge = len * 0.2 * sign;
      const cx = (x1 + x2) / 2 + nx * bulge, cy = (y1 + y2) / 2 + ny * bulge;
      arcs.push(`<path class="m-arc" data-to="${i}" style="--i:${arcs.length}" pathLength="1" d="M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`);
    }
    // Faint graticule
    let grat = '';
    for (let lon = Math.ceil(M.lon0 / 20) * 20; lon <= M.lon1; lon += 20) grat += `<line x1="${X(lon).toFixed(1)}" y1="0" x2="${X(lon).toFixed(1)}" y2="${M.H}"/>`;
    for (let lat = Math.ceil(M.latS / 20) * 20; lat <= M.latN; lat += 20) grat += `<line x1="0" y1="${Y(lat).toFixed(1)}" x2="${M.W}" y2="${Y(lat).toFixed(1)}"/>`;
    const now = homes[homes.length - 1] && homes[homes.length - 1].name;
    const pos = { r: [10, 4, 'start'], l: [-10, 4, 'end'], t: [0, -11, 'middle'], b: [0, 19, 'middle'] };
    const dots = cities.map(c => {
      const x = X(c.lon), y = Y(c.lat), [ox, oy, anchor] = pos[c.anchor] || pos.r;
      return `<g class="m-city${c.name === now ? ' is-now' : ''}" data-city="${escapeHtml(c.name)}">
        <circle class="m-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8"/>
        <circle class="m-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6"/>
        <text class="m-label" x="${(x + ox).toFixed(1)}" y="${(y + oy).toFixed(1)}" text-anchor="${anchor}">${escapeHtml(c.name)} <tspan class="m-nums">${c.nums.join('·')}</tspan></text>
      </g>`;
    }).join('');
    return `<svg class="homes-svg" viewBox="0 0 ${M.W} ${M.H}" role="img"
        aria-label="Map of the places I have lived, joined in the order I lived in them">
      <rect class="m-sea" width="${M.W}" height="${M.H}"/>
      <path class="m-land" d="${M.land}"/>
      <path class="m-lived" d="${M.lived}"/>
      <path class="m-borders" d="${M.borders}"/>
      <g class="m-grat">${grat}</g>
      <g class="m-arcs">${arcs.join('')}</g>
      <g class="m-dots">${dots}</g>
    </svg>`;
  }

  const PIN = '<svg class="homes-pin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

  function homesStats() {
    const nCities = new Set(homes.map(h => h.name)).size, nCountries = new Set(homes.map(h => h.country || h.region)).size;
    let miles = 0;
    for (let i = 1; i < homes.length; i++) miles += km(homes[i - 1], homes[i]) * 0.621371;
    return { nCities, nCountries, miles };
  }

  // Collapsed by default: a quiet row that opens the map
  function homesShell() {
    if (!homes.length) return '';
    const { nCities, nCountries } = homesStats();
    return `
      <section class="homes">
        <button type="button" class="homes-toggle" aria-expanded="false" aria-controls="homes-panel">
          ${PIN}
          <span class="homes-label">Where I&rsquo;ve called home</span>
          <span class="homes-hint">${nCities} cities &middot; ${nCountries} countries</span>
        </button>
        <div class="homes-panel" id="homes-panel"><div class="homes-inner"></div></div>
      </section>`;
  }

  // The map, list and caption: built on first open (which is also when the map shapes are fetched)
  function homesInner() {
    const { miles } = homesStats();
    return `
      <p class="homes-eyebrow">About ${(Math.round(miles / 100) * 100).toLocaleString('en-US')} miles between them, as the crow flies</p>
      <div class="homes-grid">
        <div class="homes-map" id="homes-map">${mapSvg()}</div>
        <ol class="homes-list">
          ${homes.map((h, i) => `
            <li><button type="button" class="home-row" data-i="${i}" aria-pressed="false">
              <span class="home-n" aria-hidden="true">${i + 1}</span>
              <span class="home-name">${escapeHtml(h.name)}</span>
              <span class="home-years">${escapeHtml(years(h))}</span>
            </button></li>`).join('')}
        </ol>
      </div>
      <p class="homes-caption" id="homes-caption" aria-live="polite"></p>`;
  }

  function setupHomes() {
    const root = modalBody.querySelector('.homes');
    if (!root) return;
    const btn = root.querySelector('.homes-toggle'), inner = root.querySelector('.homes-inner');
    let built = false;
    btn.addEventListener('click', () => {
      const open = !root.classList.contains('is-open');
      const apply = () => { root.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
      if (open && !built) {
        built = true;
        withMap(() => {
          if (!document.contains(inner)) return;
          inner.innerHTML = homesInner();
          wireHomes();
          requestAnimationFrame(apply);   // next frame, so the panel animates open from closed
        });
        return;
      }
      apply();
    });
  }

  function wireHomes() {
    const root = modalBody.querySelector('.homes');
    if (!root) return;
    const cap = root.querySelector('#homes-caption');
    let sel = -1;

    function clocksLine() {
      // One clock per time zone, named for the place you were last in that zone
      const byTz = new Map();
      homes.forEach(h => { if (h.tz) byTz.set(h.tz, h.name); });
      const parts = Array.from(byTz, ([tz, name]) => `<strong>${clock(tz)}</strong> in ${escapeHtml(name)}`);
      return parts.length ? `Right now it&rsquo;s ${parts.join(' &middot; ')}.` : '';
    }
    function paint() {
      if (sel < 0) { cap.innerHTML = clocksLine(); return; }
      const h = homes[sel];
      cap.innerHTML = `<strong>${escapeHtml(place(h))}</strong> &middot; ${escapeHtml(years(h))}`
        + (h.tz ? ` &middot; ${clock(h.tz)} there now` : '')
        + (h.note ? `<span class="homes-note">${escapeHtml(h.note)}</span>` : '');
    }
    function mark(i) {   // i = stop index to emphasise, -1 for none
      root.classList.toggle('has-active', i >= 0);
      root.querySelectorAll('.m-arc').forEach(a => a.classList.toggle('is-on', +a.dataset.to === i));
      root.querySelectorAll('.m-city').forEach(c => c.classList.toggle('is-on', i >= 0 && c.dataset.city === homes[i].name));
      root.querySelectorAll('.home-row').forEach(r => r.classList.toggle('is-on', +r.dataset.i === i));
    }
    root.querySelectorAll('.home-row').forEach(btn => {
      const i = +btn.dataset.i;
      btn.addEventListener('mouseenter', () => mark(i));
      btn.addEventListener('focus', () => mark(i));
      btn.addEventListener('mouseleave', () => mark(sel));
      btn.addEventListener('blur', () => mark(sel));
      btn.addEventListener('click', () => {
        sel = sel === i ? -1 : i;
        root.querySelectorAll('.home-row').forEach(r => r.setAttribute('aria-pressed', String(+r.dataset.i === sel)));
        mark(sel); paint();
      });
    });
    // Tapping a dot on the map selects that city's latest stop
    root.addEventListener('click', e => {
      const g = e.target.closest('.m-city');
      if (!g) return;
      let i = -1; homes.forEach((h, k) => { if (h.name === g.dataset.city) i = k; });
      const row = root.querySelector(`.home-row[data-i="${i}"]`);
      if (row) row.click();
    });
    paint();
    clearInterval(clockTimer);
    clockTimer = setInterval(() => {
      if (!modal.classList.contains('is-visible') || !document.contains(cap)) { clearInterval(clockTimer); return; }
      paint();
    }, 20000);
  }

  // The map shapes are a separate file (~50 KB), fetched only when the story is first opened
  function withMap(cb) {
    if (window.STORY_MAP || !homes.length) return cb();
    const sc = document.createElement('script');
    sc.src = 'js/story-map.js?v=20261026';
    sc.onload = cb; sc.onerror = cb;
    document.head.appendChild(sc);
  }

  // ---------------------------------------------------------------
  // Shelf: books as spines, albums as sleeves
  // ---------------------------------------------------------------
  // Colours are fixed (physical objects don't change with dark mode); text colours chosen for contrast.
  const BOOK_COLORS = [
    { bg: '#a3182d', fg: '#ffffff' }, { bg: '#34414a', fg: '#ffffff' }, { bg: '#d9a441', fg: '#1f1b18' },
    { bg: '#5d6b50', fg: '#ffffff' }, { bg: '#e9e1d3', fg: '#1f1b18' }, { bg: '#5b3a4a', fg: '#ffffff' }
  ];
  const ALBUM_COLORS = [
    { bg: '#d9a441', fg: '#1f1b18' }, { bg: '#5d6b50', fg: '#ffffff' }, { bg: '#26211f', fg: '#f3eeea' },
    { bg: '#34414a', fg: '#ffffff' }, { bg: '#a3182d', fg: '#ffffff' }, { bg: '#e9e1d3', fg: '#1f1b18' }
  ];
  const JITTER = [6, -8, 14, -2, 10, -12, 4, 0];
  const TILT = [-3, 2, -1.5, 3, -2.5, 1];
  const HINT = '<span class="shelf-hint">Pick something off the shelf.</span>';

  // A spine / record-label colour from config (hex), with readable text picked automatically; falls back to the palette
  function swatch(b, fallback) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(b.color || '').trim());
    if (!m) return fallback;
    const n = parseInt(m[1], 16), lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
    return { bg: '#' + m[1], fg: L > 0.32 ? '#1f1b18' : '#ffffff' };
  }
  const books = cfg.books || [], reading = cfg.reading || [], albums = cfg.albums || [];
  const items = [];
  books.forEach((b, i) => items.push({ ...b, kind: 'book', c: swatch(b, BOOK_COLORS[i % BOOK_COLORS.length]), n: i }));
  reading.forEach((b, i) => items.push({ ...b, kind: 'reading', c: swatch(b, BOOK_COLORS[(books.length + i) % BOOK_COLORS.length]), n: books.length + i }));
  albums.forEach((b, i) => items.push({ ...b, kind: 'album', author: b.artist, c: swatch(b, ALBUM_COLORS[i % ALBUM_COLORS.length]), n: i }));
  const idx = it => items.indexOf(it);
  // Size a title so its longest word fits one line
  const longest = t => Math.max(...String(t).split(/\s+/).map(w => w.length), 1);
  const fit = (t, k, cap) => Math.min(cap, k / longest(t)).toFixed(2) + 'rem';
  // Optional cover photo laid over the typeset cover; if the file is missing it removes itself
  const art = b => b.image
    ? `<img class="art" src="${escapeHtml(b.image)}" alt="" loading="lazy" decoding="async" onerror="this.parentNode.classList.remove('has-art');this.remove()">` : '';

  function spineHtml(b) {
    const h = Math.max(150 + JITTER[b.n % JITTER.length], 64 + Math.min(b.title.length, 22) * 7.4); // long titles wrap to two columns
    const w = [46, 42, 52, 44, 48, 40][b.n % 6];
    const leaning = b.kind === 'reading';
    return `
      <li class="${leaning ? 'is-leaning' : ''}" style="--h:${Math.round(h)}px; --w:${w}px; --bg:${b.c.bg}; --fg:${b.c.fg}">
        <button type="button" class="spine" data-i="${idx(b)}" aria-pressed="false"
          aria-label="${escapeHtml(b.title)}${b.author ? ', ' + escapeHtml(b.author) : ''}${leaning ? ' (reading now)' : ''}">
          <span class="spine-title">${escapeHtml(b.title)}</span>
        </button>
      </li>`;
  }

  function sleeveHtml(b) {
    return `
      <li style="--bg:${b.c.bg}; --fg:${b.c.fg}; --rot:${TILT[b.n % TILT.length]}deg; --fs:${fit(b.title, 8.1, 0.9)}">
        <button type="button" class="sleeve" data-i="${idx(b)}" aria-pressed="false"
          aria-label="${escapeHtml(b.title)}, ${escapeHtml(b.author || '')} (album)">
          <span class="disc" aria-hidden="true"></span>
          <span class="sleeve-face${b.image ? ' has-art' : ''}" aria-hidden="true">
            <span class="sleeve-artist">${escapeHtml(b.author || '')}</span>
            <span class="sleeve-title">${escapeHtml(b.title)}</span>
            ${art(b)}
          </span>
        </button>
      </li>`;
  }

  function shelfHtml() {
    const bookItems = items.filter(x => x.kind !== 'album');
    const albumItems = items.filter(x => x.kind === 'album');
    if (!items.length) return '';
    return `
      <div class="story-shelf">
        <div class="bookcase">
          ${bookItems.length ? `<div class="shelf-level"><ul class="shelf">${bookItems.map(spineHtml).join('')}</ul><div class="shelf-board" aria-hidden="true"></div></div>` : ''}
          ${albumItems.length ? `<div class="shelf-level is-records"><ul class="crate">${albumItems.map(sleeveHtml).join('')}</ul><div class="shelf-board" aria-hidden="true"></div></div>` : ''}
        </div>
        <div class="shelf-detail is-empty" id="shelf-detail" aria-live="polite">${HINT}</div>
      </div>`;
  }

  function detailHtml(b) {
    const eyebrow = b.tag || (b.kind === 'reading' ? 'Reading now' : b.kind === 'album' ? 'Album' : 'Book');
    const face = b.kind === 'album' ? `
      <div class="record" style="--bg:${b.c.bg}; --fg:${b.c.fg}; --fs:${fit(b.title, 11, 1.05)}" aria-hidden="true">
        <div class="record-slide"><div class="record-disc"><span class="record-label"></span></div></div>
        <div class="record-sleeve${b.image ? ' has-art' : ''}">
          <span class="cover-author">${escapeHtml(b.author || '')}</span>
          <span class="cover-title">${escapeHtml(b.title)}</span>
          ${art(b)}
        </div>
      </div>` : `
      <div class="cover${b.image ? ' has-art' : ''}" style="--bg:${b.c.bg}; --fg:${b.c.fg}" aria-hidden="true">
        <span class="cover-author">${escapeHtml(b.author || '')}</span>
        <span class="cover-title">${escapeHtml(b.title)}</span>
        <span class="cover-rule"></span>
        ${art(b)}
      </div>`;
    return `
      ${face}
      <div class="detail-text">
        <span class="detail-tag">${escapeHtml(eyebrow)}</span>
        <span class="shelf-detail-title">${escapeHtml(b.title)}</span>
        <span class="shelf-detail-meta">${escapeHtml(b.author || '')}</span>
        ${b.review ? `<span class="review-label">My take</span><span class="review">${escapeHtml(b.review)}</span>` : ''}
      </div>`;
  }

  function wireShelf() {
    const bookcase = modalBody.querySelector('.bookcase');
    const detail = modalBody.querySelector('#shelf-detail');
    if (!bookcase || !detail) return;
    bookcase.addEventListener('click', e => {
      const btn = e.target.closest('.spine, .sleeve');
      if (!btn) return;
      const wasOn = btn.getAttribute('aria-pressed') === 'true';
      bookcase.querySelectorAll('[aria-pressed]').forEach(x => x.setAttribute('aria-pressed', 'false'));
      if (wasOn) { detail.className = 'shelf-detail is-empty'; detail.innerHTML = HINT; return; }
      btn.setAttribute('aria-pressed', 'true');
      detail.className = 'shelf-detail';
      detail.innerHTML = detailHtml(items[+btn.dataset.i]);
    });
  }

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------
  function openStory() {
    modalBody.innerHTML = tpl.innerHTML;
    const slot = modalBody.querySelector('#shelf-slot');
    if (slot) slot.innerHTML = shelfHtml();
    wireShelf();
    const hs = modalBody.querySelector('#homes-slot');
    if (hs) { hs.innerHTML = homesShell(); setupHomes(); }
    presentModal('story');
    if (location.hash !== '#story') history.replaceState(null, '', '#story');
  }

  ['story-photo', 'story-link'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openStory);
  });
  window.addEventListener('hashchange', () => {
    if (location.hash === '#story' && !modal.classList.contains('is-visible')) openStory();
  });
  if (location.hash === '#story') openStory();
})();
