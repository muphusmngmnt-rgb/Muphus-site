/**
 * MUPHUS — Chrome 3D Brand-Objekt
 * Gyroskop aus dünnen Chrom-Ringen in dunkler Studio-Umgebung (Akzent neben dem Logo).
 * Wird lazy geladen (siehe main.js) und pausiert, wenn es nicht sichtbar ist.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';

export async function createChrome(canvas, { reduced = false, mobile = false, onFail = () => {} } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'default' });
  } catch (err) {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  const dprCap = mobile ? 1.5 : 2;

  const scene = new THREE.Scene();

  // Kontrollierte Studio-Reflexionen
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  scene.environmentIntensity = 1.5;
  envScene.dispose?.();
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);

  // Gyroskop aus drei dünnen Chrom-Ringen, zentriert hinter dem Logo
  const seg = mobile ? 128 : 256;
  const tube = mobile ? 16 : 32;
  const geometries = [
    new THREE.TorusGeometry(1, 0.05, tube, seg),
    new THREE.TorusGeometry(0.8, 0.04, tube, seg),
    new THREE.TorusGeometry(0.62, 0.03, tube, seg),
  ];
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xdfe3e8,
    metalness: 1,
    roughness: 0.1,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
  });
  const ring1 = new THREE.Mesh(geometries[0], material);
  const ring2 = new THREE.Mesh(geometries[1], material);
  const ring3 = new THREE.Mesh(geometries[2], material);
  ring1.add(ring2);
  ring2.add(ring3);
  ring1.rotation.set(1.15, 0.3, 0);
  ring2.rotation.set(0.2, 1.0, 0);
  ring3.rotation.set(0.9, 0.1, 0.4);
  const mesh = ring1; // Alias für Animation
  const pivot = new THREE.Group();
  pivot.add(ring1);
  scene.add(pivot);

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xdbe4ff, 0.8);
  rim.position.set(-4, -1, -3);
  scene.add(key, rim);

  const FOV_TAN = 2 * Math.tan(THREE.MathUtils.degToRad(35 / 2));

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    const aspect = w / h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    const visH = Math.max(6.2, 4.8 / aspect);
    camera.position.set(0, 0, visH / FOV_TAN);
    camera.updateProjectionMatrix();
    // Breit: Ringe zentriert hinter dem Logo (Logo sitzt im Gyroskop). Hochformat: oberhalb des Logo-Blocks.
    const wide = aspect > 1;
    pivot.scale.setScalar(wide ? Math.min(visH * 0.36, visH * aspect * 0.2) : Math.min(visH * 0.1, visH * aspect * 0.28));
    pivot.position.x = 0;
    baseY = wide ? visH * 0.07 : visH * 0.3;
    pivot.position.y = baseY;
    if (reduced || !running) renderOnce();
  }

  function renderOnce() {
    renderer.render(scene, camera);
  }

  // ----- Animation -----
  let running = false;
  let raf = 0;
  let last = 0;
  let inView = true;
  let baseY = 0;
  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (mobile && t - last < 33) return; // ~30 fps auf Mobile
    const dt = Math.min((t - last) / 1000, 0.1);
    last = t;
    ring1.rotation.x += dt * 0.10;
    ring2.rotation.y += dt * 0.15;
    ring3.rotation.x -= dt * 0.12;
    ring3.rotation.z += dt * 0.08;
    smooth.x += (pointer.x - smooth.x) * 0.05;
    smooth.y += (pointer.y - smooth.y) * 0.05;
    pivot.rotation.y = smooth.x * 0.35;
    pivot.rotation.x = smooth.y * 0.2;
    pivot.position.y = baseY + Math.sin(t * 0.0006) * 0.06;
    renderer.render(scene, camera);
  }

  function update() {
    const shouldRun = !reduced && inView && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', update);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const onMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reduced && !mobile) window.addEventListener('pointermove', onMove, { passive: true });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    dispose();
    onFail();
  });

  function dispose() {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', update);
    window.removeEventListener('pointermove', onMove);
    geometries.forEach((g) => g.dispose());
    material.dispose();
    renderer.dispose();
  }

  resize();
  renderOnce();
  canvas.classList.add('is-ready');
  update();

  return { dispose };
}
