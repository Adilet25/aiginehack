import { useEffect, useRef } from 'react';
import { useMotion } from './motion';
import './Experience.css';

export default function PointerEffects() {
  const halo = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const { paused } = useMotion();
  useEffect(() => {
    const dot = halo.current;
    const bar = progress.current;
    if (!dot || !bar || paused) return;
    const fine = matchMedia('(pointer: fine)');
    let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0;
    let active: HTMLElement | null = null;
    const reset = () => {
      dot.style.opacity = '0';
      active?.style.removeProperty('--tilt-x');
      active?.style.removeProperty('--tilt-y');
      active = null;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const tick = () => {
      x += (targetX - x) * .18;
      y += (targetY - y) * .18;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .1 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse') return reset();
      const target = event.target as HTMLElement;
      // Keep precision tools and the map visually undisturbed.
      if (target.closest('.leaflet-container,canvas,input,textarea,select')) return reset();
      targetX = event.clientX; targetY = event.clientY;
      if (dot.style.opacity !== '1') { x = targetX; y = targetY; }
      dot.style.opacity = '1';
      dot.dataset.link = String(Boolean(target.closest('a,button,summary')));
      const card = target.closest<HTMLElement>('[data-tilt]');
      if (active !== card) {
        active?.style.removeProperty('--tilt-x'); active?.style.removeProperty('--tilt-y');
        active = card;
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 5}deg`);
        card.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 5}deg`);
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const scroll = () => {
      const range = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`;
      reset();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('pointerleave', reset);
    scroll();
    return () => {
      reset();
      window.removeEventListener('pointermove', move); window.removeEventListener('scroll', scroll);
      window.removeEventListener('blur', reset); document.documentElement.removeEventListener('pointerleave', reset);
    };
  }, [paused]);
  return <div aria-hidden="true" className="guide-effects" hidden={paused}><div ref={halo} className="guide-cursor"><i /></div><div ref={progress} className="guide-scroll-progress" /></div>;
}
