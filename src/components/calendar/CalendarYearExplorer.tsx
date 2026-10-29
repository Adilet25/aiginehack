import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useLang } from '../../app/providers/LanguageProvider';
import { useGuideCopy } from '../../data/guide';
import './CalendarExplorer.css';

type Month = { month: number; kyrgyzName: string; togool: string; explanation: string };
type Props = { months: Month[]; month: number; year: number; onSelect: (month: number) => void; onToday: () => void; onOpenMonth: () => void };
const seasonFor = (month: number) => Math.floor(((month + 1) % 12) / 3);
const colors = ['#dceff5', '#d8eedc', '#faedca', '#f4dfd1'];
const inks = ['#28637a', '#286847', '#866220', '#9b5233'];
function point(radius: number, angle: number) { const a = (angle - 90) * Math.PI / 180; return [260 + radius * Math.cos(a), 260 + radius * Math.sin(a)]; }
function sector(index: number) {
  const start = index * 30 + 1.2, end = (index + 1) * 30 - 1.2;
  const a = point(238,start), b = point(238,end), c = point(172,end), d = point(172,start);
  return `M ${a.join(' ')} A 238 238 0 0 1 ${b.join(' ')} L ${c.join(' ')} A 172 172 0 0 0 ${d.join(' ')} Z`;
}

export default function CalendarYearExplorer({months,month,year,onSelect,onToday,onOpenMonth}: Props) {
  const {lang,t} = useLang();
  const g = useGuideCopy();
  const wheel = useRef<SVGSVGElement>(null);
  const locale = lang === 'kg' ? 'ky-KG' : lang === 'en' ? 'en-GB' : 'ru-RU';
  const monthName = (index: number, short = false) => new Intl.DateTimeFormat(locale,{month:short ? 'short' : 'long'}).format(new Date(year,index,1));
  const selected = months[month];
  const focusMonth = (index: number) => { const next = (index + 12) % 12; onSelect(next); wheel.current?.querySelector<SVGGElement>(`[data-month="${next}"]`)?.focus(); };
  return <div className="calendar-explorer">
    <header className="calendar-explorer-heading"><div><p className="guide-eyebrow">{year} / {t.kyrgyzCalendar}</p><h2>{g.wheelTitle}</h2><p>{g.wheelHint}</p></div><button className="calendar-today" onClick={onToday}><CalendarDays size={17} />{g.today}</button></header>
    <div className="calendar-explorer-layout">
      <div className="calendar-wheel-panel">
        <label className="calendar-month-select">{g.selectMonth}<select value={month} onChange={e => onSelect(Number(e.target.value))}>{months.map(item => <option key={item.month} value={item.month}>{monthName(item.month)} · {item.kyrgyzName}</option>)}</select></label>
        <svg ref={wheel} viewBox="0 0 520 520" className="calendar-interactive-wheel" role="group" aria-label={g.selectMonth}>
          <circle cx="260" cy="260" r="250" fill="var(--panel)" stroke="var(--line)" />
          {months.map(item => {
            const selectedMonth = month === item.month;
            const p = point(205,item.month * 30 + 15);
            const season = seasonFor(item.month);
            return <g key={item.month} data-month={item.month} role="button" tabIndex={selectedMonth ? 0 : -1} aria-pressed={selectedMonth} aria-label={`${monthName(item.month)} · ${item.kyrgyzName}`} onClick={() => onSelect(item.month)} onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(item.month); }
              if (['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)) { e.preventDefault(); focusMonth(e.key === 'Home' ? 0 : e.key === 'End' ? 11 : item.month + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1)); }
            }} className="calendar-sector"><path d={sector(item.month)} fill={selectedMonth ? '#215d46' : colors[season]} stroke={selectedMonth ? '#215d46' : 'transparent'} strokeWidth="2" /><text x={p[0]} y={p[1]} dominantBaseline="middle" textAnchor="middle" fill={selectedMonth ? '#fff' : inks[season]} fontWeight="650" fontSize="16">{monthName(item.month,true).replace('.','')}</text></g>;
          })}
          <circle cx="260" cy="260" r="148" fill="var(--wash)" stroke="var(--line)" />
          <g className="calendar-wheel-center" key={month} aria-hidden="true"><text x="260" y="211" textAnchor="middle" fontSize="12" fill="var(--muted)">{g.seasons[seasonFor(month)]} · {year}</text><text x="260" y="254" textAnchor="middle" fontSize="29" fontWeight="700" fill="var(--text)">{monthName(month)}</text><text x="260" y="289" textAnchor="middle" fontSize="18" fill="var(--clay)">{selected.kyrgyzName}</text><text x="260" y="319" textAnchor="middle" fontSize="13" fill="var(--muted)">{selected.togool}</text></g>
        </svg>
        <ul className="calendar-season-legend" aria-label={lang === 'en' ? 'Seasons' : lang === 'kg' ? 'Жыл мезгилдери' : 'Времена года'}>{g.seasons.map((season,i) => <li key={season}><i style={{background:colors[i],borderColor:inks[i]}} />{season}</li>)}</ul>
      </div>
      <aside className="calendar-month-story" aria-live="polite" aria-atomic="true"><div className="calendar-story-nav"><p className="guide-eyebrow">{g.selected}</p><div><button onClick={() => onSelect((month + 11) % 12)} aria-label={g.prev}><ChevronLeft size={18} /></button><button onClick={() => onSelect((month + 1) % 12)} aria-label={g.next}><ChevronRight size={18} /></button></div></div><div className="calendar-month-story-body" key={month}><span className="calendar-season-pill" style={{background:colors[seasonFor(month)],color:inks[seasonFor(month)]}}>{g.seasons[seasonFor(month)]}</span><h3>{monthName(month)}</h3><dl><div><dt>{g.monthName}</dt><dd>{selected.kyrgyzName}</dd></div><div><dt>{g.togool}</dt><dd>{selected.togool}</dd></div></dl><p className="calendar-explanation">{selected.explanation}</p><button className="guide-button" onClick={onOpenMonth}>{g.openMonth}<ArrowRight size={18} /></button></div><p className="calendar-model-note">{g.modelNote}</p></aside>
    </div>
    <details className="muras-disclosure calendar-periods"><summary>{g.periods}</summary><div className="muras-disclosure-body"><p className="muras-caption">{g.periodHint}</p><div className="calendar-period-list">{[{label:t.legendKyshChilde,from:[0,8],to:[1,18]},{label:t.legendZhayChilde,from:[6,8],to:[7,18]},{label:t.legendTokson,from:[11,13],to:[2,13]}].map(period => <div key={period.label}><strong>{period.label}</strong><span>{new Date(year,period.from[0],period.from[1]).toLocaleDateString(locale,{day:'numeric',month:'long'})} — {new Date(year,period.to[0],period.to[1]).toLocaleDateString(locale,{day:'numeric',month:'long'})}</span></div>)}</div></div></details>
  </div>;
}
