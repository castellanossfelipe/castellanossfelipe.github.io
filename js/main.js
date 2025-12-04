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

// ========= Featured project tile click handling (modal-ready) =========
(function () {
  function handleProjectTileClick(projectId) {
    // Placeholder for future modal/pop-up
    // You can later replace this with: openProjectModal(projectId)
    console.log("Featured project clicked:", projectId);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".project-tile").forEach((tile) => {
      tile.addEventListener("click", () => handleProjectTileClick(tile.dataset.project));
    });
  });
})();
