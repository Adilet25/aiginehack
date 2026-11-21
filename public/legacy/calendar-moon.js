import * as T from './vendor/three.module.js';

function surface() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(canvas.width, canvas.height);
  let seed = 102;
  const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const relief = Math.sin(x * .017 + 2 * Math.cos(y * .031)) * Math.cos(y * .025 + Math.sin(x * .033));
      const gray = 154 + 34 * relief + 13 * Math.sin(x * .17 + y * .12) * Math.cos(y * .13) + random() * 32;
      const i = (y * canvas.width + x) * 4;
      pixels.data.set([gray, gray, gray - 3, 255], i);
    }
  }
  ctx.putImageData(pixels, 0, 0);
  for (let i = 0; i < 630; i++) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const r = 1 + random() ** 4 * 28;
    const gradient = ctx.createRadialGradient(x - r * .21, y + r * .21, r * .13, x, y, r);
    gradient.addColorStop(0, '#34384955');
    gradient.addColorStop(.69, '#41434b46');
    gradient.addColorStop(.85, '#ffffff62');
    gradient.addColorStop(1, '#ffffff00');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  return map;
}

export function mountMoon(host) {
  let renderer;
  try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34, 1, .1, 20);
  camera.position.z = 4;
  const map = surface();
  const geometry = new T.SphereGeometry(1, 56, 36);
  const material = new T.MeshStandardMaterial({ map, roughness: 1 });
  const sphere = new T.Mesh(geometry, material);
  scene.add(sphere, new T.AmbientLight('#839acc', .22));
  const sunlight = new T.DirectionalLight('#fff1d6', 2.65);
  scene.add(sunlight);
  host.append(renderer.domElement);
  host.dataset.webgl = 'true';
  let progress = 0;
  function draw() {
    sphere.rotation.y = -.55 + progress * 2.45;
    sphere.rotation.z = .12;
    const phase = 2.95 - progress * 1.25;
    sunlight.position.set(Math.sin(phase) * 4, .45, Math.cos(phase) * 4);
    renderer.render(scene, camera);
  }
  function resize() {
    const size = host.clientWidth;
    if (!size) return;
    renderer.setSize(size, size, false);
    draw();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  renderer.domElement.addEventListener('webglcontextlost', () => { delete host.dataset.webgl; });
  resize();
  return {
    update(value) { progress = value; draw(); },
    dispose() { observer.disconnect(); geometry.dispose(); material.dispose(); map.dispose(); renderer.dispose(); renderer.forceContextLoss(); },
  };
}
