import { useEffect, useRef } from 'react';
import { useMotion } from './motion';

/** Decorative dust in exhibition light, with no cultural/astronomical claims. */
export default function AtelierAtmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotion();
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || paused) return;
    let frame = 0, last = 0, time = 0, x = 0, y = 0;
    const dots = Array.from({ length: 65 }, (_, i) => ({ x: ((i * 73) % 101) / 101, y: ((i * 41) % 97) / 97, radius: .5 + (i % 4) * .35 }));
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    const draw = (stamp: number) => {
      time += Math.min((stamp - last) / 1000, .05); last = stamp;
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (innerWidth >= 1024) dots.forEach((dot, i) => {
        const dx = dot.x * canvas.width + Math.sin(time * .1 + i) * 14 + x * dot.radius;
        const dy = (dot.y * canvas.height + time * (1 + dot.radius)) % canvas.height + y * dot.radius;
        context.fillStyle = `rgba(225,216,190,${.12 + (i % 5) * .06})`;
        context.beginPath(); context.arc(dx, dy, dot.radius, 0, Math.PI * 2); context.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    const sync = () => { cancelAnimationFrame(frame); if (!document.hidden) { last = performance.now(); frame = requestAnimationFrame(draw); } };
    const move = (event: PointerEvent) => { x = (event.clientX / innerWidth - .5) * 12; y = (event.clientY / innerHeight - .5) * 8; };
    resize(); sync();
    window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', sync);
    return () => { cancelAnimationFrame(frame); context.clearRect(0, 0, canvas.width, canvas.height); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', sync); };
  }, [paused]);
  return <canvas ref={ref} className="atelier-atmosphere" aria-hidden="true" />;
}
