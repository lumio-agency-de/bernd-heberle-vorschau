/* bernd heberle — Interaktion (kein Framework, keine Inline-Scripts) */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: Scroll-Zustand + mobiles Menü ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("navBurger");
  if (nav) {
    var onScrollNav = function () {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScrollNav, { passive: true });
    onScrollNav();
  }
  if (nav && burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll-Reveals ---------- */
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Hero-Mosaik: gestaffelte Enthüllung + Parallax ---------- */
  var plates = Array.prototype.slice.call(document.querySelectorAll(".hero .plate"));
  if (plates.length) {
    plates.forEach(function (p, i) {
      window.setTimeout(function () { p.classList.add("in"); }, 250 + i * 140);
    });
  }
  var colA = document.querySelector(".mosaic__col--a");
  var colB = document.querySelector(".mosaic__col--b");
  if (!reduced && colA && colB) {
    var ticking = false;
    var parallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        colA.style.transform = "translateY(" + y * -0.06 + "px)";
        colB.style.transform = "translateY(" + y * 0.05 + "px)";
      }
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(parallax);
      }
    }, { passive: true });
  }

  /* ---------- Lightbox (Referenz-Galerien) ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lightbox__caption");
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".galerie__grid button"));
    var current = -1;

    var show = function (i) {
      if (i < 0) i = buttons.length - 1;
      if (i >= buttons.length) i = 0;
      current = i;
      var thumb = buttons[i].querySelector("img");
      lbImg.src = thumb.src;
      lbImg.alt = thumb.alt;
      if (lbCap) lbCap.textContent = thumb.alt;
    };
    var openLb = function (i) {
      show(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    var closeLb = function () {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    };

    buttons.forEach(function (b, i) {
      b.addEventListener("click", function () { openLb(i); });
    });
    lb.querySelector(".lightbox__close").addEventListener("click", closeLb);
    lb.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
    lb.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- Atmosphäre-Slots: Bild einblenden, sobald Datei existiert ---------- */
  document.querySelectorAll(".atmo[data-src]").forEach(function (slot) {
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.src = slot.getAttribute("data-src");
      img.alt = slot.getAttribute("data-alt") || "";
      img.loading = "lazy";
      slot.appendChild(img);
      slot.classList.add("loaded");
    };
    probe.src = slot.getAttribute("data-src");
  });
})();
