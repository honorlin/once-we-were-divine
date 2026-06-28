(function () {
  "use strict";

  /* ---- Nav scroll state ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 60) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav__links");
  toggle.addEventListener("click", function () {
    links.classList.toggle("open");
    toggle.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("open");
    });
  });

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 0.08 + "s";
    io.observe(el);
  });

  /* ---- Falling petals ---- */
  var petalLayer = document.querySelector(".petals");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (petalLayer && !reduce) {
    var COUNT = 14;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var size = 8 + Math.random() * 10;
      p.style.width = size + "px";
      p.style.height = size * 0.7 + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 9 + Math.random() * 10 + "s";
      p.style.animationDelay = -Math.random() * 18 + "s";
      p.style.opacity = 0.4 + Math.random() * 0.4;
      petalLayer.appendChild(p);
    }
  }

  /* ---- Lightbox gallery ---- */
  var items = Array.prototype.slice.call(
    document.querySelectorAll(".gallery__item")
  );
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var current = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    var fig = items[current];
    lbImg.src = fig.getAttribute("data-src");
    lbImg.alt = fig.querySelector("img").alt;
    lbCap.textContent = fig.getAttribute("data-cap") || "";
  }
  function open(idx) {
    show(idx);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  items.forEach(function (fig, idx) {
    fig.addEventListener("click", function () {
      open(idx);
    });
  });
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbNext").addEventListener("click", function () {
    show(current + 1);
  });
  document.getElementById("lbPrev").addEventListener("click", function () {
    show(current - 1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  /* ---- Hero parallax ---- */
  var heroBg = document.querySelector(".hero__bg");
  if (heroBg && !reduce) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = "scale(1.12) translateY(" + y * 0.18 + "px)";
        }
      },
      { passive: true }
    );
  }
})();
