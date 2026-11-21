import * as T from './vendor/three.module.js';

const radius = 3.07;
const models = new URL('./assets/yurt-models/', import.meta.url);

function move(model, parent, position, scale = 1, angle = 0) {
  model.position.set(...position);
  model.scale.setScalar(scale);
  model.rotation.y = angle;
  parent.add(model);
  return model;
}

function poleMount(group, radial, height, angle) {
  group.position.set(radial * Math.sin(angle), height, radial * Math.cos(angle));
  group.rotation.y = angle;
}

// Bend the exported flat panel around the circular wall while keeping its texture coordinates.
function bendPanel(model, curveRadius) {
  model.traverse(node => {
    if (!node.isMesh) return;
    const geometry = node.geometry.clone();
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const angle = positions.getX(i) / curveRadius;
      const r = curveRadius + positions.getZ(i);
      positions.setX(i, Math.sin(angle) * r);
      positions.setZ(i, Math.cos(angle) * r - curveRadius);
    }
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    node.geometry = geometry;
  });
}

function fitWallPanels(model, interior, count, height, inset, widthScale, heightScale) {
  const r = radius - inset;
  const hinges = .208;
  const span = (2 * Math.PI - hinges * 2) / count;
  // Bake the along-wall scale before bending so the panel edges meet at their proper angle.
  model.traverse(node => {
    if (!node.isMesh) return;
    node.geometry = node.geometry.clone().scale(widthScale, heightScale, 1);
  });
  bendPanel(model, r);
  for (let i = 0; i < count; i++) {
    const panel = model.clone();
    poleMount(panel, r, height, hinges + span * (i + .5));
    interior.add(panel);
  }
}

function positionBenches(model, root) {
  for (const side of [-1, 1]) {
    const bench = model.clone();
    move(bench, root, [side * 2.27, .014, -.67], .94, side * (Math.PI / 2 - .19));
  }
}

function positionCushions(model, root) {
  for (const side of [-1, 1]) {
    move(model.clone(), root, [side * 2.205, .391, side * .34 - .67], .72, side * .22);
  }
}

const placements = {
  'map-table': [[0, .014, -1.17], 1],
  'calendar-dial': [[-1.58, .014, -1.28], 1.18, .10],
  'petroglyph-stone': [[1.46, .023, -.97], .93, -.12],
  'sandyk': [[2.07, .014, -1.49], .90, -.34],
  'shyrdak-floor-rug': [[0, .018, .055], 1],
  'wall-hanging': [[-.08, .60, -2.81], 1.02],
  'juk-bedding': [[-.10, .02, -2.46], 1.10],
  'clay-jug': [[2.52, .02, -.94], 1.14, -.66],
  'clay-bowl': [[2.46, .02, -.49], 1],
  'lantern': [[-1.94, .018, -1.91], 1.24, .25],
};

export function createYurtInterior(scene, loader, host) {
  const root = new T.Group();
  root.name = 'Yurt_Interior';
  scene.add(root);
  const floor = new T.Mesh(new T.CircleGeometry(3.047, 80), new T.MeshStandardMaterial({
    color: '#9a734f', roughness: .99,
  }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = .014;
  root.add(floor);
  const glow = new T.PointLight('#ffaa53', 1.8, 3.1, 2);
  glow.position.set(-1.94, .249, -1.91);
  root.add(glow);
  glow.visible = false;

  const anchors = {
    calendar: new T.Vector3(-1.58, 1.15, -1.22),
    places: new T.Vector3(0, .87, -1.11),
    stone: new T.Vector3(1.46, .80, -.89),
  };
  const exhibits = {};
  const paths = { 'map-table': 'places', 'calendar-dial': 'calendar', 'petroglyph-stone': 'stone' };

  const mount = {
    bench: model => positionBenches(model, root),
    cushion: model => positionCushions(model, root),
    'woven-yurt-band': model => fitWallPanels(model, root, 9, 1.638, .095, .93, .90),
  };
  const names = [...Object.keys(placements), ...Object.keys(mount)];
  host.dataset.interior = 'loading';
  const results = names.map(async name => {
    const url = name === 'sandyk' ? new URL('./assets/sandyk.glb', import.meta.url) : new URL(name + '.glb', models);
    const { scene: model } = await loader.loadAsync(url.href);
    model.name = name;
    if (mount[name]) mount[name](model);
    else move(model, root, ...placements[name]);
    if (paths[name]) exhibits[paths[name]] = model;
    if (name === 'lantern') glow.visible = true;
  });
  const ready = Promise.allSettled(results).then(statuses => {
    const failed = statuses.flatMap(({ status }, i) => status === 'rejected' ? [names[i]] : []);
    host.dataset.interior = failed.length ? 'partial' : 'loaded';
    if (failed.length) console.warn('Yurt interior models could not load:', failed.join(', '));
  });

  return {
    ready,
    anchors,
    exhibits,
    update(nearEntrance) { root.visible = nearEntrance; },
  };
}
