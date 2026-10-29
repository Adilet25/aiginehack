import * as THREE from 'three';
import { heritageScene } from '../../config/experience';

export type SceneControls = { dispose: () => void; pause: (value: boolean) => void; rotate: (direction: number) => void };

export function mountScene(host: HTMLElement, onError: (fatal: boolean) => void): SceneControls {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 40);
  camera.position.set(0, .4, 8.8);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xe7f6ff, 0x27674c, 3));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x73d5ea, 3);
  rim.position.set(4, 0, -2); scene.add(rim);
  const world = new THREE.Group();
  scene.add(world);
  const artifact = new THREE.Group();
  world.add(artifact);
  const placeholder = new THREE.Group();
  artifact.add(placeholder);

  // A decorative stone, deliberately not a historical reconstruction.
  const geometry = new THREE.IcosahedronGeometry(1.12, 1);
  const vertices = geometry.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
    const factor = 1 + .12 * Math.sin(x * 8 + y * 5 + z * 3);
    vertices.setXYZ(i, x * factor, y * factor * 1.13, z * factor * .63);
  }
  geometry.computeVertexNormals();
  const stone = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x326e62, roughness: .63, metalness: .22, flatShading: true }));
  placeholder.add(stone);
  const markMaterial = new THREE.MeshStandardMaterial({ color: 0xf3e4bd, metalness: .65, roughness: .3 });
  const strokes = [[[-.48,.5], [0,0]], [[0,0],[-.48,-.5]], [[-.08,.5],[.4,0]], [[.4,0],[-.08,-.5]], [[-.54,.12],[-.22,.5]]];
  for (const [a, b] of strokes) {
    const start = new THREE.Vector3(a[0], a[1], .74);
    const end = new THREE.Vector3(b[0], b[1], .74);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(.095, start.distanceTo(end), .065), markMaterial);
    beam.position.copy(start.clone().add(end).multiplyScalar(.5));
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), end.sub(start).normalize());
    placeholder.add(beam);
  }
  const orbits = new THREE.Group(); world.add(orbits);
  for (let i = 0; i < 3; i++) {
    const orbit = new THREE.Group();
    orbit.rotation.set(.8 + i * .6, .2 + i * .8, i * .7);
    const material = new THREE.MeshStandardMaterial({ color: [0x4d9e82,0x59afc9,0xe99773][i], metalness: .55, roughness: .35 });
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(1.68 + i * .18, .012, 6, 100), material));
    const satellite = new THREE.Mesh(new THREE.IcosahedronGeometry(.105 + i * .025, 1), material);
    satellite.position.x = 1.68 + i * .18;
    orbit.add(satellite); orbits.add(orbit);
  }
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 128; shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64,64,0,64,64,64);
    gradient.addColorStop(0,'rgba(25,75,58,.2)'); gradient.addColorStop(1,'rgba(25,75,58,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0,0,128,128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.8,1.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
    shadow.position.set(0,-2,-.6); scene.add(shadow);
  }
  let disposed = false, paused = false, visible = true, frame = 0, last = 0, time = 0, manualAngle = 0;
  let px = 0, py = 0;
  const abort = new AbortController();
  function disposeObject(object: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    object.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      geometries.add(child.geometry);
      const items = Array.isArray(child.material) ? child.material : [child.material];
      items.forEach(material => {
        materials.add(material);
        Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
      });
    });
    geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
  }
  if (heritageScene.modelUrl) {
    const url = heritageScene.modelUrl;
    void (async () => {
      const [{ GLTFLoader }, response] = await Promise.all([import('three/addons/loaders/GLTFLoader.js'), fetch(url, { signal: abort.signal })]);
      if (!response.ok) throw new Error('Model unavailable');
      const data = await response.arrayBuffer();
      if (disposed) return;
      const result = await new GLTFLoader().parseAsync(data, new URL('.', new URL(url, location.href)).href);
      if (disposed) { disposeObject(result.scene); return; }
      const model = result.scene;
      model.rotation.set(...heritageScene.rotation);
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      if (bounds.isEmpty() || size.length() < .0001) { disposeObject(model); throw new Error('Empty model'); }
      const scale = 2.5 / Math.max(size.x,size.y,size.z,.001);
      const center = bounds.getCenter(new THREE.Vector3());
      model.scale.multiplyScalar(scale); model.position.sub(center.multiplyScalar(scale));
      artifact.remove(placeholder); disposeObject(placeholder); artifact.add(model);
      draw();
    })().catch(() => { if (!disposed) onError(false); });
  }
  const moving = () => !paused && visible && !document.hidden;
  function draw() { if (!disposed && visible && !document.hidden) renderer.render(scene, camera); }
  function tick(stamp: number) {
    frame = 0;
    if (disposed || !moving()) return;
    time += Math.min((stamp - last) / 1000, .04); last = stamp;
    const rect = host.getBoundingClientRect();
    const scroll = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
    world.rotation.y += (px * .28 + scroll * .6 - world.rotation.y) * .045;
    world.rotation.x += (py * .14 - world.rotation.x) * .045;
    artifact.rotation.y = manualAngle + Math.sin(time * .3) * .45;
    artifact.position.y = Math.sin(time * .8) * .09;
    orbits.rotation.y = time * .1;
    orbits.rotation.z = time * .06;
    draw(); frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    draw();
    if (moving()) { last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width,height); camera.aspect = width / height; camera.updateProjectionMatrix(); draw();
  });
  resize.observe(host);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
  observer.observe(host);
  const pointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !moving()) return;
    const rect = host.getBoundingClientRect();
    px = (event.clientX - rect.left) / rect.width - .5;
    py = (event.clientY - rect.top) / rect.height - .5;
  };
  const leave = () => { px = 0; py = 0; };
  const lost = (event: Event) => { event.preventDefault(); paused = true; sync(); onError(true); };
  host.addEventListener('pointermove',pointer); host.addEventListener('pointerleave',leave);
  renderer.domElement.addEventListener('webglcontextlost',lost);
  document.addEventListener('visibilitychange',sync);
  sync();
  return {
    pause(value) { paused = value; sync(); },
    rotate(direction) { manualAngle += direction * Math.PI / 6; artifact.rotation.y = manualAngle; draw(); },
    dispose() {
      disposed = true; abort.abort(); cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      host.removeEventListener('pointermove',pointer); host.removeEventListener('pointerleave',leave);
      renderer.domElement.removeEventListener('webglcontextlost',lost);
      document.removeEventListener('visibilitychange',sync);
      disposeObject(scene); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
