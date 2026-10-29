import { useEffect, useRef, useState } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { useLang } from '../../app/providers/LanguageProvider';
import BrandMark from '../shared/BrandMark';
import { useMotion } from './motion';
import type { SceneControls } from './scene';
import './Experience.css';

const copy = {
  ru: { title: 'Декоративная 3D-композиция', note: '3D-эскиз · Двигайте курсор и прокручивайте', loading: 'Подготавливаем 3D…', error: 'Упрощённый вид · 3D недоступно', left: 'Повернуть влево', right: 'Повернуть вправо' },
  en: { title: 'Decorative 3D composition', note: '3D study · Move your cursor and scroll', loading: 'Preparing 3D…', error: 'Simplified view · 3D unavailable', left: 'Rotate left', right: 'Rotate right' },
  kg: { title: 'Декоративдүү 3D-композиция', note: '3D-эскиз · Курсорду жылдырып, баракты сыдырыңыз', loading: '3D даярдалууда…', error: 'Жөнөкөй көрүнүш · 3D жеткиликсиз', left: 'Солго буруу', right: 'Оңго буруу' },
};

export default function HeritageScene() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<SceneControls | null>(null);
  const { paused } = useMotion();
  const pausedRef = useRef(paused);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback' | 'error'>('loading');
  const { lang } = useLang();
  const c = copy[lang];
  useEffect(() => { pausedRef.current = paused; controls.current?.pause(paused); }, [paused]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    void import('./scene').then(({ mountScene }) => {
        if (cancelled) return;
        controls.current = mountScene(element, fatal => { if (!cancelled) setStatus(fatal ? 'error' : 'fallback'); });
        controls.current.pause(pausedRef.current);
        setStatus('ready');
      }).catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; controls.current?.dispose(); controls.current = null; };
  }, []);
  const ready = status === 'ready' || status === 'fallback';
  const fallback = lang === 'en' ? 'Model unavailable · Showing the 3D study' : lang === 'kg' ? 'Модель жүктөлгөн жок · 3D-эскиз көрсөтүлдү' : 'Модель не загрузилась · Показан 3D-эскиз';
  return <figure className="heritage-scene" data-ready={ready} aria-label={c.title}>
    <div ref={host} className="heritage-scene-stage" />
    <div className="heritage-scene-fallback" aria-hidden="true"><BrandMark /></div>
    <figcaption className="heritage-scene-caption"><p role="status">{status === 'loading' ? c.loading : status === 'error' ? c.error : status === 'fallback' ? fallback : c.note}</p><div className="heritage-scene-controls"><button disabled={!ready} aria-label={c.left} onClick={() => controls.current?.rotate(-1)}><RotateCcw size={16} /></button><button disabled={!ready} aria-label={c.right} onClick={() => controls.current?.rotate(1)}><RotateCw size={16} /></button></div></figcaption>
  </figure>;
}
