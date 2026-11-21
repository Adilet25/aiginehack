import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import * as T from '../public/legacy/vendor/three.module.js';

const origin = new URL('../public/legacy/assets/sandyk.glb', import.meta.url);
const { Vector3, Matrix4, Quaternion, Euler } = T;

const round = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth = value => value * value * (3 - 2 * value);
const mix = (a, b, t) => a + (b - a) * t;
function random(x, y, seed) {
  let n = Math.imul(x + seed, 374761393) + Math.imul(y - seed, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function noise(x, y, seed) {
  const a = Math.floor(x), b = Math.floor(y);
  const u = smooth(x - a), v = smooth(y - b);
  return mix(mix(random(a, b, seed), random(a + 1, b, seed), u),
    mix(random(a, b + 1, seed), random(a + 1, b + 1, seed), u), v);
}
const crcTable = Uint32Array.from({ length: 256 }, (_, i) => {
  for (let j = 0; j < 8; j++) i = i & 1 ? 0xedb88320 ^ (i >>> 1) : i >>> 1;
  return i;
});
function pngChunk(type, data) {
  const block = Buffer.alloc(data.length + 12);
  block.writeUInt32BE(data.length);
  block.write(type, 4, 'ascii');
  data.copy(block, 8);
  let crc = 0xffffffff;
  for (const byte of block.subarray(4, -4)) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  block.writeUInt32BE((crc ^ 0xffffffff) >>> 0, block.length - 4);
  return block;
}
function texture(width, height, colorAt) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const row = width * 3 + 1;
  const pixels = Buffer.alloc(row * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgb = colorAt(x / width, y / height, x, y);
      for (let c = 0; c < 3; c++) pixels[y * row + 1 + x * 3 + c] = round(rgb[c], 0, 255);
    }
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(pixels, { level: 8 })), pngChunk('IEND', Buffer.alloc(0))]);
}
function walnut(u, v, x, y) {
  let warp = (noise(u * 6, v * 7, 31) - .5) * .036;
  let knots = 0;
  for (const [cx, cy] of [[.28, .36], [.76, .68]]) {
    const dx = (u - cx) * 5, dy = (v - cy) * 13;
    const radius = Math.hypot(dx, dy);
    const surround = Math.exp(-radius * radius * 1.5);
    warp += surround * Math.sign(dy) * .045;
    knots += Math.sin(radius * 34) * surround * 10 - surround * 12;
  }
  const fiber = noise(u * 4, (v + warp) * 137, 17) - .5;
  const pores = noise(u * 33, (v + warp) * 235, 91);
  const grain = Math.sin((v + warp) * 410 + noise(u * 9, v * 22, 2) * 2.2);
  const grainDark = Math.pow((1 + grain) / 2, 7) * 9;
  const grit = (random(x, y, 16) - .5) * 6;
  const variation = (noise(u * 9, v * 14, 21) - .5) * 17 + fiber * 28 + grit + knots - grainDark - (pores > .76 ? 9 : 0);
  return [141 + variation, 91 + variation * .9, 56 + variation * .75];
}
function iron(u, v, x, y) {
  const smithing = noise(u * 31, v * 33, 41);
  const corrosion = noise(u * 9, v * 12, 73);
  const pit = random(x, y, 54) ** 8 * 21;
  const base = 69 + smithing * 26 - pit;
  const oxidation = Math.max(0, corrosion - .48) * 47;
  return [base + oxidation, base - 5 + oxidation * .45, base - 10 - oxidation * .22];
}
const woodPng = texture(640, 320, walnut);
const ironPng = texture(256, 256, iron);

const materials = [
  { name: 'Aged walnut · boards', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, roughnessFactor: .89, metallicFactor: 0 } },
  { name: 'Aged walnut · raised frame', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, baseColorFactor: [1, .81, .64, 1], roughnessFactor: .86, metallicFactor: 0 } },
  { name: 'Carving · dark grooves', pbrMetallicRoughness: { baseColorFactor: [.11, .043, .016, 1], roughnessFactor: .98, metallicFactor: 0 } },
  { name: 'Carving · rounded lip', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, baseColorFactor: [.94, .66, .45, 1], roughnessFactor: .83, metallicFactor: 0 } },
  { name: 'Forged iron · patina', pbrMetallicRoughness: { baseColorTexture: { index: 1 }, metallicFactor: .7, roughnessFactor: .78 } },
  { name: 'Iron nail heads', pbrMetallicRoughness: { baseColorTexture: { index: 1 }, baseColorFactor: [1, .82, .67, 1], metallicFactor: .66, roughnessFactor: .62 } },
  { name: 'Dark interior wood', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, baseColorFactor: [.61, .53, .42, 1], roughnessFactor: .96, metallicFactor: 0 } },
];

function roundedBox(w, h, d, radius) {
  const g = new T.BoxGeometry(2, 2, 2, 5, 5, 5);
  const position = g.getAttribute('position');
  const normal = g.getAttribute('normal');
  const dimensions = [w / 2, h / 2, d / 2];
  const inner = new Vector3();
  const axis = new Vector3();
  // The repeated vertices at seams share the same rounded normals.
  for (let i = 0; i < position.count; i++) {
    const p = [position.getX(i), position.getY(i), position.getZ(i)];
    inner.set(...p.map(value => round(value, -.6, .6)));
    axis.set(...p).sub(inner).normalize();
    const base = p.map((value, k) => round(value / .6, -1, 1) * (dimensions[k] - radius));
    position.setXYZ(i, base[0] + radius * axis.x, base[1] + radius * axis.y, base[2] + radius * axis.z);
    normal.setXYZ(i, axis.x, axis.y, axis.z);
  }
  return g;
}
const body = new Map();
const lid = new Map();
function add(group, material, geometry, position, rotation = [0, 0, 0]) {
  if (position) {
    geometry.applyMatrix4(new Matrix4().compose(new Vector3(...position),
      new Quaternion().setFromEuler(new Euler(...rotation)), new Vector3(1, 1, 1)));
  }
  if (!group.has(material)) group.set(material, []);
  group.get(material).push(geometry);
}
function box(group, material, size, center, radius = .006, rotation) {
  add(group, material, roundedBox(...size, radius), center, rotation);
}

const width = .88;
const depth = .49;
const hingeHeight = .423;
const front = depth / 2;
const hingeZ = -depth / 2;

// Base: planked walls with a readable, hollow interior and inset feet.
box(body, 6, [.846, .028, .445], [0, .052, 0], .005);
for (const x of [-.417, .417]) for (const z of [-.217, .217]) {
  box(body, 1, [.074, .064, .068], [x, .032, z], .009);
}
for (const side of [-1, 1]) {
  for (let row = 0; row < 4; row++) {
    const y = .092 + row * .089;
    box(body, 0, [width, .092, .03], [0, y, side * .23], .0035);
    box(body, 0, [.028, .092, .443], [side * .426, y, 0], .0035);
  }
  box(body, 1, [.886, .035, .034], [0, .410, side * .231], .006);
  box(body, 1, [.034, .035, .456], [side * .428, .410, 0], .006);
  box(body, 1, [.89, .053, .039], [0, .062, side * .232], .009);
  box(body, 1, [.039, .053, .46], [side * .428, .062, 0], .009);
}
for (const x of [-.416, .416]) {
  for (const z of [-front, front]) box(body, 1, [.057, .329, .025], [x, .235, z], .007);
}
box(body, 0, [.758, .272, .015], [0, .236, front + .008], .005);
for (const sign of [-1, 1]) {
  box(body, 3, [.779, .017, .015], [0, .236 + sign * .144, front + .018], .003);
  box(body, 3, [.017, .271, .015], [sign * .38, .236, front + .018], .003);
}

// The lid is modeled at its real rear hinge. The curved top and boards are solid.
const lidDepth = depth + .024;
const lidWidth = width + .031;
const lidBack = -.012;
const lidWoodTop = z => {
  const t = round((z - lidBack) / lidDepth, 0, 1);
  return .074 + .056 * Math.sin(Math.PI * t) ** .7;
};
function bufferedSurface(vertices, uvs, indices) {
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
function curvedTop(x0, x1, clearance = 0, strips = 28) {
  const vertices = [], uv = [], indices = [];
  for (let i = 0; i <= strips; i++) {
    const t = i / strips;
    const z = lidBack + lidDepth * t;
    const y = lidWoodTop(z) + clearance;
    vertices.push(x0, y, z, x1, y, z);
    uv.push(0, t, 1, t);
    const k = 2 * i;
    if (i !== strips) indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
  }
  return bufferedSurface(vertices, uv, indices);
}
add(lid, 0, curvedTop(-lidWidth / 2, lidWidth / 2));
for (const side of [-1, 1]) {
  const vertices = [], uv = [], indices = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const z = lidBack + lidDepth * t;
    vertices.push(side * lidWidth / 2, .01, z, side * lidWidth / 2, lidWoodTop(z), z);
    uv.push(t, 0, t, 1);
    const k = 2 * i;
    if (i < 24) {
      if (side > 0) indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      else indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
  }
  add(lid, 1, bufferedSurface(vertices, uv, indices));
}
box(lid, 1, [lidWidth, .071, .033], [0, .038, lidBack + lidDepth - .012], .014);
box(lid, 1, [lidWidth, .071, .031], [0, .036, lidBack + .013], .009);
box(lid, 6, [lidWidth, .018, lidDepth], [0, .016, lidDepth / 2 + lidBack], .007);

function line(points, radius, factor = 1) {
  const curve = new T.CatmullRomCurve3(points.map(p => new Vector3(...p)), false, 'centripetal');
  const geometry = new T.TubeGeometry(curve, Math.max(6, points.length * 2), radius, 6, false);
  if (factor !== 1) {
    const position = geometry.getAttribute('position');
    const center = curve.getPointAt(0);
    for (let i = 0; i < position.count; i++) {
      position.setZ(i, center.z + (position.getZ(i) - center.z) * factor);
    }
    geometry.computeVertexNormals();
  }
  return geometry;
}

// Recessed-looking incisions are framed by a narrow, worn highlight.
function frontGroove(points, radius = .0036) {
  const z = front + .0155;
  add(body, 3, line(points.map(([x, y]) => [x, y - .002, z]), radius * 1.38, .42));
  add(body, 2, line(points.map(([x, y]) => [x - .0007, y + .0015, z + .0015]), radius, .26));
}
function horn(x, y, sx, sy) {
  const shape = [[0, 0], [.16, .09], [.31, .45], [.49, .76], [.75, .79], [.94, .63],
    [.92, .37], [.74, .27], [.58, .41], [.64, .56], [.75, .52]];
  return shape.map(([a, b]) => [x + a * sx, y + b * sy]);
}
frontGroove([[0, .350], [.172, .239], [0, .122], [-.172, .239], [0, .350]], .003);
for (const side of [-1, 1]) {
  frontGroove(horn(side * .013, .238, side * .123, .098));
  frontGroove(horn(side * .013, .233, side * .123, -.096));
  frontGroove(horn(side * .179, .251, side * .174, .118));
  frontGroove(horn(side * .179, .219, side * .174, -.125));
  frontGroove(horn(side * .055, .238, -side * .057, .042), .0023);
}
for (let x = -.31; x < .33; x += .043) {
  frontGroove(horn(x, .389, .038, .02), .0016);
}
for (let x = -.31; x < .33; x += .047) {
  frontGroove([[x, .088], [x + .012, .081], [x + .028, .088]], .0015);
}

function lidGroove(points, radius = .0027) {
  add(lid, 2, line(points.map(([x, z]) => [x, lidWoodTop(z) + .0008, z]), radius));
}
for (const side of [-1, 1]) {
  lidGroove(horn(0, .247, side * .19, .14));
  lidGroove(horn(0, .247, side * .19, -.14));
  lidGroove([[side * .021, .091], [side * .326, .20], [side * .34, .267], [side * .292, .32], [0, .413]], .0024);
}
for (const side of [-1, 1]) {
  const x = side * .443;
  for (const z of [-.12, .12]) {
    const points = horn(z - .06, .195, .12, z < 0 ? .13 : -.13).map(([depth, y]) => [x, y, depth]);
    add(body, 2, line(points, .0028));
  }
}

function nail(group, x, y, z, axis, radius = .011) {
  const g = new T.SphereGeometry(radius, 10, 6);
  g.scale(1, axis === 'up' ? .39 : 1, axis === 'front' ? .44 : 1);
  add(group, 5, g, [x, y, z]);
}
for (const x of [-.265, .265]) {
  // Forged bands follow the curved top and break cleanly at the lid seam.
  add(lid, 4, curvedTop(x - .028, x + .028, .004));
  for (const side of [-1, 1]) {
    const vertices = [], uv = [], indices = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const z = lidBack + lidDepth * t;
      const y = lidWoodTop(z);
      const edge = x + side * .028;
      vertices.push(edge, y - .001, z, edge, y + .004, z);
      uv.push(t, 0, t, 1);
      const k = 2 * i;
      if (i < 28) {
        if (side > 0) indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        else indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
      }
    }
    add(lid, 4, bufferedSurface(vertices, uv, indices));
  }
  box(lid, 4, [.056, .073, .011], [x, .043, lidBack + lidDepth + .003], .004);
  box(body, 4, [.058, .264, .013], [x, .264, front + .028], .006);
  const terminal = new T.Shape();
  terminal.moveTo(-.029, .024);
  terminal.bezierCurveTo(-.056, .015, -.047, -.004, -.036, -.013);
  terminal.quadraticCurveTo(-.013, -.021, 0, -.043);
  terminal.quadraticCurveTo(.013, -.021, .036, -.013);
  terminal.bezierCurveTo(.047, -.004, .056, .015, .029, .024);
  terminal.closePath();
  add(body, 4, new T.ExtrudeGeometry(terminal, { depth: .009, bevelEnabled: true, bevelThickness: .003,
    bevelSize: .003, bevelSegments: 2, steps: 1, curveSegments: 6 }), [x, .125, front + .022]);
  for (const y of [.387, .308, .224, .146]) nail(body, x, y, front + .036, 'front');
  nail(lid, x, .041, lidBack + lidDepth + .010, 'front');
  for (const z of [.04, .133, .263, .40]) nail(lid, x, lidWoodTop(z) + .004, z, 'up');
  box(body, 4, [.066, .070, .015], [x, .395, -front - .006], .005);
  const pin = new T.CylinderGeometry(.014, .014, .079, 12);
  pin.rotateZ(Math.PI / 2);
  add(body, 4, pin, [x, hingeHeight, hingeZ - .008]);
}
for (const x of [-.411, .411]) for (const z of [-front - .012, front + .012]) {
  for (const y of [.105, .361]) {
    box(body, 4, [.043, .032, .01], [x, y, z], .003);
    nail(body, x, y, z + Math.sign(z) * .006, 'front', .006);
  }
}

const gltf = {
  asset: { version: '2.0', generator: 'Aigine sandyk' },
  scenes: [{ name: 'Sandyk', nodes: [0] }], scene: 0,
  nodes: [
    { name: 'Sandyk', children: [1, 2] },
    { name: 'Sandyk_Body', mesh: 0 },
    { name: 'Sandyk_Lid_Hinge', mesh: 1, translation: [0, hingeHeight, hingeZ] },
  ],
  meshes: [], materials, accessors: [], bufferViews: [], buffers: [{ byteLength: 0 }],
  images: [], textures: [{ source: 0, sampler: 0 }, { source: 1, sampler: 0 }],
  samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
};
const chunks = [];
let offset = 0;
function view(bytes, target) {
  const id = gltf.bufferViews.length;
  gltf.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, ...(target ? { target } : {}) });
  chunks.push(bytes);
  offset += bytes.length;
  const padding = (4 - offset % 4) % 4;
  if (padding) { chunks.push(Buffer.alloc(padding)); offset += padding; }
  return id;
}
for (const png of [woodPng, ironPng]) gltf.images.push({ bufferView: view(png), mimeType: 'image/png' });

function accessor(array, components, format, target, bounds) {
  const id = gltf.accessors.length;
  const buffer = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  gltf.accessors.push({ bufferView: view(buffer, target), componentType: format, count: array.length / components,
    type: ['SCALAR', 'VEC2', 'VEC3'][components - 1], ...bounds });
  return id;
}
for (const group of [body, lid]) {
  const primitives = [];
  for (const [material, parts] of group) {
    const positions = [], normals = [], uv = [], indices = [];
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const p of parts) {
      const position = p.getAttribute('position');
      const normal = p.getAttribute('normal');
      const texCoords = p.getAttribute('uv');
      const base = positions.length / 3;
      for (let i = 0; i < position.count; i++) {
        const v = [position.getX(i), position.getY(i), position.getZ(i)];
        v.forEach((coord, j) => { min[j] = Math.min(coord, min[j]); max[j] = Math.max(coord, max[j]); });
        positions.push(...v);
        normals.push(normal.getX(i), normal.getY(i), normal.getZ(i));
        uv.push(texCoords?.getX(i) ?? 0, texCoords?.getY(i) ?? 0);
      }
      const index = p.getIndex();
      if (index) for (let i = 0; i < index.count; i++) indices.push(base + index.getX(i));
      else for (let i = 0; i < position.count; i++) indices.push(base + i);
    }
    const large = positions.length / 3 > 65535;
    primitives.push({
      attributes: {
        POSITION: accessor(Float32Array.from(positions), 3, 5126, 34962, { min, max }),
        NORMAL: accessor(Float32Array.from(normals), 3, 5126, 34962),
        TEXCOORD_0: accessor(Float32Array.from(uv), 2, 5126, 34962),
      },
      indices: accessor(large ? Uint32Array.from(indices) : Uint16Array.from(indices), 1, large ? 5125 : 5123, 34963),
      material,
    });
  }
  gltf.meshes.push({ primitives });
}
gltf.buffers[0].byteLength = offset;

const json = Buffer.from(JSON.stringify(gltf));
const jsonSize = Math.ceil(json.length / 4) * 4;
const header = Buffer.alloc(20);
header.write('glTF');
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + jsonSize + offset, 8);
header.writeUInt32LE(jsonSize, 12);
header.write('JSON', 16);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(offset);
binaryHeader.write('BIN\0', 4);
writeFileSync(origin, Buffer.concat([header, json, Buffer.alloc(jsonSize - json.length, 32), binaryHeader, ...chunks]));
