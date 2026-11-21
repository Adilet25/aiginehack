import { motif, motifCanvas, readLocal, saveLocal, stoneSound } from './petroglyph-art.js';

const key = 'aigine-petroglyph-posts';
const asset = new URL('./assets/cholpon-ata.jpg', import.meta.url).href;
const picture = 'https://commons.wikimedia.org/wiki/File:Petroglyph_Museum_of_Cholpon-Ata_10.jpg';
const sensitive = /https?:|www\.|[\p{L}\d-]+\.(?:com|kg|ru|net|org)\b|@|(?:\+?\d[\s().-]*){7,}/iu;
const canvasImage = /^data:image\/(?:png|webp|jpeg);base64,/;

export function createMarkup(c) {
  return `
    <section class="petro-workshop">
      <div class="petro-workbench"><h1 tabindex="-1">${c.modes[1]}</h1><p>${c.prompt}</p>
        <canvas class="petro-drawing" width="640" height="400" aria-label="${c.prompt}" tabindex="0"></canvas>
        <div class="petro-actions">
          ${c.tools.map((name, i) => `<button type="button" data-draw="${i}" ${i < 2 ? `aria-pressed="${i === 0}"` : ''}>${name}</button>`).join('')}
        </div>
        <div class="petro-actions petro-stencils">
          ${c.symbols.map((name, i) => `<button type="button" data-stencil="${i}"><canvas width="44" height="38" aria-hidden="true"></canvas>${name}</button>`).join('')}
        </div>
        <form class="petro-publish"><label>${c.nick}<input name="nick" maxlength="24" required /></label><label>${c.caption}<input name="caption" maxlength="40" /></label>
          <button class="petro-primary" type="submit">${c.publish}</button><button type="button" data-export>${c.share}</button>
        </form><p class="petro-message" role="status"></p>
      </div>
      <section class="petro-feed" aria-label="${c.local}">
        <h2>${c.local}</h2>
        <div class="petro-actions">${c.feeds.map((tab, i) => `<button type="button" data-feed="${i}" aria-pressed="${i === 0}">${tab}</button>`).join('')}</div>
        <div class="petro-posts"></div>
      </section>
    </section>`;
}

export function mountCreate(host, c, signal) {
  const canvas = host.querySelector('.petro-drawing');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const form = host.querySelector('form');
  const message = host.querySelector('.petro-message');
  const list = host.querySelector('.petro-posts');
  const options = { signal };
  let posts = readLocal(key, []);
  let tab = 0;
  let tool = 0;
  let changed = false;
  let pointer;
  let previous;
  let brush = [canvas.width / 2, canvas.height / 2];
  const undo = [];
  const note = text => { message.textContent = text; };

  function checkpoint() {
    undo.push({ image: ctx.getImageData(0, 0, canvas.width, canvas.height), changed });
    if (undo.length > 12) undo.shift();
  }
  function dot(x, y) {
    ctx.globalCompositeOperation = tool ? 'destination-out' : 'source-over';
    ctx.fillStyle = tool ? '#000' : '#ddb589';
    ctx.beginPath();
    ctx.arc(x, y, tool ? 11 : 2.1, 0, Math.PI * 2);
    ctx.fill();
    if (!tool) {
      ctx.fillStyle = '#67482e';
      ctx.fillRect(x - 1.1, y - 1.3, 1.4, 1.1);
    }
    ctx.globalCompositeOperation = 'source-over';
    changed = true;
  }
  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return [(event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height];
  }
  function between(from, to) {
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const count = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4));
    for (let i = 1; i <= count; i++) dot(from[0] + dx * i / count, from[1] + dy * i / count);
    stoneSound();
    if (!tool) {
      canvas.style.setProperty('--spark-x', to[0] / canvas.width * 100 + '%');
      canvas.style.setProperty('--spark-y', to[1] / canvas.height * 100 + '%');
      canvas.classList.add('petro-spark');
    }
  }
  canvas.addEventListener('pointerdown', event => {
    if (pointer !== undefined || event.button !== 0) return;
    checkpoint();
    pointer = event.pointerId;
    canvas.setPointerCapture(pointer);
    previous = point(event);
    between(previous, previous);
  }, options);
  canvas.addEventListener('pointermove', event => {
    if (pointer !== event.pointerId) return;
    const next = point(event);
    between(previous, next);
    previous = next;
  }, options);
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(name, event => {
      if (event.pointerId === pointer) {
        pointer = undefined;
        canvas.classList.remove('petro-spark');
      }
    }, options);
  }
  canvas.addEventListener('keydown', event => {
    const step = { ArrowLeft: [-9, 0], ArrowRight: [9, 0], ArrowUp: [0, -9], ArrowDown: [0, 9], ' ': [0, 0] }[event.key];
    if (!step) return;
    event.preventDefault();
    checkpoint();
    const next = brush.map((v, i) => Math.max(0, Math.min(i ? canvas.height : canvas.width, v + step[i])));
    between(brush, next);
    brush = next;
  }, options);
  function thumbnail(post) {
    const node = document.createElement('article');
    node.className = 'petro-post';
    const image = new Image();
    image.alt = c.prompt;
    image.src = post.image;
    const name = document.createElement('strong');
    name.textContent = post.nick;
    const caption = document.createElement('p');
    caption.textContent = post.caption;
    const like = document.createElement('button');
    like.textContent = (post.liked ? '♥ ' : '♡ ') + Number(post.liked);
    like.setAttribute('aria-label', c.like);
    like.setAttribute('aria-pressed', String(post.liked));
    const report = document.createElement('button');
    report.textContent = c.report;
    report.disabled = !!post.reported;
    function change(patch) {
      const next = posts.map(item => item.id === post.id ? { ...item, ...patch } : item);
      if (!saveLocal(key, next)) { note(c.storage); return; }
      posts = next;
      renderPosts();
    }
    like.addEventListener('click', () => change({ liked: !post.liked, likedAt: post.liked ? null : Date.now() }), options);
    image.addEventListener('dblclick', () => { if (!post.liked) change({ liked: true, likedAt: Date.now() }); }, options);
    report.addEventListener('click', () => { change({ reported: true }); note(c.reported); }, options);
    node.append(name, image, caption, like, report);
    return node;
  }
  function renderPosts() {
    const week = Date.now() - 7 * 86400000;
    const valid = posts.filter(post => canvasImage.test(post.image));
    const score = post => Number(tab === 1 ? post.liked && post.likedAt > week : post.liked);
    const ordered = valid.sort((a, b) => (tab ? score(b) - score(a) : 0) || b.date - a.date);
    list.replaceChildren(...ordered.map((post, i) => {
      const node = thumbnail(post);
      if (tab && i < 3 && score(post)) node.classList.add('petro-ranked');
      return node;
    }));
    if (!ordered.length) list.textContent = c.empty;
  }

  const values = () => ({
    nick: form.elements.nick.value.trim(),
    caption: form.elements.caption.value.trim(),
  });
  function hasDrawing() {
    if (changed && ctx.getImageData(0, 0, canvas.width, canvas.height).data.some((value, i) => i % 4 === 3 && value)) return true;
    note(c.blank);
    return false;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!hasDrawing()) return;
    const { nick, caption } = values();
    if (!nick) { form.elements.nick.focus(); return; }
    if (sensitive.test(nick + ' ' + caption)) { note(c.privateText); return; }
    const today = new Date().toDateString();
    if (posts.filter(post => new Date(post.date).toDateString() === today).length >= 5) { note(c.limit); return; }
    const post = { id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()), nick, caption, image: canvas.toDataURL('image/webp', .9), date: Date.now(), liked: false };
    const next = [post, ...posts];
    if (!saveLocal(key, next)) { note(c.storage); return; }
    posts = next;
    note(c.saved);
    renderPosts();
    stoneSound('tap');
  }, options);
  host.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-draw')) {
      const command = Number(button.dataset.draw);
      if (command < 2) {
        tool = command;
        host.querySelectorAll('[data-draw][aria-pressed]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      } else if (command === 2) {
        const state = undo.pop();
        if (state) { ctx.putImageData(state.image, 0, 0); changed = state.changed; }
      } else {
        checkpoint();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        changed = false;
      }
    }
    if (button.hasAttribute('data-stencil')) {
      checkpoint();
      motif(ctx, Number(button.dataset.stencil), 170, 55, 290);
      changed = true;
      stoneSound();
    }
    if (button.hasAttribute('data-feed')) {
      tab = Number(button.dataset.feed);
      host.querySelectorAll('[data-feed]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      renderPosts();
    }
    if (button.hasAttribute('data-export') && hasDrawing()) {
      const { caption } = values();
      const output = document.createElement('canvas');
      output.width = 640;
      output.height = 470;
      const out = output.getContext('2d');
      const stone = out.createLinearGradient(0, 0, 640, 470);
      stone.addColorStop(0, '#4c3c30');
      stone.addColorStop(1, '#1e1a17');
      out.fillStyle = stone;
      out.fillRect(0, 0, 640, 470);
      out.drawImage(canvas, 0, 0);
      out.fillStyle = '#ffe2af';
      out.font = '19px system-ui';
      out.fillText(caption, 22, 423, 596);
      out.font = '14px system-ui';
      out.fillText(location.origin + location.pathname + '#stone', 22, 450, 596);
      const link = document.createElement('a');
      link.download = 'aigine-petroglyph.png';
      link.href = output.toDataURL();
      link.click();
      note(c.shared);
    }
  }, options);
  host.querySelectorAll('[data-stencil] canvas').forEach((icon, index) => motifCanvas(icon, index));
  renderPosts();
}

export function findMarkup(c) {
  return `<section class="petro-scanner">
    <h1 tabindex="-1">${c.modes[2]}</h1><p>${c.point}</p><small>${c.privacy}</small>
    <div class="petro-viewfinder">
      <canvas width="320" height="220" aria-hidden="true"></canvas><video playsinline muted hidden></video><img alt="" hidden />
      <div class="petro-reticle" aria-hidden="true"></div>
    </div>
    <div class="petro-actions">
      <button type="button" data-camera>${c.camera}</button>
      <button type="button" data-upload>${c.upload}</button><input type="file" accept="image/*" hidden />
      <button type="button" data-sample>${c.sample}</button><button type="button" data-scan disabled>${c.scan}</button>
    </div>
    <p class="petro-message" role="status"></p><section class="petro-result" hidden></section>
    <details class="petro-collection"><summary>${c.collection}</summary><p></p></details>
  </section>`;
}

export function mountFind(host, c, signal) {
  const find = host.querySelector('.petro-scanner');
  const view = find.querySelector('.petro-viewfinder');
  const placeholder = view.querySelector('canvas');
  const video = view.querySelector('video');
  const image = view.querySelector('img');
  const scan = find.querySelector('[data-scan]');
  const file = find.querySelector('input[type="file"]');
  const message = find.querySelector('.petro-message');
  const result = find.querySelector('.petro-result');
  const storageKey = 'aigine-petroglyph-collection';
  const collection = find.querySelector('.petro-collection p');
  let stream, blob, timer;
  let version = 0;
  let source = '';

  function updateCollection() {
    collection.textContent = readLocal(storageKey, false) ? c.place : '—';
  }
  function reset() {
    version++;
    clearTimeout(timer);
    stream?.getTracks().forEach(track => track.stop());
    stream = undefined;
    video.srcObject = null;
    if (blob) URL.revokeObjectURL(blob);
    blob = undefined;
    placeholder.hidden = false;
    video.hidden = true;
    image.hidden = true;
    image.removeAttribute('src');
    result.hidden = true;
    scan.disabled = true;
    view.removeAttribute('data-scan-state');
    message.textContent = '';
    source = '';
  }
  signal.addEventListener('abort', reset, { once: true });
  motifCanvas(placeholder);
  updateCollection();
  function showImage(url, type) {
    const request = version;
    image.onload = () => {
      if (signal.aborted || version !== request) return;
      placeholder.hidden = true;
      image.hidden = false;
      source = type;
      scan.disabled = false;
    };
    image.onerror = () => { if (!signal.aborted && version === request) message.textContent = c.imageError; };
    image.src = url;
  }
  file.addEventListener('change', () => {
    const photo = file.files[0];
    file.value = '';
    if (!photo) return;
    reset();
    if (!photo.type.startsWith('image/')) { message.textContent = c.imageError; return; }
    blob = URL.createObjectURL(photo);
    showImage(blob, 'upload');
  }, { signal });
  find.addEventListener('click', async event => {
    if (event.target.closest('[data-camera]')) {
      reset();
      const request = version;
      try {
        const acquired = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
        if (signal.aborted || version !== request) { acquired.getTracks().forEach(track => track.stop()); return; }
        stream = acquired;
        video.srcObject = acquired;
        await video.play();
        if (signal.aborted || version !== request) return;
        placeholder.hidden = true;
        video.hidden = false;
        source = 'camera';
        scan.disabled = false;
      } catch {
        if (version === request) { reset(); message.textContent = c.cameraError; }
      }
    }
    if (event.target.closest('[data-upload]')) file.click();
    if (event.target.closest('[data-sample]')) { reset(); showImage(asset, 'sample'); }
    if (event.target.closest('[data-scan]') && source) {
      scan.disabled = true;
      message.textContent = '';
      view.dataset.scanState = 'scanning';
      stoneSound('scan');
      timer = setTimeout(() => {
        scan.disabled = false;
        view.dataset.scanState = source === 'sample' ? 'found' : 'unknown';
        if (source !== 'sample') { message.textContent = c.unrecognized; return; }
        result.innerHTML = `<strong>${c.place}</strong> <small>${c.demo}</small><p>${c.uncertain}</p><div class="petro-actions"><a href="${picture}">${c.details}</a><button type="button" data-collect>${c.add}</button></div><small><a href="${picture}">Bernard Gagnon · CC0</a></small>`;
        result.hidden = false;
      }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 720);
    }
    if (event.target.closest('[data-collect]')) {
      message.textContent = saveLocal(storageKey, true) ? c.saved : c.storage;
      updateCollection();
    }
  }, { signal });
}
