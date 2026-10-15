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
      // turn the day/night wheel (transitions are off until the first click)
      toggle.classList.add("is-switching");
      root.setAttribute("data-theme", next);
      storeTheme(next);
    });
  }

  // Phone menu: the burger slides the nav in as a drawer from the left.
  // Without JS the links simply wrap under the name (see .js in styles.css).
  function initMenu() {
    var root = document.documentElement;
    var button = document.getElementById("menu-button");
    var nav = document.getElementById("site-nav");
    var overlay = document.getElementById("nav-overlay");
    if (!button || !nav || !overlay) return;

    var phone = window.matchMedia("(max-width: 600px)");

    function links() {
      return Array.prototype.slice.call(nav.querySelectorAll("a[href]"));
    }

    function isOpen() {
      return root.classList.contains("menu-open");
    }

    function open() {
      root.classList.add("menu-open");
      button.setAttribute("aria-expanded", "true");
      document.addEventListener("keydown", onKeydown);
      var first = links()[0];
      if (first) first.focus({ preventScroll: true });
    }

    function close(returnFocus) {
      root.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKeydown);
      if (returnFocus) button.focus();
    }

    function onKeydown(event) {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      // Keep focus cycling between the burger and the menu links.
      var items = [button].concat(links());
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    button.addEventListener("click", function () {
      if (isOpen()) close(true);
      else open();
    });
    overlay.addEventListener("click", function () {
      close(false);
    });
    phone.addEventListener("change", function (e) {
      if (!e.matches && isOpen()) close(false);
    });
  }

  // Drawings strip: previous / next buttons on top of scroll-snap.
  function initArtCarousel() {
    var rail = document.querySelector(".art-rail");
    if (!rail) return;
    var strip = rail.querySelector(".art-carousel");
    var controls = rail.querySelector(".art-rail-controls");
    if (!strip || !controls) return;
    var buttons = controls.querySelectorAll(".art-rail-btn");
    controls.hidden = false;

    function update() {
      var max = strip.scrollWidth - strip.clientWidth - 2;
      buttons[0].disabled = strip.scrollLeft <= 2;
      buttons[1].disabled = strip.scrollLeft >= max;
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var dir = Number(btn.getAttribute("data-dir"));
        strip.scrollBy({ left: dir * strip.clientWidth, behavior: "smooth" });
      });
    });
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  initThemeToggle();
  initMenu();
  initArtCarousel();
})();
