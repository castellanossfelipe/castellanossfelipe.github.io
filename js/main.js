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
const projectData = {
  "student-hub": {
    title: "Student Hub Platform",
    details: "A comprehensive academic resource platform built for Davidson College students. It features real-time study group coordination and resource sharing.",
    stack: "React, Supabase, Agile Methodology",
    link: "https://github.com/N-Pacis/Student-Hub"
  },
  "secure-file-transfer": {
    title: "Secure File Transfer System",
    details: "Implemented end-to-end encryption using AES-GCM. The system ensures that files remain encrypted both in transit and at rest, with a Python-based client-server architecture.",
    stack: "Python, PyCryptodome, Socket Programming",
    link: "https://github.com/jackbray287/Cryptography"
  },
  "critical-section-granularity": {
    title: "Research in Critical-Section Granularity",
    details: "Explored the trade-offs between fine-grained and coarse-grained locking in real-time systems. Developed a Python simulation to visualize task latency under various scheduling constraints.",
    stack: "Real-Time Systems, Python, LaTeX",
    link: "#"
  },
  "airport-connectivity-map": {
    title: "Global Airport Connectivity Bubble Map",
    details: "An interactive visualization mapping thousands of flight paths. Users can filter by region and see the weight of connectivity based on flight frequency.",
    stack: "D3.js, Leaflet.js, Data Cleaning",
    link: "airport-vis/index.html"
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

  // 1. Create the button only if the link isn't "#" and exists
  const buttonHtml = (data.link && data.link !== "#") 
    ? `<a href="${data.link}" class="toggle-btn" style="text-decoration: none; display: inline-block;">
         View Project Data
       </a>` 
    : ''; // Empty string if link is "#"

  modalBody.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.details}</p>
    <div class="modal-pills">
      ${pillsHtml}
    </div>
    ${buttonHtml} 
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