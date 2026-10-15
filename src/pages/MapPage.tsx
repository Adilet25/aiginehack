import { useEffect, useMemo, useState } from "react";
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

import PageHeader from "../components/shared/PageHeader";
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
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | 'sacred' | 'petroglyph'>('all');
  const filteredLocations = useMemo(() => mapLocations.filter(location => (kind === 'all' || location.kind === kind) && `${location.name} ${location.district}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [mapLocations, kind, query]);

  const [selected, setSelected] = useState<HeritageLocation | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );

  const [startMode, setStartMode] = useState<"user" | "location">("user");
  const [startLocationId, setStartLocationId] = useState<string>("");
  const [destinationId, setDestinationId] = useState<string>("");
  const [routeStops, setRouteStops] = useState<HeritageLocation[]>([]);
  const [routeBuilt, setRouteBuilt] = useState(false);
  const [autoSuggestions, setAutoSuggestions] = useState<HeritageLocation[]>(
    [],
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        // ignore in MVP
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const nearby = useMemo(() => {
    if (!userPosition) return null;
    return mapLocations.find((loc) => {
      const dist = distanceMeters(
        userPosition[0],
        userPosition[1],
        loc.lat,
        loc.lng,
      );
      return dist <= loc.radiusMeters;
    }) ?? null;
  }, [mapLocations, userPosition]);
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

  const polylinePositions = useMemo<[number, number][]>(() => {
    return routePoints.map((point) => getPointCoords(point));
  }, [routePoints]);

  const totalDistance = useMemo(() => {
    if (polylinePositions.length < 2) return 0;

    let total = 0;
    for (let i = 0; i < polylinePositions.length - 1; i++) {
      const [aLat, aLng] = polylinePositions[i];
      const [bLat, bLng] = polylinePositions[i + 1];
      total += distanceMeters(aLat, aLng, bLat, bLng);
    }
    return total;
  }, [polylinePositions]);

  const addStopToRoute = (location: HeritageLocation) => {
    if (routeStops.some((item) => item.id === location.id)) return;
    if (destinationId === String(location.id)) return;
    if (startMode === "location" && startLocationId === String(location.id))
      return;

    setRouteStops((prev) => [...prev, location]);
  };

  const removeStop = (id: number) => {
    setRouteStops((prev) => prev.filter((item) => item.id !== id));
  };

  const buildRoute = () => {
    if (!startPoint || !destinationLocation) return;
    setRouteBuilt(true);
  };

  const autoBuildRoute = () => {
    if (!startPoint || !destinationLocation) return;

    const [aLat, aLng] = getPointCoords(startPoint);
    const [bLat, bLng] = [destinationLocation.lat, destinationLocation.lng];

    const corridorCandidates = mapLocations
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
    setStartMode("user");
    setAutoSuggestions([]);
  };

  return (
    <div className="muras-map space-y-6">
      <PageHeader
        title={t.mapTitle}
        subtitle={t.mapSubtitle}
      />
      <PrototypeNotice kind="map" />
      <div className="muras-map-toolbar"><input type="search" aria-label={c.searchPlaces} placeholder={c.searchPlaces} value={query} onChange={e => setQuery(e.target.value)} /><div className="muras-filters">{(['all', 'sacred', 'petroglyph'] as const).map(value => <button key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{value === 'all' ? t.filterAll : value === 'sacred' ? `● ${t.kindSacred}` : `◇ ${t.kindPetroglyph}`}</button>)}</div></div>

      <div className="muras-map-layout">
        <div className="muras-map-frame">
          <div className="heritage-map-surface overflow-hidden rounded-2xl border border-line ">
            <MapContainer
              center={center}
              zoom={7}
              scrollWheelZoom
              className="h-full w-full"
            >
              <FocusPlace location={selected} />
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                    color: "#9c4327",
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
                          onClick={() => addStopToRoute(location)}
                          className="w-full rounded-xl bg-gold-soft px-3 py-2 font-semibold text-ink  transition hover:bg-gold-soft"
                        >
                          {t.addToRoute}
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
        </div>

        <div className="muras-map-sidebar">
          <div className="muras-place-browser"><p className="muras-result-count" role="status">{c.results}: {filteredLocations.length}</p><p className="muras-caption">{c.choosePlace}</p><div className="muras-place-list">{filteredLocations.map(location => <button key={location.id} aria-pressed={selected?.id === location.id} onClick={() => setSelected(location)}><span>{location.name}</span><small>{location.district}</small></button>)}</div>{filteredLocations.length === 0 && <button className="muras-link" onClick={() => { setQuery(''); setKind('all'); }}>{c.reset}</button>}</div>
          <LocationSidePanel
            location={selected}
            nearbyWarning={nearbyWarning}
          />

          <details className="muras-disclosure muras-planner">
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
                    onChange={(e) =>
                      setStartMode(e.target.value as "user" | "location")
                    }
                    className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink    outline-none"
                  >
                    <option value="user">{t.myLocation}</option>
                    <option value="location">{t.chooseLocation}</option>
                  </select>

                  {startMode === "location" && (
                    <select
                      aria-label={t.selectPointA}
                      value={startLocationId}
                      onChange={(e) => setStartLocationId(e.target.value)}
                      className="rounded-2xl border border-line bg-surface px-4 py-3 text-ink    outline-none"
                    >
                      <option value="">{t.selectPointA}</option>
                      {mapLocations.map((loc) => (
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
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink    outline-none"
                >
                  <option value="">{t.selectPointB}</option>
                  {mapLocations.map((loc) => (
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
                  disabled={!startPoint || !destinationLocation}
                  className="rounded-2xl border border-gold bg-gold-soft px-5 py-3 font-semibold text-ink  transition hover:bg-gold-soft"
                >
                  {t.buildManually}
                </button>

                <button
                  onClick={autoBuildRoute}
                  disabled={!startPoint || !destinationLocation}
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

              {routeBuilt && routePoints.length > 1 && (
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
