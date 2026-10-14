(function () {
  "use strict";

  // The saved theme is applied by the inline script in head.html before
  // first paint; this only wires up the toggle button.
  function storeTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (err) {
      /* storage unavailable, theme just won't persist */
    }
  }

  function initThemeToggle() {
    var root = document.documentElement;
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      storeTheme(next);
    });
  }

  initThemeToggle();
})();
