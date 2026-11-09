import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../experience/motion';
import { useLang } from '../../app/providers/LanguageProvider';
import type { mountJourney } from './journeyScene';
export default function LandscapeScene(){
 const host=useRef<HTMLDivElement>(null),api=useRef<ReturnType<typeof mountJourney>|null>(null),motion=useRef(false);
 const {paused}=useMotion();const {lang}=useLang();const [failed,setFailed]=useState(false);
 useEffect(()=>{motion.current=paused;window.dispatchEvent(new Event('scroll'));},[paused]);
 useEffect(()=>{let disposed=false,frame=0;const element=host.current;if(!element)return;
 const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=element.getBoundingClientRect();api.current?.update(1+Math.max(0,Math.min(.7,-r.top/innerHeight)),motion.current,r.bottom>0&&r.top<innerHeight);});};
 void import('./journeyScene').then(({mountJourney})=>{if(disposed)return;api.current=mountJourney(element,()=>setFailed(true));update();}).catch(()=>{if(!disposed)setFailed(true);});window.addEventListener('scroll',update,{passive:true});
 return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',update);api.current?.dispose();api.current=null;};},[]);
 return <figure className="landscape-exhibit"><div ref={host} aria-hidden="true"/>{failed&&<div className="landscape-fallback" aria-hidden="true"/>}<figcaption>{lang==='en'?'Imagined terrain · an interactive study':lang==='kg'?'Көркөм рельеф · интерактивдүү эскиз':'Воображаемый рельеф · интерактивный эскиз'}</figcaption></figure>;
}
