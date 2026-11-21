const chords = [
  [45, 52, 57, 60, 64],
  [41, 48, 53, 57, 60],
  [48, 55, 60, 64, 67],
  [43, 50, 55, 59, 62],
];

let context;
let volume;
let timer;
let chord = 0;
let preferred = true;
let playing = false;
let petroglyphs = false;
let breeze;
let windBuffer;
let voices = new Set();
const changes = new EventTarget();

try { preferred = localStorage.getItem('aigine-sky-sound') !== 'off'; } catch { /* Default to sound on entry. */ }

function emit() {
  changes.dispatchEvent(new Event('change'));
}

function soundChord() {
  if (!playing) return;
  const t = context.currentTime;
  const notes = petroglyphs ? chords[chord].slice(0, 3) : chords[chord];
  notes.forEach((note, i) => {
    const voice = context.createOscillator();
    const envelope = context.createGain();
    const start = t + i * (petroglyphs ? .26 : .15);
    voice.type = !petroglyphs && i < 3 ? 'sine' : 'triangle';
    voice.frequency.value = 440 * 2 ** ((note - 69) / 12);
    voice.detune.value = i % 2 ? 3 : -3;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(petroglyphs ? .095 : i < 2 ? .12 : .063, start + (petroglyphs ? .015 : 1.7));
    envelope.gain.exponentialRampToValueAtTime(.0001, start + (petroglyphs ? 1.7 : 8.2));
    voice.connect(envelope).connect(volume);
    voice.start(start);
    voice.stop(start + (petroglyphs ? 1.8 : 8.3));
    voices.add(voice);
    voice.onended = () => { voices.delete(voice); voice.disconnect(); envelope.disconnect(); };
  });
  chord = (chord + 1) % chords.length;
  timer = setTimeout(soundChord, petroglyphs ? 4800 : 5700);
}

function updateBreeze() {
  if (breeze && (!playing || !petroglyphs)) {
    breeze.stop();
    breeze.disconnect();
    breeze = undefined;
  }
  if (!playing || !petroglyphs || breeze) return;
  if (!windBuffer) {
    windBuffer = context.createBuffer(1, 4 * context.sampleRate, context.sampleRate);
    const samples = windBuffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < samples.length; i++) {
      previous = (previous + (Math.random() * 2 - 1) * .026) / 1.028;
      samples[i] = previous * Math.min(1, i / 3000, (samples.length - 1 - i) / 3000);
    }
  }
  breeze = context.createBufferSource();
  breeze.buffer = windBuffer;
  breeze.loop = true;
  breeze.connect(volume);
  breeze.start();
}

async function start() {
  if (playing || !preferred || !window.AudioContext) return;
  try {
    if (!context) {
      context = new AudioContext();
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;
      volume = context.createGain();
      volume.gain.value = 0;
      volume.connect(filter).connect(context.destination);
    }
    const generation = stopCount;
    await context.resume();
    if (generation !== stopCount || !preferred || playing || context.state !== 'running') return;
    playing = true;
    volume.gain.setTargetAtTime(.38, context.currentTime, .7);
    soundChord();
    updateBreeze();
    emit();
  } catch {
    emit();
  }
}

let stopCount = 0;
function stop() {
  stopCount++;
  clearTimeout(timer);
  if (!playing) return;
  playing = false;
  updateBreeze();
  volume.gain.setTargetAtTime(0, context.currentTime, .18);
  for (const voice of voices) {
    try { voice.stop(context.currentTime + .8); } catch { /* The note already ended. */ }
  }
  emit();
}

export const skySound = {
  enter: start,
  leave: stop,
  get playing() { return playing; },
  setPetroglyphs(active) {
    if (petroglyphs === active) return;
    petroglyphs = active;
    updateBreeze();
    if (playing) {
      clearTimeout(timer);
      soundChord();
    }
  },
  toggle() {
    preferred = !playing;
    try { localStorage.setItem('aigine-sky-sound', preferred ? 'on' : 'off'); } catch { /* Apply for this visit. */ }
    if (preferred) start();
    else stop();
  },
  subscribe(fn) {
    changes.addEventListener('change', fn);
    return () => changes.removeEventListener('change', fn);
  },
};
