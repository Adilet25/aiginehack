import { mkdirSync, readFileSync } from 'node:fs';
import { Asset, T, embeddedImages, png, quad, hash, noise, clamp, mix, surface } from './glb-kit.mjs';

const out = new URL('../public/legacy/assets/yurt-models/', import.meta.url);
mkdirSync(out, { recursive: true });
const [woodGrain, ironGrain] = embeddedImages(new URL('../public/legacy/assets/sandyk.glb', import.meta.url));
const photoTexture = name => ({ mimeType: 'image/jpeg', bytes: readFileSync(new URL('./model-textures/' + name + '.jpg', import.meta.url)) });

const wood = surface('Walnut', '#f2d7be', { texture: woodGrain, roughness: .84 });
const lightWood = surface('Honey-colored willow', '#e0c4a2', { texture: woodGrain, roughness: .85 });
const darkWood = surface('Dark oiled wood', '#a98162', { texture: woodGrain, roughness: .89 });
const iron = surface('Forged iron', '#a9a29a', { texture: ironGrain, metal: .6, roughness: .76 });
const copper = surface('Aged copper', '#f3ad7b', { texture: ironGrain, metal: .58, roughness: .65 });
const brass = surface('Brass', '#b18a48', { metal: .67, roughness: .54 });
const incision = surface('Dark recesses in wood', '#54361f');
const parchment = surface('Unbleached parchment', '#e4c998', { roughness: .94 });

function grainTexture(base, seed, coarse, grit) {
  return png(384, 256, (u, v, x, y) => {
    const variation = (noise(u * 22, v * 23, seed) - .5) * coarse
      + (noise(u * 112, v * 101, seed * 2) - .5) * grit
      + (hash(x, y, seed) - .5) * grit * .8;
    return base.map(channel => channel + variation);
  });
}
const clayTexture = grainTexture([144, 77, 49], 14, 28, 20);
const clay = surface('Fired terracotta', '#ffffff', { texture: clayTexture });
const innerClay = surface('Terracotta interior', '#e0c9af', { texture: clayTexture });
const slip = surface('Pale clay slip', '#d6b88b', { texture: grainTexture([255, 247, 228], 28, 18, 13) });
const feltGrain = png(512, 384, (u, v, x, y) => {
  const warp = noise(u * 54, v * 103, 87);
  const pilling = hash(x, y, 12);
  const rough = (noise(u * 14, v * 17, 38) - .5) * 18
    + (warp - .5) * 20 + (pilling - .5) * 21 + Math.sin(u * 1800 + v * 660) * 1.5;
  return [224 + rough, 212 + rough, 189 + rough];
});
const felt = surface('Ivory wool felt', '#ffffff', { texture: feltGrain, twoSided: true, roughness: 1 });
const red = surface('Burgundy wool', '#873834', { texture: feltGrain, roughness: 1 });
const redBinding = surface('Burgundy seam', '#79352e', { texture: feltGrain, twoSided: true });
const teal = surface('Deep teal wool', '#315c59', { texture: feltGrain });
const ochre = surface('Ochre wool', '#bd8242', { texture: feltGrain });
const braid = surface('Hand twisted wool cord', '#bb9265', { texture: feltGrain });
const rugged = surface('Weathered rock', '#ffffff', { texture: grainTexture([87, 78, 68], 85, 46, 35), roughness: 1 });
const rugCloth = surface('Shyrdak face', '#ffffff', { texture: photoTexture('rug'), roughness: 1, twoSided: true });
const hangingCloth = surface('Wall felt face', '#ffffff', { texture: photoTexture('hanging'), roughness: 1, twoSided: true });
const bandCloth = surface('Woven yurt band', '#ffffff', { texture: photoTexture('woven-band'), roughness: .98, twoSided: true });

const rotX = angle => [angle, 0, 0];
const rotZ = angle => [0, 0, angle];

function bandPath(x, y, sx, sy) {
  return [[0, 0], [.21, .17], [.38, .65], [.68, .89], [.92, .67], [.88, .37], [.65, .27], [.56, .49], [.7, .59]]
    .map(([u, v]) => [x + u * sx, y + v * sy]);
}
function carve(asset, points, z, radius = .0021, node = 0) {
  asset.cord(incision, points.map(([x, y]) => [x, y, z]), radius, node);
}
function fabricPad(w, h, d, fullness = .25) {
  const g = new T.BoxGeometry(2, 2, 2, 16, 7, 12);
  const p = g.attributes.position;
  const roundness = .17;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), flatY = p.getY(i), z = p.getZ(i);
    const u = .5 + .5 * x, v = .5 + .5 * z;
    const fill = (1 - x ** 4) * (1 - z ** 4);
    const wrinkles = (noise(u * 10, v * 8, 62) - .5) * h * .085;
    const seam = Math.cos(flatY * Math.PI / 2);
    p.setXYZ(i, w / 2 * x * (1 - roundness * z ** 10 + seam * .044), h / 2 * flatY * (.82 + fullness * fill) + wrinkles,
      d / 2 * z * (1 - roundness * x ** 10 + seam * .044));
  }
  g.computeVertexNormals();
  return g;
}
function fringeOnRug(asset, width, depth, y) {
  for (const side of [-1, 1]) {
    for (let i = 0; i < 132; i++) {
      const x = (i / 131 - .5) * width;
      const extent = .018 + hash(i, side, 7) * .034;
      asset.rod(i % 4 === 0 ? ochre : braid, [x, y, side * depth / 2],
        [x + (hash(i, side, 9) - .5) * .021, y - .002, side * (depth / 2 + extent)], .0016);
    }
  }
}

function rug() {
  const a = new Asset('Shyrdak floor rug');
  const w = 2.82, d = 3.55;
  a.box(red, [w, .020, d], [0, .010, 0], .003);
  const top = new T.PlaneGeometry(d, w);
  top.rotateZ(Math.PI / 2);
  a.add(top, rugCloth, [0, .021, 0], rotX(-Math.PI / 2));
  fringeOnRug(a, w, d, .012);
  return a;
}

function hanging() {
  const a = new Asset('Felt wall hanging');
  a.box(red, [1.42, 1.78, .023], [0, .91, -.012], .010);
  a.add(new T.PlaneGeometry(1.42, 1.78), hangingCloth, [0, .91, .001]);
  for (let i = 0; i < 9; i++) {
    const x = (i - 4) * .149;
    a.cord(braid, [[x - .015, 1.785, -.009], [x - .007, 1.84, -.019], [x + .013, 1.84, -.015], [x + .018, 1.785, -.008]], .0035);
  }
  return a;
}

function wovenBand() {
  const a = new Asset('Woven binding band');
  a.box(redBinding, [2.12, .16, .012], [0, .12, -.003], .004);
  a.add(new T.PlaneGeometry(2.11, .155), bandCloth, [0, .12, .004]);
  for (const s of [-1, 1]) for (let i = 0; i < 9; i++) {
    const y = .069 + i * .012;
    a.cord(i % 3 === 0 ? red : braid,
      [[s * 1.055, y, .002], [s * 1.069, y - .026, .003], [s * (1.08 + .012 * hash(i, s, 19)), y - .045, .009]], .002);
  }
  return a;
}

function cushion() {
  const a = new Asset('Wool cushion');
  a.add(fabricPad(.59, .19, .48, .45), teal, [0, .104, 0]);
  const inset = .035;
  for (const s of [-1, 1]) {
    for (let i = 0; i < 18; i++) {
      const x = -(.295 - inset) + i * .030;
      a.rod(i % 5 ? braid : red, [x, .185, s * .184], [x + .015, .183, s * .186], .0016);
    }
    for (let j = 0; j < 12; j++) {
      const z = -.172 + j * .030;
      a.rod(braid, [s * .249, .184, z], [s * .251, .182, z + .014], .0016);
    }
    const swirl = bandPath(0, 0, .137 * s, .105);
    a.cord(ochre, swirl.map(([x, z]) => [x, .223 - .018 * Math.abs(x), z - .041]), .0030);
    a.cord(ochre, swirl.map(([x, z]) => [-x, .223 - .018 * Math.abs(x), -z + .041]), .0030);
  }
  return a;
}

function bench() {
  const a = new Asset('Low wooden bench with bolster');
  a.box(wood, [1.18, .077, .47], [0, .315, 0], .013);
  for (const x of [-.50, .50]) for (const z of [-.177, .177]) {
    a.box(darkWood, [.086, .291, .085], [x, .146, z], .012, rotZ(Math.sign(x) * .06));
  }
  for (const side of [-1, 1]) a.box(wood, [1.045, .042, .049], [0, .135, side * .174], .006);
  a.add(fabricPad(1.14, .059, .442), red, [0, .372, 0]);
  a.add(new T.PlaneGeometry(1.03, .402), rugCloth, [-.033, .411, 0], rotX(-Math.PI / 2));
  a.add(fabricPad(.24, .124, .41), ochre, [.423, .462, -.005]);
  for (const s of [-1, 1]) {
    a.cord(braid, [[.32, .464, s * .177], [.41, .505, s * .163], [.53, .463, s * .172]], .0028);
  }
  return a;
}

function bedding() {
  const a = new Asset('Juk folded bedding');
  a.box(darkWood, [1.34, .054, .56], [0, .091, 0], .011);
  for (const x of [-.55, .55]) a.box(darkWood, [.105, .063, .47], [x, .032, 0], .006);
  const colors = [ochre, teal, red];
  for (let row = 0; row < 3; row++) {
    const w = 1.31 - row * .073, d = .538 - row * .038;
    const top = .20 + row * .13;
    a.add(fabricPad(w, .148, d, .46), colors[row], [0, top, -.009 * row]);
    const front = d / 2 - .006 - row * .009;
    for (let j = 0; j < 3; j++) {
      a.cord(j === 1 ? ochre : braid, [[-w * .4, top + .048 - j * .016, front], [-w * .08, top + .052 - j * .016, front + .003],
        [w * .17, top + .045 - j * .017, front], [w * .42, top + .035 - j * .017, front]], .0017);
    }
  }
  return a;
}

function bowl() {
  const a = new Asset('Open terracotta bowl');
  const outside = [[0,.006],[.076,.006],[.095,.016],[.103,.035],[.118,.05],[.139,.069],[.155,.090],[.166,.114],[.172,.139],[.174,.15]];
  const inside = [[.174,.15],[.167,.154],[.159,.147],[.151,.120],[.138,.095],[.119,.077],[.095,.06],[.055,.054],[0,.054]];
  a.lathe(clay, outside, [0, 0, 0]);
  a.lathe(innerClay, inside, [0, 0, 0]);
  a.lathe(slip, [[.163,.109],[.166,.116],[.168,.121]], [0, 0, 0]);
  a.lathe(slip, [[.154,.089],[.157,.094],[.160,.099]], [0, 0, 0]);
  return a;
}

function jug() {
  const a = new Asset('Terracotta jug with open mouth');
  const outside = [[0,.004],[.083,.004],[.1,.025],[.126,.089],[.135,.124],[.134,.159],[.124,.201],
    [.105,.229],[.082,.255],[.057,.271],[.046,.292],[.044,.323],[.055,.337],[.056,.351]];
  const inside = [[.056,.351],[.050,.355],[.043,.347],[.035,.324],[.035,.295],[.050,.271],
    [.084,.242],[.104,.215],[.115,.179],[.120,.138],[.093,.061],[.078,.034],[0,.03]];
  a.lathe(clay, outside, [0, 0, 0]);
  a.lathe(innerClay, inside, [0, 0, 0]);
  a.lathe(slip, [[.133,.162],[.133,.169],[.130,.178]], [0, 0, 0]);
  a.lathe(slip, [[.127,.189],[.126,.194],[.124,.202]], [0, 0, 0]);
  a.cord(clay, [[.047,.312,0],[.091,.317,0],[.14,.304,0],[.163,.268,0],[.158,.233,0],[.137,.2,0],[.111,.189,0]], .0146);
  return a;
}

function lantern() {
  const a = new Asset('Copper lantern with glass');
  a.lathe(copper, [[0,.003],[.095,.003],[.099,.012],[.098,.021],[.087,.029],[.082,.07],[.095,.081],[.087,.092],[0,.096]], [0, 0, 0]);
  a.lathe(copper, [[.042,.247],[.078,.259],[.070,.27],[.032,.285],[.026,.305],[.051,.314],[.043,.323],[0,.328]], [0, 0, 0]);
  for (let i = 0; i < 4; i++) {
    const angle = (i + .5) * Math.PI / 2;
    const pos = (r, y) => [r * Math.cos(angle), y, r * Math.sin(angle)];
    a.rod(iron, pos(.078, .081), pos(.061, .251), .007, 0, 7);
    a.globe(brass, [.006,.006,.006], pos(.079, .086));
  }
  const glass = surface('Thin lantern glass', '#efe2c6', { roughness: .14, opacity: .22, twoSided: true });
  a.lathe(glass, [[.047,.091],[.05,.119],[.055,.164],[.050,.194],[.038,.227],[.040,.252]], [0, 0, 0]);
  a.cylinder(iron, .032, .043, .028, [0, .102, 0]);
  const flame = surface('Amber flame', '#ffbe65', { roughness: .6, emissive: '#ff912d' });
  a.lathe(flame, [[0,.11],[.013,.124],[.017,.14],[.013,.164],[.006,.184],[0,.196]], [0, 0, 0], 0, 24);
  const handle = Array.from({ length: 21 }, (_, i) => {
    const angle = Math.PI * i / 20;
    return [.058 * Math.cos(angle), .31 + .083 * Math.sin(angle), 0];
  });
  a.cord(copper, handle, .0048);
  return a;
}

function lattice() {
  const a = new Asset('Kerege lattice wall panel');
  const halfWidth = .87, height = 1.62;
  const slopes = [-1, 1];
  const step = .275;
  const slope = .61;
  for (const direction of slopes) {
    const z = direction * .014;
    for (let i = -7; i <= 7; i++) {
      const x0 = i * step;
      const aY = (-halfWidth - x0) / (direction * slope);
      const bY = (halfWidth - x0) / (direction * slope);
      const lower = Math.max(0, Math.min(aY, bY));
      const upper = Math.min(height, Math.max(aY, bY));
      if (upper - lower < .02) continue;
      const start = [x0 + lower * direction * slope, lower + .022, z];
      const finish = [x0 + upper * direction * slope, upper + .022, z];
      const angle = -Math.atan2(finish[0] - start[0], upper - lower);
      a.box(lightWood, [.029, Math.hypot(finish[0] - start[0], upper - lower), .020],
        start.map((v, k) => (v + finish[k]) / 2), .007, rotZ(angle));
    }
  }
  const tie = surface('Rawhide ties', '#5e4531');
  for (let i = -7; i <= 7; i++) for (let j = -7; j <= 7; j++) {
    const x = (i + j) * step / 2, y = (j - i) * step / (2 * slope);
    if (Math.abs(x) > halfWidth - .01 || y <= .035 || y > height - .02) continue;
    a.torus(tie, .021, .0029, [x, y + .022, .001], [0, Math.PI / 2, .33], 0, 14);
    a.rod(tie, [x - .016, y + .023, .022], [x + .011, y - .004, .022], .0031);
  }
  return a;
}

function rafter() {
  const a = new Asset('Uuk roof pole');
  a.cord(lightWood, [[-.49,.031,0],[-.43,.043,0],[-.35,.165,0],[-.26,.37,0],[-.05,.62,0],[.23,.87,0],[.55,1.14,0],[.75,1.28,0]], .0215, 0, 38);
  a.rod(lightWood, [.75,1.28,0], [.80,1.315,0], .012);
  a.torus(braid, .023, .003, [-.387,.095,0], rotX(Math.PI / 2));
  return a;
}

function addDoorLeaf(a, node, side, width, height, offsetZ = 0) {
  const cx = -side * width / 2;
  a.box(wood, [width, height, .043], [cx, height / 2, offsetZ], .009, undefined, node);
  const z = offsetZ + .027;
  for (const y of [height * .33, height * .70]) {
    a.box(darkWood, [width * .79, height * .278, .009], [cx, y, offsetZ + .023], .003, undefined, node);
    a.box(wood, [width * .71, height * .239, .01], [cx, y, z], .003, undefined, node);
    const motif = bandPath(cx - side * width * .23, y - height * .06, side * width * .49, height * .125);
    carve(a, motif, z + .006, .0032, node);
  }
  const x = -side * width * .84;
  a.box(iron, [width * .104, height * .07, .010], [x, height * .50, z + .002], .003, rotZ(Math.PI / 4), node);
  a.torus(iron, height * .022, .005, [x, height * .477, z + .014], undefined, node);
}

function doubleDoor() {
  const a = new Asset('Carved interior double door');
  for (const side of [-1, 1]) {
    a.box(darkWood, [.097, 1.75, .101], [side * .55, .875, 0], .012);
    const hinge = a.node(side < 0 ? 'Door_Left_Hinge' : 'Door_Right_Hinge', [side * .50, .109, .005]);
    addDoorLeaf(a, hinge, side, .499, 1.53);
  }
  a.box(wood, [1.215, .131, .115], [0, 1.744, .006], .012);
  a.box(darkWood, [1.182, .092, .152], [0, .046, .009], .012);
  for (const s of [-1, 1]) {
    carve(a, bandPath(0, 1.714, s * .44, .054), .065, .0035);
    for (const y of [1.61, .31]) for (let i = 0; i < 3; i++) {
      const h = y + .009 * i;
      a.cord(braid, [[s * .494,h,-.056],[s * .602,h,-.041],[s * .607,h,.041],[s * .54,h,.058],[s * .499,h,.052]], .0034);
    }
  }
  return a;
}

const region = JSON.parse(readFileSync(new URL('../public/legacy/assets/atlas-geography.json', import.meta.url)));
function mapTexture() {
  const width = 520, height = 290;
  const fill = new Uint8Array(width * height);
  const ink = new Uint8Array(width * height);
  const project = ([lng, lat]) => [29 + (lng - 69.1) / 11.6 * (width - 58), 26 + (43.7 - lat) / 4.6 * (height - 52)];
  function outline(polygons, kind) {
    const rings = polygons.flat().map(ring => ring.map(project));
    for (let y = 0; y < height; y++) {
      const crossings = [];
      for (const ring of rings) for (let i = 1; i < ring.length; i++) {
        const [x1, y1] = ring[i - 1], [x2, y2] = ring[i];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) crossings.push(x1 + (x2 - x1) * (y - y1) / (y2 - y1));
      }
      crossings.sort((a, b) => a - b);
      for (let p = 0; p + 1 < crossings.length; p += 2) {
        const left = clamp(Math.ceil(crossings[p]), 0, width - 1);
        const right = clamp(Math.floor(crossings[p + 1]), 0, width - 1);
        for (let x = left; x <= right; x++) fill[y * width + x] = kind;
      }
    }
    for (const ring of rings) for (let i = 1; i < ring.length; i++) {
      const [x1, y1] = ring[i - 1], [x2, y2] = ring[i];
      const length = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2));
      for (let t = 0; t <= length; t++) {
        const x = Math.round(mix(x1, x2, t / length)), y = Math.round(mix(y1, y2, t / length));
        if (x >= 0 && x < width && y >= 0 && y < height) ink[y * width + x] = kind;
      }
    }
  }
  for (const [name, kind] of [['Kyrgyzstan', 1], ['Issyk-Kul', 2]]) {
    const geometry = region.features.find(feature => feature.properties.name === name).geometry;
    outline(geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates, kind);
  }
  return png(width, height, (u, v, x, y) => {
    const d = y * width + x;
    const edge = Math.min(u, v, 1 - u, 1 - v);
    const hair = Math.sin(u * 359 + v * 169 + noise(u * 20, v * 17, 38) * 2) ** 14;
    const field = (noise(u * 17, v * 17, 36) - .5) * 21 + (hash(x, y, 7) - .5) * 11;
    const border = edge < .014 ? -40 : ((u * width) % 38 < 1 || (v * height) % 38 < 1) ? -13 : 0;
    const base = ink[d] === 1 ? [112, 72, 43] : fill[d] === 2 ? [134, 145, 121] : fill[d] === 1 ? [224, 192, 140] : [206, 171, 119];
    return base.map(value => value + field + border - (fill[d] === 1 ? hair * 15 : 0));
  });
}

function mapTable() {
  const a = new Asset('Map table with parchment roll');
  for (const x of [-.61, .61]) for (const z of [-.31, .31]) {
    a.box(darkWood, [.115, .521, .104], [x, .267, z], .013, rotZ(x * .03));
  }
  a.box(wood, [1.43,.118,.82], [0,.516,0], .021);
  const slope = .22;
  a.box(wood, [1.48,.075,.85], [0,.641,0], .016, rotX(slope));
  const map = surface('Parchment map of Kyrgyzstan', '#ffffff', { texture: mapTexture(), roughness: .96, twoSided: true });
  const boardZ = z => .690 - Math.sin(slope) * z;
  const plane = new T.PlaneGeometry(1.23, .681, 10, 8);
  const p = plane.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setXYZ(i, x + .003 * Math.sin(40 * y), y, .002 + .005 * Math.abs(Math.sin(14 * y + 15 * x)));
  }
  plane.computeVertexNormals();
  a.add(plane, map, [0, .690, 0], rotX(-Math.PI / 2 + slope));
  for (const x of [-.615,.615]) {
    a.rod(lightWood, [x,boardZ(-.367) + .021,-.367], [x,boardZ(.367) + .021,.367], .032, 0, 20);
    for (const z of [-.38,.38]) {
      a.globe(darkWood, [.046,.045,.030], [x,boardZ(z) + .021,z]);
      a.torus(wood, .038, .005, [x,boardZ(z) + .021,z]);
    }
  }
  for (let i = 0; i < 6; i++) carve(a, bandPath(-.55 + i * .18,.495,.17,.050), .411, .003);
  return a;
}

function calendar() {
  const a = new Asset('Wooden seasonal calendar dial');
  a.cylinder(darkWood, .218,.267,.098,[0,.051,0],undefined,0,32);
  a.box(wood,[.43,.075,.194],[0,.102,0],.011);
  a.box(lightWood,[.112,.435,.106],[0,.316,-.028],.012);
  const center = .596;
  const pitch = rotX(Math.PI / 2);
  a.cylinder(wood,.418,.418,.075,[0,center,0],pitch,0,72);
  a.torus(darkWood,.399,.014,[0,center,.036]);
  a.cylinder(parchment,.368,.368,.008,[0,center,.039],pitch,0,72);
  a.torus(incision,.354,.0020,[0,center,.044]);
  a.torus(incision,.247,.0017,[0,center,.044]);
  a.cylinder(wood,.147,.147,.017,[0,center,.050],pitch,0,64);
  a.torus(brass,.145,.0032,[0,center,.061]);
  a.globe(brass,[.025,.025,.016],[0,center,.068]);
  const polar = (r, t, z = .045) => [r * Math.sin(t), center + r * Math.cos(t), z];
  for (let i = 0; i < 48; i++) {
    const angle = i * Math.PI / 24;
    a.rod(incision, polar(i % 6 === 0 ? .254 : .329, angle), polar(.35, angle), i % 6 === 0 ? .0023 : .0014);
    if (i % 6 === 0) a.globe(brass,[.010,.010,.008],polar(.388,angle,.044));
  }
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8;
    a.rod(lightWood,polar(.032,angle,.061),polar(i % 2 === 0 ? .132 : .085,angle,.061),.0016);
  }
  const sun = Array.from({length:17}, (_, i) => [.038 * Math.cos(Math.PI * i / 16), center + .274 + .038 * Math.sin(Math.PI * i / 16)]);
  carve(a, sun, .046,.0015);
  for (let i = 0; i < 7; i++) {
    const angle = Math.PI * i / 6;
    a.rod(incision, [.047 * Math.cos(angle),center + .274 + .047 * Math.sin(angle),.046],
      [.058 * Math.cos(angle),center + .274 + .058 * Math.sin(angle),.046],.0013);
  }
  for (const x of [-.299,.299]) {
    a.rod(incision, [x,center - .046,.046],[x,center + .052,.046],.0018);
    for (let i = 0; i < 4; i++) for (const s of [-1,1]) {
      a.rod(incision,[x,center - .044 + .023 * i,.046],[x+s*.023, center - .025 + .023*i,.046],.0016);
    }
  }
  for (let i = 0; i < 6; i++) {
    const ang = i * Math.PI / 3;
    const x = .042 * Math.cos(ang), y = .042 * Math.sin(ang);
    a.rod(incision,[0,center-.294,.046],[x,center-.294+y,.046],.0015);
  }
  return a;
}

function ibexTexture() {
  const paths = [
    [[.28,.52],[.35,.45],[.58,.44],[.67,.37],[.74,.39],[.71,.46],[.64,.47],[.60,.57],[.39,.58],[.28,.52],[.22,.44]],
    [[.39,.58],[.36,.71],[.31,.78]], [[.43,.58],[.45,.72],[.41,.79]],
    [[.58,.57],[.59,.71],[.62,.76]], [[.61,.56],[.67,.68],[.66,.77]],
    [[.67,.38],[.66,.29],[.59,.21],[.50,.18],[.41,.22],[.38,.28]],
    [[.65,.38],[.62,.31],[.55,.25],[.47,.25],[.42,.29]],
  ];
  const segments = paths.flatMap(points => points.slice(1).map((end, i) => [points[i], end]));
  return png(512, 400, (u, v, x, y) => {
    let nearest = Infinity;
    for (const [[x1, y1], [x2, y2]] of segments) {
      const dx = x2 - x1, dy = y2 - y1;
      const t = clamp(((u - x1) * dx + (v - y1) * dy) / (dx * dx + dy * dy));
      nearest = Math.min(nearest, Math.hypot(u - x1 - t * dx, v - y1 - t * dy));
    }
    const patches = (noise(u * 23, v * 22, 85) - .5) * 39 + (noise(u * 105, v * 99, 16) - .5) * 28;
    const flecks = (hash(x, y, 13) - .5) * 43;
    const pecks = nearest < .008 + (noise(u * 155, v * 147, 49) - .5) * .010 && hash(x, y, 44) > .12;
    return (pecks ? [164, 141, 108] : [85, 78, 70]).map(c => c + patches + flecks);
  });
}

function petroglyph() {
  const a = new Asset('Weathered ibex petroglyph');
  const geom = new T.SphereGeometry(1, 64, 36).toNonIndexed();
  const p = geom.attributes.position;
  const uv = geom.attributes.uv;
  const frontPositions = [], backPositions = [], frontUV = [], backUV = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const w = (noise(x * 5.2, y * 6.8 + z * 3, 19) - .5) * .135 + (noise(x * 14.8, y * 15.1 + z * 6, 39) - .5) * .036;
    const worldX = (x + y * .21) * (.50 + w);
    const worldY = Math.max(.015, .38 + y * (.405 + w));
    const crown = Math.max(.0, z);
    const worldZ = (z > 0 ? Math.min(z * .42, .250 + crown * .037) : z * .28) + w * .43;
    p.setXYZ(i, worldX, worldY, worldZ);
  }
  for (let i = 0; i < p.count; i += 3) {
    const toFront = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3 > .126;
    const vertices = toFront ? frontPositions : backPositions;
    const textureCoordinates = toFront ? frontUV : backUV;
    for (let j = i; j < i + 3; j++) {
      const x = p.getX(j), y = p.getY(j), z = p.getZ(j);
      vertices.push(x, y, z);
      if (toFront) textureCoordinates.push(clamp(.5 + x / 1.07), clamp(y / .80));
      else textureCoordinates.push(uv.getX(j), uv.getY(j));
    }
  }
  const clayFace = surface('Pecked ibex on rock patina', '#ffffff', { texture: ibexTexture(), roughness: 1 });
  for (const [vertices, uv, material] of [[frontPositions, frontUV, clayFace], [backPositions, backUV, rugged]]) {
    const shape = new T.BufferGeometry();
    shape.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    shape.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    shape.computeVertexNormals();
    a.add(shape, material);
  }
  return a;
}

function circumferential(profile, start = 0, end = Math.PI * 2, repeat = 1, shape = () => 0) {
  const columns = 192;
  const vertices = [], uv = [], indices = [];
  for (let i = 0; i < profile.length; i++) {
    const [radius, height] = profile[i];
    for (let j = 0; j <= columns; j++) {
      const t = j / columns, a = mix(start, end, t);
      const r = radius + shape(a, i / (profile.length - 1));
      vertices.push(Math.sin(a) * r, height, Math.cos(a) * r);
      uv.push(t * repeat, i / (profile.length - 1));
      if (i === 0 || j === 0) continue;
      const v = i * (columns + 1) + j;
      const row = columns + 1;
      // The profile runs from bottom to top, including the open apex of the roof.
      indices.push(v - row - 1, v - row, v - 1, v - row, v, v - 1);
    }
  }
  return quad(vertices, indices, uv);
}

function yurt() {
  const a = new Asset('Kyrgyz yurt with open roof aperture');
  const gap = .208;
  const radius = 3.07;
  const frameZ = radius * Math.cos(gap);
  const jambX = radius * Math.sin(gap);
  const eave = 1.89;
  const body = Array.from({ length: 18 }, (_, i) => {
    const v = i / 17;
    return [radius + .018 * Math.sin(v * Math.PI), .035 + (eave - .035) * v];
  });
  const folds = (angle, t) => (.010 * Math.sin(angle * 34 + t * 2.6)
    + .008 * Math.sin(angle * 51 - t * 5) + .008 * Math.sin(angle * 7 + t * 4))
    * (.34 + .66 * Math.sin(Math.PI * t) ** .5);
  a.add(circumferential(body, gap, 2 * Math.PI - gap, 14, folds), felt);
  const profile = [[3.09,eave],[3.08,1.96],[2.99,2.11],[2.80,2.31],[2.55,2.50],[2.27,2.69],
    [1.96,2.89],[1.62,3.10],[1.29,3.30],[.95,3.49],[.69,3.64],[.49,3.73],[.431,3.75]];
  a.add(circumferential(profile, 0, 2 * Math.PI, 14, (angle, t) => folds(angle, t) * (1 - t)), felt);
  // A thin folded felt hem bounds the aperture. It leaves the center completely empty.
  a.add(circumferential([[.438,3.711],[.419,3.742],[.426,3.761],[.460,3.768],[.49,3.750]]), felt);
  const ridgeSeam = surface('Felt panel seams', '#b4a182', { roughness: 1 });
  for (let i = 0; i < 32; i++) {
    const angle = i * Math.PI * 2 / 32;
    const points = profile.map(([r, y], j) => {
      const theta = angle + .009 * Math.sin(j * .47 + i);
      return [(r + .006) * Math.sin(theta), y + .007, (r + .006) * Math.cos(theta)];
    });
    a.cord(ridgeSeam, points, .006, 0, 24);
  }
  // The textile bands are independent fitted rings, interrupted only by the doorway.
  for (const [y, h, material] of [[.080,.136,bandCloth],[.86,.041,redBinding],[1.76,.191,bandCloth]]) {
    a.add(circumferential([[radius + .053,y],[radius + .057,y + h]], gap, 2 * Math.PI - gap, 15), material);
  }
  a.add(circumferential([[radius + .043,1.962],[radius + .049,2.032]], 0, 2 * Math.PI, 14), redBinding);
  for (let i = 0; i < 168; i++) {
    const angle = gap + (i + .5) * (2 * Math.PI - 2 * gap) / 168;
    const point = (r, y, da = 0) => [(r - .001) * Math.sin(angle + da), y, (r - .001) * Math.cos(angle + da)];
    a.rod(i % 3 === 0 ? ochre : braid, point(radius + .055, 1.764),
      point(radius + .049, 1.721 - hash(i, 4, 71) * .042, .0025), .0085, 0, 6);
  }
  for (const side of [-1, 1]) {
    a.box(darkWood,[.128,1.77,.149],[side * jambX,.905,frameZ],.013);
    a.box(redBinding, [.114,1.75,.010], [side * jambX,.906,frameZ + .078], .003);
    const pivot = a.node(side < 0 ? 'Entrance_Left_Hinge' : 'Entrance_Right_Hinge',
      [side * (jambX - .054), .085, frameZ + .023]);
    addDoorLeaf(a, pivot, side, jambX - .056, 1.605);
  }
  a.box(wood,[jambX * 2 + .16,.18,.130],[0,1.75,frameZ + .011],.018);
  a.box(darkWood,[jambX * 2 + .12,.087,.228],[0,.045,frameZ + .004],.012);
  for (const side of [-1, 1]) carve(a, bandPath(0,1.733,side * .49,.080),frameZ + .078,.006);
  return a;
}

const models = [
  ['map-table', mapTable], ['calendar-dial', calendar], ['petroglyph-stone', petroglyph],
  ['bench', bench], ['juk-bedding', bedding], ['clay-jug', jug], ['clay-bowl', bowl],
  ['shyrdak-floor-rug', rug], ['wall-hanging', hanging], ['cushion', cushion], ['lantern', lantern],
  ['kerege-wall-lattice', lattice], ['uuk-roof-pole', rafter], ['interior-double-door', doubleDoor],
  ['woven-yurt-band', wovenBand], ['yurt-without-tunduk', yurt],
];
for (const [name, build] of models) {
  const model = build();
  const result = model.write(new URL(name + '.glb', out));
  console.log(name.padEnd(23), result.triangles.toLocaleString().padStart(8), 'triangles', (result.bytes / 1024).toFixed(0).padStart(5), 'KiB');
}
