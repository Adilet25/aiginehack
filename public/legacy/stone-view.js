import * as T from './vendor/three.module.js';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';

export function mountStone(host) {
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(41, 1, .02, 25);
  camera.position.set(0, .22, 3.5);
  camera.lookAt(0, 0, 0);
  const pivot = new T.Group();
  scene.add(pivot, new T.HemisphereLight('#ffe6b9', '#876354', 2));
  const sun = new T.DirectionalLight('#ffe0ba', 2.8);
  sun.position.set(-2, 3, 4);
  scene.add(sun);
  const display = host.querySelector('.stone-display');
  const canvas = renderer.domElement;
  display.append(canvas);
  let alive = true;
  let drag;
  const render = () => { if (alive) renderer.render(scene, camera); };
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = display;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(display);
  new GLTFLoader().load(new URL('./assets/yurt-models/petroglyph-stone.glb', import.meta.url).href, gltf => {
    if (!alive) {
      dispose(gltf.scene);
      return;
    }
    const object = gltf.scene;
    const bounds = new T.Box3().setFromObject(object);
    const center = bounds.getCenter(new T.Vector3());
    const size = bounds.getSize(new T.Vector3());
    const scale = 2.1 / Math.max(size.x, size.y, size.z);
    object.scale.multiplyScalar(scale);
    object.position.addScaledVector(center, -scale);
    pivot.add(object);
    host.dataset.model = 'true';
    resize();
  }, undefined, () => {});
  const controls = new AbortController();
  const options = { signal: controls.signal };
  host.addEventListener('click', event => {
    const cmd = event.target.closest('[data-stone-command]')?.dataset.stoneCommand;
    if (cmd === 'left' || cmd === 'right') pivot.rotation.y += cmd === 'left' ? -.38 : .38;
    if (cmd === 'in' || cmd === 'out') camera.position.z = T.MathUtils.clamp(camera.position.z + (cmd === 'in' ? -.35 : .35), 2.2, 5.3);
    if (cmd) render();
  }, options);
  canvas.addEventListener('pointerdown', event => {
    canvas.setPointerCapture(event.pointerId);
    drag = [event.clientX, event.clientY];
  }, options);
  canvas.addEventListener('pointermove', event => {
    if (!drag) return;
    pivot.rotation.y += (event.clientX - drag[0]) * .01;
    pivot.rotation.x = T.MathUtils.clamp(pivot.rotation.x + (event.clientY - drag[1]) * .01, -1.1, 1.1);
    drag = [event.clientX, event.clientY];
    render();
  }, options);
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(name, () => { drag = null; }, options);
  }
  return () => {
    alive = false;
    observer.disconnect();
    controls.abort();
    dispose(pivot);
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}

function dispose(object) {
  const surfaces = new Set();
  const textures = new Set();
  object.traverse(mesh => {
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    for (const surface of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) surfaces.add(surface);
  });
  for (const surface of surfaces) {
    for (const value of Object.values(surface)) if (value?.isTexture) textures.add(value);
    surface.dispose();
  }
  for (const texture of textures) texture.dispose();
}
