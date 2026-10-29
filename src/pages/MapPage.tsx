import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { LocateFixed, Maximize2, X, ArrowRight, MapPin, Mountain, Search } from 'lucide-react';
import { useRoadRoute } from '../components/map/useRoadRoute';
import { useGuideCopy } from '../data/guide';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


import PrototypeNotice from "../components/shared/PrototypeNotice";
import LocationSidePanel from "../components/map/LocationSidePanel";
import PetroScanMock from "../components/map/PetroScanMock";
import MySubmissions from "../components/map/MySubmissions";
import { useLang } from "../app/providers/LanguageProvider";
import { useGame } from "../app/providers/GameProvider";
import type { HeritageLocation } from "../types";
import { useInterfaceCopy } from '../data/interface';

function FocusPlace({ location }: { location: HeritageLocation | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], Math.max(map.getZoom(), 10), { animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches });
  }, [location, map]);
  return null;
}

function MapViewport({ reset, mobileView, route, locations, selected }: { reset: number; mobileView: string; route: [number,number][]; locations: HeritageLocation[]; selected: boolean }) {
  const map = useMap();

  useEffect(() => { const frame = requestAnimationFrame(() => map.invalidateSize()); return () => cancelAnimationFrame(frame); },[mobileView,map]);
  useEffect(() => {
    if (route.length > 1) map.fitBounds(route,{padding:[35,35],animate:false});
    else if (!selected && locations.length) map.fitBounds(locations.map(place => [place.lat,place.lng] as [number,number]),{padding:[40,40],maxZoom:10,animate:false});
    else if (!selected && reset > 0) map.setView(center,7);
  },[route,map,locations,selected,reset,mobileView]);
  return null;
}

// Fix Leaflet default markers in Vite
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const center: [number, number] = [41.4, 75.5];
const heritageIcons = {
  sacred: L.divIcon({ className: 'heritage-map-pin heritage-map-pin--sacred', html: '<span aria-hidden="true">•</span>', iconSize: [26, 26], iconAnchor: [13, 26] }),
  petroglyph: L.divIcon({ className: 'heritage-map-pin heritage-map-pin--petroglyph', html: '<span aria-hidden="true">◇</span>', iconSize: [26, 26], iconAnchor: [13, 26] }),
};

type PlannerPoint =
  | { type: "user"; name: string; lat: number; lng: number }
  | { type: "location"; location: HeritageLocation };

function getPointCoords(point: PlannerPoint): [number, number] {
  if (point.type === "user") return [point.lat, point.lng];
  return [point.location.lat, point.location.lng];
}

function getPointName(point: PlannerPoint): string {
  if (point.type === "user") return point.name;
  return point.location.name;
}

function distanceMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
) {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number, lang: "ru" | "en") {
  if (meters < 1000) return `${Math.round(meters)} ${lang === "ru" ? "м" : "m"}`;
  return `${(meters / 1000).toFixed(1)} ${lang === "ru" ? "км" : "km"}`;
}

// distance from point P to line segment AB in approximate "degree space"
// good enough for MVP ranking
function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;

  const abLenSq = abx * abx + aby * aby;
  if (abLenSq === 0) {
    const dx = px - ax;
    const dy = py - ay;
    return Math.sqrt(dx * dx + dy * dy);
  }

  let t = (apx * abx + apy * aby) / abLenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = ax + abx * t;
  const closestY = ay + aby * t;

  const dx = px - closestX;
  const dy = py - closestY;

  return Math.sqrt(dx * dx + dy * dy);
}

export default function MapPage() {
  const { t, lang } = useLang();
  const { mapLocations } = useGame();
  const c = useInterfaceCopy();
  const g = useGuideCopy();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const kindParam = searchParams.get('kind');
  const kind = kindParam === 'sacred' || kindParam === 'petroglyph' ? kindParam : 'all';
  const setQuery = (value: string) => setSearchParams(previous => { const next = new URLSearchParams(previous); if (value) next.set('q',value); else next.delete('q'); return next; },{replace:true});
  const setKind = (value: 'all' | 'sacred' | 'petroglyph') => setSearchParams(previous => { const next = new URLSearchParams(previous); if (value !== 'all') next.set('kind',value); else next.delete('kind'); return next; },{replace:true});
  const [mobileView,setMobileView] = useState<'map' | 'list'>('map');
  const [resetView,setResetView] = useState(0);
  const [geoEnabled,setGeoEnabled] = useState(false);
  const [geoAttempt,setGeoAttempt] = useState(0);
  const [geoError,setGeoError] = useState(false);
  const planner = useRef<HTMLDetailsElement>(null);
  const [showDemo, setShowDemo] = useState(false);
  const browseLocations = useMemo(() => mapLocations.filter(location => showDemo || !location.sourceLabel?.includes('MVP')).sort((a,b) => ((a.id === 3 ? -1 : a.id) - (b.id === 3 ? -1 : b.id))), [mapLocations,showDemo]);
  const filteredLocations = useMemo(() => browseLocations.filter(location => (kind === 'all' || location.kind === kind) && `${location.name} ${location.district}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [browseLocations, kind, query]);

  const [selected, setSelected] = useState<HeritageLocation | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );

  const [startMode, setStartMode] = useState<"user" | "location">("location");
  const [startLocationId, setStartLocationId] = useState<string>("");
  const [destinationId, setDestinationId] = useState<string>("");
  const [routeStops, setRouteStops] = useState<HeritageLocation[]>([]);
  const [routeBuilt, setRouteBuilt] = useState(false);
  const [autoSuggestions, setAutoSuggestions] = useState<HeritageLocation[]>(
    [],
  );

  useEffect(() => {
    if (!geoEnabled || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
        setGeoError(false);
      },
      () => {
        setGeoError(true);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [geoEnabled,geoAttempt]);

  const nearby = useMemo(() => {
    if (!userPosition) return null;
    return browseLocations.find((loc) => {
      const dist = distanceMeters(
        userPosition[0],
        userPosition[1],
        loc.lat,
        loc.lng,
      );
      return dist <= loc.radiusMeters;
    }) ?? null;
  }, [browseLocations, userPosition]);
  const nearbyWarning = !nearby ? null : nearby.kind === 'sacred' ? `${t.nearbyWarning}: ${nearby.name}` : t.petroglyphNearby.replace('{name}', nearby.name);
  useEffect(() => {
    if (nearby?.kind === 'sacred' && 'vibrate' in navigator) navigator.vibrate?.([150, 80, 150]);
  }, [nearby]);

  const destinationLocation = useMemo(
    () => mapLocations.find((loc) => String(loc.id) === destinationId) ?? null,
    [destinationId, mapLocations],
  );

  const startPoint = useMemo<PlannerPoint | null>(() => {
    if (startMode === "user") {
      if (!userPosition) return null;
      return {
        type: "user",
        name: t.myLocation,
        lat: userPosition[0],
        lng: userPosition[1],
      };
    }

    const location = mapLocations.find(
      (loc) => String(loc.id) === startLocationId,
    );
    if (!location) return null;

    return {
      type: "location",
      location,
    };
  }, [startMode, userPosition, mapLocations, startLocationId, t.myLocation]);

  const routePoints = useMemo<PlannerPoint[]>(() => {
    if (!routeBuilt || !startPoint || !destinationLocation) return [];

    return [
      startPoint,
      ...routeStops.map(
        (stop) => ({ type: "location", location: stop }) as PlannerPoint,
      ),
      { type: "location", location: destinationLocation },
    ];
  }, [routeBuilt, startPoint, routeStops, destinationLocation]);

  const routeCoordinates = useMemo<[number, number][]>(() => {
    return routePoints.map((point) => getPointCoords(point));
  }, [routePoints]);

  const road = useRoadRoute(routeCoordinates);
  const polylinePositions = road.points;
  const totalDistance = road.distance;
  const routeStatus = road.loading ? (lang === 'en' ? 'Finding roads…' : lang === 'kg' ? 'Жолдор изделүүдө…' : 'Ищем маршрут по дорогам…') : road.error ? (lang === 'en' ? 'No road route available. Change the points or try again later.' : lang === 'kg' ? 'Жол табылган жок. Башка жерлерди тандаңыз.' : 'Не удалось построить дорожный маршрут. Измените точки или попробуйте позже.') : (lang === 'en' ? 'Driving · OSRM' : lang === 'kg' ? 'Унаа · OSRM' : 'На автомобиле · OSRM');


  const addStopToRoute = (location: HeritageLocation) => {
    if (routeStops.some((item) => item.id === location.id)) return;
    if (destinationId === String(location.id)) return;
    if (startMode === "location" && startLocationId === String(location.id))
      return;

    setRouteStops((prev) => [...prev, location]);
    if (planner.current) planner.current.open = true;
  };

  const planTo = (location: HeritageLocation) => {
    setDestinationId(String(location.id));
    setRouteStops(previous => previous.filter(stop => stop.id !== location.id));
    setRouteBuilt(false);
    if (planner.current) { planner.current.open = true; planner.current.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'nearest'}); }
  };

  const removeStop = (id: number) => {
    setRouteStops((prev) => prev.filter((item) => item.id !== id));
  };

  const buildRoute = () => {
    if (!startPoint || !destinationLocation || (startMode === 'location' && startLocationId === destinationId)) return;
    setRouteBuilt(true);
  };

  const autoBuildRoute = () => {
    if (!startPoint || !destinationLocation || (startMode === 'location' && startLocationId === destinationId)) return;

    const [aLat, aLng] = getPointCoords(startPoint);
    const [bLat, bLng] = [destinationLocation.lat, destinationLocation.lng];

    const corridorCandidates = browseLocations
      .filter((loc) => {
        if (destinationLocation.id === loc.id) return false;
        if (startMode === "location" && startLocationId === String(loc.id))
          return false;

        const distToLine = pointToSegmentDistance(
          loc.lat,
          loc.lng,
          aLat,
          aLng,
          bLat,
          bLng,
        );

        // approximate threshold in degrees (~ 15–25 km depending on latitude)
        return distToLine < 0.18;
      })
      .map((loc) => {
        const distToLine = pointToSegmentDistance(
          loc.lat,
          loc.lng,
          aLat,
          aLng,
          bLat,
          bLng,
        );
        const distFromStart = distanceMeters(aLat, aLng, loc.lat, loc.lng);
        return {
          location: loc,
          distToLine,
          distFromStart,
        };
      })
      .sort((a, b) => {
        if (a.distToLine !== b.distToLine) return a.distToLine - b.distToLine;
        return a.distFromStart - b.distFromStart;
      })
      .slice(0, 4);

    const selectedStops = corridorCandidates
      .sort((a, b) => a.distFromStart - b.distFromStart)
      .map((item) => item.location);

    setRouteStops(selectedStops);
    setAutoSuggestions(selectedStops);
    setRouteBuilt(true);
  };

  const clearRoute = () => {
    setRouteBuilt(false);
    setRouteStops([]);
    setDestinationId("");
    setStartLocationId("");
    setStartMode("location");
    setAutoSuggestions([]);
  };

  return (
    <div className="muras-map space-y-6" data-mobile-view={mobileView}>
      <div className="guide-mobile-map-switch" role="group" aria-label={t.map}><button aria-pressed={mobileView === 'map'} onClick={() => setMobileView('map')}>{g.showMap}</button><button aria-pressed={mobileView === 'list'} onClick={() => setMobileView('list')}>{g.showList} · {filteredLocations.length}</button></div>

      <div className="muras-map-layout">
        <div className="muras-map-sidebar">      <header className="guide-map-heading"><h1>{lang === 'en' ? 'Plan your discoveries' : lang === 'kg' ? 'Ачылыштарды пландаңыз' : 'Планируйте открытия'}</h1><p>{lang === 'en' ? 'Explore places and build your own journey.' : lang === 'kg' ? 'Жерлерди изилдеп, өз багытыңызды түзүңүз.' : 'Исследуйте места и собирайте свой маршрут.'}</p></header>
      <details className="guide-map-notice"><summary>{lang === 'en' ? 'Prototype map · About the data' : lang === 'kg' ? 'Карта прототиби · Маалымат жөнүндө' : 'Прототип карты · О данных'}</summary><PrototypeNotice kind="map" /><label className="guide-demo-toggle"><input type="checkbox" checked={showDemo} onChange={event => { setShowDemo(event.target.checked); if (!event.target.checked) { clearRoute(); setSelected(null); } }} />{lang === 'en' ? 'Show demonstration places' : lang === 'kg' ? 'Үлгү жерлерди көрсөтүү' : 'Показать демонстрационные места'}</label></details>
      <div className="muras-map-toolbar"><Search size={18} aria-hidden="true" /><input type="search" aria-label={c.searchPlaces} placeholder={c.searchPlaces} value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label={g.clearSearch} onClick={() => setQuery('')}><X size={18} /></button>}<div className="muras-filters">{(['all', 'sacred', 'petroglyph'] as const).map(value => <button key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{value === 'all' ? t.filterAll : value === 'sacred' ? `● ${t.kindSacred}` : `◇ ${t.kindPetroglyph}`}</button>)}</div></div>
      <div className="guide-map-actions"><button onClick={() => { setSelected(null); setResetView(value => value + 1); setSearchParams({},{replace:true}); setMobileView('map'); }}><Maximize2 size={16} />{g.fullMap}</button><button disabled={geoEnabled && !userPosition && !geoError} onClick={() => { setGeoError(!navigator.geolocation); setGeoEnabled(true); setGeoAttempt(value => value + 1); setStartMode('user'); setRouteBuilt(false); if (planner.current) planner.current.open = true; }}><LocateFixed size={16} />{geoEnabled && !userPosition && !geoError ? g.locating : g.locate}</button></div>
      {geoError && <p role="status" className="muras-caption">{g.locateError}</p>}

          {selected && <LocationSidePanel
            location={selected}
            nearbyWarning={nearbyWarning}
          />}
          {selected && <div className="guide-selected-actions"><button onClick={() => planTo(selected)}>{g.destination}</button><button disabled={routeStops.some(stop => stop.id === selected.id) || destinationId === String(selected.id) || (startMode === 'location' && startLocationId === String(selected.id))} onClick={() => addStopToRoute(selected)}>{routeStops.some(stop => stop.id === selected.id) ? g.added : t.addToRoute}</button></div>}

          <div className="muras-place-browser"><p className="muras-result-count" role="status">{c.results}: {filteredLocations.length}</p><div className="muras-place-list">{filteredLocations.map(location => <article key={location.id} className="guide-place-card" data-selected={selected?.id === location.id}>
            <button className="guide-place-open" aria-pressed={selected?.id === location.id} onClick={() => { setSelected(location); setMobileView('map'); }}>
              {(location.id === 1 || location.id === 3) && <img src={location.id === 1 ? '/home/sulaiman-too.jpg' : '/home/cholpon-ata.jpg'} alt="" loading="lazy" width="400" height="150" />}
              <span>{location.name}</span><small>{location.district}</small>
              <em className="guide-place-kind">{location.kind === 'sacred' ? <MapPin size={12} /> : <Mountain size={12} />}{location.kind === 'sacred' ? t.kindSacred : t.kindPetroglyph}{location.sourceLabel?.includes('MVP') && <b> · {lang === 'en' ? 'Demo' : lang === 'kg' ? 'Үлгү' : 'Демо'}</b>}</em>
            </button>
            <div className="guide-place-card-bottom"><p>{location.description}</p><button onClick={() => planTo(location)} aria-label={g.destination + ': ' + location.name}>{g.destination}<ArrowRight size={14} /></button></div>
          </article>)}</div>{filteredLocations.length === 0 && <div><p>{c.noResults}</p><p className="muras-caption">{c.tryAgain}</p><button className="muras-link" onClick={() => setSearchParams({},{replace:true})}>{c.reset}</button></div>}</div>
          <details className="guide-map-credits"><summary>{lang === 'en' ? 'Photo credits' : lang === 'kg' ? 'Сүрөт булактары' : 'Источники фото'}</summary><p><a href="https://commons.wikimedia.org/wiki/File:Osh_sulaiman_Too.jpg">Сулайман-Тоо · Hzewo</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></p><p><a href="https://commons.wikimedia.org/wiki/File:Petroglyph_Museum_of_Cholpon-Ata_10.jpg">Чолпон-Ата · Bgag</a> · CC0</p><p>{lang === 'en' ? 'Cropped for display.' : lang === 'kg' ? 'Көрсөтүү үчүн кесилген.' : 'Кадрированы для показа.'}</p></details>
                    <details ref={planner} className="muras-disclosure muras-planner">
            <summary>{t.tripPlanner}</summary>
            <div className="muras-disclosure-body">
            <p className="mt-2 text-sm leading-7 text-ink ">
              {t.tripPlannerDesc}
            </p>
            <p className="muras-caption">{c.planHint}</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink ">
                  {t.pointA}
                </label>

                <div className="grid gap-3">
                  <select
                    aria-label={t.pointA}
                    value={startMode}
                    onChange={(e) => { setStartMode(e.target.value as "user" | "location"); setRouteBuilt(false); }}
                    className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink    outline-none"
                  >
                    <option value="user">{t.myLocation}</option>
                    <option value="location">{t.chooseLocation}</option>
                  </select>

                  {startMode === "location" && (
                    <select
                      aria-label={t.selectPointA}
                      value={startLocationId}
                      onChange={(e) => { setStartLocationId(e.target.value); setRouteBuilt(false); setRouteStops(previous => previous.filter(stop => String(stop.id) !== e.target.value)); }}
                      className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink    outline-none"
                    >
                      <option value="">{t.selectPointA}</option>
                      {browseLocations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-ink ">
                  {t.pointB}
                </label>

                <select
                  aria-label={t.pointB}
                  value={destinationId}
                    onChange={(e) => { setDestinationId(e.target.value); setRouteBuilt(false); setRouteStops(previous => previous.filter(stop => String(stop.id) !== e.target.value)); }}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink    outline-none"
                >
                  <option value="">{t.selectPointB}</option>
                  {browseLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-ink ">
                    {t.stopsOnWay}
                  </label>
                  <span className="text-xs text-ink ">
                    {t.stopsHint}
                  </span>
                </div>

                {routeStops.length === 0 ? (
                  <div className="rounded-2xl border border-line bg-wash px-4 py-3 text-sm text-ink ">
                    {t.noStops}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routeStops.map((stop, index) => (
                      <div
                        key={stop.id}
                        className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3  "
                      >
                        <div>
                          <p className="text-sm font-semibold text-ink ">
                            {index + 1}. {stop.name}
                          </p>
                          <p className="text-xs text-ink ">
                            {stop.kind === "sacred" ? t.kindSacred : t.kindPetroglyph}
                          </p>
                        </div>

                        <button
                          onClick={() => removeStop(stop.id)}
                          className="rounded-xl border border-danger bg-danger-soft px-3 py-1 text-xs font-semibold text-danger hover:bg-danger-soft"
                        >
                          {t.remove}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={buildRoute}
                  disabled={!startPoint || !destinationLocation || (startMode === 'location' && startLocationId === destinationId)}
                  className="rounded-2xl border border-gold bg-gold-soft px-5 py-3 font-semibold text-ink  transition hover:bg-gold-soft"
                >
                  {t.buildManually}
                </button>

                <button
                  onClick={autoBuildRoute}
                  disabled={!startPoint || !destinationLocation || (startMode === 'location' && startLocationId === destinationId)}
                  className="rounded-2xl border border-sage bg-sage-soft px-5 py-3 font-semibold text-ink  transition hover:bg-sage-soft"
                >
                  {t.buildAuto}
                </button>

                <button
                  onClick={clearRoute}
                  className="rounded-2xl border border-line bg-surface px-5 py-3 font-semibold text-ink  transition hover:bg-surface"
                >
                  {t.clear}
                </button>
              </div>
              {startMode === 'user' && !userPosition && <p className="muras-caption" role="status">{c.locationHint}</p>}

              {autoSuggestions.length > 0 && (
                <div className="rounded-3xl border border-sky bg-sky-soft p-5">
                  <h4 className="text-lg font-bold text-ink ">
                    {t.suggestedStops}
                  </h4>
                  <div className="mt-3 space-y-2">
                    {autoSuggestions.map((stop) => (
                      <div
                        key={stop.id}
                        className="rounded-2xl border border-line bg-wash px-4 py-3 text-sm text-ink "
                      >
                        {stop.name}{" "}
                        <span className="text-ink ">
                          • {stop.kind === "sacred" ? t.kindSacred : t.kindPetroglyph}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {routeBuilt && <p role="status" className="muras-caption">{routeStatus}</p>}
              {routeBuilt && road.points.length > 1 && (
                <div className="rounded-3xl border border-sage bg-sage-soft p-5">
                  <h4 className="text-lg font-bold text-ink ">
                    {t.routeSummary}
                  </h4>
                  <div className="mt-3 space-y-2 text-sm text-sage">
                    <p>
                      <span className="font-semibold">{t.routeStart}:</span>{" "}
                      {getPointName(routePoints[0])}
                    </p>
                    <p>
                      <span className="font-semibold">{t.routeDestination}:</span>{" "}
                      {getPointName(routePoints[routePoints.length - 1])}
                    </p>
                    <p>
                      <span className="font-semibold">{t.routeStops}:</span>{" "}
                      {routeStops.length}
                    </p>
                    <p>
                      <span className="font-semibold">{t.routeDistance}:</span>{" "}
                      {formatDistance(totalDistance, lang === "kg" ? "ru" : lang)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            </div>
          </details>
        </div>
        <div className="muras-map-frame">
          <div className="heritage-map-surface overflow-hidden rounded-2xl border border-line ">
            <MapContainer
              center={center}
              zoom={7}
              scrollWheelZoom
              className="h-full w-full"
            >
              <FocusPlace location={selected} />
              <MapViewport reset={resetView} mobileView={mobileView} route={polylinePositions} locations={filteredLocations} selected={!!selected} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · SRTM · <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA) · <a href="https://openmaps.fr/donate">Support tiles</a>'
                url="https://tile.openmaps.fr/opentopomap/{z}/{x}/{y}.png" maxNativeZoom={17}
              />

              {userPosition && (
                <Circle
                  center={userPosition}
                  radius={45}
                  pathOptions={{
                    color: "#e6c79c",
                    fillColor: "#e6c79c",
                    fillOpacity: 0.18,
                  }}
                />
              )}

              {routeBuilt && polylinePositions.length > 1 && (
                <Polyline
                  positions={polylinePositions}
                  pathOptions={{
                    color: "#215d46",
                    weight: 5,
                    opacity: 0.85,
                  }}
                />
              )}

              {filteredLocations.map((location) => (
                <div key={location.id}>
                  <Marker
                    icon={heritageIcons[location.kind]}
                    title={location.name}
                    alt={location.name}
                    position={[location.lat, location.lng]}
                    eventHandlers={{
                      click: () => setSelected(location),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[240px] space-y-3 text-sm">
                        <div>
                          <h3 className="font-bold text-ink">
                            {location.name}
                          </h3>
                          <p className="text-ink">
                            {location.description}
                          </p>
                        </div>

                        <div className="pt-1">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                              location.kind === "sacred"
                                ? "bg-danger-soft text-danger"
                                : "bg-sky-soft text-sky"
                            }`}
                          >
                            {location.kind === "sacred" ? t.kindSacred : t.kindPetroglyph}
                          </span>
                        </div>

                        <button
                          onClick={() => planTo(location)}
                          className="w-full rounded-xl bg-gold-soft px-3 py-2 font-semibold text-ink  transition hover:bg-gold-soft"
                        >
                          {g.destination}
                        </button>
                      </div>
                    </Popup>
                  </Marker>

                  <Circle
                    center={[location.lat, location.lng]}
                    radius={location.radiusMeters}
                    pathOptions={{
                      color: location.kind === "sacred" ? "#b84b4b" : "#4d7ea8",
                      fillColor:
                        location.kind === "sacred" ? "#b84b4b" : "#4d7ea8",
                      fillOpacity: 0.14,
                    }}
                  />
                </div>
              ))}
            </MapContainer>
          </div>
          <form className="guide-map-quick-route" onSubmit={event => { event.preventDefault(); buildRoute(); }}><h2>{lang === 'en' ? 'Your journey, step by step' : lang === 'kg' ? 'Багытыңызды түзүңүз' : 'Соберите своё путешествие'}</h2><p className="muras-caption">{lang === 'en' ? '1. Choose a start → 2. Choose a destination → 3. Build a driving route. Coordinates are sent to OSRM.' : lang === 'kg' ? '1. Башталыш → 2. Бара турган жер → 3. Унаа багыты. Координаттар OSRM кызматына жөнөтүлөт.' : '1. Откуда → 2. Куда → 3. Маршрут по дорогам. Координаты отправляются в OSRM.'}</p><label><span>{t.pointA}</span><select aria-label={g.route + ": " + t.pointA} value={startMode === 'user' ? 'user' : startLocationId} onChange={event => { setStartMode(event.target.value === 'user' ? 'user' : 'location'); setStartLocationId(event.target.value === 'user' ? '' : event.target.value); setRouteBuilt(false); setRouteStops(previous => previous.filter(stop => String(stop.id) !== event.target.value)); }}><option value="">{t.selectPointA}</option>{userPosition && <option value="user">{t.myLocation}</option>}{browseLocations.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label><label><span>{t.pointB}</span><select aria-label={g.route + ": " + t.pointB} value={destinationId} onChange={event => { setDestinationId(event.target.value); setRouteBuilt(false); setRouteStops(previous => previous.filter(stop => String(stop.id) !== event.target.value)); }}><option value="">{t.selectPointB}</option>{browseLocations.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label><button className="guide-button" disabled={!startPoint || !destinationLocation || (startMode === 'location' && startLocationId === destinationId)}>{t.buildManually}<ArrowRight size={16} /></button>{routeBuilt && <p role="status">{!road.loading && !road.error && <>{formatDistance(totalDistance,lang === 'en' ? 'en' : 'ru')} · {Math.round(road.duration / 60)} {lang === 'en' ? 'min' : 'мин'} · </>}{routeStatus}</p>}<button type="button" className="guide-quick-more" onClick={() => { if (planner.current) { planner.current.open = true; planner.current.scrollIntoView({block:'center'}); } }}>{t.stopsOnWay}<ArrowRight size={14} /></button></form>
        </div>

      </div>

      <section className="muras-discovery-section"><h2>{c.discoveries}</h2><div className="muras-discovery-grid">
        <PetroScanMock />
        <div className="min-w-0">
          <MySubmissions />
        </div>
      </div></section>
    </div>
  );
}
