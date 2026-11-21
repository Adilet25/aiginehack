import { createJournal } from './journal.js';
import './cursor-stars.js';
import { renderSky } from './sky-atlas.js';
import { skySound } from './sky-sound.js';
import { messages } from './content.js';
import { worldCopy, placePoints } from './experience.js';
import { atlasCopy, loadRoads, mountSacredMap, roadLegs } from './sacred-map.js';
import { createSacredPortal } from './sacred-portal.js';
import { playStoneIntro } from './stone-intro.js';
import { mountPetroglyphs } from './petroglyphs.js';

const stage = document.querySelector('#stage');
const journey = document.querySelector('#journey');
const entry = document.querySelector('.yurt-entry');
const world = document.querySelector('#world');
const fallbacks = world.querySelectorAll('.fallback');
const chapter = document.querySelector('#chapter');
const home = document.querySelector('#home');
const language = document.querySelector('#language');
const exhibits = document.querySelector('.exhibits');
const hero = document.querySelector('.hero-copy');
const scrollNote = document.querySelector('.scroll-note');
const outside = document.querySelector('.back-out');
const sound = document.querySelector('.journey-sound');
const sceneStatus = document.querySelector('.scene-loading');
const sacredPortal = createSacredPortal(stage, () => { location.hash = 'inside'; });
const journal = createJournal();
const sceneCopy = {
  ru: ['Загружаем юрту…', 'Музыка'],
  ky: ['Боз үй жүктөлүүдө…', 'Музыка'],
  en: ['Loading the yurt…', 'Music'],
};
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const routes = new Set(['places', 'stone', 'calendar']);
const selection = {};
let route = '';
let updateWorld;
let progress = 0;
let animation = 0;
let entering = false;
let chapterRevision = 0;
let disposeStone;
let disposeStoneIntro;
let stoneIntroSeen = false;
let stoneMode = '';
let disposeSky;
let sacredMap;
let roadData;
let roadStatus = 'loading';
let itinerary = [];
let lastProgress = -1;
let lastInside = false;
let activeLanguage = 'ru';
try {
  const saved = localStorage.getItem('aigine-language');
  if (Object.hasOwn(messages, saved)) activeLanguage = saved;
} catch { /* The default is available with private storage disabled. */ }
try {
  const saved = JSON.parse(localStorage.getItem('aigine-itinerary'));
  if (Array.isArray(saved)) itinerary = [...new Set(saved.filter(i => Number.isInteger(i) && i >= 0 && i < placePoints.length))];
} catch { /* Private browsing. */ }
function saveItinerary() {
  try { localStorage.setItem('aigine-itinerary', JSON.stringify(itinerary)); } catch { /* Private browsing. */ }
}
language.value = activeLanguage;

let loadingWorld;
function loadWorld() {
  if (motion.matches) {
    fallbacks.forEach(image => { image.hidden = false; });
    stage.dataset.loading = 'false';
    return;
  }
  if (loadingWorld) return loadingWorld;
  world.dataset.attempted = 'true';
  stage.dataset.loading = 'true';
  loadingWorld = import('./world.js').then(async ({ createWorld }) => {
    updateWorld = await createWorld(world, positions => {
      for (const [name, [x, y]] of Object.entries(positions)) {
        const label = exhibits.querySelector('.exhibit-' + name);
        label.style.setProperty('--x', x + '%');
        label.style.setProperty('--y', y + '%');
      }
    }, (door, yurt) => {
      for (const [name, bounds] of [['door', door], ['yurt', yurt]]) {
        for (const [edge, percent] of Object.entries(bounds)) {
          stage.style.setProperty('--model-' + name + '-' + edge, percent + '%');
        }
      }
    }, name => exhibits.querySelector('.exhibit-' + name).click());
    lastProgress = -1;
    updateStage();
    if (stage.dataset.flight === 'places') {
      updateWorld.transition('places', Number(stage.style.getPropertyValue('--flight')));
    }
    stage.dataset.ready = String(!motion.matches);
  }).catch(() => {
    stage.dataset.ready = 'false';
    fallbacks.forEach(image => { image.hidden = false; });
  }).finally(() => {
    stage.dataset.loading = 'false';
  });
  return loadingWorld;
}

// Match the hotspots to the yurt in the loading image, including portrait crops.
function placeStaticEntrance() {
  const { clientWidth: width, clientHeight: height } = world;
  if (!width || !height) return;
  const wide = width >= 700;
  const modelWidth = Math.min(width * (wide ? .53 : .91), height * 1.02);
  const modelHeight = modelWidth * (659 / 950);
  const shift = wide ? Math.min(height * .30, width * .24) : 0;
  const left = Math.min((width - modelWidth) / 2 + shift, width - modelWidth);
  const top = height * .80 - modelHeight;
  const style = stage.style;
  style.setProperty('--fallback-photo-width', modelWidth + 'px');
  style.setProperty('--fallback-photo-height', modelHeight + 'px');
  style.setProperty('--fallback-photo-left', left + 'px');
  style.setProperty('--fallback-photo-top', top + 'px');
  style.setProperty('--fallback-door-left', (left + modelWidth * .41) / width * 100 + '%');
  style.setProperty('--fallback-door-top', (top + modelHeight * .54) / height * 100 + '%');
  style.setProperty('--fallback-door-width', modelWidth * .18 / width * 100 + '%');
  style.setProperty('--fallback-door-height', modelHeight * .46 / height * 100 + '%');
}

new ResizeObserver(placeStaticEntrance).observe(world);

function updateStage() {
  const inside = progress >= .92;
  if (inside !== lastInside) {
    lastInside = inside;
    stage.dataset.inside = String(inside);
    exhibits.inert = !inside;
    document.querySelector('#current-stage').textContent = inside ? '02' : '01';
    scrollNote.hidden = inside;
    outside.hidden = !inside;

  }
  hero.inert = progress > .30;
  entry.hidden = progress > .1;
  stage.dataset.approaching = String(progress > .12);
  stage.style.setProperty('--progress', progress);
  if (updateWorld && Math.abs(progress - lastProgress) > .0005) {
    updateWorld(progress);
    lastProgress = progress;
  }
}

function animate(duration, draw, done = () => {}) {
  const token = ++animation;
  if (duration === 0 || motion.matches) { draw(1); done(); return; }
  const start = performance.now();
  const frame = now => {
    if (token !== animation) return;
    const t = Math.min(1, (now - start) / duration);
    draw(t);
    if (t < 1) requestAnimationFrame(frame);
    else done();
  };
  requestAnimationFrame(frame);
}

function scrollRange() {
  return Math.max(1, journey.offsetHeight - stage.offsetHeight);
}

function syncScroll() {
  if (stage.dataset.loading === 'true' || home.hidden || entering || stage.dataset.flight) return;
  const previous = progress;
  const position = Math.min(1, Math.max(0, scrollY / scrollRange()));
  progress = motion.matches ? Number(position >= .5) : position;
  if (progress >= .2 && navigator.userActivation?.hasBeenActive) skySound.enter();
  if (progress === 0 && previous > 0) skySound.leave();
  updateStage();
}

function navigate(focus = true, play = true) {
  if (['', '#home', '#inside'].includes(location.hash) && stage.dataset.loading === 'true' && !motion.matches) {
    const destination = location.hash;
    loadWorld().then(() => { if (location.hash === destination) navigate(focus, play); });
    return;
  }
  stopStoneIntro();
  entering = false;
  const next = location.hash.slice(1);
  const subpage = /^stone\/(learn|create|find)$/.exec(next)?.[1] ?? '';
  const planner = next === 'places/route';
  const target = planner ? 'places' : subpage ? 'stone' : routes.has(next) ? next : '';
  const enteringStone = target === 'stone' && !subpage && route !== 'stone';
  const wasInside = !route && lastInside;
  let previewedPlaces = false;
  if (!target && next !== 'inside') skySound.leave();
  if (chapter.classList.contains('sky-preview')) {
    disposeSky?.();
    disposeSky = undefined;
    chapter.classList.remove('sky-preview');
    chapter.hidden = !route || previewedPlaces;
    chapter.inert = false;
  }
  const open = () => {
    route = target;
    journal.visit(target);
    stoneMode = subpage;
    skySound.setPetroglyphs(route === 'stone');
    home.hidden = Boolean(route) && !previewedPlaces;
    chapter.hidden = !route || previewedPlaces;
    document.body.dataset.route = route;
    if (!previewedPlaces) {
      stage.removeAttribute('data-flight');
      stage.style.removeProperty('--flight');
    }
    const previewedSky = chapter.classList.contains('sky-preview');
    chapter.classList.remove('sky-preview');
    chapter.style.removeProperty('--sky-mix');
    chapter.inert = false;
    exhibits.inert = previewedPlaces || !lastInside;
    if (previewedPlaces) {
      chapterRevision++;
      disposeStone?.();
      disposeStone = undefined;
      disposeSky?.();
      disposeSky = undefined;
      sacredMap?.dispose();
      sacredMap = undefined;
      sacredPortal.open(focus);
      return;
    }
    if (route) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (!previewedSky) renderChapter(enteringStone && !motion.matches, Boolean(subpage));
      if (focus && !disposeStoneIntro) chapter.querySelector('h1').focus({ preventScroll: true });
      return;
    }
    chapterRevision++;
    disposeStone?.();
    disposeSky?.();
    sacredMap?.dispose();
    sacredMap = undefined;
    disposeStone = undefined;
    disposeSky = undefined;
    loadWorld();
    const end = Number(next === 'inside');
    window.scrollTo({ top: progress * scrollRange(), behavior: 'instant' });
    if (end === progress) {
      lastProgress = -1;
      updateStage();
      if (focus) (end ? exhibits.querySelector('a') : hero.querySelector('a')).focus({ preventScroll: true });
      return;
    }
    const from = progress;
    const duration = end ? 1700 : 1100;
    entering = true;
    animate(play ? duration : 0, t => {
      progress = from + (end - from) * t;
      window.scrollTo({ top: progress * scrollRange(), behavior: 'instant' });
      updateStage();
    }, () => {
      entering = false;
      if (focus) (end ? exhibits.querySelector('a') : hero.querySelector('a')).focus({ preventScroll: true });
    });
  };
  const navigation = ++animation;
  if (target === 'places' && !planner && activeLanguage === 'ru') {
    sacredPortal.prepare().then(ready => {
      if (navigation !== animation) return;
      if (!ready) {
        open();
        return;
      }
      previewedPlaces = true;
      const flyIn = wasInside && play && !motion.matches && !!updateWorld && stage.dataset.ready === 'true';
      stage.dataset.flight = 'places';
      exhibits.inert = true;
      if (!flyIn) {
        home.hidden = false;
        progress = 1;
        window.scrollTo({ top: scrollRange(), behavior: 'instant' });
        updateStage();
        loadWorld();
      }
      let backdropPose = -1;
      const frame = t => {
        stage.style.setProperty('--flight', t);
        const pose = Math.min(t, .83);
        if (pose !== backdropPose) {
          updateWorld?.transition('places', pose);
          backdropPose = pose;
        }
        if (t > .66) {
          const lift = (t - .66) / .34;
          sacredPortal.reveal(lift * lift * (3 - 2 * lift));
        }
      };
      if (flyIn) animate(1860, frame, open);
      else {
        frame(1);
        open();
      }
    });
    return;
  }
  sacredPortal.close();
  if (target && !planner && target !== 'places' && wasInside && play && !motion.matches) {
    stage.dataset.flight = target;
    const calendarFlight = target === 'calendar';
    if (calendarFlight) {
      chapter.classList.add('sky-preview');
      chapter.style.setProperty('--sky-mix', 0);
      chapter.hidden = false;
      chapter.inert = true;
      mountSky();
    }
    const duration = calendarFlight ? 1550 : 880;
    animate(duration, t => {
      stage.style.setProperty('--flight', t);
      updateWorld?.transition(target, t);
      if (calendarFlight) {
        const blend = Math.min(1, Math.max(0, (t - .69) / .28));
        chapter.style.setProperty('--sky-mix', blend * blend * (3 - 2 * blend));
      }
    }, open);
  } else {
    open();
  }
}

const figures = {
  places: (c, w, copy) => `
    <div class="map-art" role="group" aria-label="${copy.title}">
      <div class="atlas-map"></div>
      <span class="atlas-cartouche">${copy.title}</span>
      <span class="atlas-compass" aria-hidden="true"><b>${copy.north}</b><i>✵</i></span>
      <div class="atlas-controls">
        <button type="button" data-map-command="in" aria-label="${w.zoomIn}">+</button>
        <button type="button" data-map-command="out" aria-label="${w.zoomOut}">−</button>
        <button type="button" data-map-command="all" aria-label="${copy.all}" title="${copy.all}">◎</button>
        <button type="button" data-map-command="route" aria-label="${copy.route}" title="${copy.route}" disabled>↝</button>
      </div>
      <p class="atlas-credits">
        © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ·
        <a href="https://routing.openstreetmap.de/about.html">OSRM</a> ·
        <a href="https://www.naturalearthdata.com/">Natural Earth</a> ·
        <a href="https://www.openstreetmap.org/edit?lat=41.4&amp;lon=74.7&amp;zoom=7">${copy.edit}</a>
      </p>
    </div>`,
};

function mountSky() {
  disposeSky?.();
  disposeSky = renderSky(chapter, activeLanguage, messages[activeLanguage]);
}

function stopStoneIntro() {
  if (!disposeStoneIntro) return;
  disposeStoneIntro();
  disposeStoneIntro = undefined;
  chapter.inert = false;
}

function startStoneIntro() {
  disposeStoneIntro = playStoneIntro(messages[activeLanguage].stone, activeLanguage, () => {
    disposeStoneIntro = undefined;
    chapter.inert = false;
    chapter.querySelector('h1').focus({ preventScroll: true });
  }, stoneIntroSeen ? 1250 : 2450);
  stoneIntroSeen = true;
  chapter.inert = Boolean(disposeStoneIntro);
  return chapter.inert;
}

function renderChapter(showStoneIntro = false, animateStoneMode = false) {
  stopStoneIntro();
  disposeSky?.();
  disposeSky = undefined;
  disposeStone?.();
  disposeStone = undefined;
  sacredMap?.dispose();
  sacredMap = undefined;
  const revision = ++chapterRevision;
  const c = messages[activeLanguage];
  const w = worldCopy[activeLanguage];
  const copy = atlasCopy[activeLanguage];
  if (route === 'calendar') {
    mountSky();
    return;
  }
  if (route === 'stone') {
    disposeStone = mountPetroglyphs(chapter, activeLanguage, c.stone, stoneMode, animateStoneMode);
    if (showStoneIntro) startStoneIntro();
    return;
  }
  const index = ['places', 'stone', 'calendar'].indexOf(route) + 1;
  chapter.innerHTML = `
    <div class="chapter-top"><a href="#inside" class="return"><span aria-hidden="true">←</span> ${c.back}</a><span class="chapter-number">0${index} / 03</span></div>
    <div class="chapter-grid" data-route="${route}">
      <section class="chapter-copy">
        <p class="eyebrow">${c.kicker}</p>
        <h1 tabindex="-1">${c[route]}</h1>
        <p class="chapter-hint">${route === 'stone' ? w.stoneInstruction : c.placesHint}</p>
        ${route === 'places' ? `<div class="place-list">${c.locations.map((name, i) => `<button type="button" data-choice="${i}" aria-pressed="false"><span aria-hidden="true">✦</span> ${name}</button>`).join('')}</div>` : ''}
        <div class="answer" aria-live="polite" hidden></div>${route === 'places' ? '<section class="itinerary" aria-live="polite"></section>' : ''}
      </section>
      <div class="chapter-figure">${figures[route](c, w, copy)}</div>
    </div>
    <nav class="chapter-nav" aria-label="${c.sections}">
      ${[...routes].map(name => `<a href="#${name}" ${name === route ? 'aria-current="page"' : ''}>${c[name]} <span aria-hidden="true">↗</span></a>`).join('')}
    </nav>`;
  if (route === 'places') {
    const frame = chapter.querySelector('.map-art');
    mountSacredMap(frame, c.locations, copy, reveal, motion.matches).then(map => {
      if (revision !== chapterRevision) {
        map?.dispose();
        return;
      }
      sacredMap = map;
      updateMap(Boolean(roadData));
    }).catch(() => {
      if (revision !== chapterRevision) return;
      frame.querySelector('.atlas-controls').hidden = true;
      frame.insertAdjacentHTML('beforeend', `<p class="atlas-status" role="status">${copy.mapUnavailable}</p>`);
    });
    renderItinerary();
    loadRoads().then(data => {
      if (revision !== chapterRevision) return;
      roadData = data;
      roadStatus = 'ready';
      renderItinerary(true);
    }).catch(() => {
      if (revision !== chapterRevision) return;
      roadStatus = 'error';
      renderItinerary();
    });
  }
  if (selection[route] !== undefined) reveal(selection[route]);
}

function updateMap(focusRoute = false) {
  sacredMap?.setStops(itinerary, roadLegs(itinerary, roadData), selection.places, focusRoute);
}

function renderItinerary(focusRoute = false) {
  const panel = chapter.querySelector('.itinerary');
  if (!panel) return;
  const c = messages[activeLanguage];
  const w = worldCopy[activeLanguage];
  const copy = atlasCopy[activeLanguage];
  const legs = roadLegs(itinerary, roadData);
  const km = meters => (meters / 1000).toLocaleString(activeLanguage, { maximumFractionDigits: 1 }) + ' ' + w.km;
  const minutes = Math.round(legs.reduce((sum, leg) => sum + leg.duration, 0) / 60);
  const travelTime = [Math.floor(minutes / 60), minutes % 60];
  updateMap(focusRoute);
  panel.innerHTML = `<h2>${w.plan}</h2>
    ${itinerary.length ? `<ol>${itinerary.map((index, i) => `<li>${c.locations[index]}${legs[i - 1] ? ` <small>· ${km(legs[i - 1].distance)}</small>` : ''}</li>`).join('')}</ol>` : ''}
    ${itinerary.length < 2 ? `<p>${w.empty}</p>` : ''}
    ${legs.length ? `<p class="itinerary-total">${copy.itinerary} <strong>${km(legs.reduce((sum, leg) => sum + leg.distance, 0))}</strong> · ≈ ${travelTime[0] ? travelTime[0] + ' ' + copy.hour + ' ' : ''}${travelTime[1]} ${copy.minute}</p>
      ${itinerary.includes(2) ? `<p class="itinerary-note">${copy.approach}</p>` : ''}` : ''}
    ${itinerary.length > 1 && !legs.length ? `<p>${roadStatus === 'loading' ? '…' : copy.unavailable}</p>` : ''}
    ${itinerary.length > 2 ? `<label class="itinerary-order">${w.order}<select data-route-order>${itinerary.map((index, i) => `<option value="${i}">${[index, ...itinerary.filter(value => value !== index)].map(value => c.locations[value]).join(' → ')}</option>`).join('')}</select></label>` : ''}
    ${itinerary.length > 1 ? `<button type="button" data-route-command="reverse">${w.reverse}</button>` : ''}
    ${itinerary.length ? `<button type="button" data-route-command="clear">${w.clear}</button>` : ''}`;
}

function reveal(index) {
  const c = messages[activeLanguage];
  const w = worldCopy[activeLanguage];
  const names = { places: c.locations, stone: c.motifs };
  const descriptions = { places: c.locationsText, stone: c.motifText };
  if (!names[route]?.[index]) return;
  selection[route] = index;
  if (route === 'places') updateMap();
  for (const choice of chapter.querySelectorAll('[data-choice]')) {
    choice.setAttribute('aria-pressed', String(Number(choice.dataset.choice) === index));
  }
  const answer = chapter.querySelector('.answer');
  const photo = route === 'places'
    ? [
      `<figure><img src="${new URL('./assets/sulaiman-too.jpg', import.meta.url).href}" alt="${c.locations[0]}"><figcaption><a href="https://commons.wikimedia.org/wiki/File:Osh_sulaiman_Too.jpg">${c.imageCredit}</a></figcaption></figure>`,
      '',
      `<p><a class="source" href="https://commons.wikimedia.org/wiki/File:Абшыр-Ата.jpg">${w.viewPhoto} ↗</a></p>`,
    ][index]
    : '';
  const morePhoto = route === 'stone'
    ? `<figure><img src="./assets/cholpon-ata.jpg" alt="${c.photoStone}" loading="lazy"><figcaption><a href="https://commons.wikimedia.org/wiki/File:Petroglyph_Museum_of_Cholpon-Ata_10.jpg">${c.photoStone}</a></figcaption></figure>`
    : '';
  const source = route === 'places' ? placePoints[index].source : '';
  const add = route === 'places'
    ? `<button class="route-toggle" type="button" data-route-command="toggle" aria-pressed="${itinerary.includes(index)}">${itinerary.includes(index) ? w.remove : w.add}</button>` : '';
  const more = c[route + 'More'];
  answer.innerHTML = `<h2>${names[route][index]}</h2><p>${descriptions[route][index]}</p>${photo}${add}${morePhoto}
    <details><summary>${c.more}</summary><p>${more}</p>${source ? `<a class="source" href="${source}">${c.source} ↗</a>` : ''}</details>`;
  answer.hidden = false;
}

function updateLanguage() {
  const c = messages[activeLanguage];
  journal.localize(activeLanguage, c);
  document.documentElement.lang = activeLanguage;
  document.title = c.title + ' — ' + c.edition;
  document.querySelector('.brand').setAttribute('aria-label', c.title);
  document.querySelector('.brand > span:last-child').textContent = c.title.toUpperCase();
  exhibits.setAttribute('aria-label', c.sections);
  sceneStatus.textContent = sceneCopy[activeLanguage][0];
  sound.querySelector('span:last-child').textContent = sceneCopy[activeLanguage][1];
  document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = c[element.dataset.copy]; });
  scrollNote.querySelector('[data-copy]').textContent = worldCopy[activeLanguage].hint;
  if (chapter.classList.contains('sky-preview')) mountSky();
  else if (route && !chapter.hidden) renderChapter();
}

chapter.addEventListener('click', event => {
  const button = event.target.closest('[data-choice]');
  if (button) reveal(Number(button.dataset.choice));
  const command = event.target.closest('[data-route-command]')?.dataset.routeCommand;
  if (command === 'toggle') {
    const index = selection.places;
    itinerary = itinerary.includes(index) ? itinerary.filter(i => i !== index) : [...itinerary, index];
    reveal(index);
    chapter.querySelector('.route-toggle').focus();
  } else if (command === 'clear') {
    itinerary = [];
    if (selection.places !== undefined) reveal(selection.places);
  } else if (command === 'reverse') {
    itinerary.reverse();
  }
  if (command) { saveItinerary(); renderItinerary(command !== 'clear'); }
  if (command === 'reverse') chapter.querySelector('[data-route-command="reverse"]').focus();
  if (command === 'clear') chapter.querySelector('.place-list [aria-pressed="true"]')?.focus();
});
chapter.addEventListener('change', event => {
  if (!event.target.matches('[data-route-order]')) return;
  const [first] = itinerary.splice(Number(event.target.value), 1);
  itinerary.unshift(first);
  saveItinerary();
  renderItinerary(true);
  chapter.querySelector('[data-route-order]').focus();
});

language.addEventListener('change', () => {
  activeLanguage = language.value;
  try { localStorage.setItem('aigine-language', activeLanguage); } catch { /* Selection stays active for this visit. */ }
  updateLanguage();
  if (location.hash === '#places') navigate(false, false);
});
window.addEventListener('hashchange', () => navigate());
window.addEventListener('scroll', syncScroll, { passive: true });
window.addEventListener('resize', syncScroll);
motion.addEventListener('change', () => {
  if (motion.matches && disposeStoneIntro) {
    stopStoneIntro();
    chapter.querySelector('h1').focus({ preventScroll: true });
  }
  if (updateWorld) fallbacks.forEach(image => { image.hidden = !motion.matches; });
  stage.dataset.ready = String(Boolean(updateWorld) && !motion.matches);
  if (!home.hidden) loadWorld();
  updateStage();
});
document.addEventListener('click', event => {
  const link = event.target.closest('a');
  const hash = link?.hash ?? '';
  if (hash === '#inside' || hash.startsWith('#stone/') || routes.has(hash.slice(1))) skySound.enter();
  else if (!link && lastInside && !home.hidden && !event.target.closest('button, select')) skySound.enter();
  if (link && (link.hash === '#home' || link.hash === '#inside') && link.hash === location.hash) {
    event.preventDefault();
    navigate();
  }
});
sound.addEventListener('click', () => skySound.toggle());
skySound.subscribe(() => sound.setAttribute('aria-pressed', String(skySound.playing)));
outside.hidden = true;
updateLanguage();
navigate(false, false);





