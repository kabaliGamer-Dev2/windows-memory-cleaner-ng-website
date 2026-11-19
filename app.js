/* ==========================================================================
   Windows Memory Cleaner NG — site behaviour
   --------------------------------------------------------------------------
   No framework, no dependencies. Everything here is progressive: with
   JavaScript disabled the page still reads, the FAQ answers are reachable
   because the markup keeps them in the document, and every download link is a
   real anchor.

   Everything respects prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  // Enables the scroll-reveal styles. Everything they hide is visible by default.
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- nav --- */

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navMobile");

  var navStuck = null;

  function updateNav() {
    // Writing the attribute on every scroll event invalidates layout even when the
    // value is unchanged, which is what made the scroll handler expensive.
    if (!nav) return;
    var next = window.scrollY > 8;
    if (next === navStuck) return;
    navStuck = next;
    nav.dataset.stuck = String(next);
  }
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  function setMenu(open) {
    if (!navToggle || !navMobile) return;
    navMobile.dataset.open = String(open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      setMenu(navMobile.dataset.open !== "true");
    });
    // Any navigation closes the sheet.
    navMobile.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    // A resize past the breakpoint must not leave the sheet open.
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  /* ------------------------------------------------------------- reveal --- */

  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.dataset.shown = "true";
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.dataset.shown = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    Array.prototype.forEach.call(revealables, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------- to top --- */

  var toTop = document.getElementById("toTop");
  if (toTop) {
    var onScroll = function () {
      toTop.dataset.visible = String(window.scrollY > 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------- lightbox --- */

  var lightbox = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var current = 0;
  var lastFocused = null;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    current = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[current];
    var thumb = item.querySelector("img");

    lbImage.src = item.dataset.src;
    lbImage.alt = thumb ? thumb.alt : "";
    lbCaption.textContent = item.dataset.caption || "";
    lightbox.dataset.open = "true";
    document.body.style.overflow = "hidden";
    lbClose.focus();

    if (lbImage.complete) return;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.dataset.open = "false";
    document.body.style.overflow = "";
    lbImage.src = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function step(delta) {
    openLightbox(current + delta);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      lastFocused = item;
      openLightbox(index);
    });
  });

  if (lightbox) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () {
      step(-1);
    });
    lbNext.addEventListener("click", function () {
      step(1);
    });

    // Clicking the backdrop closes; clicking the frame does not.
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.dataset.open !== "true") return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "Tab") {
        // Keep focus inside the dialog while it is open.
        var focusable = lightbox.querySelectorAll("button");
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
    });
  }

  /* --------------------------------------------------------------- FAQ --- */

  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  var faqSearch = document.getElementById("faqSearch");
  var faqEmpty = document.getElementById("faqEmpty");

  faqItems.forEach(function (item) {
    var button = item.querySelector(".faq__q");
    if (!button) return;
    button.addEventListener("click", function () {
      var open = item.dataset.open === "true";
      item.dataset.open = String(!open);
      button.setAttribute("aria-expanded", String(!open));
    });
  });

  if (faqSearch) {
    var filter = function () {
      var needle = faqSearch.value.trim().toLowerCase();
      var visible = 0;

      faqItems.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        var match = needle === "" || text.indexOf(needle) !== -1;
        item.style.display = match ? "" : "none";
        if (match) visible += 1;
        // A search that lands on one answer should show it, not make the reader
        // click again.
        if (match && needle !== "") {
          item.dataset.open = "true";
          var btn = item.querySelector(".faq__q");
          if (btn) btn.setAttribute("aria-expanded", "true");
        }
      });

      if (faqEmpty) faqEmpty.dataset.visible = String(visible === 0);
    };

    faqSearch.addEventListener("input", filter);
    faqSearch.addEventListener("search", filter);
  }

  /* ------------------------------------------------------------ checksum --- */

  var copySha = document.getElementById("copySha");
  var shaValue = document.getElementById("shaValue");

  if (copySha && shaValue) {
    var value = (copySha.dataset.copy || "").trim();

    if (!value) {
      copySha.disabled = true;
      copySha.setAttribute("aria-disabled", "true");
      copySha.title = "A checksum is published with the release.";
    }

    copySha.addEventListener("click", function () {
      var text = (copySha.dataset.copy || "").trim();
      if (!text) return;

      var done = function () {
        copySha.title = "Copied";
        copySha.setAttribute("aria-label", "Checksum copied");
        window.setTimeout(function () {
          copySha.title = "";
          copySha.setAttribute("aria-label", "Copy the SHA-256 checksum");
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          copySha.title = "Could not copy — select the text instead.";
        });
      } else {
        // Older webviews: select the text so the reader can copy it manually.
        var range = document.createRange();
        range.selectNodeContents(shaValue);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copySha.title = "Selected — press Ctrl+C.";
      }
    });
  }
})();
