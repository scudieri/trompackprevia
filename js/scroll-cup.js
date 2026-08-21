// Trompack — scroll-scrubbing product hero (Copo Personalizado).
// Drives a canvas frame-by-frame from scroll position, like Apple/Stripe hero videos.
//
// Two things matter for this to feel fast:
//
//  1. Scrolling is wired up immediately, not after the whole sequence downloads.
//     Waiting for every frame meant the page (and the scroll-reactive backdrop)
//     sat inert for as long as the download took.
//  2. Frames are fetched in an order that serves scrubbing: a coarse pass first,
//     so the whole rotation is roughly scrubbable early, then the in-between
//     frames fill the detail in. Any gap falls back to the nearest loaded frame,
//     so there is never a blank canvas.

(function () {
  "use strict";

  // 106 frames: the forward half of the clip. The source video was authored to
  // loop, so past its midpoint the lid descends again — scrubbed by scroll that
  // reads as the animation glitching backwards. Cutting at the peak gives a
  // one-way reveal: the cup turns, the lid lifts clear, done.
  // On a phone the product renders a few hundred px tall, where the difference
  // between 208 and 104 frames is imperceptible — but the 4.4MB download and
  // 231MB of decoded bitmap are very perceptible. So small screens scrub the
  // even frames only: half the bytes, half the memory, same apparent motion.
  const SOURCE_FRAMES = 106;
  const STEP = window.matchMedia("(max-width: 820px)").matches ? 2 : 1;
  const TOTAL_FRAMES = Math.ceil(SOURCE_FRAMES / STEP);
  const FRAME_PATH = (i) =>
    `img/scroll-cup/frame_${String(i * STEP + 1).padStart(4, "0")}.webp`;

  const wrapper = document.getElementById("scrollCupWrapper");
  const canvas = document.getElementById("scrollCanvas");
  if (!wrapper || !canvas) return;

  const ctx = canvas.getContext("2d");
  const progressFill = document.getElementById("scrollProgressFill");
  const frameCounter = document.getElementById("scrollFrameCounter");
  const loading = document.getElementById("scrollLoading");
  const loadingFill = document.getElementById("scrollLoadingFill");
  const loadingLabel = document.getElementById("scrollLoadingLabel");
  const hint = document.getElementById("scrollHint");
  const copy = document.getElementById("scrollCupCopy");

  const images = new Array(TOTAL_FRAMES);
  const loaded = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;
  let currentFrame = -1;
  let naturalW = 400, naturalH = 729;
  let hasScrolled = false;
  let overlayGone = false;

  function sizeCanvas() {
    const dprCap = 1.5;
    const sticky = wrapper.querySelector(".scroll-cup-sticky");
    // clientWidth/Height include padding, so subtract it to get the content box
    // the canvas may actually occupy (the sticky section reserves headroom for
    // the heading above the product)
    const cs = getComputedStyle(sticky);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const boxW = Math.max(1, sticky.clientWidth - padX);
    const boxH = Math.max(1, sticky.clientHeight - padY);

    const scale = Math.min(boxW / naturalW, boxH / naturalH);
    const cssW = naturalW * scale;
    const cssH = naturalH * scale;

    // Upscaling a frame past its own pixel count only makes it soft, so the
    // buffer is capped at the source resolution.
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap, naturalW / cssW);

    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Nearest already-loaded frame, so an incomplete sequence still scrubs.
  function nearestLoaded(index) {
    if (loaded[index]) return index;
    for (let d = 1; d < TOTAL_FRAMES; d++) {
      if (loaded[index - d]) return index - d;
      if (loaded[index + d]) return index + d;
    }
    return -1;
  }

  // Cross-fade between the two frames the scroll position falls between.
  // With 106 frames the nearest-frame approach visibly steps; blending the pair
  // gives continuous motion for the cost of one extra drawImage.
  function render(p) {
    const cssW = parseFloat(canvas.style.width);
    const cssH = parseFloat(canvas.style.height);
    if (!(cssW > 0)) return;

    const f = p * (TOTAL_FRAMES - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(TOTAL_FRAMES - 1, i0 + 1);
    const t = f - i0;

    const a = nearestLoaded(i0);
    if (a < 0) return;
    const b = nearestLoaded(i1);

    ctx.clearRect(0, 0, cssW, cssH);
    ctx.drawImage(images[a], 0, 0, cssW, cssH);
    if (b >= 0 && b !== a && t > 0.02) {
      // smoothstep applied twice: hugs 0 and 1 hard, so the frames spend
      // most of the interval showing one crisp image instead of a 50/50 mix
      const s1 = t * t * (3 - 2 * t);
      const w = s1 * s1 * (3 - 2 * s1);
      ctx.globalAlpha = w;
      ctx.drawImage(images[b], 0, 0, cssW, cssH);
      ctx.globalAlpha = 1;
    }

    currentFrame = Math.round(f);
    if (frameCounter) {
      frameCounter.textContent =
        `${String(currentFrame + 1).padStart(2, "0")} / ${TOTAL_FRAMES}`;
    }
  }

  function drawFrame(index) {
    render(index / (TOTAL_FRAMES - 1));
  }

  function scrollProgress() {
    const rect = wrapper.getBoundingClientRect();
    const scrollable = wrapper.offsetHeight - window.innerHeight;
    return scrollable > 0
      ? Math.min(1, Math.max(0, -rect.top / scrollable))
      : 0;
  }

  // The rendered position eases toward the scroll position instead of snapping
  // to it, so a coarse mouse-wheel step (which jumps ~100px at once) still
  // plays as motion rather than a jump.
  let targetP = 0;
  let renderP = 0;
  let rafId = null;

  function paint(p) {
    if (progressFill) progressFill.style.width = `${p * 100}%`;
    if (copy) copy.style.opacity = String(Math.max(0, 1 - p * 4));
    // publish progress so the decorative backdrop eases along with the product
    wrapper.style.setProperty("--p", p.toFixed(4));
    render(p);
  }

  function tick() {
    rafId = null;
    const d = targetP - renderP;
    if (Math.abs(d) < 0.0005) {
      renderP = targetP;
      paint(renderP);
      return;
    }
    renderP += d * 0.2;
    paint(renderP);
    rafId = requestAnimationFrame(tick);
  }

  function requestTick() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  function updateFromScroll() {
    targetP = scrollProgress();
    if (targetP > 0.01 && !hasScrolled) {
      hasScrolled = true;
      if (hint) hint.style.opacity = "0";
    }
    requestTick();
  }

  function onScroll() {
    updateFromScroll();
  }

  function hideOverlay() {
    if (overlayGone) return;
    overlayGone = true;
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(() => loading.remove(), 500);
    }
  }

  function onFrameReady(i, img) {
    loaded[i] = true;
    loadedCount++;

    if (i === 0) {
      naturalW = img.naturalWidth || naturalW;
      naturalH = img.naturalHeight || naturalH;
      sizeCanvas();
    }

    const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
    if (loadingFill) loadingFill.style.width = pct + "%";
    if (loadingLabel) loadingLabel.textContent = `carregando frames… ${pct}%`;

    // Reveal as soon as the coarse pass is in: the rotation is already
    // scrubbable end to end, and remaining frames only sharpen it.
    if (!overlayGone && loadedCount >= COARSE_COUNT) hideOverlay();

    // Until something has actually been painted, currentFrame is -1 and there
    // is nothing to refresh — so derive the frame from the scroll position
    // instead. Without this the canvas stays blank on arrival and only fills
    // in once the visitor scrolls.
    if (currentFrame < 0) updateFromScroll();
    else drawFrame(currentFrame);
  }

  // load order: every 8th frame first (coarse but complete), then progressively
  // fill in — so the whole rotation is scrubbable within a few hundred KB and
  // keeps getting smoother as the rest arrives.
  const order = [];
  for (let step = 8; step >= 1; step = step >> 1) {
    for (let i = 0; i < TOTAL_FRAMES; i += step) {
      if (!order.includes(i)) order.push(i);
    }
  }
  const COARSE_COUNT = Math.ceil(TOTAL_FRAMES / 8);

  function preload() {
    order.forEach((i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => onFrameReady(i, img);
      img.onerror = () => { loadedCount++; };
      img.src = FRAME_PATH(i);
      images[i] = img;
    });
  }

  window.addEventListener("resize", () => {
    sizeCanvas();
    if (currentFrame >= 0) drawFrame(currentFrame);
  });

  sizeCanvas();
  // wire scrolling up front so the page (and the backdrop) reacts instantly
  window.addEventListener("scroll", onScroll, { passive: true });
  updateFromScroll();
  preload();
})();
