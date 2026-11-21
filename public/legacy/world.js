import * as T from './vendor/three.module.js';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';

import { createYurtInterior } from './yurt-interior.js';
import { sacredFraming } from './sacred-framing.js';

function mesh(parent, geometry, surface, x = 0, y = 0, z = 0) {
  const object = new T.Mesh(geometry, surface);
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

function texture(draw, width = 512, height = width) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const image = new T.CanvasTexture(canvas);
  image.colorSpace = T.SRGBColorSpace;
  image.anisotropy = 4;
  return image;
}

const ease = (start, end, progress) => T.MathUtils.smoothstep(progress, start, end);

function nightSky(scene) {
  const positions = [];
  let seed = 47;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 1400; i++) {
    const angle = random() * 2 * Math.PI;
    const altitude = random() * Math.PI / 2;
    positions.push(90 * Math.cos(angle) * Math.cos(altitude), 90 * Math.sin(altitude), 90 * Math.sin(angle) * Math.cos(altitude));
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  const stars = new T.Points(geometry, new T.PointsMaterial({
    color: '#d2deec', size: .065, fog: false, transparent: true, opacity: .55,
  }));
  scene.add(stars);
  return stars;
}

export async function createWorld(host, updateLabels, updateEntrance, openExhibit) {
  const scene = new T.Scene();
  const indoorSky = new T.Color('#0b1324');
  scene.fog = new T.FogExp2('#142036', .009);
  const camera = new T.PerspectiveCamera(41, 1, .035, 160);
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  const loader = new GLTFLoader();
  let exterior;
  let exteriorDoors;
  try {
    const url = new URL('./assets/yurt-models/painted-entry.glb', import.meta.url);
    ({ scene: exterior } = await loader.loadAsync(url.href));
    exteriorDoors = ['Entrance_Left_Hinge', 'Entrance_Right_Hinge'].map(name => exterior.getObjectByName(name));
    if (exteriorDoors.some(hinge => !hinge)) throw new Error('Exterior yurt door hinges are missing');
  } catch (error) {
    renderer.dispose();
    renderer.forceContextLoss();
    throw error;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  host.append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    host.parentElement.dataset.ready = 'false';
    host.querySelectorAll('.fallback').forEach(image => { image.hidden = false; });
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    render();
    const ready = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    host.parentElement.dataset.ready = String(ready);
    host.querySelectorAll('.fallback').forEach(image => { image.hidden = ready; });
  });
  const ambient = new T.HemisphereLight('#a6b4cd', '#302c29', .82);
  const dusk = new T.DirectionalLight('#b4bfd2', .9);
  dusk.position.set(-7, 8, -3);
  const interiorFill = new T.DirectionalLight('#e0dbec', 0);
  interiorFill.position.set(-6, 12, 8);
  const light = new T.PointLight('#ffe7b0', 11, 8, 1.6);
  light.position.set(0, 3.8, .2);
  const thresholdLight = new T.PointLight('#d59a59', .46, 1.65, 1.8);
  thresholdLight.position.set(.03, .09, 3.47);
  scene.add(ambient, dusk, interiorFill, light, thresholdLight);
  const tableLight = new T.PointLight('#ffcb86', 0, 2.2, 2);
  tableLight.position.set(0, 1.73, -1.17);
  scene.add(tableLight);
  const mapShadow = mesh(scene, new T.PlaneGeometry(1.06, .6), new T.MeshBasicMaterial({
    transparent: true, depthWrite: false, opacity: 0,
    map: texture((ctx, w, h) => {
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      glow.addColorStop(0, '#211105c4');
      glow.addColorStop(1, '#21110500');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }),
  }), sacredFraming.origin[0], .837, sacredFraming.origin[2]);
  mapShadow.rotation.x = -Math.PI / 2;
  mapShadow.visible = false;
  const stars = nightSky(scene);
  const shadow = mesh(scene, new T.PlaneGeometry(7.8, 7.1), new T.MeshBasicMaterial({
    transparent: true,
    depthWrite: false,
    map: texture((ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, w * .29, w / 2, h / 2, w / 2);
      g.addColorStop(0, '#080a0bb8'); g.addColorStop(.52, '#080a0b6f'); g.addColorStop(1, '#080a0b00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }),
  }), .04, -.012, -.04);
  shadow.rotation.x = -Math.PI / 2;
  // Keep the red woven motifs legible on the curved walls and at grazing angles.
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  exterior.traverse(node => {
    if (node.isMesh && node.material.map) node.material.map.anisotropy = anisotropy;
  });
  // Fixed jambs overlap the cut felt edge while the two leaves swing inward.
  const casing = new T.MeshStandardMaterial({ color: '#885432', roughness: .89 });
  for (const side of [-1, 1]) {
    mesh(exterior, new T.BoxGeometry(.14, 1.72, .21), casing, side * .55, .85, 2.96);
  }
  mesh(exterior, new T.BoxGeometry(1.22, .15, .21), casing, 0, 1.67, 2.96);
  for (const name of ['White_Fabric_Wall', 'White_Fabric_Roof', 'Ornamented_Eave_Band']) {
    const fabric = exterior.getObjectByName(name);
    if (!fabric) continue;
    fabric.material.side = T.DoubleSide;
    fabric.material.onBeforeCompile = shader => {
      shader.vertexShader = 'varying vec3 feltPoint;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\nfeltPoint = position;');
      shader.fragmentShader = 'varying vec3 feltPoint;\n' + shader.fragmentShader.replace(
        '#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        vec3 offset = feltPoint - vec3(-.40, 1.35, 1.25);
        float lamplight = 0.008 + 0.14 / (1.0 + dot(offset, offset) * 0.56);
        totalEmissiveRadiance += diffuseColor.rgb * vec3(1.0, .48, .15) * lamplight;`);
    };
  }
  // The scanned door leaves have irregular silhouettes. Give each leaf a
  // solid rebated back that swings with it and laps behind the fixed jamb.
  const doorBack = new T.MeshStandardMaterial({ color: '#875d36', roughness: .96 });
  exteriorDoors.forEach((hinge, i) => {
    mesh(hinge, new T.BoxGeometry(.55, 1.72, .055), doorBack,
      (i ? -1 : 1) * .258, .85, -.121 - i * .058);
  });
  mesh(exterior, new T.BoxGeometry(1.24, .09, .25), casing, 0, .02, 2.96);
  for (const side of [-1, 1]) {
    mesh(exterior, new T.BoxGeometry(.29, 1.80, .30), casing, side * .605, .88, 2.82);
  }
  mesh(exterior, new T.BoxGeometry(1.48, .24, .30), casing, 0, 1.72, 2.82);
  scene.add(exterior);
  const yurtBounds = new T.Box3().setFromObject(exterior);
  const doorBounds = new T.Box3();
  exteriorDoors.forEach(hinge => doorBounds.expandByObject(hinge));
  host.dataset.model = 'loaded';
  const interior = createYurtInterior(scene, loader, host);
  const { anchors } = interior;

  let width = 1;
  let height = 1;
  let progress = 0;
  let flight = null;
  const stage = host.parentElement;
  const ray = new T.Raycaster();
  const pointer = new T.Vector2();
  function exhibitAt(event) {
    if (progress < .92 || flight || stage.dataset.ready !== 'true' || event.target.closest('a, button')) return '';
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return '';
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    ray.setFromCamera(pointer, camera);
    const choices = Object.entries(interior.exhibits);
    const hit = ray.intersectObjects(choices.map(([, model]) => model), true)[0];
    if (!hit) return '';
    for (let node = hit.object; node; node = node.parent) {
      const match = choices.find(([, model]) => model === node);
      if (match) return match[0];
    }
    return '';
  }

  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse') stage.dataset.exhibitHover = exhibitAt(event);
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { delete stage.dataset.exhibitHover; });
  stage.addEventListener('click', event => {
    const exhibit = exhibitAt(event);
    if (exhibit) openExhibit?.(exhibit);
  });
  function projectBounds(bounds, flat = false) {
    let left = 100, top = 100, right = 0, bottom = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of flat ? [bounds.max.z] : [bounds.min.z, bounds.max.z]) {
          const p = new T.Vector3(x, y, z).project(camera);
          left = Math.min(left, (p.x + 1) * 50);
          right = Math.max(right, (p.x + 1) * 50);
          top = Math.min(top, (1 - p.y) * 50);
          bottom = Math.max(bottom, (1 - p.y) * 50);
        }
      }
    }
    return { left, top, width: right - left, height: bottom - top };
  }

  // Project one landscape onto the distant mountains and the ground from the
  // entry viewpoint. Both surfaces stay in world space as the visitor walks.
  const projector = new T.PerspectiveCamera();
  const projection = new T.Matrix4();
  const terrainMaterial = new T.ShaderMaterial({
    uniforms: { plate: { value: null }, projection: { value: projection }, crop: { value: new T.Vector2(1, 1) } },
    vertexShader: `uniform mat4 projection;
      varying vec4 photo;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.);
        photo = projection * world;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: `uniform sampler2D plate; uniform vec2 crop;
      varying vec4 photo;
      void main() {
        vec2 uv = clamp(photo.xy / photo.w * .5 * crop + .5, .001, .999);
        gl_FragColor = texture2D(plate, uv);
        #include <colorspace_fragment>
      }`,
    side: T.DoubleSide,
  });
  const landscape = new T.Group();
  const ground = mesh(landscape, new T.PlaneGeometry(500, 220), terrainMaterial, 0, -.045, -40);
  ground.rotation.x = -Math.PI / 2;
  mesh(landscape, new T.PlaneGeometry(520, 230), terrainMaterial, 0, 36, -78);
  landscape.visible = false;
  scene.add(landscape);
  let plateReady = false;
  const terrainReady = new T.TextureLoader().loadAsync(new URL('./assets/hero-blue-hour.jpg', import.meta.url).href).then(plate => {
    plate.colorSpace = T.SRGBColorSpace;
    terrainMaterial.uniforms.plate.value = plate;
    plateReady = true;
  }).catch(() => {});
  function render() {
    const narrow = width < 700;
    const portraitFov = degrees => T.MathUtils.radToDeg(2 * Math.atan(Math.tan(T.MathUtils.degToRad(degrees / 2)) / camera.aspect));
    const outsideFov = narrow ? Math.max(53, portraitFov(30)) : 41;
    const startZ = narrow ? 14.6 : 12.8;
    const startY = narrow ? 2.6 : 3.1;
    const startLookX = narrow ? 0 : -2.85;
    const startLookY = narrow ? 4.7 : 2.22;
    const source = terrainMaterial.uniforms.plate.value?.image;
    if (source) {
      const aspectRatio = camera.aspect / (source.width / source.height);
      terrainMaterial.uniforms.crop.value.set(Math.min(1, aspectRatio), Math.min(1, 1 / aspectRatio));
    }
    projector.aspect = camera.aspect;
    projector.fov = outsideFov;
    projector.near = .035;
    projector.far = 160;
    projector.position.set(0, startY, startZ);
    projector.lookAt(startLookX, startLookY, 0);
    projector.updateProjectionMatrix();
    projector.updateMatrixWorld();
    projection.multiplyMatrices(projector.projectionMatrix, projector.matrixWorldInverse);

    const approach = ease(0, .72, progress);
    const enter = ease(.52, 1, progress);
    const open = ease(.17, .56, progress);
    camera.position.set(
      0,
      T.MathUtils.lerp(startY, 1.29, approach) + .46 * ease(.91, 1, progress),
      T.MathUtils.lerp(startZ, 4.12, approach) - 1.56 * enter
    );
    const insideFov = narrow ? Math.min(132, Math.max(63, portraitFov(76))) : 63;
    camera.fov = T.MathUtils.lerp(outsideFov, insideFov, ease(.89, 1, progress));
    camera.lookAt(startLookX * (1 - approach), T.MathUtils.lerp(startLookY, 1.30, approach), -1.05 * enter);
    if (flight) {
      const t = ease(0, 1, flight.amount);
      if (flight.name === 'calendar') {
        const glide = ease(0, .68, flight.amount);
        const lift = ease(.29, 1, flight.amount);
        const tilt = ease(.03, .56, flight.amount);
        camera.position.set(
          .36 * Math.sin(Math.PI * glide),
          1.75 + 3.45 * lift,
          2.56 * (1 - glide)
        );
        camera.lookAt(
          .12 * tilt,
          T.MathUtils.lerp(1.3, Math.max(4.2, camera.position.y + 1.3), tilt),
          T.MathUtils.lerp(-1.05, -.12, tilt)
        );
        camera.fov = T.MathUtils.lerp(camera.fov, 68, tilt);
      } else if (flight.name === 'places') {
        const glide = ease(0, .66, flight.amount);
        const [x, y, z] = sacredFraming.target;
        camera.position.lerp(new T.Vector3(...sacredFraming.camera), glide);
        camera.lookAt(x * glide, T.MathUtils.lerp(1.30, y, glide), T.MathUtils.lerp(-1.05 * enter, z, glide));
        camera.fov = T.MathUtils.lerp(camera.fov, sacredFraming.fov(camera.aspect), glide);
      } else {
        const target = anchors[flight.name];
        camera.position.lerp(new T.Vector3(target.x, target.y + .2, target.z + .23), t);
        camera.lookAt(target.x, target.y, target.z);
      }
    }
    // Drop below the lintel during entry, then raise the viewer to eye height inside.
    const inside = progress > .55 && camera.position.z < 2.98;
    interior.update(progress > .20);
    const insideLight = ease(.48, 1, progress);
    const mapFocus = flight?.name === 'places' ? ease(.29, .83, flight.amount) : 0;
    ambient.intensity = T.MathUtils.lerp(.82, 1.65, insideLight) * (1 - .72 * mapFocus);
    dusk.intensity = T.MathUtils.lerp(.9, 0, insideLight);
    interiorFill.intensity = 1.34 * insideLight * (1 - .74 * mapFocus);
    light.intensity = T.MathUtils.lerp(1.7, 11, insideLight) * (1 - .76 * mapFocus);
    tableLight.intensity = 2.7 * mapFocus;
    mapShadow.visible = mapFocus > 0;
    mapShadow.material.opacity = .62 * mapFocus;
    thresholdLight.intensity = .46 * (1 - insideLight);
    renderer.toneMappingExposure = T.MathUtils.lerp(.97, 1.23, insideLight);
    stars.visible = inside;
    scene.background = inside ? indoorSky : null;
    shadow.visible = !inside;
    landscape.visible = plateReady && !inside;
    exteriorDoors.forEach((door, i) => {
      door.rotation.y = (i ? 1 : -1) * 1.69 * open;
    });
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    if (progress <= .3) updateEntrance(projectBounds(doorBounds, true), projectBounds(yurtBounds));
    if (progress > .86) {
      const projected = Object.fromEntries(Object.entries(anchors).map(([key, point]) => {
        const p = point.clone().project(camera);
        return [key, [(p.x + 1) * 50, (1 - p.y) * 50]];
      }));
      updateLabels(projected);
    }
  }

  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    renderer.setSize(width, height, false);
    render();
  }

  await Promise.all([interior.ready, terrainReady]);
  // Warm both views behind the loader, including textures and lighting programs.
  progress = 1;
  resize();
  await renderer.compileAsync(scene, camera);
  progress = 0;
  new ResizeObserver(resize).observe(host);
  resize();
  const update = value => { progress = value; flight = null; render(); };
  update.transition = (name, amount) => { flight = { name, amount }; render(); };
  return update;
}



