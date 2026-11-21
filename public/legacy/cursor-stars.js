const canvas = document.createElement('canvas');
canvas.className = 'cursor-stars';
canvas.setAttribute('aria-hidden', 'true');
document.body.append(canvas);

const ctx = canvas.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const stage = document.querySelector('#stage');
let frame = 0;
let points = [];
let usePaws = false;

function updateTrailStyle() {
  const inside = !document.body.dataset.route &&
    stage?.dataset.inside === 'true' && !stage.dataset.flight;
  if (inside !== usePaws) {
    clear();
    usePaws = inside;
  }
}

function clear() {
  cancelAnimationFrame(frame);
  frame = 0;
  points = [];
  ctx?.clearRect(0, 0, innerWidth, innerHeight);
}

function resize() {
  clear();
  const scale = Math.min(devicePixelRatio, 2);
  canvas.width = Math.round(innerWidth * scale);
  canvas.height = Math.round(innerHeight * scale);
  ctx?.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawPaw(point, opacity) {
  const { x, y, angle, side } = point;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.translate(side * 8, 0);
  ctx.globalAlpha = opacity * .82;
  ctx.fillStyle = '#f8d598';
  ctx.shadowColor = '#e8a652';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(-5, 4);
  ctx.bezierCurveTo(-7, 0, -3, -3, 0, -2);
  ctx.bezierCurveTo(3, -3, 7, 0, 5, 4);
  ctx.bezierCurveTo(3, 6, 1, 4, 0, 4);
  ctx.bezierCurveTo(-1, 4, -3, 6, -5, 4);
  ctx.fill();
  for (const [toeX, toeY, tilt] of [[-6, -4, -.45], [-2.3, -7, -.15], [2.3, -7, .15], [6, -4, .45]]) {
    ctx.beginPath();
    ctx.ellipse(toeX, toeY, 1.5, 2.25, tilt, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

function draw(now) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const lifetime = usePaws ? 1200 : 670;
  points = points.filter(point => now - point.time < lifetime);
  const dark = !document.body.dataset.route || document.body.dataset.route === 'calendar';
  const dots = dark ? '142, 230, 209' : '43, 125, 110';
  const lines = dark ? '123, 210, 198' : '50, 137, 125';
  const fade = point => Math.min(1, 1 - (now - point.time) / lifetime);
  ctx.lineWidth = 1;
  for (const [i, p] of points.entries()) {
    const life = fade(p);
    if (usePaws) {
      drawPaw(p, life);
      continue;
    }
    ctx.fillStyle = 'rgba(' + dots + ', ' + life * .7 + ')';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < points.length; j++) {
      const q = points[j];
      const distance = Math.hypot(q.x - p.x, q.y - p.y);
      if (distance >= 130) continue;
      ctx.strokeStyle = 'rgba(' + lines + ', ' + Math.min(life, fade(q)) * (1 - distance / 130) * .5 + ')';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  }
  frame = points.length ? requestAnimationFrame(draw) : 0;
}

function move(event) {
  if (motion.matches || event.pointerType !== 'mouse') return;
  const { clientX: x, clientY: y } = event;
  const last = points.at(-1);
  const distance = last ? Math.hypot(x - last.x, y - last.y) : 0;
  if (last && distance <= (usePaws ? 21 : 24)) return;
  const angle = last ? Math.atan2(y - last.y, x - last.x) : -Math.PI / 2;
  points.push({ x, y, angle, side: last ? -last.side : 1, time: performance.now() });
  if (points.length > 20) points.shift();
  if (!frame) frame = requestAnimationFrame(draw);
}

if (ctx) {
  resize();
  const observer = new MutationObserver(updateTrailStyle);
  observer.observe(document.body, { attributeFilter: ['data-route'] });
  if (stage) observer.observe(stage, { attributeFilter: ['data-inside', 'data-flight'] });
  updateTrailStyle();
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('blur', clear);
  motion.addEventListener('change', clear);
}
