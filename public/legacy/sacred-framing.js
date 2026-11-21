const tableCenterZ = -1.17;
const reliefHeight = 1.145;
const cameraDistance = 1.825;
const tiltFromVertical = 20 * Math.PI / 180;

export const sacredFraming = {
  camera: [
    0,
    reliefHeight + cameraDistance * Math.cos(tiltFromVertical),
    tableCenterZ + cameraDistance * Math.sin(tiltFromVertical),
  ],
  target: [0, reliefHeight, tableCenterZ],
  origin: [0, reliefHeight, tableCenterZ],
  scale: .087,
  lift: .29,
  fov(aspect) {
    const span = 2.36 + .5 * Math.min(1, Math.max(0, (aspect - .5) / 1.1));
    return 2 * Math.atan(span / (2 * cameraDistance * aspect)) * 180 / Math.PI;
  },
};
