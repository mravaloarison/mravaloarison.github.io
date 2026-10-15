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

  // Table of contents: mark the section you're reading as you scroll.
  function initTocSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if (!links.length) return;

    var headings = [];
    links.forEach(function (link) {
      var el = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (el && headings.indexOf(el) === -1) headings.push(el);
    });
    if (!headings.length) return;

    var current = null;
    var ticking = false;

    function update() {
      ticking = false;
      // The last heading above this line is the section being read.
      var line = window.innerHeight * 0.3;
      var active = null;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= line) active = headings[i];
        else break;
      }
      // At the very bottom, the last section wins even if its heading is low.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        active = headings[headings.length - 1];
      }
      var id = active ? active.id : null;
      if (id === current) return;
      current = id;
      links.forEach(function (link) {
        if (id && link.hash === "#" + id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  initThemeToggle();
  initMenu();
  initTocSpy();
})();
