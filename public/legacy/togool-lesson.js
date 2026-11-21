const copy = {
  ru: {
    skip: 'К календарю →', replay: 'Как считать тогоол', title: ['Найдите сближение', 'Посчитайте дни', 'Чын куран · 5 тогоол'],
    guide: ['1 марта 2014 года — новолуние. Двигайте шкалу по дням, пока Луна не окажется рядом с Үркөр.',
      'Отсчёт начинается с нуля в день новолуния. Сколько дней прошло к моменту сближения?',
      'От новолуния до сближения прошло пять дней. Так Төрөң Жумаев объясняет число в названии этого месяца.'],
    moon: 'Ай · Луна', stars: 'Үркөр · Плеяды', newMoon: 'Новолуние', day: 'День наблюдения',
    next: 'Посчитать дни →', found: 'Луна рядом с Үркөр', keep: 'Продолжайте наблюдение',
    check: 'Проверить', wrong: 'Посчитайте шаги от 1 до 6 марта. 1 марта — день 0.',
    finish: 'Открыть круг года →', note: 'Учебная схема по описанию Төрөң Жумаева, март 2014 года',
  },
  ky: {
    skip: 'Календарга →', replay: 'Тоголду кантип эсептейт?', title: ['Айдын жакындашын табыңыз', 'Күндөрдү санаңыз', 'Чын куран · 5 тогол'],
    guide: ['2014-жылдын 1-мартында Ай жаңырган. Ай Үркөргө жакындаганга чейин шкаланы жылдырыңыз.',
      'Ай жаңырган күндөн эсеп нөлдөн башталат. Ай Үркөргө жакындаганга чейин канча күн өттү?',
      'Ай жаңыргандан тоголго чейин беш күн өттү. Төрөң Жумаев айдын атындагы санды ушундайча түшүндүрөт.'],
    moon: 'Ай', stars: 'Үркөр', newMoon: 'Ай жаңырды', day: 'Байкоо күнү',
    next: 'Күндөрдү саноо →', found: 'Ай Үркөргө жакындады', keep: 'Байкоону улантыңыз',
    check: 'Текшерүү', wrong: '1-марттан 6-мартка чейинки кадамдарды санаңыз. 1-март — нөлүнчү күн.',
    finish: 'Жыл айлампасын ачуу →', note: 'Төрөң Жумаевдин сүрөттөмөсү боюнча окуу схемасы, 2014-жылдын марты',
  },
  en: {
    skip: 'Go to calendar →', replay: 'Learn to count togool', title: ['Find the encounter', 'Count the days', 'Chyn kuran · 5 togool'],
    guide: ['March 1, 2014 is the new moon. Move the slider day by day until the Moon is close to Ürkör.',
      'Start at zero on the day of the new moon. How many days have passed when the Moon meets Ürkör?',
      'Five days passed from the new moon to the encounter. This is how Töröñ Zhumaev explains the number in the month’s name.'],
    moon: 'Moon', stars: 'Ürkör · Pleiades', newMoon: 'New moon', day: 'Observation day',
    next: 'Count the days →', found: 'The Moon is close to Ürkör', keep: 'Keep observing',
    check: 'Check', wrong: 'Count the steps from March 1 to March 6. March 1 is day zero.',
    finish: 'Open the wheel of the year →', note: 'Illustration based on Töröñ Zhumaev’s account for March 2014',
  },
};

export function mountTogoolLesson(root, lang, openYear) {
  const c = copy[lang];
  const wheel = root.querySelector('.atlas-year');
  const discovery = wheel.parentElement;
  const lesson = document.createElement('section');
  lesson.className = 'togool-lesson';
  lesson.setAttribute('aria-labelledby', 'togool-title');
  const atlasParts = [...root.querySelectorAll('.atlas-map, .atlas-reading, .atlas-discovery, .atlas-note')];
  const replay = document.createElement('button');
  replay.className = 'togool-secondary';
  replay.type = 'button';
  replay.textContent = c.replay;
  discovery.append(replay);
  root.append(lesson);

  const dateFormat = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const date = day => dateFormat.format(new Date(Date.UTC(2014, 2, day + 1)));
  let stage = 0;
  let day = 0;
  const lastDay = 5;

  function render(focus = false) {
    lesson.innerHTML = `
      <div class="togool-top"><ol aria-label="${c.title[stage]}">${c.title.map((title, i) => `<li ${i === stage ? 'aria-current="step"' : ''}>${i + 1}</li>`).join('')}</ol>
      <button class="togool-secondary" type="button" data-lesson="skip">${c.skip}</button></div>
      <h2 id="togool-title" tabindex="-1">${c.title[stage]}</h2>
      <p class="togool-guide">${c.guide[stage]}</p>
      <div class="togool-sky" aria-hidden="true">
        <div class="togool-orbit"></div>
        <div class="togool-cluster"><i></i><i></i><i></i><i></i><i></i><i></i><span>${c.stars}</span></div>
        <div class="togool-moon"><i></i><span>${c.moon}</span></div>
        <div class="togool-wave"></div>
      </div>
      ${stage === 0 ? `
        <div class="togool-controls"><div><label for="togool-day">${c.day}</label><output for="togool-day"></output></div>
          <input type="range" id="togool-day" min="0" max="7" value="${day}" step="1">
          <div class="togool-dates"><span>${date(0)} · ${c.newMoon}</span><span>${date(7)}</span></div></div>
        <button type="button" class="togool-primary" data-lesson="next" disabled>${c.next}</button>`
      : stage === 1 ? `
        <div class="togool-count" aria-label="${c.day}">${Array.from({ length: lastDay + 1 }, (_, i) => `<span>${date(i)}</span>`).join('')}</div>
        <form class="togool-answer"><label class="sr-only" for="togool-number">${c.guide[1]}</label><input id="togool-number" type="number" inputmode="numeric" min="0" required><button class="togool-primary">${c.check}</button></form>
        <p class="togool-feedback" aria-live="polite"></p>`
      : `<div class="togool-equation"><span>${date(lastDay)}</span> − <span>${date(0)}</span> = <strong>5</strong></div>
        <button type="button" class="togool-primary" data-lesson="finish">${c.finish}</button>`}
      <small>${c.note}</small>`;
    syncDay();
    if (focus) lesson.querySelector('h2').focus({ preventScroll: true });
  }

  function syncDay() {
    const progress = day / lastDay;
    lesson.style.setProperty('--moon-x', (14 + progress * 54) + '%');
    lesson.style.setProperty('--moon-y', (66 - 31 * Math.sin(progress * Math.PI * .58)) + '%');
    lesson.style.setProperty('--moon-light', Math.min(1, .15 + progress * .75));
    lesson.dataset.encounter = String(day === lastDay);
    const slider = lesson.querySelector('#togool-day');
    if (!slider) return;
    const status = day === lastDay ? c.found : day === 0 ? c.newMoon : c.keep;
    lesson.querySelector('output').textContent = date(day) + ' · ' + status;
    slider.setAttribute('aria-valuetext', date(day) + ' · ' + status);
    lesson.querySelector('[data-lesson="next"]').disabled = day !== lastDay;
  }

  function showLesson(active) {
    root.classList.toggle('learning-togool', active);
    lesson.hidden = !active;
    atlasParts.forEach(part => { part.inert = active; });
  }

  lesson.addEventListener('input', event => {
    if (event.target.id !== 'togool-day') return;
    day = Number(event.target.value);
    syncDay();
  });
  lesson.addEventListener('click', event => {
    const action = event.target.closest('[data-lesson]')?.dataset.lesson;
    if (action === 'next') { stage = 1; render(true); }
    if (action === 'finish' || action === 'skip') {
      showLesson(false);
      wheel.focus({ preventScroll: true });
      if (action === 'finish') openYear(2);
    }
  });
  lesson.addEventListener('submit', event => {
    event.preventDefault();
    if (lesson.querySelector('#togool-number').valueAsNumber === lastDay) {
      stage = 2;
      render(true);
    } else {
      lesson.querySelector('.togool-feedback').textContent = c.wrong;
    }
  });
  replay.addEventListener('click', () => {
    stage = 0;
    day = 0;
    showLesson(true);
    render(true);
  });

  showLesson(true);
  render();
}
