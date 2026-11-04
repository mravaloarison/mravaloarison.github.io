(function () {
  "use strict";

  // Below 1040px the burger slides the nav in as a drawer from the right.
  // Without JS the links are a plain row instead (see .js in styles.css).
  function initMenu() {
    var root = document.documentElement;
    var button = document.getElementById("menu-button");
    var nav = document.getElementById("site-nav");
    var overlay = document.getElementById("nav-overlay");
    if (!button || !nav || !overlay) return;

    var phone = window.matchMedia("(max-width: 1039px)");

    // Links and dropdown toggles that can take focus right now (a closed
    // dropdown's links are hidden).
    function links() {
      return Array.prototype.slice.call(nav.querySelectorAll("a[href], button")).filter(function (el) {
        return el.getClientRects().length > 0;
      });
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

  // Projects and Arts: a toggle folds their types away. Without JS the
  // toggles are hidden and every type is listed.
  function initNavGroups() {
    var toggles = document.querySelectorAll(".nav-toggle");
    Array.prototype.forEach.call(toggles, function (toggle) {
      toggle.addEventListener("click", function () {
        var group = toggle.closest(".nav-group");
        var open = !group.classList.contains("is-open");
        group.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  // Swipe left / right on an element (touch, pen or a mouse drag).
  function onSwipe(el, toNext, toPrev) {
    var start = null;
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    el.addEventListener("pointercancel", function () {
      start = null;
    });
    el.addEventListener("pointerup", function (e) {
      if (!start || e.pointerId !== start.id) return;
      var dx = e.clientX - start.x;
      var dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      el.setAttribute("data-swiped", "");
      window.setTimeout(function () { el.removeAttribute("data-swiped"); }, 350);
      if (dx < 0) toNext();
      else toPrev();
    });
  }

  // Arts galleries: a picture opens full screen over the gallery, like a
  // photo viewer, with ‹ › (or the arrow keys, or a swipe) to the others in
  // that gallery, close, and an info button for when it was made. The
  // address becomes the piece's own page while it's open, so Back closes it
  // and a reload or a shared link shows that page (the same view, built by
  // _layouts/art.html). Without JS the thumbnails just link to those pages.
  function initViewerDialog() {
    var root = document.documentElement;
    var dialog = document.getElementById("viewer");
    if (!dialog || typeof dialog.showModal !== "function" || !window.history.pushState) return;

    var stage = dialog.querySelector("[data-viewer-stage]");
    var figure = stage.querySelector(".viewer-figure");
    var caption = dialog.querySelector(".viewer-title");
    var time = dialog.querySelector(".viewer-info time");
    var info = dialog.querySelector(".viewer-info");
    var infoButton = dialog.querySelector("[data-viewer-info]");
    var prevButton = dialog.querySelector("[data-viewer-prev]");
    var nextButton = dialog.querySelector("[data-viewer-next]");
    var pageTitle = document.title;
    var siteTitle = pageTitle.split(" · ").pop();
    var list = [];
    var index = 0;
    var img = null;
    var pushed = false;

    function itemsIn(group) {
      return Array.prototype.slice.call(document.querySelectorAll(".gallery-item[data-viewer]")).filter(function (a) {
        return a.getAttribute("data-viewer") === group;
      });
    }

    function picture(a) {
      var el = document.createElement("img");
      el.className = "viewer-img";
      el.alt = a.getAttribute("data-alt") || "";
      el.width = Number(a.getAttribute("data-width")) || 0;
      el.height = Number(a.getAttribute("data-height")) || 0;
      el.decoding = "async";
      el.draggable = false; // so a mouse drag swipes instead of dragging the image
      if (a.getAttribute("data-srcset")) {
        el.sizes = "100vw";
        el.srcset = a.getAttribute("data-srcset");
      }
      el.src = a.getAttribute("data-src");
      return el;
    }

    function show(i) {
      var n = list.length;
      index = ((i % n) + n) % n;
      var a = list[index];
      var next = picture(a);
      if (img) figure.replaceChild(next, img);
      else figure.insertBefore(next, caption);
      img = next;
      caption.textContent = a.getAttribute("data-title");
      time.textContent = a.getAttribute("data-date");
      time.setAttribute("datetime", a.getAttribute("data-datetime"));
      document.title = a.getAttribute("data-title") + " · " + siteTitle;
      if (pushed) window.history.replaceState({ viewer: a.getAttribute("href") }, "", a.href);
      prevButton.hidden = nextButton.hidden = n < 2;
      if (n > 1) {
        picture(list[(index + 1) % n]); // start loading the neighbours
        picture(list[(index + n - 1) % n]);
      }
    }

    function open(a, fromHistory) {
      list = itemsIn(a.getAttribute("data-viewer"));
      info.hidden = true;
      infoButton.setAttribute("aria-expanded", "false");
      if (!fromHistory) window.history.pushState({ viewer: a.getAttribute("href") }, "", a.href);
      pushed = true;
      dialog.showModal();
      root.classList.add("viewer-open");
      show(list.indexOf(a));
    }

    var closingFromHistory = false;

    function close(fromHistory) {
      if (!dialog.open) return;
      closingFromHistory = fromHistory;
      dialog.close(); // the "close" event below tidies up
    }

    // However it closes (the × button, Escape, Back), put the page back.
    dialog.addEventListener("close", function () {
      root.classList.remove("viewer-open");
      document.title = pageTitle;
      if (img) {
        figure.removeChild(img);
        img = null;
      }
      if (pushed) {
        pushed = false;
        if (!closingFromHistory) window.history.back();
      }
      closingFromHistory = false;
      var current = list[index];
      if (current) current.focus();
    });

    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest(".gallery-item[data-viewer]") : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(a, false);
    });

    dialog.querySelector("[data-viewer-close]").addEventListener("click", function () {
      close(false);
    });
    prevButton.addEventListener("click", function () { show(index - 1); });
    nextButton.addEventListener("click", function () { show(index + 1); });
    infoButton.addEventListener("click", function () {
      var opening = info.hidden;
      info.hidden = !opening;
      infoButton.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    dialog.addEventListener("keydown", function (e) {
      if (list.length < 2) return;
      if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
    });
    // A tap on the dark space around the picture closes it, as in a photo viewer.
    stage.addEventListener("click", function (e) {
      if (e.target === stage && !stage.hasAttribute("data-swiped")) close(false);
    });
    onSwipe(stage, function () { if (list.length > 1) show(index + 1); }, function () { if (list.length > 1) show(index - 1); });

    window.addEventListener("popstate", function (e) {
      if (dialog.open) {
        close(true);
      } else if (e.state && e.state.viewer) {
        // Forward again, onto a picture that was open: open it again.
        var a = document.querySelector('.gallery-item[data-viewer][href="' + e.state.viewer + '"]');
        if (a) open(a, true);
      }
    });
  }

  // A piece's own page (the same view): the arrow keys, Escape and swiping
  // follow its ‹ › and close links.
  function initViewerPage() {
    var page = document.querySelector(".viewer-page");
    if (!page) return;
    var prev = page.querySelector(".viewer-prev");
    var next = page.querySelector(".viewer-next");
    var close = page.querySelector(".viewer-close");
    document.addEventListener("keydown", function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key === "ArrowLeft" && prev) prev.click();
      else if (e.key === "ArrowRight" && next) next.click();
      else if (e.key === "Escape" && close) close.click();
    });
    var stage = page.querySelector(".viewer-stage");
    if (stage && prev && next) {
      onSwipe(stage, function () { next.click(); }, function () { prev.click(); });
    }
  }

  initMenu();
  initNavGroups();
  initViewerDialog();
  initViewerPage();
})();
