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

  // Mami's logo animation (made from her Procreate export by
  // scripts/make-logo-animation.py): its frames side by side in one image,
  // stepped through once over the still logo. The layout puts the frame
  // count, the length and the strips on the logo link.
  var logoAnim = (function () {
    var a = document.querySelector(".site-logo[data-anim-strips]");
    if (!a) return null;
    var strips = a.getAttribute("data-anim-strips").split(",").map(function (s) {
      var p = s.trim().split(/\s+/);
      return { src: p[0], size: Number(p[1]) || 0 };
    }).filter(function (x) { return x.src; }).sort(function (x, y) { return x.size - y.size; });
    var frames = Number(a.getAttribute("data-anim-frames"));
    var duration = Number(a.getAttribute("data-anim-duration"));
    if (!strips.length || !(frames > 1) || !(duration > 0)) return null;
    return { frames: frames, duration: duration, strips: strips };
  })();
  var stripLoads = {};

  // The smallest strip that's sharp for something this many CSS pixels wide.
  function logoStrip(cssPx) {
    var need = cssPx * (window.devicePixelRatio || 1) * 0.9;
    for (var i = 0; i < logoAnim.strips.length; i++) {
      if (logoAnim.strips[i].size >= need) return logoAnim.strips[i].src;
    }
    return logoAnim.strips[logoAnim.strips.length - 1].src;
  }

  function loadStrip(src) {
    if (!stripLoads[src]) {
      stripLoads[src] = new Promise(function (resolve, reject) {
        var im = new Image();
        im.onload = function () {
          if (im.decode) im.decode().then(resolve, resolve);
          else resolve();
        };
        im.onerror = reject;
        im.src = src;
      });
    }
    return stripLoads[src];
  }

  // Play it once over `still` (an image inside `host`, which is
  // positioned): the still hides underneath and is back after the last
  // frame. Returns a function that stops it early.
  function playLogo(host, still, src, onEnd) {
    var box = document.createElement("span");
    box.className = "logo-anim";
    box.setAttribute("aria-hidden", "true");
    box.style.left = still.offsetLeft + "px";
    box.style.top = still.offsetTop + "px";
    box.style.width = still.offsetWidth + "px";
    box.style.height = still.offsetHeight + "px";
    box.style.backgroundImage = "url(" + src + ")";
    box.style.backgroundSize = logoAnim.frames * 100 + "% 100%";
    host.appendChild(box);
    var anim = null;
    try {
      anim = box.animate([{ backgroundPosition: "0% 0%" }, { backgroundPosition: "100% 0%" }], {
        duration: logoAnim.duration,
        easing: "steps(" + logoAnim.frames + ", jump-none)",
        fill: "forwards"
      });
    } catch (e) {} // a browser without stepped easing: no animation
    var stopped = false;
    function stop() {
      if (stopped) return;
      stopped = true;
      if (anim) anim.cancel();
      still.style.visibility = "";
      if (box.parentNode) box.parentNode.removeChild(box);
    }
    if (!anim) {
      stop();
      if (onEnd) onEnd();
      return stop;
    }
    still.style.visibility = "hidden";
    anim.onfinish = function () {
      if (stopped) return;
      stop();
      if (onEnd) onEnd();
    };
    return stop;
  }

  // A reload (Mami's request): the logo plays the animation again where it
  // sits, once its strip is in. Not on the first visit (that's the intro),
  // nor with reduced motion.
  // Wide screens (Mami's requests, November 2026): the dog's card sits
  // beside the page's title block, from the top of the eyebrow ("PORTFOLIO")
  // to the bottom of the title, and the first menu link sits level with the
  // first sentence under it. Titles sit at different heights (a breadcrumb,
  // a title on two lines), so this is measured; with JS off the column keeps
  // the place that's right for a page without a breadcrumb. Measured with
  // offsets, not rects, so a paragraph that's still rising into place
  // (content coming in, the intro) counts where it will land: with rects
  // the Long bio's menu ended up too low.
  function initNavAlign() {
    var root = document.documentElement;
    var link = document.querySelector(".site-nav a");
    var h1 = document.querySelector("main h1");
    if (!link || !h1 || !window.matchMedia) return;
    var eyebrow = document.querySelector("main .eyebrow-row, main .eyebrow") || h1;
    // the first sentence: the abstract under the title, or the Long bio's first paragraph
    var first = document.querySelector("main .abstract, main .bio-text p");
    var wide = window.matchMedia("(min-width: 1040px)");

    function pageTop(el) {
      var y = 0;
      while (el) {
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return y;
    }
    function align() {
      ["--logo-top", "--logo-h", "--nav-gap"].forEach(function (name) { root.style.removeProperty(name); });
      if (!wide.matches) return;
      var top = pageTop(eyebrow);
      var height = Math.max(72, pageTop(h1) + h1.offsetHeight - top);
      root.style.setProperty("--logo-top", Math.round(top) + "px");
      root.style.setProperty("--logo-h", Math.round(height) + "px");
      if (!first) return;
      var line = parseFloat(getComputedStyle(first).lineHeight) || first.offsetHeight;
      var gap = pageTop(first) + line / 2 - (top + height) - link.offsetHeight / 2;
      root.style.setProperty("--nav-gap", Math.max(0, Math.round(gap)) + "px");
    }

    align();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    window.addEventListener("load", align);
    window.addEventListener("resize", align);
  }

  function initLogoReload() {
    if (!logoAnim || document.documentElement.classList.contains("intro-running")) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var perf = window.performance;
    var nav = perf && perf.getEntriesByType ? perf.getEntriesByType("navigation")[0] : null;
    var reloaded = nav ? nav.type === "reload" : !!(perf && perf.navigation && perf.navigation.type === 1);
    if (!reloaded) return;
    var link = document.querySelector(".site-logo");
    var still = link && link.querySelector("img");
    if (!still || !still.offsetWidth) return;
    var src = logoStrip(still.offsetWidth);
    loadStrip(src).then(function () {
      window.setTimeout(function () { playLogo(link, still, src); }, 350);
    }, function () {});
  }

  // Arts galleries: a picture opens full screen over the gallery, like a
  // photo viewer, with ‹ › (or the arrow keys, or a swipe) to the others in
  // that gallery, close, and an info button for when it was made. The
  // address becomes the piece's own page while it's open, so Back closes it
  // and a reload or a shared link shows that page (the same view, built by
  // _layouts/art.html). Without JS the thumbnails just link to those pages.
  // Opening, the picture grows out of its square to its full shape; closing,
  // it shrinks back into its square (Mami's request, like a photo app). The
  // logo opens the same way, from its corner.
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
    var replayButton = dialog.querySelector("[data-viewer-replay]");
    var chrome = [dialog.querySelector(".viewer-bar"), prevButton, nextButton, caption];
    var pageTitle = document.title;
    var siteTitle = pageTitle.split(" · ").pop();
    var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var EASE = "cubic-bezier(0.32, 0.72, 0, 1)"; // the drawer's: quick out, soft landing
    var SHADE = "rgb(14 13 12)";
    var CLEAR = "rgb(14 13 12 / 0)";
    var BIG = { transform: "translate(0px, 0px) scale(1) rotate(0deg)", clipPath: "inset(0px 0px)", opacity: 1 };
    var list = [];
    var index = 0;
    var img = null;
    var pushed = false;
    var closing = false;
    var closingFromHistory = false;
    var zoom = null;      // the zoom under way: its animations and what ends it
    var ghost = null;     // the picture flying between the page and the viewer
    var lifted = null;    // the square (or the logo) hidden while its picture is up
    var pressed = null;   // a picture fetched early, on the press that opens it
    var stopLogo = null;  // the logo animation playing in the viewer

    // Everything that opens in the viewer carries data-viewer="<group>": the
    // gallery thumbnails, the pieces a sample gallery doesn't show (hidden
    // spans with data-href), and the logo. ‹ › step through one group.
    function itemsIn(group) {
      return Array.prototype.slice.call(document.querySelectorAll("[data-viewer]")).filter(function (a) {
        return a.getAttribute("data-viewer") === group;
      });
    }

    // The address while a piece is open: its own page. Things without a page
    // of their own (the logo) keep the current address.
    function urlOf(a) {
      if (a.hasAttribute("data-viewer-keep-url")) return window.location.href;
      return a.getAttribute("data-href") || a.getAttribute("href");
    }

    function keyOf(a) {
      return a.getAttribute("data-viewer") + " " + (a.getAttribute("data-href") || a.getAttribute("href"));
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

    // As big as fits between the bar and the name, never bigger than the
    // picture itself: what the CSS gives once it has loaded, set up front so
    // the zoom knows where it lands and nothing moves when it arrives.
    function fit(el, a) {
      var w = Number(a.getAttribute("data-width"));
      var h = Number(a.getAttribute("data-height"));
      if (!w || !h) return;
      var cs = window.getComputedStyle(stage);
      var roomW = Math.min(1200, stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
      var roomH = window.innerHeight - (parseFloat(window.getComputedStyle(dialog).getPropertyValue("--viewer-chrome")) || 140);
      var scale = Math.min(1, roomW / w, roomH / h);
      if (!(scale > 0)) return;
      el.style.maxWidth = el.style.maxHeight = "none";
      el.style.width = Math.round(w * scale) + "px";
      el.style.height = Math.round(h * scale) + "px";
    }

    // Something with an animation of its own: the logo.
    function animated(a) {
      return !!(logoAnim && a && a.hasAttribute("data-anim-strips"));
    }

    function stopAnimation() {
      if (stopLogo) {
        stopLogo();
        stopLogo = null;
      }
    }

    // The logo plays its animation over the big picture: once after the
    // zoom, and again with the replay button.
    function replay() {
      if (!img || closing || !animated(list[index])) return;
      var shown = img;
      var src = logoStrip(img.offsetWidth);
      loadStrip(src).then(function () {
        if (img !== shown || !dialog.open || closing || img.classList.contains("is-waiting")) return;
        stopAnimation();
        stopLogo = playLogo(figure, img, src, function () { stopLogo = null; });
      }, function () {});
    }

    function zoomable() {
      return typeof dialog.animate === "function" && !(reduceMotion && reduceMotion.matches);
    }

    function onScreen(el) {
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    }

    // The picture a piece sits as on the page: its gallery square, or the
    // logo. None for a piece the page doesn't show, or one off screen; a
    // gallery square further down is first scrolled into view when asked
    // (behind the viewer, as a photo app does), so closing can land on it.
    function thumbOf(a, scrollTo) {
      if (!a || !a.getClientRects().length) return null;
      var t = a.querySelector("img");
      if (!t) return null;
      settleReveal(a); // a square still held back or coming in: in its place now
      if (scrollTo && !onScreen(t) && a.classList.contains("gallery-item")) {
        root.style.scrollBehavior = "auto";
        a.scrollIntoView({ block: "center" });
        root.style.scrollBehavior = "";
      }
      return onScreen(t) ? t : null;
    }

    // Where a thumbnail is and how it looks right now (the logo may be
    // mid-tilt, a hovered square a little faded).
    function frameOf(t) {
      var r = t.getBoundingClientRect();
      var cs = window.getComputedStyle(t);
      var angle = 0;
      var m = /^matrix\(([^)]+)\)/.exec(cs.transform || "");
      if (m) {
        var v = m[1].split(",");
        angle = Math.atan2(parseFloat(v[1]), parseFloat(v[0])) * 180 / Math.PI;
      }
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: t.offsetWidth || r.width,
        h: t.offsetHeight || r.height,
        angle: angle,
        opacity: parseFloat(cs.opacity) || 1,
        src: t.currentSrc || t.src
      };
    }

    // The flying picture as it sits on the page: the whole picture scaled to
    // cover the square (what object-fit: cover does there), cut to it.
    function pageFrame(f, box) {
      var s = Math.max(f.w / box.width, f.h / box.height);
      var ix = Math.max(0, (box.width - f.w / s) / 2);
      var iy = Math.max(0, (box.height - f.h / s) / 2);
      return {
        transform: "translate(" + (f.cx - box.left - box.width / 2) + "px, " + (f.cy - box.top - box.height / 2) + "px) scale(" + s + ") rotate(" + f.angle + "deg)",
        clipPath: "inset(" + iy + "px " + ix + "px)",
        opacity: f.opacity
      };
    }

    function makeGhost(src, box) {
      dropGhost();
      ghost = document.createElement("img");
      ghost.className = "viewer-ghost";
      ghost.alt = "";
      ghost.draggable = false;
      ghost.src = src;
      ghost.style.left = box.left + "px";
      ghost.style.top = box.top + "px";
      ghost.style.width = box.width + "px";
      ghost.style.height = box.height + "px";
      dialog.appendChild(ghost);
    }

    function dropGhost() {
      if (ghost) {
        ghost.parentNode.removeChild(ghost);
        ghost = null;
      }
    }

    function lift(a) {
      land();
      lifted = a;
      a.style.visibility = "hidden";
    }

    function land() {
      if (lifted) {
        lifted.style.visibility = "";
        lifted = null;
      }
    }

    function run(anims, end) {
      var z = { anims: anims, end: end };
      zoom = z;
      anims[0].onfinish = function () {
        if (zoom === z) settle();
      };
    }

    // Jump a zoom under way to its end, now.
    function settle() {
      if (!zoom) return;
      var z = zoom;
      zoom = null;
      z.anims.forEach(function (x) { x.cancel(); });
      z.end();
    }

    // Opening: the square grows into the picture, the dark coming up behind
    // it and the buttons and name after. The flying picture is the one the
    // gallery already shows; the sharp one takes its place once it's ready.
    function zoomIn(a, f) {
      var box = img.getBoundingClientRect();
      if (!box.width || !box.height) {
        root.classList.add("viewer-shaded");
        return;
      }
      var early = pressed && pressed.a === a && pressed.el.complete && pressed.el.naturalWidth ? pressed.el.currentSrc : "";
      makeGhost(early || f.src, box);
      img.classList.add("is-waiting");
      lift(a);
      var shown = img;
      var flying = ghost;
      run([
        ghost.animate([pageFrame(f, box), BIG], { duration: 420, easing: EASE }),
        dialog.animate([{ backgroundColor: CLEAR }, { backgroundColor: SHADE }], { duration: 320, easing: "ease-out" })
      ].concat(chrome.map(function (el) {
        return el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 200, easing: "ease-out", fill: "backwards" });
      })), function () {
        land();
        root.classList.add("viewer-shaded");
        function swap() {
          shown.classList.remove("is-waiting");
          if (ghost === flying) dropGhost();
          if (img === shown && animated(a)) window.setTimeout(replay, 150); // the logo says hello
        }
        if (shown.decode) shown.decode().then(swap, swap);
        else swap();
      });
    }

    // Closing: the picture shrinks back into its square, the page coming
    // back around it; a piece the page doesn't show just fades.
    function zoomOut() {
      var a = list[index];
      var t = thumbOf(a, true);
      var box = img ? img.getBoundingClientRect() : null;
      root.classList.remove("viewer-shaded");
      if (!t || !box || !box.width) {
        run([dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out", fill: "forwards" })], finishClose);
        return;
      }
      var f = frameOf(t);
      var src = img.complete && img.naturalWidth ? img.currentSrc : (ghost ? ghost.src : f.src);
      makeGhost(src, box);
      img.classList.add("is-waiting");
      lift(a);
      var end = pageFrame(f, box);
      end.opacity = 1;
      run([
        ghost.animate([BIG, end], { duration: 360, easing: EASE, fill: "forwards" }),
        dialog.animate([{ backgroundColor: SHADE }, { backgroundColor: CLEAR }], { duration: 300, easing: "ease-out", fill: "forwards" })
      ].concat(chrome.map(function (el) {
        return el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: "ease-out", fill: "forwards" });
      })), function () {
        finishClose();
        var name = a.querySelector(".gallery-title");
        if (name && name.animate) name.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
      });
    }

    function finishClose() {
      land();
      dropGhost();
      dialog.close(); // the "close" event below tidies up
    }

    function show(i) {
      settle(); // an opening still under way ends first
      dropGhost();
      stopAnimation();
      var n = list.length;
      index = ((i % n) + n) % n;
      var a = list[index];
      var next = picture(a);
      if (img) figure.replaceChild(next, img);
      else figure.insertBefore(next, caption);
      img = next;
      fit(img, a);
      replayButton.hidden = !animated(a);
      if (animated(a)) loadStrip(logoStrip(parseFloat(img.style.width) || 512)).catch(function () {});
      caption.textContent = a.getAttribute("data-title");
      time.textContent = a.getAttribute("data-date");
      time.setAttribute("datetime", a.getAttribute("data-datetime"));
      document.title = a.getAttribute("data-title") + " · " + siteTitle;
      if (pushed) window.history.replaceState({ viewer: keyOf(a) }, "", urlOf(a));
      prevButton.hidden = nextButton.hidden = n < 2;
      if (n > 1) {
        picture(list[(index + 1) % n]); // start loading the neighbours
        picture(list[(index + n - 1) % n]);
      }
    }

    function step(by) {
      if (!closing && list.length > 1) show(index + by);
    }

    function open(a, fromHistory) {
      if (dialog.open) return;
      var t = zoomable() ? thumbOf(a, false) : null;
      var f = t ? frameOf(t) : null; // measured before the viewer covers it
      list = itemsIn(a.getAttribute("data-viewer"));
      info.hidden = true;
      infoButton.setAttribute("aria-expanded", "false");
      if (!fromHistory) window.history.pushState({ viewer: keyOf(a) }, "", urlOf(a));
      pushed = true;
      closing = false;
      dialog.showModal();
      root.classList.add("viewer-open");
      show(list.indexOf(a));
      if (f) zoomIn(a, f);
      else root.classList.add("viewer-shaded");
    }

    function close(fromHistory) {
      if (!dialog.open || closing) return;
      closing = true;
      closingFromHistory = fromHistory;
      settle();
      stopAnimation();
      if (zoomable()) zoomOut();
      else finishClose();
    }

    // However it closes (the × button, Escape, Back), put the page back.
    dialog.addEventListener("close", function () {
      settle();
      stopAnimation();
      land();
      dropGhost();
      closing = false;
      root.classList.remove("viewer-open", "viewer-shaded");
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
      if (current && current.offsetParent !== null) current.focus();
      else if (list[0] && list[0].offsetParent !== null) list[0].focus(); // a hidden piece: back to its gallery
    });

    // Escape: close the same way as × (if the browser lets the close wait).
    dialog.addEventListener("cancel", function (e) {
      if (!e.cancelable) return;
      e.preventDefault();
      close(false);
    });

    // Fetch a piece's picture on the press that opens it, so the zoom can
    // often fly the sharp one.
    document.addEventListener("pointerdown", function (e) {
      var a = e.target.closest ? e.target.closest("a[data-viewer]") : null;
      if (a && !dialog.open && e.button === 0) pressed = { a: a, el: picture(a) };
    }, { passive: true });

    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a[data-viewer]") : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(a, false);
    });

    dialog.querySelector("[data-viewer-close]").addEventListener("click", function () {
      close(false);
    });
    prevButton.addEventListener("click", function () { step(-1); });
    nextButton.addEventListener("click", function () { step(1); });
    replayButton.addEventListener("click", replay);
    infoButton.addEventListener("click", function () {
      var opening = info.hidden;
      info.hidden = !opening;
      infoButton.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });
    // A tap on the dark space around the picture closes it, as in a photo viewer.
    stage.addEventListener("click", function (e) {
      if (e.target === stage && !stage.hasAttribute("data-swiped")) close(false);
    });
    onSwipe(stage, function () { step(1); }, function () { step(-1); });

    window.addEventListener("resize", function () {
      if (dialog.open && img && !zoom) fit(img, list[index]);
    });

    window.addEventListener("popstate", function (e) {
      if (dialog.open) {
        close(true);
      } else if (e.state && e.state.viewer) {
        // Forward again, onto a picture that was open: open it again.
        var match = Array.prototype.filter.call(document.querySelectorAll("[data-viewer]"), function (x) {
          return keyOf(x) === e.state.viewer;
        })[0];
        if (match) open(match, true);
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
      if (document.querySelector("dialog[open]")) return;
      if (e.key === "ArrowLeft" && prev) prev.click();
      else if (e.key === "ArrowRight" && next) next.click();
      else if (e.key === "Escape" && close) close.click();
    });
    var stage = page.querySelector(".viewer-stage");
    if (stage && prev && next) {
      onSwipe(stage, function () { next.click(); }, function () { prev.click(); });
    }
  }

  // Animations (Arts → Animated): short silent loops that play by
  // themselves while they're on screen, like GIFs, and rest when they
  // scroll away (Mami's request). With reduced motion they stay on their
  // still frame; the big one on an animation's page has a button to pause
  // or play it (moving things need a way to stop them). Without JS: the
  // gallery shows still frames and the page a plain player.
  function initLoops() {
    var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-loop]"));
    if (!videos.length) return;
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var loops = videos.map(function (v) {
      var loop = {
        video: v,
        wanted: !still,   // playing whenever it's on screen
        seen: false,
        toggle: v.parentNode.querySelector("[data-loop-toggle]"),
        item: v.closest ? v.closest(".gallery-item") : null
      };
      v.muted = true;
      v.removeAttribute("controls");
      if (loop.toggle) {
        loop.toggle.hidden = false;
        loop.toggle.addEventListener("click", function () {
          loop.wanted = !loop.wanted;
          sync(loop);
        });
      }
      v.addEventListener("playing", function () { show(loop); });
      v.addEventListener("pause", function () { show(loop); });
      show(loop);
      return loop;
    });

    function show(loop) {
      var playing = !loop.video.paused;
      if (loop.item) loop.item.classList.toggle("is-playing", playing);
      if (loop.toggle) {
        loop.toggle.classList.toggle("is-paused", !loop.wanted);
        var label = loop.toggle.querySelector("[data-loop-label]");
        if (label) label.textContent = loop.wanted ? "Pause the animation" : "Play the animation";
      }
    }

    function sync(loop) {
      var v = loop.video;
      if (loop.wanted && loop.seen) {
        if (v.paused) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {}); // no autoplay here: the still frame stays
        }
      } else if (!v.paused) {
        v.pause();
      }
      show(loop);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          loops.forEach(function (loop) {
            if (loop.video === entry.target) {
              loop.seen = entry.isIntersecting && entry.intersectionRatio >= 0.2;
              sync(loop);
            }
          });
        });
      }, { threshold: [0, 0.2] });
      videos.forEach(function (v) { io.observe(v); });
    } else {
      loops.forEach(function (loop) {
        loop.seen = true;
        sync(loop);
      });
    }
  }

  // Content coming in (Mami's request, November 2026). styles.css brings in
  // what's on screen when a page opens, on its own; this holds back what's
  // further down (.reveal-wait: hidden, a little below its place) and lets
  // each piece fade up into place once it's nearly on screen, a beat apart
  // when several arrive together. Keep
  // REVEAL in step with the selectors in styles.css ("Content coming in").
  var REVEAL = [
    "main:not(.viewer) > h1 ~ :not(.abstract, script, [hidden], .card-grid, .post-list, .entry-list, .gallery-grid, .bio-text)",
    "main:not(.viewer) > h1 ~ :is(.card-grid, .post-list, .entry-list, .gallery-grid, .bio-text) > *",
    ".site-footer"
  ].join(", ");
  var revealWatch = null;

  // A piece in its place at once: shown if it's still held back, its
  // animation run to the end if it's coming in (the viewer closing onto a
  // square further down, keyboard focus landing inside one).
  function settleReveal(el) {
    if (!el) return;
    if (el.classList.contains("reveal-wait")) {
      if (revealWatch) revealWatch.unobserve(el);
      el.style.animation = "none";
      el.classList.remove("reveal-wait");
    } else if (el.getAnimations) {
      el.getAnimations().forEach(function (anim) {
        if (/^reveal-/.test(anim.animationName || "")) anim.finish();
      });
    }
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var pieces;
    try {
      pieces = document.querySelectorAll(REVEAL);
    } catch (e) {
      return; // a browser without :is() / :not() lists: styles.css skips it all too
    }
    var fold = window.innerHeight;
    var held = Array.prototype.filter.call(pieces, function (el) {
      return el.getBoundingClientRect().top > fold;
    });
    if (!held.length) return;
    held.forEach(function (el) { el.classList.add("reveal-wait"); });

    revealWatch = new IntersectionObserver(function (entries) {
      var coming = entries.filter(function (entry) { return entry.isIntersecting; });
      coming.sort(function (a, b) {
        return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left);
      });
      coming.forEach(function (entry, i) {
        var el = entry.target;
        revealWatch.unobserve(el);
        el.style.animationDelay = Math.min(i, 5) * 90 + "ms";
        el.classList.remove("reveal-wait"); // its animation starts from the top
        el.addEventListener("animationend", function done(e) {
          if (e.target !== el) return;
          el.removeEventListener("animationend", done);
          el.style.animation = "none"; // done for good: nothing can start it again
        });
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    held.forEach(function (el) { revealWatch.observe(el); });

    document.addEventListener("focusin", function (e) {
      if (e.target.closest) settleReveal(e.target.closest(".reveal-wait"));
    });
  }

  // The assets folder, from this script's own address (assets/js/main.js).
  var ASSETS = ((document.currentScript && document.currentScript.src) || "/assets/js/main.js").replace(/js\/main\.js.*$/, "");

  // First visit in a tab (html.intro, set before first paint in head.html):
  // the dog appears in the middle of the screen and plays Mami's logo
  // animation (a glint on the sunglasses, an ear flick), then glides into
  // its place as the logo and the page's blocks rise in one after another,
  // the way iOS brings in a screen. Any tap, key or scroll ends it at once.
  function initIntro() {
    var root = document.documentElement;
    if (!root.classList.contains("intro")) return;
    // on a connection so slow the page's own cover has already lifted
    // (styles.css, after 3 s), the page is showing: no intro over it now
    if (window.performance && performance.now() > 2500) {
      root.classList.remove("intro");
      return;
    }
    var target = document.querySelector(".site-logo img");
    var timers = [];
    var reveals = [];
    var done = false;
    var INPUTS = ["pointerdown", "keydown", "wheel", "touchstart"];

    function el(tag, cls) {
      var e = document.createElement(tag);
      e.className = cls;
      return e;
    }
    function later(ms, fn) {
      timers.push(window.setTimeout(fn, ms));
    }

    var layer = el("div", "intro-layer");
    var stage = el("div", "intro-stage");
    var dog = el("div", "intro-dog");
    var still = el("img", "intro-still");
    still.alt = "";
    still.width = still.height = 512;
    still.src = ASSETS + "brand/logo-512.webp";
    layer.setAttribute("aria-hidden", "true");
    stage.setAttribute("aria-hidden", "true");
    dog.appendChild(still);
    stage.appendChild(dog);
    document.body.appendChild(layer);
    document.body.appendChild(stage);
    root.classList.add("intro-running");
    root.classList.remove("intro"); // this layer takes over from the first-paint cover

    var glided = false;
    var started = false;
    var shown = false;
    var ready = false;
    var src = logoAnim ? logoStrip(dog.offsetWidth || 220) : null;

    // the animation, once the dog is in and its frames have arrived; the
    // dog moves off a moment after its last frame
    function hello() {
      if (started || glided || done) return;
      started = true;
      playLogo(dog, still, src, function () { later(300, glide); });
    }
    if (src) {
      loadStrip(src).then(function () {
        ready = true;
        if (shown) hello();
      }, function () {});
    }

    // The page's blocks rise in, top to bottom, a little apart: a soft fade,
    // a short rise and a hint of blur that clears (only what's on screen).
    function reveal() {
      var vh = window.innerHeight;
      var vw = window.innerWidth;
      var items = [];
      Array.prototype.forEach.call(document.querySelectorAll(".menu-button, .site-nav > ul > li, main > *, .site-footer"), function (node) {
        var r = node.getBoundingClientRect();
        if (!r.width || !r.height || r.bottom < 0 || r.top > vh || r.left >= vw || r.right <= 0) return;
        items.push({ node: node, top: r.top, left: r.left });
      });
      items.sort(function (a, b) { return (a.top - b.top) || (a.left - b.left); });
      items.forEach(function (item, i) {
        if (!item.node.animate) return;
        reveals.push(item.node.animate([
          { opacity: 0, transform: "translateY(16px) scale(0.985)", filter: "blur(4px)" },
          { opacity: 1, transform: "none", filter: "blur(0)" }
        ], { duration: 700, delay: Math.min(i * 55, 440), easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));
      });
      later(1500, stopListening);
    }

    function stopListening() {
      INPUTS.forEach(function (type) { window.removeEventListener(type, skip); });
    }

    // take the intro's layers away and give the logo back
    function finish() {
      if (done) return;
      done = true;
      root.classList.remove("intro-running");
      layer.remove();
      stage.remove();
    }

    function skip() {
      reveals.forEach(function (anim) { anim.finish(); }); // the page as it is, now
      timers.forEach(window.clearTimeout);
      timers = [];
      stopListening();
      glided = true; // a late strip can't start the animation now
      if (done) return;
      layer.classList.add("is-skipping");
      stage.classList.add("is-skipping");
      window.setTimeout(finish, 170);
    }
    INPUTS.forEach(function (type) {
      window.addEventListener(type, skip, { passive: true });
    });

    // the dog is all but there: the page comes in under it
    function uncover() {
      reveal(); // hides the blocks first, so the cover can go in the same frame
      layer.remove();
    }

    function glide() {
      if (glided || done) return;
      glided = true;
      var from = dog.getBoundingClientRect();
      var to = target ? target.getBoundingClientRect() : null;
      var onScreen = to && to.width > 0 && to.bottom > 0 && to.top < window.innerHeight;
      if (onScreen && dog.animate) {
        var move = "translate(" + (to.left - from.left) + "px, " + (to.top - from.top) + "px) scale(" + to.width / from.width + ")";
        dog.animate([{ transform: "none" }, { transform: move }], {
          duration: 650,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          fill: "forwards"
        });
      } else {
        dog.classList.add("is-fading");
      }
      later(430, uncover);
      later(680, finish); // landed: the real logo takes over
    }

    // The dog is in after its fade; the animation starts then (or as soon as
    // its frames arrive). Without them by 1.5 s it just moves on, still; by
    // 3 s it moves whatever happens.
    later(560, function () {
      shown = true;
      if (ready) hello();
    });
    later(1500, function () {
      if (!started) glide();
    });
    later(3000, glide);
  }

  initNavAlign();
  initIntro();
  initReveal();
  initLogoReload();
  initMenu();
  initNavGroups();
  initViewerDialog();
  initViewerPage();
  initLoops();
})();
