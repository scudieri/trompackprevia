// Trompack — shared site behavior: nav, reveal animations, mobile menu.

(function () {
  "use strict";

  // ---------- Nav scroll state ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Mobile menu ----------
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      panel.classList.toggle("open");
    });
    panel.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => panel.classList.remove("open"))
    );
  }

  // ---------- Active nav link ----------
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-panel a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // ---------- Sticky action bar ----------
  // Held back until the visitor is past the first screen, so it reinforces the
  // page instead of covering the hero the moment they arrive.
  const actionBar = document.getElementById("actionBar");
  if (actionBar) {
    let abTick = false;
    const syncBar = () => {
      abTick = false;
      actionBar.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", () => {
      if (!abTick) { abTick = true; requestAnimationFrame(syncBar); }
    }, { passive: true });
    syncBar();
  }

  // ---------- Reveal on load / on scroll ----------
  // Objects animate in the moment they enter view — including immediately
  // on page load for anything already above the fold (hero, etc).
  const revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-group]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }
})();
