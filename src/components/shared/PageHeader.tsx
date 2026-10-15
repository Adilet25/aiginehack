import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useLang } from '../../app/providers/LanguageProvider';
import { useInterfaceCopy } from '../../data/interface';
import BrandMark from './BrandMark';

type Props = { title: string; subtitle?: string; action?: { to: string; label: string } };

export default function PageHeader({ title, subtitle, action }: Props) {
  const { t } = useLang();
  const c = useInterfaceCopy();
  const { pathname } = useLocation();
  const groups = [
    { label: c.explore, links: [['/map', t.map], ['/calendar', t.calendar]] },
    { label: c.create, links: [['/stone-workshop', t.stoneLab], ['/petroglyph-quiz', t.petroQuiz], ['/lootbox', t.lootbox]] },
    { label: c.community, links: [['/community-gallery', t.gallery], ['/leaderboard', t.leaderboard]] },
    { label: c.personal, links: [['/profile', t.profile], ['/museum', t.museum]] },
  ];
  const group = groups.find(item => item.links.some(([to]) => to === pathname));
  return (
    <header className="muras-page-header">
      <div className="muras-breadcrumb"><Link to="/"><ArrowLeft size={14} aria-hidden="true" />{t.home}</Link><span aria-hidden="true">/</span><span>{group?.label ?? title}</span></div>
      <div className="muras-page-title"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><BrandMark /></div>
      <div className="muras-page-nav">
        {group && <nav aria-label={group.label}>{group.links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>}
        {action && <Link className="muras-link" to={action.to}>{action.label}<ArrowUpRight size={17} aria-hidden="true" /></Link>}
      </div>
    </header>
  );
}
