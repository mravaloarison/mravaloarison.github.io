(function () {
  "use strict";

  function readStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (err) {
      return null;
    }
  }

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
    var stored = readStoredTheme();

    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    }

    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      storeTheme(next);
    });
  }

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function initNavDrawer() {
    var menuButton = document.getElementById("menu-button");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    if (!menuButton || !sidebar || !overlay) return;

    function isOpen() {
      return sidebar.classList.contains("is-open");
    }

    function openDrawer() {
      sidebar.classList.add("is-open");
      overlay.hidden = false;
      menuButton.setAttribute("aria-expanded", "true");
      document.addEventListener("keydown", onKeydown);
      var focusable = getFocusable(sidebar);
      if (focusable.length) focusable[0].focus();
    }

    function closeDrawer(returnFocus) {
      sidebar.classList.remove("is-open");
      overlay.hidden = true;
      menuButton.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKeydown);
      if (returnFocus) menuButton.focus();
    }

    function onKeydown(event) {
      if (event.key === "Escape") {
        closeDrawer(true);
        return;
      }

      if (event.key === "Tab") {
        var focusable = getFocusable(sidebar);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    menuButton.addEventListener("click", function () {
      if (isOpen()) {
        closeDrawer(true);
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener("click", function () {
      closeDrawer(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && isOpen()) {
        closeDrawer(false);
      }
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function initOnThisPage() {
    var main = document.getElementById("main");
    var aside = document.getElementById("on-this-page");
    var asideNav = document.getElementById("on-this-page-nav");
    if (!main || !aside || !asideNav) return;

    var headings = Array.prototype.slice.call(main.querySelectorAll("h2, h3"));
    if (headings.length < 2) return;

    var usedIds = {};
    var list = document.createElement("ul");

    headings.forEach(function (heading) {
      if (!heading.id) {
        var base = slugify(heading.textContent);
        var id = base;
        var i = 1;
        while (usedIds[id] || document.getElementById(id)) {
          id = base + "-" + i++;
        }
        heading.id = id;
      }
      usedIds[heading.id] = true;

      var item = document.createElement("li");
      if (heading.tagName === "H3") {
        item.style.paddingLeft = "12px";
      }
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    asideNav.appendChild(list.cloneNode(true));
    aside.hidden = false;

    var mobileDetails = document.createElement("details");
    mobileDetails.className = "on-this-page-mobile";
    var summary = document.createElement("summary");
    summary.textContent = "On This Page";
    var mobileNav = document.createElement("nav");
    mobileNav.appendChild(list);
    mobileDetails.appendChild(summary);
    mobileDetails.appendChild(mobileNav);
    main.insertBefore(mobileDetails, main.firstChild);

    var links = Array.prototype.slice.call(asideNav.querySelectorAll("a"));

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = links.filter(function (a) {
            return a.getAttribute("href") === "#" + entry.target.id;
          })[0];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (a) {
              a.removeAttribute("aria-current");
            });
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  initThemeToggle();
  initNavDrawer();
  initOnThisPage();
})();
