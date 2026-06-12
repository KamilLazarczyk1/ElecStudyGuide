/* ============================================================
   Electronics Exam Study Guide - shared scripts
   ============================================================ */
(function () {
  "use strict";

  /* ---------- active nav link ---------- */
  var page = document.body.dataset.page || "";
  document.querySelectorAll(".topnav a.navlink").forEach(function (a) {
    if (a.dataset.nav === page) a.classList.add("active");
  });

  /* ---------- lightbox for figures ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = '<img alt=""><div class="cap"></div>';
  document.body.appendChild(lb);
  lb.addEventListener("click", function () { lb.classList.remove("open"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("open"); });

  document.querySelectorAll(".fig img").forEach(function (img) {
    img.addEventListener("click", function () {
      lb.querySelector("img").src = img.src;
      var cap = img.closest(".fig").querySelector("figcaption");
      lb.querySelector(".cap").textContent = cap ? cap.textContent : "";
      lb.classList.add("open");
    });
  });

  /* ---------- per-section progress checkboxes ---------- */
  var KEY = "eguide-progress";
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function saveStore(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
  }

  var boxes = document.querySelectorAll(".toc input[type=checkbox]");
  var store = loadStore();

  function refreshBar() {
    var bar = document.querySelector(".sidebar .pbar > span");
    var lbl = document.querySelector(".sidebar .progress-label b");
    if (!bar || !boxes.length) return;
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    bar.style.width = Math.round(100 * done / boxes.length) + "%";
    if (lbl) lbl.textContent = done + " / " + boxes.length;
  }

  boxes.forEach(function (b) {
    var id = page + ":" + b.dataset.sec;
    b.checked = !!store[id];
    b.addEventListener("change", function () {
      store = loadStore();
      if (b.checked) store[id] = 1; else delete store[id];
      saveStore(store);
      refreshBar();
    });
  });
  refreshBar();

  /* ---------- home page: progress per section card ---------- */
  document.querySelectorAll("[data-progress-of]").forEach(function (el) {
    var info = el.dataset.progressOf.split("|"); // page|total
    var pg = info[0], total = parseInt(info[1], 10);
    var s = loadStore(), done = 0;
    Object.keys(s).forEach(function (k) { if (k.indexOf(pg + ":") === 0) done++; });
    var pct = total ? Math.round(100 * done / total) : 0;
    var span = el.querySelector(".pbar > span");
    if (span) span.style.width = pct + "%";
    var pctEl = el.querySelector(".pct");
    if (pctEl) pctEl.textContent = done + " of " + total + " topics checked off (" + pct + "%)";
  });

  /* ---------- highlight current TOC entry while scrolling ---------- */
  var sections = document.querySelectorAll("section.topic[id]");
  if (sections.length && "IntersectionObserver" in window) {
    var links = {};
    document.querySelectorAll(".toc a").forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("current"); });
          var l = links[en.target.id];
          if (l) l.classList.add("current");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- formulas page: search + topic filter ---------- */
  var search = document.getElementById("fsearch");
  if (search) {
    var chips = document.querySelectorAll(".fchip");
    var cards = document.querySelectorAll(".fcard");
    var activeTag = "all";

    var applyFilter = function () {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (c) {
        var matchTag = activeTag === "all" || (c.dataset.tags || "").split(" ").indexOf(activeTag) !== -1;
        var matchText = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        var show = matchTag && matchText;
        c.classList.toggle("hidden", !show);
        if (show) visible++;
      });
      document.querySelectorAll(".fgroup").forEach(function (g) {
        var any = g.querySelector(".fcard:not(.hidden)");
        g.style.display = any ? "" : "none";
      });
      var cn = document.getElementById("fcount");
      if (cn) cn.textContent = visible + " formula" + (visible === 1 ? "" : "s") + " shown";
    };

    search.addEventListener("input", applyFilter);
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("on"); });
        ch.classList.add("on");
        activeTag = ch.dataset.tag;
        applyFilter();
      });
    });
    applyFilter();
  }

  /* ---------- dark mode toggle (persisted in localStorage) ---------- */
  var THEME_KEY = "eguide-theme";
  var root = document.documentElement;
  var themeBtn = document.getElementById("themetoggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var MOON = "🌙", SUN = "☀️";

  function isDark() { return root.getAttribute("data-theme") === "dark"; }
  function paintTheme() {
    if (themeBtn) {
      themeBtn.textContent = isDark() ? SUN : MOON;
      themeBtn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
      themeBtn.title = themeBtn.getAttribute("aria-label");
    }
    if (themeMeta) themeMeta.content = isDark() ? "#0d1730" : "#1e3a8a";
  }
  if (themeBtn) {
    paintTheme();
    themeBtn.addEventListener("click", function () {
      var dark = isDark();
      if (dark) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      try { localStorage.setItem(THEME_KEY, dark ? "light" : "dark"); } catch (e) { /* private mode */ }
      paintTheme();
    });
  }

  /* print in light mode regardless of theme, then restore */
  var wasDark = false;
  window.addEventListener("beforeprint", function () {
    wasDark = isDark();
    if (wasDark) root.removeAttribute("data-theme");
  });
  window.addEventListener("afterprint", function () {
    if (wasDark) root.setAttribute("data-theme", "dark");
    paintTheme();
  });

  /* ---------- mobile hamburger menu ---------- */
  var navToggle = document.getElementById("navtoggle");
  var navLinks = document.getElementById("navlinks");
  var BURGER = "☰", CROSS = "✕";
  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (navToggle) { navToggle.setAttribute("aria-expanded", "false"); navToggle.textContent = BURGER; }
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.textContent = open ? CROSS : BURGER;
    });
    navLinks.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("click", function (e) {
      if (navLinks.classList.contains("open") && !e.target.closest(".topnav")) closeMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- collapsible sidebar TOC on phones ---------- */
  var sb = document.querySelector(".sidebar");
  if (sb) {
    var sbHead = sb.querySelector("h3");
    if (sbHead) {
      sbHead.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) sb.classList.toggle("open");
      });
    }
    sb.querySelectorAll(".toc a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) sb.classList.remove("open");
      });
    });
  }

  /* ---------- back-to-top button ---------- */
  var btt = document.createElement("button");
  btt.className = "backtotop";
  btt.type = "button";
  btt.setAttribute("aria-label", "Back to top");
  btt.textContent = "↑";
  document.body.appendChild(btt);
  btt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  var bttTick = false;
  window.addEventListener("scroll", function () {
    if (bttTick) return;
    bttTick = true;
    requestAnimationFrame(function () {
      btt.classList.toggle("show", window.scrollY > 600);
      bttTick = false;
    });
  }, { passive: true });
})();
