import { useEffect, useRef, type ReactNode } from 'react';

export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || preference.matches || !('IntersectionObserver' in window)) return;
    const show = () => { element.dataset.revealed = 'true'; };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { show(); observer.disconnect(); }
    }, { threshold: 0.08 });
    element.dataset.revealed = 'false';
    observer.observe(element);
    preference.addEventListener('change', show);
    return () => { observer.disconnect(); preference.removeEventListener('change', show); };
  }, []);
  return <div ref={ref} className={`museum-reveal ${className}`}>{children}</div>;
}
