import { useEffect, useState } from 'react';

type Result = { key: string; points: [number,number][]; distance: number; duration: number; error: boolean };
export function useRoadRoute(stops: [number,number][]) {
  const key = stops.map(([lat,lng]) => `${lng},${lat}`).join(';');
  const [result,setResult] = useState<Result | null>(null);
  useEffect(() => {
    if (!key || !key.includes(';')) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(),15000);
    let active = true;
    fetch(`https://router.project-osrm.org/route/v1/driving/${key}?overview=full&geometries=geojson`,{signal:controller.signal})
      .then(response => { if (!response.ok) throw new Error('Routing unavailable'); return response.json(); })
      .then(data => {
        const route = data.routes?.[0];
        if (data.code !== 'Ok' || !route?.geometry?.coordinates?.length) throw new Error('No road route');
        if (active) setResult({key,points:route.geometry.coordinates.map(([lng,lat]:number[]) => [lat,lng]),distance:route.distance,duration:route.duration,error:false});
      }).catch(() => { if (active) setResult({key,points:[],distance:0,duration:0,error:true}); })
      .finally(() => clearTimeout(timer));
    return () => { active=false; clearTimeout(timer); controller.abort(); };
  },[key]);
  const current = result?.key === key ? result : null;
  return {points:current?.points ?? [],distance:current?.distance ?? 0,duration:current?.duration ?? 0,error:current?.error ?? false,loading:Boolean(key && !current)};
}
