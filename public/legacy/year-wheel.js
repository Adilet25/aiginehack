export const months = [
  ['Бирдин айы', 9], ['Жалган куран', 7], ['Чын куран', 5], ['Бугу', 3],
  ['Кулжа', 1], ['Теке', 23], ['Баш оона', 21], ['Аяк оона', 19],
  ['Тогуздун айы', 17], ['Жетинин айы', 15], ['Бештин айы', 13], ['Үчтүн айы', 11],
];

const labels = {
  ru: {
    title: 'Круг года', close: 'К звёздам', back: 'Предыдущий месяц', next: 'Следующий месяц',
    note: 'Месяцы и числа приведены по описанию Төрөң Жумаева. Современные месяцы даны для ориентира.',
    examples: {
      0: 'Жумаев объясняет название сближением Луны с Үркөр через девять дней после новолуния.',
      3: 'В описании Жумаева с заходом Үркөр связывали завершение посева зерновых.',
      4: 'Жумаев пишет, что в это время говорили «Үркөр опустился на землю». Это выражение относилось к заходу звёздного скопления.',
    },
  },
  ky: {
    title: 'Жыл айлампасы', close: 'Жылдыздарга', back: 'Мурунку ай', next: 'Кийинки ай',
    note: 'Айлар жана сандар Төрөң Жумаевдин сүрөттөмөсүнөн алынды. Азыркы айлар багыт алуу үчүн берилди.',
    examples: {
      0: 'Жумаев бул аталышты Ай жаңыргандан тогуз күн өткөндө Үркөргө жакындашы менен түшүндүрөт.',
      3: 'Жумаевдин сүрөттөмөсүндө дан эгүүнү Үркөр батканга чейин бүтүрүшкөн.',
      4: 'Жумаев бул мезгилде «Үркөр жерге түштү» деп айтышканын жазат. Бул сөз Үркөрдүн батышын билдирген.',
    },
  },
  en: {
    title: 'Wheel of the year', close: 'Back to the stars', back: 'Previous month', next: 'Next month',
    note: 'Month names and numbers follow Töröñ Zhumaev’s account. Modern months are shown for reference.',
    examples: {
      0: 'Zhumaev explains the name through the Moon’s approach to Ürkör nine days after the new moon.',
      3: 'In Zhumaev’s account, the setting of Ürkör marked the end of grain sowing.',
      4: 'Zhumaev records the expression “Ürkör descended to Earth” for the setting of the star cluster.',
    },
  },
};

export function mountYearWheel(root, lang) {
  const copy = labels[lang];
  const opener = root.querySelector('.atlas-year');
  const dialog = document.createElement('dialog');
  dialog.className = 'year-dialog';
  dialog.setAttribute('aria-labelledby', 'year-title');
  const monthName = (i, style) => new Intl.DateTimeFormat(lang, { month: style, timeZone: 'UTC' }).format(new Date(Date.UTC(2024, i, 1)));
  dialog.innerHTML = `
    <div class="year-heading"><h2 id="year-title">${copy.title}</h2><form method="dialog"><button>${copy.close} ×</button></form></div>
    <div class="year-ring">
      <div class="year-dial" aria-hidden="true"></div>
      <span class="year-center" aria-hidden="true">✦</span>
      ${months.map(([name, number], i) => {
        const angle = i * Math.PI / 6 - Math.PI / 2;
        return `<button type="button" data-month="${i}" aria-label="${monthName(i, 'long')} · ${name} ${number}" style="--x:${50 + 42 * Math.cos(angle)}%;--y:${50 + 42 * Math.sin(angle)}%">${monthName(i, 'short')}</button>`;
      }).join('')}
    </div>
    <div class="year-controls"><button type="button" data-step="-1" aria-label="${copy.back}">←</button><p class="year-month" aria-live="polite"></p><button type="button" data-step="1" aria-label="${copy.next}">→</button></div>
    <p class="year-example" hidden></p><p class="year-note">${copy.note}</p>`;
  root.append(dialog);

  const ring = dialog.querySelector('.year-ring');
  const dial = dialog.querySelector('.year-dial');
  const month = dialog.querySelector('.year-month');
  const example = dialog.querySelector('.year-example');
  const buttons = [...ring.querySelectorAll('[data-month]')];
  let index = 0;
  let rotation = 0;
  let drag;

  function select(next, delta) {
    index = (next % months.length + months.length) % months.length;
    rotation -= delta * 30;
    dial.style.setProperty('--angle', rotation + 'deg');
    for (const [i, button] of buttons.entries()) button.setAttribute('aria-pressed', String(i === index));
    month.textContent = months[index].join(' ') + (lang === 'ky' ? ' тогол' : ' тогоол');
    example.textContent = copy.examples[index] || '';
    example.hidden = !copy.examples[index];
  }
  select(0, 0);

  opener.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('click', event => {
    const pick = event.target.closest('[data-month]');
    const step = event.target.closest('[data-step]');
    if (pick) {
      const next = Number(pick.dataset.month);
      select(next, (next - index + 18) % 12 - 6);
    }
    if (step) select(index + Number(step.dataset.step), Number(step.dataset.step));
  });
  ring.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.target.closest('button')) return;
    const rect = ring.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    drag = { x, y, angle: Math.atan2(event.clientY - y, event.clientX - x), turn: 0, pointer: event.pointerId };
    ring.setPointerCapture(event.pointerId);
    ring.dataset.dragging = '';
  });
  ring.addEventListener('pointermove', event => {
    if (drag?.pointer !== event.pointerId) return;
    const angle = Math.atan2(event.clientY - drag.y, event.clientX - drag.x);
    const diff = angle - drag.angle;
    drag.turn += Math.atan2(Math.sin(diff), Math.cos(diff)) * 180 / Math.PI;
    drag.angle = angle;
    dial.style.setProperty('--angle', rotation + drag.turn + 'deg');
  });
  function stop(event, commit) {
    if (drag?.pointer !== event.pointerId) return;
    const steps = commit ? Math.round(-drag.turn / 30) : 0;
    drag = undefined;
    delete ring.dataset.dragging;
    select(index + steps, steps);
  }
  ring.addEventListener('pointerup', event => stop(event, true));
  ring.addEventListener('pointercancel', event => stop(event, false));
  ring.addEventListener('lostpointercapture', event => stop(event, false));
  return monthIndex => {
    select(monthIndex, (monthIndex - index + 18) % 12 - 6);
    dialog.showModal();
  };
}
