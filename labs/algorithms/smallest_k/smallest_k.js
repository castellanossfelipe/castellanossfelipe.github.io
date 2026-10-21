// Parse "1, 2  3" -> [1, 2, 3]
function parseNumberList(s) {
  return s
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

// Core logic + trace (JS reimplementation of the Python idea)
function smallestKTrace(arr) {
  if (!arr.length) {
    return { ok: false, sorted: [], rows: [], firstK: null };
  }

  const sorted = [...arr].sort((a, b) => a - b);
  let sum = 0;
  const rows = [];
  let firstK = null;

  for (let i = 0; i < sorted.length; i++) {
    const k = i + 1;
    sum += sorted[i];
    const k3 = k ** 3;
    const ok = sum <= k3;
    if (ok && firstK === null) {
      firstK = k;
    }
    rows.push({ k, kth: sorted[i], sum, k3, ok });
  }

  return { ok: firstK !== null, sorted, rows, firstK };
}

function renderSmallestK() {
  const input     = document.getElementById("sk-input");
  const runBtn    = document.getElementById("sk-run");
  const out       = document.getElementById("sk-output");
  const tbody     = document.querySelector("#sk-table tbody");
  const tableWrap = document.querySelector(".table-wrap"); // wrapper around the table

  if (!input || !runBtn || !out || !tbody || !tableWrap) {
    console.warn("smallest_k elements not found in DOM");
    return;
  }

  // Hide result + table by default
  out.classList.add("hidden");
  tableWrap.classList.add("hidden");
  out.textContent = "";
  tbody.innerHTML = "";

  function run() {
    const raw = input.value.trim();

    // If literally nothing typed: hide everything
    if (!raw) {
      out.textContent = "";
      out.classList.add("hidden");
      tbody.innerHTML = "";
      tableWrap.classList.add("hidden");
      return;
    }

    const arr = parseNumberList(raw);
    const { ok, rows, firstK } = smallestKTrace(arr);

    // User typed something but we couldn't parse any numbers
    if (!arr.length) {
      out.textContent = "Please enter at least one number (comma/space separated).";
      out.classList.remove("hidden");
      tbody.innerHTML = "";
      tableWrap.classList.add("hidden");
      return;
    }

    // Valid numeric input: show result + table
    out.textContent = ok
      ? `True — works for k = ${firstK} (the k smallest numbers already satisfy the bound).`
      : `False — no k satisfies sum(k smallest) ≤ k³.`;

    tbody.innerHTML = rows
      .map(
        (r) => `
      <tr>
        <td>${r.k}</td>
        <td>${r.kth}</td>
        <td>${r.sum}</td>
        <td>${r.k3}</td>
        <td>${r.ok ? "Yes" : "—"}</td>
      </tr>
    `
      )
      .join("");

    out.classList.remove("hidden");
    tableWrap.classList.remove("hidden");
  }

  runBtn.addEventListener("click", run);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") run();
  });
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy-target");
      const el = document.querySelector(sel);
      if (!el) return;
      const text = el.textContent;
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = prev), 900);
      } catch {
        // fallback: select text
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  });
}

// Ensure this runs after the DOM is parsed
document.addEventListener("DOMContentLoaded", () => {
  renderSmallestK();
  setupCopyButtons();
});
