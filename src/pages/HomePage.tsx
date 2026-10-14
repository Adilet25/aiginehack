import { ArrowDown, ArrowUpRight, ArrowRight, Hammer, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGame } from '../app/providers/GameProvider';
import { useLang } from '../app/providers/LanguageProvider';
import { homeCopy } from '../data/home';
import BrandMark from '../components/shared/BrandMark';
import Reveal from '../components/shared/Reveal';
import './HomePage.css';
import './Exhibition.css';

function ExhibitLink({ number, title, description, to, action, index }: {
  number: string; title: string; description: string; to: string; action: string; index: number;
}) {
  return <Link className="museum-exhibit" to={to}>
    <div className={`museum-exhibit-art museum-exhibit-art--${index}`} aria-hidden="true">
      {index < 2 ? <img src={index === 0 ? '/home/song-kol.jpg' : '/home/cholpon-ata.jpg'} alt="" loading="lazy" width="960" height="640" /> : <svg className="museum-sky-dial" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="120" /><circle cx="150" cy="150" r="106" /><circle cx="150" cy="150" r="70" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d="M150 19v22M150 248v33" transform={`rotate(${i * 30} 150 150)`} />)}
        <path d="M150 57v186M57 150h186M150 130l20 20-20 20-20-20Z" /><circle cx="150" cy="150" r="8" />
        <circle cx="150" cy="80" r="9" fill="currentColor" /><path d="M215 144a10 10 0 1 0 0 12 8 8 0 0 1 0-12Z" fill="currentColor" />
      </svg>}
      <span className="museum-exhibit-number">{number}</span>
    </div>
    <div className="museum-exhibit-copy"><h3>{title}</h3><p>{description}</p>
    <span className="museum-text-link">{action}<ArrowUpRight size={19} aria-hidden="true" /></span>
    </div>
  </Link>;
}

export default function HomePage() {
  const { level, points, collection } = useGame();
  const { lang } = useLang();
  const c = homeCopy[lang];
  return <div className="museum-home" lang={lang === 'kg' ? 'ky' : lang}>
    <section className="museum-hero" aria-labelledby="museum-title">
      <img className="museum-hero-image" src="/home/heritage-illustration.png" alt="" width="1672" height="941" fetchPriority="high" />
      <div className="museum-hero-shade" />
      <div className="museum-hero-copy">
        <p className="museum-eyebrow">{c.eyebrow}</p>
        <h1 id="museum-title">{c.title}<em>{c.titleAccent}</em></h1>
        <p className="museum-hero-description">{c.intro}</p>
        <div className="museum-actions">
          <Link className="museum-button" to="/map">{c.explore}<ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Link className="museum-hero-link" to="/stone-workshop">{c.create}<ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
      <div className="museum-hero-bottom"><a href="#museum-themes">{c.discover}<ArrowDown size={16} aria-hidden="true" /></a><span>{lang === 'en' ? 'Artistic illustration · AI-assisted' : lang === 'kg' ? 'Көркөм иллюстрация · ЖИ жардамы менен' : 'Художественная иллюстрация · с помощью ИИ'}</span></div>
    </section>
    <div className="museum-paper-body">
    <div className="museum-divider" aria-hidden="true"><span /><BrandMark /><span /></div>
    <Reveal><section className="museum-section museum-themes-section" id="museum-themes" aria-labelledby="themes-title">
      <div className="museum-section-heading"><div><p className="museum-eyebrow">{c.chapterOne}</p><h2 id="themes-title">{c.themesTitle}</h2></div><p>{c.themesIntro}</p></div>
      <div className="museum-exhibits">{c.themes.map((theme, i) => <ExhibitLink key={theme.title} index={i} number={`0${i + 1}`} {...theme} />)}</div>
    </section></Reveal>
    <Reveal className="museum-stone-wrap"><section className="museum-stone-story" aria-labelledby="stone-title">
      <figure><img src="/home/cholpon-ata.jpg" alt={c.stoneAlt} width="960" height="640" loading="lazy" /><figcaption>{c.stoneCaption}<span>Bgag · CC0</span></figcaption></figure>
      <div className="museum-story-copy"><p className="museum-eyebrow">{c.closeLook}</p><h2 id="stone-title">{c.stoneTitle}</h2><p>{c.stoneIntro}</p><p className="museum-preservation">{c.respect}</p><Link className="museum-text-link" to="/map">{c.openMap}<ArrowUpRight size={19} aria-hidden="true" /></Link><small>{c.mapNote}</small></div>
    </section></Reveal>
    <Reveal><section className="museum-section museum-making" aria-labelledby="experiences-title">
      <div className="museum-section-heading"><div><p className="museum-eyebrow">{c.chapterTwo}</p><h2 id="experiences-title">{c.experiencesTitle}</h2></div><p>{c.experiencesIntro}</p></div>
      <div className="museum-experience-grid">{c.experiences.map((experience, i) => {
        const Icon = [Hammer, Sparkles, Compass][i];
        return <Link key={experience.to} to={experience.to} className="museum-experience"><span className="museum-experience-number" aria-hidden="true">0{i + 1}</span><span className="museum-experience-seal"><Icon size={32} strokeWidth={1.1} aria-hidden="true" /></span><div className="museum-experience-copy"><h3>{experience.title}</h3><p>{experience.description}</p></div><span className="museum-text-link">{experience.action}<ArrowUpRight size={20} aria-hidden="true" /></span></Link>;
      })}</div>
      <div className="museum-community-note"><span>{c.communityNote}</span><Link className="museum-text-link" to="/leaderboard">{c.leaderboard}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section></Reveal>
    <Reveal><section className="museum-journey" aria-labelledby="journey-title">
      <BrandMark className="museum-journey-mark" />
      <div><p className="museum-eyebrow">{c.yourJourney}</p><h2 id="journey-title">{c.journeyTitle}</h2><Link className="museum-text-link" to="/profile">{c.profile}<ArrowRight size={17} aria-hidden="true" /></Link></div>
      <dl>{[{ label: c.level, value: level }, { label: c.points, value: points }, { label: c.artifacts, value: collection.length }].map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
    </section></Reveal>
    <footer className="museum-footer"><div><Link to="/" className="museum-footer-brand"><BrandMark /><strong>МУРАС</strong></Link><p>{c.footer}</p></div><details><summary>{c.credits}</summary><p>{c.photoTreatment}</p>
      <p><a href="https://commons.wikimedia.org/wiki/File:Song_K%C3%B6l_lake,_Kyrgyzstan_(29775175450).jpg">Song-Köl — Thomas Depenbusch</a> · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a></p>
      <p>{lang === 'en' ? 'Hero: artistic illustration based on the supplied design reference, created with ImageGen.' : lang === 'kg' ? 'Башкы иллюстрация: берилген үлгүнүн негизинде ImageGen менен түзүлгөн.' : 'Главная иллюстрация: создана в ImageGen по предоставленному референсу.'}</p>
      <p><a href="https://commons.wikimedia.org/wiki/File:Petroglyph_Museum_of_Cholpon-Ata_10.jpg">Cholpon-Ata — Bgag</a> · <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a></p>
    </details></footer>
    {lang === 'kg' && <p className="museum-locale-note">Башкы бет кыргызча. Башка бөлүмдөрдө которула элек тексттер орусча көрсөтүлөт.</p>}
    </div>
  </div>;
}
