import { useEffect, type ReactNode } from "react";
import Navbar from "./Navbar";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../../app/providers/LanguageProvider";
import './InternalPages.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  const { lang, t } = useLang();
  const isHome = pathname === '/';
  return (
    <div className="heritage-shell">
      <a className="heritage-skip" href="#main-content">{lang === 'en' ? 'Skip to content' : lang === 'kg' ? 'Мазмунга өтүү' : 'Перейти к содержимому'}</a>
      <Navbar />
      <main id="main-content" className={`heritage-main ${isHome ? 'heritage-main--home' : ''}`}>
        {!isHome && lang === 'kg' && <p className="mb-4 text-xs text-muted">Которула элек маданий материалдар орусча көрсөтүлөт.</p>}
        {isHome ? children : <div className="muras-route" key={pathname}>{children}</div>}
      </main>
      {!isHome && <footer className="heritage-footer"><span>МУРАС · {lang === 'en' ? 'Discover. Understand. Preserve.' : lang === 'kg' ? 'Ачуу. Түшүнүү. Сактоо.' : 'Открывать. Понимать. Беречь.'}</span><div className="flex gap-5"><Link to="/map">{t.map}</Link><Link to="/stone-workshop">{t.stoneLab}</Link><Link to="/community-gallery">{t.gallery}</Link></div></footer>}
    </div>
  );
}
