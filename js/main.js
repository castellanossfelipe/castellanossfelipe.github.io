// ========= Toggle “More” / “Show Less” for coursework and skills =========
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
  }

  // Apply toggle behavior to coursework and skills lists
  setupToggle("#course-list", "#toggle-courses", 3);
  setupToggle("#skills-list", "#toggle-skills", 5);
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
