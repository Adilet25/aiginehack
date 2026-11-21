const labels = {
  ru: {
    name: 'Полевой дневник', progress: 'Посещено', close: 'Закрыть', visited: 'Посещено',
    hints: ['Выберите точку на карте и узнайте историю места.', 'Рассмотрите мотивы и сделайте свою зарисовку.', 'Проследите, как Луна приближается к Үркөр.'],
    planner: 'Составить маршрут', back: 'Вернуться в юрту'
  },
  ky: {
    name: 'Саякат күндөлүгү', progress: 'Ачылган бөлүмдөр', close: 'Жабуу', visited: 'Ачылды',
    hints: ['Картадан жерди тандап, анын тарыхын билиңиз.', 'Белгилерди изилдеп, өз эскизиңизди тартыңыз.', 'Айдын Үркөргө жакындашын байкаңыз.'],
    planner: 'Багыт түзүү', back: 'Боз үйгө кайтуу'
  },
  en: {
    name: 'Field journal', progress: 'Chapters visited', close: 'Close', visited: 'Visited',
    hints: ['Choose a point on the map to discover its story.', 'Explore rock art and sketch a motif.', 'Watch the Moon approach Ürkör, the Pleiades.'],
    planner: 'Plan a route', back: 'Return to the yurt'
  }
};

export function createJournal() {
  const chapters = ['places', 'stone', 'calendar'];
  const seen = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem('aigine-visits'));
    if (Array.isArray(saved)) saved.filter(key => chapters.includes(key)).forEach(key => seen.add(key));
  } catch { /* Storage is optional. */ }
  const opener = document.createElement('button');
  opener.type = 'button';
  opener.className = 'journal-opener';
  opener.setAttribute('aria-haspopup', 'dialog');
  document.querySelector('.masthead-controls').prepend(opener);
  const dialog = document.createElement('dialog');
  dialog.className = 'field-journal';
  dialog.setAttribute('aria-labelledby', 'journal-title');
  document.body.append(dialog);
  let lang, copy;
  function paint() {
    const t = labels[lang];
    opener.textContent = t.name;
    dialog.innerHTML = `<header><span>${copy.title} · ${t.progress} ${seen.size}/3</span><button type="button" aria-label="${t.close}">×</button></header>
      <h2 id="journal-title">${t.name}</h2><nav>${chapters.map((key,i) => `<a href="#${key}"><i class="journal-plate plate-${key}" aria-hidden="true"></i><span><strong>${copy[key]}</strong><em>${t.hints[i]}</em></span><b aria-label="${seen.has(key) ? t.visited : ''}">${seen.has(key) ? '✓' : '↗'}</b></a>`).join('')}</nav>
      <footer><a href="#places/route">${t.planner} →</a><a href="#inside">${t.back}</a></footer>`;
  }
  opener.onclick = () => { paint(); dialog.showModal(); };
  dialog.onclick = e => {
    if (e.target.closest('a,button')) dialog.close();
  };
  window.addEventListener('hashchange', () => { if (dialog.open) dialog.close(); });
  return {
    localize(language, messages) { lang = language; copy = messages; paint(); },
    visit(key) {
      if (!chapters.includes(key) || seen.has(key)) return;
      seen.add(key);
      try { localStorage.setItem('aigine-visits', JSON.stringify([...seen])); } catch { /* Session still works. */ }
    }
  };
}


