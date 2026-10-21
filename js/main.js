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
    summary: "Windows desktop app that picks the best clips from a client's monthly event videos.",
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
    tools: ["realtime", "schedulability", "latex"],
    tilePills: ["realtime", {text: "RTNS 2026"}, {text: "First author"}],
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
    ${buttonHtml}
    ${noteHtml}
  `;

  presentModal();
}

function presentModal(compact) {
  modal.querySelector('.modal-content').classList.toggle('is-compact', !!compact);
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
