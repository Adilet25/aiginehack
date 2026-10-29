import { useEffect, useRef } from 'react';
import { useMotion } from './motion';

/** Decorative connections; not a reconstruction of a named constellation. */
export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotion();
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || paused) return;
    let frame = 0;
    let points: { x: number; y: number; life: number }[] = [];
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; points = []; };
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      points = points.filter(p => (p.life -= .025) > 0);
      points.forEach((p,i) => {
        ctx.fillStyle = `rgba(43,125,110,${p.life * .7})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2); ctx.fill();
        points.slice(i+1).forEach(q => {
          const distance = Math.hypot(p.x-q.x,p.y-q.y);
          if (distance > 130) return;
          ctx.strokeStyle = `rgba(50,137,125,${Math.min(p.life,q.life)*(1-distance/130)*.5})`;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        });
      });
      frame = points.length ? requestAnimationFrame(draw) : 0;
    };
    const move = (e: PointerEvent) => {
      if (innerWidth < 1024 || e.pointerType !== 'mouse' || (e.target as HTMLElement).closest('.leaflet-container,input,select,textarea,canvas')) return;
      const last = points.at(-1);
      if (!last || Math.hypot(e.clientX-last.x,e.clientY-last.y)>24) {
        points.push({x:e.clientX,y:e.clientY,life:1});
        if (points.length>20) points.shift();
      }
      if (!frame) frame=requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize',resize); window.addEventListener('pointermove',move,{passive:true});
    return () => { cancelAnimationFrame(frame); ctx.clearRect(0,0,canvas.width,canvas.height); window.removeEventListener('resize',resize); window.removeEventListener('pointermove',move); };
  },[paused]);
  return <canvas ref={ref} aria-hidden="true" style={{position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:79}} />;
}
