import { useEffect, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../../app/providers/LanguageProvider";
import { Pause, Play } from 'lucide-react';
import { MotionContext } from '../experience/motion';
import PointerEffects from '../experience/PointerEffects';
import Constellation from '../experience/Constellation';
import { useGuideCopy } from '../../data/guide';
import './InternalPages.css';
import './GuideTheme.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const g = useGuideCopy();
  useEffect(() => { const preference = matchMedia('(prefers-reduced-motion: reduce)'); const change = () => setPaused(preference.matches); preference.addEventListener('change', change); return () => preference.removeEventListener('change', change); }, []);
  useEffect(() => { document.documentElement.dataset.motionPaused = String(paused); return () => { delete document.documentElement.dataset.motionPaused; }; }, [paused]);
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  const { lang, t } = useLang();
  const isHome = pathname === '/';
  return (
    <MotionContext.Provider value={{ paused, setPaused }}><div className="heritage-shell">
      <PointerEffects /><Constellation />
      <button className="guide-motion-toggle" aria-label={paused ? g.resume : g.pause} title={paused ? g.resume : g.pause} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
      <a className="heritage-skip" href="#main-content">{lang === 'en' ? 'Skip to content' : lang === 'kg' ? 'Мазмунга өтүү' : 'Перейти к содержимому'}</a>
      <Navbar />
      <main id="main-content" className={`heritage-main ${isHome ? 'heritage-main--home' : pathname === '/map' ? 'heritage-main--map' : ''}`}>
        {!isHome && lang === 'kg' && <p className="mb-4 text-xs text-muted">Которула элек маданий материалдар орусча көрсөтүлөт.</p>}
        {isHome ? children : <div className="muras-route" key={pathname}>{children}</div>}
      </main>
      {!isHome && <footer className="heritage-footer"><span>МУРАС · {lang === 'en' ? 'Discover. Understand. Preserve.' : lang === 'kg' ? 'Ачуу. Түшүнүү. Сактоо.' : 'Открывать. Понимать. Беречь.'}</span><div className="flex gap-5"><Link to="/map">{t.map}</Link><Link to="/stone-workshop">{t.stoneLab}</Link><Link to="/community-gallery">{t.gallery}</Link></div></footer>}
    </div></MotionContext.Provider>
  );
}
