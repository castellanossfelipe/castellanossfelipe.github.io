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
  setupToggle("#skills-list", "#toggle-skills", 5);

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

// 1. Comprehensive Data for All Cards
// Fields:
//   title, meta (one-line context), details (string or array of paragraphs), stack (comma-separated),
//   link (URL or null), private (true => no link; shows a confidentiality note instead)
const PRIVATE_NOTE = "Source code and project data are not public, to protect client confidentiality.";

const projectData = {
  "video-automation": {
    title: "Video Automation Pipeline",
    meta: "Independent contractor · Solo project · Jan–Aug 2026",
    details: [
      "Built for a financial advisory firm that records a monthly event series. Choosing clips by hand was the biggest time cost in its editing workflow, so this tool automates it: Whisper transcribes each video, BM25 retrieval finds the moments that match, and the Groq LLM API helps pick the best clips.",
      "I owned it end to end, from requirements through delivery and ongoing support. It was developed on macOS and packaged for Windows, and it is in monthly production use."
    ],
    stack: "Python, Whisper, BM25, Groq API, Windows packaging",
    link: null,
    private: true
  },
  "commission-tracker": {
    title: "Commission & Opportunity Tracker",
    meta: "Davidson College Consulting Group · Project lead · Sep–Oct 2026",
    details: [
      "A small insurance agency tracked its commissions in Excel. I led a four-person team (two sub-teams of two) through kickoff, an options proposal, and the client's final decision. My two-person sub-team then built the system.",
      "It is self-hosted on a GCP e2-micro VM: NocoDB, Caddy and a Python auth service under Docker Compose, plus a custom Python report-engine dashboard, cron automation and backups. A security review led to fixes for forged-cookie, open-redirect and open-signup vulnerabilities and a fail-closed session gate.",
      "About 100 clients and policies, $0 ongoing infrastructure cost, and 33 unit tests plus 28 Playwright end-to-end tests."
    ],
    stack: "GCP, Docker Compose, NocoDB, Caddy, Python, Playwright",
    link: null,
    private: true
  },
  "secure-file-transfer": {
    title: "Secure File Transfer System",
    meta: "Applied Cryptography · Team of two · Nov–Dec 2025",
    details: [
      "A client–server file-transfer protocol (SiFT v1.0), built on an instructor-provided base for commands, upload and download. We added the full cryptographic layer: RSA-OAEP key transport, HKDF key derivation, AES-256-GCM authenticated encryption and replay protection.",
      "I worked with my partner on the security layer and wrote the server-side message-transfer layer, the RSA key-generation utility and most of the end-to-end testing and debugging. About 3,100 lines of Python."
    ],
    stack: "Python, PyCryptodome, Sockets, AES-256-GCM",
    link: "https://github.com/jackbray287/Cryptography"
  },
  "airport-connectivity-map": {
    title: "Global Airport Connectivity Bubble Map",
    meta: "Data Visualization · Team of two · Spring 2025",
    details: [
      "An interactive world map of airport connectivity built from OpenFlights data. Bubbles are sized and colored by route count, hovering shows details, and a connection-range filter lets you focus on hubs or smaller airports. The palette is colorblind-safe.",
      "I did the data processing (7,698 airports, 67,663 route records and 568 airlines, reduced to about 3,400 route-serving airports), chose the tooling, built and iterated on the map, and ran the accessibility checks. My partner wrote the course report and landing page."
    ],
    stack: "D3.js, Leaflet.js, JavaScript, Python, Data cleaning",
    link: "airport-vis/index.html"
  },
  "student-hub": {
    title: "Student Hub Platform",
    meta: "Software Design · Team of four · Spring 2025",
    details: [
      "A campus platform for course reviews, professor ratings, clubs and shared resources, built by a four-person team using Agile/Scrum.",
      "I developed on the front end (React, Vite, Tailwind, Zustand) and the Supabase back end (Auth and PostgreSQL)."
    ],
    stack: "React, Vite, Tailwind CSS, Zustand, Supabase, PostgreSQL, Agile / Scrum",
    link: "https://github.com/N-Pacis/Student-Hub"
  },

  // ---- Research ----
  "fpga-riscv": {
    title: "RISC-V Processor on an FPGA",
    meta: "Independent study (Computer Architecture & FPGAs) · Fall 2026 · In progress",
    details: [
      "A semester-long study of how processors are built: implement a RISC-V CPU in SystemVerilog, integrate it into a SoC (system on a chip), and then extend it with pipelining or speculative execution. The target is an ECP5 FPGA board using the open-source Yosys and nextpnr toolchain.",
      "So far: a blinker design set up for synthesis, a parameterized RISC-V ALU and a byte-masked block RAM, both verified by self-checking testbenches (36 of 36 checks passing in Icarus Verilog), a Python RISC-V assembler, and the first SoC skeleton that fetches instructions from memory.",
      "Next: instruction decode, branches, load/store, UART and memory integration, then pipelining. All artifacts will be documented on a public page at the end of the semester."
    ],
    stack: "SystemVerilog, RISC-V, FPGA, ECP5, Yosys / nextpnr, Python",
    link: null
  },
  "critical-section-granularity": {
    title: "Single-Resource Critical-Section Granularity in a Mixed-Criticality System with the PCP-A",
    meta: "Second author · Accepted to RTNS 2026 · Presenting November 2026",
    details: [
      "Real-time tasks that share a resource, such as a GPU, can be modeled as alternating access and non-access segments. How those accesses are grouped into critical sections trades overhead against blocking of other tasks, and the trade-off changes in a mixed-criticality system.",
      "The paper extends the Priority Ceiling Protocol into the PCP-A, which can safely abort a resource-holding LO-criticality task at a mode change. It bounds the blocking this protocol can cause, then uses those bounds in a heuristic for forming critical sections. A schedulability study shows the heuristic outperforms simpler grouping approaches.",
      "My key contribution was the abort-overhead blocking term in the protocol's blocking-bound analysis. The work began as a research assistantship in the Davidson College Mathematics & Computer Science department."
    ],
    stack: "Real-Time Systems, Mixed-Criticality, Schedulability Analysis, LaTeX",
    link: null
  }
};

// 2. Element Selectors
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-modal');
const projectTiles = document.querySelectorAll('.project-tile');

// 3. Functions
function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const pillsHtml = data.stack.split(', ')
    .map(tech => `<span class="pill">${tech}</span>`)
    .join('');

  const paragraphs = (Array.isArray(data.details) ? data.details : [data.details])
    .map(text => `<p class="modal-detail">${text}</p>`)
    .join('');

  const metaHtml = data.meta ? `<p class="modal-meta">${data.meta}</p>` : '';

  // Link button only when a public link exists; private (client) projects get a note instead.
  const isExternal = data.link && /^https?:/.test(data.link);
  const buttonHtml = (data.link && !data.private)
    ? `<a href="${data.link}" class="toggle-btn" style="text-decoration: none; display: inline-block;"
          ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
         View Project Data
       </a>`
    : '';
  const noteHtml = data.private ? `<p class="modal-note">${PRIVATE_NOTE}</p>` : '';

  modalBody.innerHTML = `
    <h2>${data.title}</h2>
    ${metaHtml}
    ${paragraphs}
    <div class="modal-pills">
      ${pillsHtml}
    </div>
    ${buttonHtml}
    ${noteHtml}
  `;

  modal.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  // REMOVE THE CLASS
  modal.classList.remove('is-visible');
  document.body.style.overflow = 'auto';
}

// 4. Event Listeners
projectTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const id = tile.getAttribute('data-project');
    openModal(id);
  });
});

closeBtn.addEventListener('click', closeModal);

// Close if user clicks outside the modal box
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close on 'Escape' key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});