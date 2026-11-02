/**
 * MUPHUS — minimalistische Hintergrund-Partikel (wenige, kleine, langsame Punkte).
 * Pausiert bei verstecktem Tab; wird bei Reduced-Motion nicht gestartet.
 */
export function initParticles(canvas, { count = 36 } = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w = 0, h = 0, dpr = 1, raf = 0, last = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pts = Array.from({ length: count }, () => ({
    x: Math.random(), y: Math.random(), r: rnd(0.6, 1.6),
    vx: rnd(-0.004, 0.004), vy: rnd(-0.012, -0.003), a: rnd(0.12, 0.4), p: rnd(0, 6.28), s: rnd(0.2, 0.6),
  }));
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((t - last) / 1000, 0.1); last = t;
    ctx.clearRect(0, 0, w, h);
    for (const q of pts) {
      q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.y < -0.02) { q.y = 1.02; q.x = Math.random(); }
      if (q.x < -0.02) q.x = 1.02; else if (q.x > 1.02) q.x = -0.02;
      const tw = 0.6 + 0.4 * Math.sin(t * 0.001 * q.s + q.p);
      ctx.beginPath();
      ctx.arc(q.x * w, q.y * h, q.r, 0, 6.283);
      ctx.fillStyle = `rgba(222,226,232,${(q.a * tw).toFixed(3)})`;
      ctx.fill();
    }
  }
  function toggle() {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', toggle);
  toggle();
}
