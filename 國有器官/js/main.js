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
  function observeReveals(root) {
    (root || document).querySelectorAll(".reveal:not(.in)").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      io.observe(el);
    });
  }
  observeReveals();

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

  /* ---- Rising light embers (天國光點) ---- */
  var emberLayer = document.querySelector(".embers");
  if (emberLayer && !reduce) {
    var E_COUNT = 44;
    for (var j = 0; j < E_COUNT; j++) {
      var e = document.createElement("span");
      e.className = "ember";
      var es = 2 + Math.random() * 5;
      e.style.width = es + "px";
      e.style.height = es + "px";
      e.style.left = Math.random() * 100 + "%";
      e.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      e.style.animationDuration = 7 + Math.random() * 9 + "s";
      e.style.animationDelay = -Math.random() * 16 + "s";
      emberLayer.appendChild(e);
    }
  }

  /* ---- Lightbox gallery ---- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var items = [];
  var current = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    var fig = items[current];
    lbImg.src = fig.getAttribute("data-src");
    lbImg.alt = fig.querySelector("img").alt;
    lbCap.textContent = fig.getAttribute("data-cap") || "";
  }
  function openLb(idx) {
    show(idx);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function bindGalleryItems() {
    items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
    items.forEach(function (fig, idx) {
      fig.addEventListener("click", function () {
        openLb(idx);
      });
    });
  }
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbNext").addEventListener("click", function () {
    show(current + 1);
  });
  document.getElementById("lbPrev").addEventListener("click", function () {
    show(current - 1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
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

  /* ================================================================
     動態內容：從 content.json 載入（後台管理）
     ================================================================ */
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  function renderContent(c) {
    var copy = c.copy || {};

    setText("heroTag", copy.heroTag);
    setText("heroSub", copy.heroSub);
    setText("synopsisTitle", copy.synopsisTitle);
    setText("directorQuote", copy.directorQuote);
    setText("directorName", copy.directorName);
    setText("directorNameEn", copy.directorNameEn);
    setText("screeningSoon", copy.screeningSoon);
    setText("screeningReview", copy.screeningReview);
    if (copy.screeningReviewBy) setText("screeningReviewBy", "— " + copy.screeningReviewBy);
    setText("metaProducer", copy.metaProducer);
    setText("metaDistributor", copy.metaDistributor);
    setText("metaDirector", copy.metaDirector);
    setText("trailerNote", copy.trailerNote);

    /* marquee */
    if (copy.marquee && copy.marquee.length) {
      var track = document.getElementById("marqueeTrack");
      track.innerHTML = "";
      var lines = copy.marquee.concat(copy.marquee);
      lines.forEach(function (line) {
        var s = document.createElement("span");
        s.textContent = line;
        track.appendChild(s);
        var d = document.createElement("span");
        d.className = "dot";
        d.textContent = "✦";
        track.appendChild(d);
      });
    }

    /* synopsis paragraphs */
    if (copy.synopsisParas && copy.synopsisParas.length) {
      var wrap = document.getElementById("synopsisParas");
      wrap.innerHTML = "";
      copy.synopsisParas.forEach(function (para, idx) {
        var pEl = document.createElement("p");
        pEl.className = "reveal in";
        if (idx === copy.synopsisParas.length - 1) pEl.classList.add("accent");
        pEl.textContent = para;
        wrap.appendChild(pEl);
      });
    }

    /* gallery */
    if (c.gallery && c.gallery.length) {
      var grid = document.getElementById("galleryGrid");
      grid.innerHTML = "";
      c.gallery.forEach(function (g) {
        var fig = document.createElement("figure");
        fig.className = "gallery__item reveal" + (g.tall ? " gallery__item--tall" : "");
        fig.setAttribute("data-src", g.src);
        fig.setAttribute("data-cap", g.cap || "");
        var img = document.createElement("img");
        img.src = g.src;
        img.alt = g.alt || "";
        img.loading = "lazy";
        fig.appendChild(img);
        grid.appendChild(fig);
      });
      observeReveals(grid);
    }
    bindGalleryItems();

    /* trailer */
    if (c.trailer && c.trailer.src) {
      var video = document.getElementById("trailerVideo");
      var curSrc = video.querySelector("source");
      if (!curSrc || curSrc.getAttribute("src") !== c.trailer.src) {
        video.innerHTML = "";
        var source = document.createElement("source");
        source.src = c.trailer.src;
        source.type = "video/mp4";
        video.appendChild(source);
        if (c.trailer.poster) video.poster = c.trailer.poster;
        video.load();
      }
    }

    /* screenings */
    if (c.screenings && c.screenings.length) {
      var list = document.getElementById("screeningList");
      list.hidden = false;
      list.innerHTML = "";
      c.screenings.forEach(function (s) {
        var row = document.createElement(s.link ? "a" : "div");
        row.className = "screening__row";
        if (s.link) {
          row.href = s.link;
          row.target = "_blank";
          row.rel = "noopener";
        }
        var when = [s.date, s.time].filter(Boolean).join(" ");
        row.innerHTML =
          '<span class="screening__row-city"></span>' +
          '<span class="screening__row-theater"></span>' +
          '<span class="screening__row-when"></span>' +
          '<span class="screening__row-note"></span>';
        row.querySelector(".screening__row-city").textContent = s.city || "";
        row.querySelector(".screening__row-theater").textContent = s.theater || "";
        row.querySelector(".screening__row-when").textContent = when;
        row.querySelector(".screening__row-note").textContent = s.note || (s.link ? "購票 ›" : "");
        list.appendChild(row);
      });
    }

    /* testimonials */
    if (c.testimonials && c.testimonials.length) {
      var section = document.getElementById("testimonialsSection");
      var tGrid = document.getElementById("testimonialGrid");
      section.hidden = false;
      var navLink = document.getElementById("navTestimonials");
      if (navLink) navLink.hidden = false;
      tGrid.innerHTML = "";
      c.testimonials.forEach(function (t) {
        var card = document.createElement("figure");
        card.className = "testimonial reveal";
        var media;
        if (t.type === "youtube") {
          var vid = youtubeId(t.src);
          if (!vid) return;
          media = document.createElement("iframe");
          media.src = "https://www.youtube-nocookie.com/embed/" + vid;
          media.setAttribute("allowfullscreen", "");
          media.setAttribute("loading", "lazy");
          media.setAttribute(
            "allow",
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          );
        } else if (t.type === "drive") {
          media = document.createElement("video");
          media.controls = true;
          media.preload = "metadata";
          media.playsInline = true;
          if (t.poster) media.poster = t.poster;
          media.src = driveDownloadUrl(t.src);
        } else {
          media = document.createElement("video");
          media.src = t.src;
          media.controls = true;
          media.preload = "metadata";
          media.playsInline = true;
          if (t.poster) media.poster = t.poster;
        }
        var mediaWrap = document.createElement("div");
        mediaWrap.className = "testimonial__media";
        mediaWrap.appendChild(media);
        card.appendChild(mediaWrap);
        if (t.title || t.name) {
          var cap = document.createElement("figcaption");
          var titleEl = document.createElement("strong");
          titleEl.textContent = t.title || "";
          cap.appendChild(titleEl);
          if (t.name) {
            var nameEl = document.createElement("span");
            nameEl.textContent = t.name;
            cap.appendChild(nameEl);
          }
          card.appendChild(cap);
        }
        tGrid.appendChild(card);
      });
      observeReveals(section);
    }
  }

  function youtubeId(url) {
    var m = String(url || "").match(
      /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
    );
    return m ? m[1] : null;
  }

  function driveFileId(src) {
    var value = String(src || "");
    var m = value.match(/(?:\/file\/d\/|id=)([\w-]{10,})/) || value.match(/^([\w-]{10,})$/);
    return m ? m[1] : value;
  }

  function driveDownloadUrl(src) {
    return "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(driveFileId(src));
  }

  fetch("content.json?t=" + Date.now())
    .then(function (r) { return r.json(); })
    .then(renderContent)
    .catch(function () {
      /* 讀不到 content.json 時保留 HTML 內建內容 */
      bindGalleryItems();
    });

  /* ---- Featured Gan Jing World HLS video ---- */
  (function () {
    var video = document.getElementById("featuredGjwVideo");
    var src = video.getAttribute("data-hls-src") || "https://media1-ap-japan.cloudokyo.cloud/video/v13/40/44/e2/4044e2fc-c9a2-4f67-b8a5-2bb2bb1bafa7/playlist_720p.m3u8";
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    }
  })();

})();
