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

  // Apply toggle behavior to coursework and skills lists
  setupToggle("#course-list", "#toggle-courses", 3);
  setupToggle("#skills-list", "#toggle-skills", 10);   // top 10 shown; More / search reveals the rest

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

// ========= Mobile notice bar =========
(function () {
  const bar = document.getElementById("mobile-notice");
  const btn = document.getElementById("dismiss-notice");
  if (!bar || !btn) return; // exit if elements are missing

  // Match small screens only (same breakpoint as CSS)
  const mq = window.matchMedia("(max-width: 820px)");

  // Local storage helpers (wrapped in try/catch for Safari private mode)
  function getDismissed() {
    try { return localStorage.getItem("mobileNoticeDismissed") === "1"; }
    catch { return false; }
  }
  function setDismissed() {
    try { localStorage.setItem("mobileNoticeDismissed", "1"); }
    catch {}
  }

  // Show or hide the bar based on viewport + stored dismissal
  function update() {
    bar.hidden = !(mq.matches && !getDismissed());
  }

  // Dismiss handler: persist choice and remove element
  function dismiss(e) {
    if (e) e.preventDefault();
    setDismissed();
    // Hide immediately even if storage is blocked
    bar.hidden = true;
    // Extra guard: remove from DOM to avoid stray focus/reads
    setTimeout(() => {
      if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    }, 0);
  }

  // Only need a single click handler; run once
  btn.addEventListener("click", dismiss, { once: true });

  // Initial visibility + react to breakpoint changes
  if (mq.addEventListener) mq.addEventListener("change", update);
  else if (mq.addListener) mq.addListener(update); // older Safari
  update();
})();


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
// (what the card shows; items are tool keys or {text}), link, private.
// =====================================================================
const PRIVATE_NOTE = "Source code and project data are not public, to protect client confidentiality.";

const projectData = {
  "video-automation": {
    title: "Video Automation Pipeline",
    meta: "Independent contractor · Solo · Jan–Aug 2026",
    summary: "Windows tool that picks the best clips from a client's monthly event videos.",
    points: [
      ["Problem", "Choosing clips by hand was the biggest time cost in the client's editing workflow."],
      ["Built", "Whisper transcription, BM25 retrieval and the Groq API find and rank the matching moments."],
      ["My role", "Solo, from requirements to delivery and support. Built on macOS, packaged for Windows."],
      ["Status", "In monthly production use."]
    ],
    tools: ["python", "whisper", "bm25", "groq", "windows"],
    tilePills: ["python", "whisper", "groq"],
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
    tilePills: ["gcp", "docker", "nocodb"],
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
    tilePills: ["python", "pycryptodome"],
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
    tools: ["d3", "leaflet", "javascript", "python", "datacleaning"],
    tilePills: ["d3", "leaflet", "datacleaning"],
    link: "airport-vis/index.html"
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
    link: null
  },
  "critical-section-granularity": {
    title: "Single-Resource Critical-Section Granularity in a Mixed-Criticality System with the PCP-A",
    meta: "Second author · Accepted to RTNS 2026 · Presenting Nov 2026",
    summary: "How to group a shared resource's accesses into critical sections when tasks differ in criticality.",
    points: [
      ["Protocol", "Extends the Priority Ceiling Protocol so a low-criticality task can be safely aborted at a mode change (the PCP-A)."],
      ["Analysis", "Bounds the blocking this causes, then uses the bounds in a heuristic that performed well against simpler approaches."],
      ["My part", "The abort-overhead blocking term in the blocking-bound analysis."]
    ],
    tools: ["realtime", "schedulability", "latex"],
    tilePills: ["realtime", {text: "RTNS 2026"}, {text: "Second author"}],
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
  const toggle = document.getElementById('toggle-skills');
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
    if (toggle) toggle.classList.toggle('hidden', q !== '');
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

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const points = data.points
    .map(([label, text]) => `<li><span class="modal-label">${label}</span><span>${iconizeText(text, true)}</span></li>`)
    .join('');

  const isExternal = data.link && /^https?:/.test(data.link);
  const buttonHtml = (data.link && !data.private)
    ? `<a href="${data.link}" class="toggle-btn modal-link"
          ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>View Project Data</a>`
    : '';
  const noteHtml = data.private ? `<p class="modal-note">${PRIVATE_NOTE}</p>` : '';

  modalBody.innerHTML = `
    <h2>${escapeHtml(data.title)}</h2>
    <p class="modal-meta">${data.meta}</p>
    <p class="modal-summary">${iconizeText(data.summary, true)}</p>
    <ul class="modal-points">${points}</ul>
    <div class="modal-section-label">Tools &amp; skills <span>(click one to see everything that uses it)</span></div>
    <div class="modal-pills">${data.tools.map(filterPill).join('')}</div>
    ${buttonHtml}
    ${noteHtml}
  `;

  modal.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-visible');
  document.body.style.overflow = 'auto';
}

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
