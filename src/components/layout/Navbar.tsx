import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Compass, House, User, CalendarDays, Sparkles, Hammer, Images, Medal, Moon, Sun, ChevronDown, Menu, X, Landmark, Gift } from 'lucide-react';
import { useLang } from '../../app/providers/LanguageProvider';
import type { Lang } from '../../types';
import BrandMark from '../shared/BrandMark';

type NavItem = { to: string; label: string; icon: typeof Compass };

function NavDropdown({ label, items }: { label: string; items: NavItem[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) ref.current?.removeAttribute('open');
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return <details ref={ref} className="heritage-dropdown" data-active={items.some(item => item.to === pathname)} onKeyDown={event => {
    if (event.key === 'Escape') { ref.current?.removeAttribute('open'); ref.current?.querySelector('summary')?.focus(); }
  }}>
    <summary>{label}<ChevronDown size={14} aria-hidden="true" /></summary>
    <div className="heritage-dropdown-panel">{items.map(({ to, label: text, icon: Icon }) => <NavLink key={to} end to={to} onClick={() => ref.current?.removeAttribute('open')}><Icon size={16} aria-hidden="true" />{text}</NavLink>)}</div>
  </details>;
}

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);
  const groups = [
    { label: t.groupExplore, items: [{ to: '/', label: t.home, icon: House }, { to: '/map', label: t.map, icon: Compass }, { to: '/calendar', label: t.calendar, icon: CalendarDays }, { to: '/museum', label: t.museum, icon: Landmark }] },
    { label: t.groupPlay, items: [{ to: '/petroglyph-quiz', label: t.petroQuiz, icon: Sparkles }, { to: '/stone-workshop', label: t.stoneLab, icon: Hammer }, { to: '/lootbox', label: t.lootbox, icon: Gift }] },
    { label: t.groupCommunity, items: [{ to: '/community-gallery', label: t.gallery, icon: Images }, { to: '/leaderboard', label: t.leaderboard, icon: Medal }] },
  ];
  return <header className="heritage-nav">
    <div className="heritage-nav-inner">
      <Link to="/" className="heritage-brand" onClick={() => setMobileOpen(false)}>
        <BrandMark /><span><strong>МУРАС</strong><small>{lang === 'en' ? 'Living heritage of Kyrgyzstan' : lang === 'kg' ? 'Кыргызстандын жандуу мурасы' : 'Живое наследие Кыргызстана'}</small></span>
      </Link>
      <nav className="heritage-desktop-nav" aria-label={t.menu}>
        <NavLink className="heritage-nav-link" to="/map">{t.map}</NavLink>
        <NavLink className="heritage-nav-link" to="/calendar">{t.calendar}</NavLink>
        <NavLink className="heritage-nav-link" to="/stone-workshop">{t.stoneLab}</NavLink>
        <NavDropdown label={t.groupCommunity} items={groups[2].items} />
        <NavDropdown label={lang === 'en' ? 'More' : lang === 'kg' ? 'Дагы' : 'Ещё'} items={[groups[0].items[3], groups[1].items[0], groups[1].items[2], {to:'/profile', label:t.profile, icon:User}]} />
      </nav>
      <div className="heritage-nav-tools">
        <select aria-label="Language / Язык / Тил" value={lang} onChange={event => setLang(event.target.value as Lang)}><option value="kg">КЫР</option><option value="ru">RU</option><option value="en">EN</option></select>
        <button type="button" className="heritage-icon-button" onClick={() => setTheme(current => current === 'light' ? 'dark' : 'light')} aria-label={theme === 'dark' ? t.themeLight : t.themeDark} title={theme === 'dark' ? t.themeLight : t.themeDark}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button type="button" className="heritage-icon-button heritage-mobile-toggle" aria-label={t.menu} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(open => !open)}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
    {mobileOpen && <nav id="mobile-navigation" className="heritage-mobile-nav" aria-label={t.menu} onKeyDown={event => { if (event.key === 'Escape') setMobileOpen(false); }}>
      {groups.map(group => <div key={group.label}><h2>{group.label}</h2>{group.items.map(({ to, label, icon: Icon }) => <NavLink end key={to} to={to} onClick={() => setMobileOpen(false)}><Icon size={16} aria-hidden="true" />{label}</NavLink>)}</div>)}
      <NavLink to="/profile" onClick={() => setMobileOpen(false)}><User size={16} aria-hidden="true" />{t.profile}</NavLink>
    </nav>}
  </header>;
}
