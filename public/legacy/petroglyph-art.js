import { skySound } from './sky-sound.js';

const shapes = [
  'M11 58 L29 43 L63 45 L73 34 L89 37 L83 45 L74 45 L66 58 L29 59 Z M30 59 L24 78 L16 86 M38 59 L37 78 L30 85 M59 58 L67 77 L63 86 M64 58 L76 77 L74 85 M77 35 Q81 13 65 12 Q49 13 54 28 M72 37 Q73 21 63 19',
  'M50 29 A21 21 0 1 1 49.9 29 M50 8 V21 M50 79 V92 M8 50 H21 M79 50 H92 M20 20 L29 29 M71 71 L80 80 M20 80 L29 71 M71 29 L80 20',
  'M43 17 A7 7 0 1 1 42.9 17 M43 31 L45 58 L27 87 M45 58 L62 85 M44 36 L65 45 L81 37 M43 38 L22 48 M77 19 Q100 38 79 63 L77 19',
  'M51 52 C39 64 30 43 46 37 C64 30 74 56 59 68 C41 83 19 68 20 48 C21 22 48 12 70 24 C99 40 94 78 68 90',
];
const paths = shapes.map(shape => new Path2D(shape));
export function motif(context, id, x, y, size, color = '#dbac65') {
  context.save();
  context.translate(x, y);
  context.scale(size / 100, size / 100);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 2.8;
  context.strokeStyle = color;
  context.stroke(paths[id]);
  context.restore();
}
export function motifCanvas(canvas, id = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = Math.min(canvas.width, canvas.height) * .85;
  motif(ctx, id, (canvas.width - size) / 2, (canvas.height - size) / 2, size);
}
export function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
export function saveLocal(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { return false; }
}

let audio;
let lastSound = 0;
export function stoneSound(kind = 'strike') {
  if (!skySound.playing || performance.now() - lastSound < 65 || !window.AudioContext) return;
  lastSound = performance.now();
  try {
    audio ??= new AudioContext();
    if (audio.state !== 'running') void audio.resume().catch(() => {});
    const tone = audio.createOscillator();
    const gain = audio.createGain();
    const time = audio.currentTime;
    const frequencies = { strike: [620, 125], tap: [460, 230], scan: [370, 960], time: [102, 46] };
    const [start, end] = frequencies[kind];
    tone.type = kind === 'strike' ? 'triangle' : 'sine';
    tone.frequency.setValueAtTime(start, time);
    tone.frequency.exponentialRampToValueAtTime(end, time + .16);
    gain.gain.setValueAtTime(.04, time);
    gain.gain.exponentialRampToValueAtTime(.0001, time + .18);
    tone.connect(gain).connect(audio.destination);
    tone.start();
    tone.stop(time + .19);
    tone.onended = () => { tone.disconnect(); gain.disconnect(); };
  } catch { /* Visual effects work without audio. */ }
}
