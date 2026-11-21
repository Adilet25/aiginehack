import { stoneCopy, sources } from './petroglyph-copy.js';
import { motif, motifCanvas } from './petroglyph-art.js';

const words = {
  ru: { collection:'Полевая коллекция', lead:'Три способа прочитать след на камне.', pages:['Атлас мотивов','Моя зарисовка','Чолпон-Ата'], actions:['Рассмотреть рисунки','Открыть лист','Посмотреть снимок'], draw:'Выберите мотив и добавьте его на лист нажатием. Можно рисовать от руки.', save:'Скачать PNG', undo:'Отменить', stamp:'Добавить в центр', free:'Карандаш', sheet:'Лист для зарисовки', photo:'Камни под открытым небом', zoom:'Рассмотреть ближе', reset:'Весь снимок', study:'Учебная прорисовка', field:'Полевой снимок' },
  en: { collection:'Field collection', lead:'Three ways to read a mark on stone.', pages:['Motif atlas','My sketchbook','Cholpon-Ata'], actions:['Explore the motifs','Open a sheet','View photograph'], draw:'Choose a motif and tap the sheet to place it, or draw with the pencil.', save:'Download PNG', undo:'Undo', stamp:'Place in centre', free:'Pencil', sheet:'Sketch sheet', photo:'Stones under the open sky', zoom:'Look closer', reset:'Full photograph', study:'Illustrated study', field:'Field photograph' },
  ky: { collection:'Талаа жыйнагы', lead:'Таштагы изди таануунун үч жолу.', pages:['Белгилер атласы','Менин эскизим','Чолпон-Ата'], actions:['Сүрөттөрдү кароо','Баракты ачуу','Сүрөттү көрүү'], draw:'Белгини тандап, баракты басыңыз же карандаш менен тартыңыз.', save:'PNG жүктөө', undo:'Артка', stamp:'Ортого жайгаштыруу', free:'Карандаш', sheet:'Эскиз барагы', photo:'Ачык асман алдындагы таштар', zoom:'Жакындан кароо', reset:'Толук сүрөт', study:'Окуу үчүн сүрөт', field:'Талаадагы сүрөт' }
};
const modes = ['learn','create','find'];
const photo = new URL('./assets/cholpon-ata.jpg', import.meta.url).href;
const credit = 'https://commons.wikimedia.org/wiki/File:Petroglyph_Museum_of_Cholpon-Ata_10.jpg';

export function mountPetroglyphs(host, language, title, mode) {
  const t = words[language], c = stoneCopy[language];
  const page = modes.indexOf(mode);
  const controller = new AbortController();
  const on = (el, event, fn) => el.addEventListener(event, fn, {signal: controller.signal});
  const link = (i, label) => `<a href="#stone/${modes[i]}" ${page === i ? 'aria-current="page"' : ''}>${label}</a>`;
  host.classList.add('rock-archive');
  host.innerHTML = `<div class="rock-inner"><header class="rock-bar"><a href="${page < 0 ? '#inside' : '#stone'}">← ${page < 0 ? c.yurt : title}</a><span>${t.collection}</span></header>
    <div class="rock-content" data-mode="${mode || 'hub'}">
    ${page < 0 ? `<section class="rock-cover"><div><h1 tabindex="-1">${title}</h1><p>${t.lead}</p>${link(0,t.actions[0]+' →')}</div></section>
    <nav class="rock-index">${t.pages.map((name,i)=>link(i,`<small>0${i+1}</small><strong>${name}</strong><span>${t.actions[i]} ↗</span>`)).join('')}</nav>` :
    `<nav class="rock-tabs">${t.pages.map((name,i)=>link(i,name)).join('')}</nav><h1 tabindex="-1">${t.pages[page]}</h1><div class="rock-work"></div>`}
    </div></div>`;
  const work = host.querySelector('.rock-work');
  if (page === 0) {
    work.innerHTML = `<figure class="rock-specimen"><canvas width="600" height="420" aria-hidden="true"></canvas><figcaption>${t.study}</figcaption></figure><section><p>${c.facts[0]}</p><div class="rock-tools">${c.symbols.slice(0,3).map((s,i)=>`<button data-index="${i}">${s}</button>`).join('')}</div><p aria-live="polite" class="rock-observation"></p><a href="${sources[0]}" class="rock-source">${c.source} ↗</a></section>`;
    function select(i) {
      motifCanvas(work.querySelector('canvas'),i);
      work.querySelector('.rock-observation').textContent = c.meanings[i];
      work.querySelectorAll('[data-index]').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));
    }
    on(work,'click',e=>{ const b=e.target.closest('[data-index]'); if(b) select(Number(b.dataset.index)); }); select(0);
  } else if (page === 1) {
    work.innerHTML = `<canvas class="rock-paper" width="960" height="640" aria-label="${t.sheet}"></canvas><section><p>${t.draw}</p><div class="rock-tools">${[...c.symbols,t.free].map((s,i)=>`<button data-tool="${i}">${s}</button>`).join('')}</div><div class="rock-tools"><button data-place>${t.stamp}</button><button data-undo>${t.undo}</button></div><button data-save class="rock-primary">${t.save} ↓</button></section>`;
    const canvas=work.querySelector('canvas'), ctx=canvas.getContext('2d');
    const key='aigine-rock-sheet-v1';
    let marks=[],tool=0,path=null;
    try { const saved=JSON.parse(localStorage.getItem(key)); if(Array.isArray(saved)) marks=saved; } catch {}
    function redraw(){
      ctx.fillStyle='#eee3ca';ctx.fillRect(0,0,960,640);ctx.strokeStyle='#634735';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
      for(const m of marks){
        if(m.points){ctx.beginPath();m.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
        else motif(ctx,m.tool,m.x-78,m.y-78,156,'#634735');
      }
      work.querySelector('[data-undo]').disabled=!marks.length;
    }
    function store(){ try {localStorage.setItem(key,JSON.stringify(marks));}catch{} }
    function position(e){const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*960/r.width,(e.clientY-r.top)*640/r.height];}
    function stamp(x,y){marks.push({x,y,tool});redraw();store();}
    function select(i){tool=i;work.querySelectorAll('[data-tool]').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));work.querySelector('[data-place]').disabled=i===4;}
    on(canvas,'pointerdown',e=>{if(!e.isPrimary || e.button!==0)return;const [x,y]=position(e);if(tool<4){stamp(x,y);return;}canvas.setPointerCapture(e.pointerId);path={points:[[x,y],[x+.1,y+.1]]};marks.push(path);redraw();});
    on(canvas,'pointermove',e=>{if(path && canvas.hasPointerCapture(e.pointerId)){path.points.push(position(e));redraw();}});
    on(canvas,'lostpointercapture',()=>{path=null;store();});
    on(work,'click',e=>{const b=e.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-tool'))select(Number(b.dataset.tool));
      if(b.hasAttribute('data-place'))stamp(480,320);
      if(b.hasAttribute('data-undo')){marks.pop();redraw();store();}
      if(b.hasAttribute('data-save')){const a=document.createElement('a');a.download='aigine-sketch.png';a.href=canvas.toDataURL('image/png');a.click();}
    });select(0);redraw();
  } else if (page === 2) {
    work.innerHTML = `<figure class="rock-field"><div><img src="${photo}" alt="${t.photo} · ${c.place}"></div><figcaption><a href="${credit}">Bernard Gagnon · CC0 ↗</a></figcaption></figure><section><small>${t.field}</small><h2>${t.photo}</h2><p>${c.facts[5]}</p><button data-zoom aria-pressed="false">${t.zoom}</button></section>`;
    const b=work.querySelector('[data-zoom]');on(b,'click',()=>{const zoom=b.getAttribute('aria-pressed')==='false';b.setAttribute('aria-pressed',String(zoom));work.querySelector('img').classList.toggle('zoomed',zoom);b.textContent=zoom?t.reset:t.zoom;});
  }
  return ()=>{controller.abort();host.classList.remove('rock-archive');};
}
