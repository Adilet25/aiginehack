import { stoneSound } from './petroglyph-art.js';

const titles = {
  ru: { skip: 'Пропустить', scene: 'Мастер высекает горного козла на камне. После каждого удара часть рисунка загорается золотом.' },
  ky: { skip: 'Өткөрүп жиберүү', scene: 'Уста ташка тоо текенин сүрөтүн чегет. Ар бир соккудан кийин сүрөттүн бир бөлүгү алтын түстө жаркырайт.' },
  en: { skip: 'Skip intro', scene: 'A carver chisels a mountain goat into the rock. Each strike lights up part of the carving in gold.' },
};

const duration = 5350;
const marks = [
  [[513, 301], [535, 288], [560, 284], [588, 289], [614, 286], [622, 279]],
  [[614, 286], [628, 297], [645, 297], [648, 290], [634, 279], [621, 279], [609, 302], [594, 315], [558, 321], [532, 316], [513, 301], [499, 288]],
  [[629, 278], [634, 263], [629, 247], [617, 234], [601, 230], [588, 239], [584, 253], [590, 265], [602, 269], [612, 264]],
  [[620, 278], [620, 262], [609, 249], [596, 245], [584, 249], [578, 260]],
  [[594, 315], [601, 339], [618, 351], [626, 351]],
  [[578, 320], [577, 342], [564, 358], [570, 363]],
  [[543, 319], [527, 341], [510, 351], [516, 356]],
];
const hits = [850, 1640, 2430, 3220, 4010];
const hitPoints = [marks[0][0], marks[1][0], marks[2][0], marks[4][0], marks[5][0]];
const clamp = t => Math.max(0, Math.min(t, 1));
const mix = (a, b, t) => a + (b - a) * t;
const ease = (start, end, time) => {
  const t = clamp((time - start) / (end - start));
  return t * t * (3 - 2 * t);
};

function shape(ctx, fill, outline) {
  ctx.beginPath();
  outline(ctx);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, points, width, color) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function gradient(ctx, x, y, distance, stops) {
  const color = ctx.createRadialGradient(x, y, 0, x, y, distance);
  stops.forEach(([offset, value]) => color.addColorStop(offset, value));
  return color;
}

function noise(seed) {
  const value = Math.sin(seed * 78.233 + 14.217) * 43758.5453;
  return value - Math.floor(value);
}

function drawLandscape(ctx) {
  ctx.fillStyle = gradient(ctx, 480, 310, 675, [[0, '#765338'], [.42, '#423327'], [1, '#161810']]);
  ctx.fillRect(-1000, -500, 3000, 1600);
  const ridges = [
    ['#41392b', [[-1300, 390], [-70, 326], [32, 285], [78, 304], [146, 225], [225, 285], [282, 269], [350, 333], [435, 297], [567, 313], [678, 252], [760, 296], [841, 234], [938, 322], [1800, 328]]],
    ['#332b22', [[-1300, 401], [-120, 389], [14, 351], [135, 338], [220, 355], [317, 319], [449, 368], [541, 341], [697, 394], [759, 358], [847, 373], [1000, 320], [1800, 381]]],
    ['#25221b', [[-1300, 455], [-160, 462], [-14, 439], [132, 446], [269, 432], [363, 451], [500, 425], [651, 442], [764, 416], [1100, 442], [1800, 455]]],
  ];
  for (const [color, points] of ridges) {
    shape(ctx, color, path => {
      path.moveTo(...points[0]);
      points.slice(1).forEach(point => path.lineTo(...point));
      path.lineTo(1800, 1150);
      path.lineTo(-1300, 1150);
    });
  }
}

function drawRock(ctx) {
  function silhouette(path) {
    path.moveTo(376, 441);
    path.lineTo(393, 372);
    path.lineTo(397, 293);
    path.lineTo(449, 217);
    path.lineTo(484, 205);
    path.lineTo(536, 178);
    path.lineTo(642, 172);
    path.lineTo(712, 215);
    path.lineTo(727, 267);
    path.lineTo(758, 329);
    path.lineTo(746, 402);
    path.lineTo(763, 447);
    path.lineTo(650, 469);
    path.lineTo(509, 467);
  }
  const surface = gradient(ctx, 523, 271, 290, [[0, '#816049'], [.58, '#523d31'], [1, '#221c18']]);
  shape(ctx, surface, silhouette);
  ctx.save();
  ctx.clip();
  shape(ctx, '#dba26d38', p => {
    p.moveTo(397, 293); p.lineTo(449, 217); p.lineTo(536, 178); p.lineTo(642, 172);
    p.lineTo(603, 200); p.lineTo(502, 222); p.lineTo(446, 252); p.lineTo(435, 313);
  });
  shape(ctx, '#1c161679', p => {
    p.moveTo(642, 172); p.lineTo(712, 215); p.lineTo(758, 329); p.lineTo(746, 402);
    p.lineTo(763, 452); p.lineTo(651, 469); p.lineTo(691, 381); p.lineTo(674, 328); p.lineTo(695, 265);
  });
  shape(ctx, '#2119115c', p => {
    p.moveTo(370, 417); p.lineTo(467, 402); p.lineTo(550, 425); p.lineTo(642, 413);
    p.lineTo(713, 428); p.lineTo(734, 474); p.lineTo(373, 482);
  });
  for (let i = 0; i < 5600; i++) {
    const x = 375 + noise(i * 3) * 395;
    const y = 171 + noise(i * 3 + 1) * 303;
    const size = .35 + noise(i * 3 + 2) * 2.1;
    ctx.fillStyle = i % 3 ? '#f1c48e15' : '#20181335';
    ctx.fillRect(x, y, size * 1.9, size);
  }
  for (const crack of [
    [[430, 274], [450, 264], [467, 259], [482, 242], [509, 239]],
    [[666, 198], [658, 221], [666, 241], [651, 254]],
    [[687, 375], [673, 380], [650, 403], [627, 396], [602, 412], [590, 412]],
    [[412, 379], [430, 383], [451, 374], [463, 382], [481, 381]],
  ]) line(ctx, crack, 1.4, '#22191478');
  ctx.restore();
}

function drawCarver(ctx, strike, target) {
  shape(ctx, '#211911', path => {
    path.ellipse(300, 456, 155, 14, 0, 0, Math.PI * 2);
  });
  shape(ctx, '#31241b', p => {
    p.moveTo(195, 416); p.quadraticCurveTo(205, 374, 260, 377); p.lineTo(309, 401);
    p.quadraticCurveTo(336, 368, 364, 378); p.quadraticCurveTo(386, 383, 392, 417);
    p.lineTo(411, 439); p.lineTo(418, 450); p.lineTo(369, 450); p.lineTo(346, 426);
    p.lineTo(310, 454); p.lineTo(200, 453); p.quadraticCurveTo(172, 451, 175, 439);
  });
  const coat = gradient(ctx, 307, 305, 138, [[0, '#b38053'], [.47, '#79523c'], [1, '#37271e']]);
  shape(ctx, coat, p => {
    p.moveTo(232, 286); p.quadraticCurveTo(251, 259, 294, 267); p.quadraticCurveTo(328, 270, 340, 306);
    p.quadraticCurveTo(330, 345, 337, 376); p.lineTo(359, 410);
    p.quadraticCurveTo(304, 435, 218, 419); p.lineTo(203, 406);
    p.quadraticCurveTo(210, 369, 215, 337); p.quadraticCurveTo(218, 303, 232, 286);
  });
  line(ctx, [[215, 369], [256, 379], [299, 378], [333, 369]], 9, '#3d2b23');
  line(ctx, [[215, 365], [256, 375], [299, 374], [333, 365]], 1.3, '#c49364');
  shape(ctx, '#a67750', p => {
    p.moveTo(273, 255); p.lineTo(277, 275); p.lineTo(296, 290); p.lineTo(315, 268); p.lineTo(315, 242);
  });
  const face = gradient(ctx, 328, 224, 77, [[0, '#daa171'], [1, '#684530']]);
  shape(ctx, face, p => {
    p.moveTo(267, 220); p.quadraticCurveTo(270, 191, 301, 192); p.quadraticCurveTo(329, 190, 337, 218);
    p.lineTo(337, 231); p.lineTo(351, 246); p.lineTo(340, 251); p.lineTo(339, 266);
    p.quadraticCurveTo(323, 273, 308, 264); p.lineTo(283, 261); p.quadraticCurveTo(262, 244, 267, 220);
  });
  shape(ctx, '#34281f', p => {
    p.moveTo(251, 225); p.quadraticCurveTo(251, 190, 277, 181); p.quadraticCurveTo(318, 166, 336, 205);
    p.lineTo(339, 217); p.quadraticCurveTo(310, 211, 288, 224);
    p.quadraticCurveTo(286, 250, 294, 264); p.lineTo(270, 266); p.quadraticCurveTo(259, 258, 251, 225);
  });
  line(ctx, [[251, 219], [268, 210], [293, 203], [316, 203], [334, 207]], 2, '#ae8354');
  line(ctx, [[323, 232], [332, 232]], 2, '#4b3224');
  line(ctx, [[338, 258], [330, 257]], 1.4, '#643e2c');

  const chiselGrip = [target[0] - 34, target[1] + 22];
  line(ctx, [[313, 292], [349, 334], [chiselGrip[0] - 8, chiselGrip[1] + 1]], 24, '#674934');
  line(ctx, [[321, 298], [352, 327], [chiselGrip[0] - 7, chiselGrip[1] - 2]], 7, '#9f6d4d');
  line(ctx, [[chiselGrip[0] - 10, chiselGrip[1] + 7], target], 6, '#302a23');
  line(ctx, [[chiselGrip[0] - 10, chiselGrip[1] + 5], target], 2, '#dcb885');
  line(ctx, [chiselGrip, [chiselGrip[0] + 6, chiselGrip[1] + 1]], 14, '#b77e53');

  const wrist = [mix(329, chiselGrip[0] - 49, strike), mix(156, chiselGrip[1] - 53, strike)];
  const elbow = [mix(245, 319, strike), mix(222, 259, strike)];
  line(ctx, [[265, 296], elbow, wrist], 34, '#634330');
  line(ctx, [[269, 284], [elbow[0] + 8, elbow[1] - 7], [wrist[0] - 2, wrist[1] - 4]], 11, '#a87550');
  const contact = [chiselGrip[0] - 11, chiselGrip[1] + 7];
  const hammer = [mix(350, contact[0] - 7, strike), mix(97, contact[1] - 8, strike)];
  line(ctx, [[wrist[0] - 8, wrist[1] + 15], hammer], 8, '#4a3122');
  line(ctx, [[wrist[0] - 1, wrist[1] + 11], hammer], 2, '#a77449');
  line(ctx, [wrist, [wrist[0] + 5, wrist[1] - 6]], 14, '#ce9664');
  const angle = mix(-.35, .83, strike);
  ctx.save();
  ctx.translate(...hammer);
  ctx.rotate(angle);
  shape(ctx, '#736358', p => {
    p.moveTo(-25, -8); p.lineTo(-14, -13); p.lineTo(17, -12); p.lineTo(25, -5);
    p.lineTo(23, 9); p.lineTo(12, 13); p.lineTo(-23, 10);
  });
  line(ctx, [[-23, -8], [-14, -12], [16, -11]], 2, '#c3a386');
  ctx.restore();
}

function drawMark(ctx, points, amount, opacity) {
  if (!amount) return;
  const position = amount * (points.length - 1);
  const end = Math.floor(position);
  const path = points.slice(0, end + 1);
  if (points[end + 1]) {
    const [x, y] = points[end];
    path.push([mix(x, points[end + 1][0], position - end), mix(y, points[end + 1][1], position - end)]);
  }
  ctx.save();
  ctx.globalAlpha = opacity;
  line(ctx, path, 16, '#e9852118');
  line(ctx, path, 10, '#ffaa3230');
  line(ctx, path, 6, '#ffb44282');
  line(ctx, path, 3.4, '#ffce72');
  line(ctx, path, 1.65, '#fff0ae');
  ctx.restore();
}

function drawImpact(ctx, point, time, index) {
  const [x, y] = point;
  const fade = 1 - clamp(time / 450);
  if (fade <= 0) return;
  ctx.save();
  ctx.globalAlpha = fade * .88;
  ctx.fillStyle = gradient(ctx, x, y, 74, [[0, '#ffedaf'], [.28, '#e6953a90'], [1, '#ad5e1900']]);
  ctx.fillRect(x - 74, y - 74, 148, 148);
  ctx.beginPath();
  for (let i = 0; i < 28; i++) {
    const seed = index * 91 + i * 3;
    const angle = noise(seed) * Math.PI * 2;
    const speed = 18 + noise(seed + 1) * 110;
    const elapsed = time / 420;
    const px = x + Math.cos(angle) * elapsed * speed;
    const py = y + Math.sin(angle) * elapsed * speed + 72 * elapsed ** 2;
    const tail = 3 + noise(seed + 2) * 7;
    ctx.moveTo(px, py);
    ctx.lineTo(px - Math.cos(angle) * tail, py - Math.sin(angle) * tail);
  }
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#ffd98c';
  ctx.stroke();
  ctx.restore();
}

export function playStoneIntro(title, language, done, playbackTime = duration) {
  const overlay = document.createElement('section');
  overlay.className = 'stone-intro';
  overlay.setAttribute('aria-labelledby', 'stone-intro-title');
  overlay.setAttribute('aria-describedby', 'stone-intro-description');
  const copy = titles[language];
  overlay.innerHTML = `
    <canvas aria-hidden="true"></canvas>
    <div class="stone-intro-header"><h2 id="stone-intro-title">${title}</h2><p id="stone-intro-description" class="sr-only">${copy.scene}</p></div>
    <div class="stone-intro-footer">
      <div class="stone-intro-meter" aria-hidden="true"><span></span></div>
      <button type="button">${copy.skip} <span aria-hidden="true">→</span></button>
    </div>`;
  const canvas = overlay.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const background = document.createElement('canvas');
  const paper = background.getContext('2d');
  if (!ctx || !paper) return;
  document.body.append(overlay);
  const skip = overlay.querySelector('button');
  const meter = overlay.querySelector('.stone-intro-meter span');
  let frame;
  let width;
  let height;
  let pixelRatio;
  let start;
  let timeout;
  let stopped = false;
  let playedHits = 0;

  function setView(context, scale, shake = 0) {
    context.setTransform(pixelRatio * scale, 0, 0, pixelRatio * scale,
      pixelRatio * (width / 2 - 468 * scale + shake),
      pixelRatio * (height * .515 - 284 * scale));
    context.lineJoin = 'round';
    context.lineCap = 'round';
  }

  function paint(time) {
    const nextWidth = overlay.clientWidth;
    const nextHeight = overlay.clientHeight;
    if (!nextWidth || !nextHeight) return;
    if (width !== nextWidth || height !== nextHeight) {
      width = nextWidth;
      height = nextHeight;
      pixelRatio = Math.min(devicePixelRatio, 1.6);
      canvas.width = background.width = Math.round(width * pixelRatio);
      canvas.height = background.height = Math.round(height * pixelRatio);
      setView(paper, Math.min(width / 692, height / 514));
      drawLandscape(paper);
      drawRock(paper);
    }
    const scale = Math.min(width / 692, height / 514);
    const current = hits.findIndex(hit => time <= hit + 185);
    const i = current < 0 ? hits.length - 1 : current;
    const hit = hits[i];
    const reset = i ? hits[i - 1] + 185 : 0;
    const windup = 1 - ease(reset, reset + 185, time);
    const downstroke = ease(hit - 195, hit, time);
    const rebound = ease(hit + 40, hit + 185, time);
    const stroke = current < 0 ? .32 : Math.max(.32 * windup, downstroke * (1 - .68 * rebound));
    const target = i ? hitPoints[i].map((coordinate, axis) => mix(hitPoints[i - 1][axis], coordinate, ease(reset, reset + 210, time))) : hitPoints[0];
    const since = time - hit;
    const shake = since >= 0 && since < 135 ? Math.sin(since * .15) * (1 - since / 135) * 2.7 : 0;
    ctx.resetTransform();
    ctx.drawImage(background, 0, 0);
    setView(ctx, scale, shake);
    const revealTimes = [hits[0], hits[1], hits[2], hits[2] + 135, hits[3], hits[4], hits[4] + 145];
    marks.forEach((points, index) => {
      const age = time - revealTimes[index];
      drawMark(ctx, points, ease(0, 290, age), 1 - .18 * ease(300, 900, age));
    });
    drawCarver(ctx, stroke, target);
    hits.forEach((at, index) => {
      if (time >= at) drawImpact(ctx, hitPoints[index], time - at, index);
    });
    const passed = hits.filter(at => at <= time).length;
    if (passed > playedHits) {
      playedHits = passed;
      stoneSound();
    }
    meter.style.transform = 'scaleX(' + clamp(time / duration) + ')';
  }

  function dispose() {
    stopped = true;
    cancelAnimationFrame(frame);
    clearTimeout(timeout);
    overlay.remove();
  }

  function finish() {
    if (stopped) return;
    dispose();
    done();
  }

  function step(now) {
    start ??= now;
    const elapsed = now - start;
    paint(Math.min(duration, elapsed * duration / playbackTime));
    if (elapsed >= playbackTime) {
      overlay.classList.add('stone-intro-ending');
      timeout = setTimeout(finish, 300);
    } else {
      frame = requestAnimationFrame(step);
    }
  }

  skip.addEventListener('click', finish);
  overlay.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); });
  skip.focus({ preventScroll: true });
  frame = requestAnimationFrame(step);
  return dispose;
}
