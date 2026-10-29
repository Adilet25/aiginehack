import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowRight, Hammer, Compass, Sparkles, Search, MapPin, CalendarDays, Mountain, Pause, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../app/providers/GameProvider';
import { useLang } from '../app/providers/LanguageProvider';
import { homeCopy } from '../data/home';
import { useGuideCopy } from '../data/guide';
import BrandMark from '../components/shared/BrandMark';
import Reveal from '../components/shared/Reveal';
import HeritageScene from '../components/experience/HeritageScene';
import { useMotion } from '../components/experience/motion';
import './GuideHome.css';

export default function HomePage() {
  const { level, points, collection } = useGame();
  const { lang } = useLang();
  const c = homeCopy[lang];
  const g = useGuideCopy();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { paused, setPaused } = useMotion();
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const reset = () => { element.style.setProperty('--travel-y', '0px'); element.style.setProperty('--travel-x', '0px'); };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (paused) return reset();
        const rect = element.getBoundingClientRect();
        if (rect.bottom > 0) element.style.setProperty('--travel-y', `${Math.min(90, Math.max(0, -rect.top) * .18)}px`);
      });
    };
    const move = (event: PointerEvent) => {
      if (paused || preference.matches || event.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--travel-x', `${((event.clientX - rect.left) / rect.width - .5) * 14}px`);
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', update, { passive: true });
    preference.addEventListener('change', update);
    update();
    return () => { cancelAnimationFrame(frame); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); window.removeEventListener('scroll', update); preference.removeEventListener('change', update); };
  }, [paused]);
  const directions = [
    { title:g.places, text:g.placesText, image:'/home/song-kol-daylight.jpg', to:'/map?kind=sacred', icon:MapPin },
    { title:g.art, text:g.artText, image:'/home/cholpon-ata.jpg', to:'/map?kind=petroglyph', icon:Mountain },
    { title:g.calendar, text:g.calendarText, image:'/home/song-kol.jpg', to:'/calendar', icon:CalendarDays },
  ];
  return <div className="guide-home" data-paused={paused} lang={lang === 'kg' ? 'ky' : lang}>
    <section ref={hero} className="guide-hero" aria-labelledby="guide-title">
      <img className="guide-hero-photo" src="/home/living-guide-hero.png" alt="" fetchPriority="high" width="1852" height="849" />
      <div className="guide-hero-overlay" />
      <div className="guide-hero-content"><p className="guide-eyebrow"><span />{g.eyebrow}</p><h1 id="guide-title"><span>{g.title}</span><span>{g.accent}</span></h1><p className="guide-intro">{g.intro}</p><Link className="guide-button" to="/map">{c.explore}<ArrowUpRight size={20} /></Link></div>
      <div className="guide-hero-bottom"><a href="#directions">{c.discover}<ArrowDown size={17} /></a><span>{lang === 'en' ? 'Kyrgyzstan-inspired AI landscape' : lang === 'kg' ? 'Кыргызстандан шыктанган AI-пейзаж' : 'Художественный AI-пейзаж'}</span><button className="guide-motion" onClick={() => setPaused(!paused)} aria-label={paused ? g.resume : g.pause} title={paused ? g.resume : g.pause}>{paused ? <Play size={16} /> : <Pause size={16} />}</button></div>
      <div className="guide-contours" aria-hidden="true"><i /><i /><i /></div>
    </section>
    <form className="guide-search" role="search" onSubmit={event => { event.preventDefault(); navigate(`/map${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }}>
      <Search size={23} aria-hidden="true" /><label htmlFor="guide-place-search"><span>{g.search}</span><input id="guide-place-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={g.searchHint} /></label><button className="guide-button" type="submit">{g.find}<ArrowRight size={19} /></button>
    </form>
    <Reveal><section className="guide-section" id="directions" aria-labelledby="directions-title"><div className="guide-section-heading"><div><p className="guide-eyebrow">{c.chapterOne}</p><h2 id="directions-title">{g.directions}</h2><p>{g.directionsIntro}</p></div><Link className="guide-text-link" to="/map">{g.allPlaces}<ArrowUpRight size={18} /></Link></div><div className="guide-directions">{directions.map(({title,text,image,to,icon:Icon}, index) => <Link key={to} to={to} className="guide-destination" data-tilt><div className="guide-destination-image"><img src={image} alt="" loading="lazy" width="960" height="640" /><span className="guide-card-label"><Icon size={17} />0{index + 1}</span><span className="guide-card-arrow"><ArrowUpRight size={23} /></span><div className="guide-destination-caption"><h3>{title}</h3><p>{text}</p></div></div></Link>)}</div></section></Reveal>
    <Reveal><section className="guide-connected" aria-labelledby="connected-title"><HeritageScene /><div className="guide-connected-copy"><p className="guide-eyebrow">{g.orbitLabel}</p><h2 id="connected-title">{g.orbitTitle}</h2><p>{g.orbitText}</p><Link className="guide-text-link" to="/calendar">{g.calendar}<ArrowRight size={20} /></Link><button className="guide-text-link guide-motion-link" onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? g.resume : g.pause}</button></div></section></Reveal>
    <Reveal><section className="guide-section guide-stone" aria-labelledby="stone-title"><figure><img src="/home/cholpon-ata.jpg" alt={c.stoneAlt} loading="lazy" width="960" height="640" /><figcaption>{c.stoneCaption} · Bgag / CC0</figcaption></figure><div><p className="guide-eyebrow">{c.closeLook}</p><h2 id="stone-title">{c.stoneTitle}</h2><p>{c.stoneIntro}</p><p className="guide-respect">{c.respect}</p><Link className="guide-text-link" to="/map?kind=petroglyph">{c.openMap}<ArrowUpRight size={18} /></Link></div></section></Reveal>
    <Reveal><section className="guide-section guide-create" aria-labelledby="create-title"><div className="guide-section-heading"><div><p className="guide-eyebrow">{c.chapterTwo}</p><h2 id="create-title">{g.make}</h2></div><p>{g.makeText}</p></div><div className="guide-experiences">{c.experiences.map((experience,i) => { const Icon = [Hammer,Sparkles,Compass][i]; return <Link key={experience.to} to={experience.to}><span className="guide-experience-icon"><Icon size={26} /></span><h3>{experience.title}</h3><p>{experience.description}</p><span className="guide-text-link">{experience.action}<ArrowUpRight size={18} /></span></Link>; })}</div><div className="guide-community-note"><p>{c.communityNote}</p><Link className="guide-text-link" to="/leaderboard">{c.leaderboard}<ArrowRight size={16} /></Link></div></section></Reveal>
    <Reveal><section className="guide-journey"><div><p className="guide-eyebrow">{c.yourJourney}</p><h2>{c.journeyTitle}</h2><Link className="guide-text-link" to="/profile">{c.profile}<ArrowRight size={18} /></Link></div><dl>{[{label:c.level,value:level},{label:c.points,value:points},{label:c.artifacts,value:collection.length}].map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></section></Reveal>
    <footer className="guide-footer"><div><Link className="heritage-brand" to="/"><BrandMark /><strong>МУРАС</strong></Link><p>{c.footer}</p></div><details><summary>{c.credits}</summary><p>{lang === 'en' ? 'Hero: AI-generated artistic landscape. Photographs cropped for display.' : lang === 'kg' ? 'Биринчи пейзаж AI менен түзүлгөн. Сүрөттөр көрсөтүү үчүн кесилген.' : 'Первый пейзаж создан с помощью AI. Фотографии кадрированы для показа.'}</p><p><a href="https://commons.wikimedia.org/wiki/File:Hills_around_Song_K%C3%B6l_lake,_Kyrgyzstan;_Thomas_Depenbusch;_June_2012.jpg">Соң-Көл · Thomas Depenbusch</a> · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a></p><p><a href="https://commons.wikimedia.org/wiki/File:Song-K%C3%B6l.jpg">Соң-Көл · Ondřej Žváček</a> · <a href="https://creativecommons.org/licenses/by/2.5/">CC BY 2.5</a></p><p><a href="https://commons.wikimedia.org/wiki/File:Song_K%C3%B6l_lake,_Kyrgyzstan_(29775175450).jpg">Соң-Көл · Thomas Depenbusch</a> · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a></p><p><a href="https://commons.wikimedia.org/wiki/File:Petroglyph_Museum_of_Cholpon-Ata_10.jpg">Чолпон-Ата · Bgag</a> · CC0</p></details></footer>
  </div>;
}
