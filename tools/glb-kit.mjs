import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import * as T from '../public/legacy/vendor/three.module.js';

export { T };
export const mix = (a, b, t) => a + (b - a) * t;
export const clamp = (x, low = 0, high = 1) => Math.min(high, Math.max(low, x));
export function hash(x, y, seed = 0) {
  let n = Math.imul(x + seed, 374761393) + Math.imul(y - seed, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
export function noise(x, y, seed) {
  const i = Math.floor(x), j = Math.floor(y);
  const smooth = t => t * t * (3 - 2 * t);
  const u = smooth(x - i), v = smooth(y - j);
  return mix(mix(hash(i, j, seed), hash(i + 1, j, seed), u),
    mix(hash(i, j + 1, seed), hash(i + 1, j + 1, seed), u), v);
}
const crc = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let j = 0; j < 8; j++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n;
});
function pngChunk(name, bytes) {
  const data = Buffer.alloc(bytes.length + 12);
  data.writeUInt32BE(bytes.length);
  data.write(name, 4, 'ascii');
  bytes.copy(data, 8);
  let code = 0xffffffff;
  for (const byte of data.subarray(4, -4)) code = crc[(code ^ byte) & 255] ^ (code >>> 8);
  data.writeUInt32BE((code ^ 0xffffffff) >>> 0, data.length - 4);
  return data;
}
export function png(width, height, draw) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const stride = width * 3 + 1;
  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const color = draw(x / width, y / height, x, y);
    const start = y * stride + 1 + x * 3;
    for (let channel = 0; channel < 3; channel++) pixels[start + channel] = clamp(color[channel], 0, 255);
  }
  return { mimeType: 'image/png', bytes: Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(pixels, { level: 7 })), pngChunk('IEND', Buffer.alloc(0))]) };
}
export function embeddedImages(path) {
  const bytes = readFileSync(path);
  const size = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + size));
  const start = 28 + size;
  return gltf.images.map(image => {
    const view = gltf.bufferViews[image.bufferView];
    return { mimeType: image.mimeType, bytes: bytes.subarray(start + view.byteOffset, start + view.byteOffset + view.byteLength) };
  });
}
export function quad(vertices, indices, uvs) {
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
export function bevelBox(size, radius = .008) {
  const geometry = new T.BoxGeometry(2, 2, 2, 5, 5, 5);
  const position = geometry.attributes.position, normal = geometry.attributes.normal;
  const r = Math.min(radius, Math.min(...size) * .46);
  const surfaceNormal = new T.Vector3();
  for (let i = 0; i < position.count; i++) {
    const p = [position.getX(i), position.getY(i), position.getZ(i)];
    surfaceNormal.set(...p.map(v => v - clamp(v, -.6, .6))).normalize();
    const rounded = p.map((v, axis) => clamp(v / .6, -1, 1) * (size[axis] / 2 - r) + surfaceNormal.getComponent(axis) * r);
    position.setXYZ(i, ...rounded);
    normal.setXYZ(i, surfaceNormal.x, surfaceNormal.y, surfaceNormal.z);
  }
  return geometry;
}
export function surface(name, color, options = {}) {
  const rgb = new T.Color(color).toArray();
  const { texture, metal = 0, roughness = .91, opacity = 1, twoSided = false, emissive } = options;
  return {
    texture, material: {
      name,
      pbrMetallicRoughness: { baseColorFactor: [...rgb, opacity], roughnessFactor: roughness, metallicFactor: metal },
      ...(twoSided ? { doubleSided: true } : {}),
      ...(opacity < 1 ? { alphaMode: 'BLEND' } : {}),
      ...(emissive ? { emissiveFactor: new T.Color(emissive).toArray() } : {}),
    },
  };
}

export class Asset {
  constructor(name) {
    this.groups = [{ name, parts: new Map(), children: [] }];
    this.name = name;
  }
  node(name, translation = [0, 0, 0]) {
    this.groups.push({ name, translation, parts: new Map() });
    const id = this.groups.length - 1;
    this.groups[0].children.push(id);
    return id;
  }
  add(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], node = 0) {
    geometry.applyMatrix4(new T.Matrix4().compose(new T.Vector3(...position),
      new T.Quaternion().setFromEuler(new T.Euler(...rotation)), new T.Vector3(1, 1, 1)));
    const parts = this.groups[node].parts;
    if (!parts.has(material)) parts.set(material, []);
    parts.get(material).push(geometry);
  }
  box(material, size, center, radius = .008, rotation, node) {
    this.add(bevelBox(size, radius), material, center, rotation, node);
  }
  cylinder(material, rTop, rBottom, length, point, rotation, node, segments = 28) {
    this.add(new T.CylinderGeometry(rTop, rBottom, length, segments), material, point, rotation, node);
  }
  rod(material, a, b, radius, node, segments = 8) {
    const from = new T.Vector3(...a), to = new T.Vector3(...b);
    const delta = to.clone().sub(from);
    if (delta.lengthSq() < 1e-12) return;
    const geometry = new T.CylinderGeometry(radius, radius, delta.length(), segments);
    geometry.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize()));
    this.add(geometry, material, from.lerp(to, .5).toArray(), undefined, node);
  }
  cord(material, points, radius, node, segments = Math.max(8, points.length * 2)) {
    const path = new T.CatmullRomCurve3(points.map(point => new T.Vector3(...point)));
    this.add(new T.TubeGeometry(path, segments, radius, 7, false), material, undefined, undefined, node);
  }
  globe(material, scale, position, rotation, node) {
    const geometry = new T.SphereGeometry(1, 20, 12);
    geometry.scale(...scale);
    this.add(geometry, material, position, rotation, node);
  }
  torus(material, radius, tube, point, rotation, node, segments = 64) {
    this.add(new T.TorusGeometry(radius, tube, 8, segments), material, point, rotation, node);
  }
  lathe(material, points, position, node, segments = 64) {
    this.add(new T.LatheGeometry(points.map(p => new T.Vector2(...p)), segments), material, position, undefined, node);
  }
  write(path) {
    const gltf = {
      asset: { version: '2.0', generator: 'Aigine models' },
      scenes: [{ name: this.name, nodes: [0] }], scene: 0,
      nodes: [], meshes: [], materials: [], buffers: [{ byteLength: 0 }], bufferViews: [], accessors: [],
    };
    const blobs = [];
    let offset = 0, triangles = 0;
    function append(bytes, target) {
      const index = gltf.bufferViews.length;
      gltf.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, ...(target ? { target } : {}) });
      const padding = (4 - bytes.length % 4) % 4;
      blobs.push(bytes, Buffer.alloc(padding));
      offset += bytes.length + padding;
      return index;
    }
    function accessor(data, type, componentType, target, bounds = {}) {
      const bufferView = append(Buffer.from(data.buffer, data.byteOffset, data.byteLength), target);
      const components = { SCALAR: 1, VEC2: 2, VEC3: 3 }[type];
      return gltf.accessors.push({ bufferView, type, componentType, count: data.length / components, ...bounds }) - 1;
    }

    const materials = new Map(), images = new Map();
    function materialIndex(key) {
      if (materials.has(key)) return materials.get(key);
      const material = structuredClone(key.material);
      if (key.texture) {
        if (!images.has(key.texture)) {
          gltf.images ??= [];
          gltf.textures ??= [];
          gltf.samplers ??= [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }];
          const source = gltf.images.push({ mimeType: key.texture.mimeType, bufferView: append(key.texture.bytes) }) - 1;
          images.set(key.texture, gltf.textures.push({ source, sampler: 0 }) - 1);
        }
        material.pbrMetallicRoughness.baseColorTexture = { index: images.get(key.texture) };
      }
      const index = gltf.materials.push(material) - 1;
      materials.set(key, index);
      return index;
    }

    for (const group of this.groups) {
      const node = { name: group.name, ...(group.translation ? { translation: group.translation } : {}),
        ...(group.children?.length ? { children: group.children } : {}) };
      gltf.nodes.push(node);
      if (!group.parts.size) continue;
      const primitives = [];
      for (const [material, shapes] of group.parts) {
        const positions = [], normals = [], uv = [], indices = [];
        const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
        for (const geometry of shapes) {
          const p = geometry.attributes.position, n = geometry.attributes.normal, t = geometry.attributes.uv;
          const base = positions.length / 3;
          for (let i = 0; i < p.count; i++) {
            const point = [p.getX(i), p.getY(i), p.getZ(i)];
            point.forEach((value, axis) => { min[axis] = Math.min(min[axis], value); max[axis] = Math.max(max[axis], value); });
            positions.push(...point);
            normals.push(n.getX(i), n.getY(i), n.getZ(i));
            // BufferGeometry UVs start at the lower left; glTF images start at the upper left.
            uv.push(t?.getX(i) ?? 0, 1 - (t?.getY(i) ?? 0));
          }
          const index = geometry.index;
          for (let i = 0; i < (index?.count ?? p.count); i++) indices.push(base + (index ? index.getX(i) : i));
        }
        triangles += indices.length / 3;
        const large = positions.length / 3 > 65535;
        primitives.push({
          attributes: {
            POSITION: accessor(Float32Array.from(positions), 'VEC3', 5126, 34962, { min, max }),
            NORMAL: accessor(Float32Array.from(normals), 'VEC3', 5126, 34962),
            TEXCOORD_0: accessor(Float32Array.from(uv), 'VEC2', 5126, 34962),
          },
          indices: accessor(large ? Uint32Array.from(indices) : Uint16Array.from(indices), 'SCALAR', large ? 5125 : 5123, 34963),
          material: materialIndex(material),
        });
      }
      node.mesh = gltf.meshes.push({ primitives }) - 1;
    }
    gltf.buffers[0].byteLength = offset;
    const json = Buffer.from(JSON.stringify(gltf));
    const length = Math.ceil(json.length / 4) * 4;
    const header = Buffer.alloc(20);
    header.write('glTF');
    header.writeUInt32LE(2, 4);
    header.writeUInt32LE(28 + length + offset, 8);
    header.writeUInt32LE(length, 12);
    header.write('JSON', 16);
    const binary = Buffer.alloc(8);
    binary.writeUInt32LE(offset);
    binary.write('BIN\0', 4);
    const file = Buffer.concat([header, json, Buffer.alloc(length - json.length, 32), binary, ...blobs]);
    writeFileSync(path, file);
    return { triangles, bytes: file.length };
  }
}
