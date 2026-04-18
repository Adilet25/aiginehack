import { useEffect, useMemo, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import PageHeader from "../components/shared/PageHeader";
import LocationSidePanel from "../components/map/LocationSidePanel";
import PetroScanMock from "../components/map/PetroScanMock";
import MySubmissions from "../components/map/MySubmissions";
import { useLang } from "../app/providers/LanguageProvider";
import { useGame } from "../app/providers/GameProvider";
import type { HeritageLocation } from "../types";

// Fix Leaflet default markers in Vite
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const center: [number, number] = [41.4, 75.5];

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

function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} м`;
  return `${(meters / 1000).toFixed(1)} км`;
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
  const { t } = useLang();
  const { mapLocations } = useGame();

  const [selected, setSelected] = useState<HeritageLocation | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [nearbyWarning, setNearbyWarning] = useState<string | null>(null);

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

  useEffect(() => {
    if (!userPosition) {
      setNearbyWarning(null);
      return;
    }

    const nearby = mapLocations.find((loc) => {
      const dist = distanceMeters(
        userPosition[0],
        userPosition[1],
        loc.lat,
        loc.lng,
      );
      return dist <= loc.radiusMeters;
    });

    if (!nearby) {
      setNearbyWarning(null);
      return;
    }

    if (nearby.kind === "sacred") {
      setNearbyWarning(
        `${t.nearbyWarning}: ${nearby.name}. Соблюдайте тишину, не мусорьте и не повреждайте среду.`,
      );

      if ("vibrate" in navigator) {
        navigator.vibrate?.([150, 80, 150]);
      }
    } else {
      setNearbyWarning(
        `Вы рядом с петроглифом: ${nearby.name}. Можно изучить его, сфотографировать и отправить на проверку.`,
      );
    }
  }, [mapLocations, t.nearbyWarning, userPosition]);

  const destinationLocation = useMemo(
    () => mapLocations.find((loc) => String(loc.id) === destinationId) ?? null,
    [destinationId, mapLocations],
  );

  const startPoint = useMemo<PlannerPoint | null>(() => {
    if (startMode === "user") {
      if (!userPosition) return null;
      return {
        type: "user",
        name: "My location",
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
  }, [startMode, userPosition, mapLocations, startLocationId]);

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
    <div className="space-y-6">
      <PageHeader
        title="Sacred & Rock Art Map"
        subtitle="Карта для туристов, местных жителей и семейных поездок: укажи точку A и точку B, а система сама предложит культурные места по пути."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glow-card panel-ornament overflow-hidden rounded-3xl p-3">
          <div className="h-[620px] overflow-hidden rounded-2xl border border-white/10">
            <MapContainer
              center={center}
              zoom={7}
              scrollWheelZoom
              className="h-full w-full"
            >
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
                    color: "#f59e0b",
                    weight: 5,
                    opacity: 0.85,
                  }}
                />
              )}

              {mapLocations.map((location) => (
                <div key={location.id}>
                  <Marker
                    position={[location.lat, location.lng]}
                    eventHandlers={{
                      click: () => setSelected(location),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[240px] space-y-3 text-sm">
                        <div>
                          <h3 className="font-bold text-black">
                            {location.name}
                          </h3>
                          <p className="text-black/70">
                            {location.description}
                          </p>
                        </div>

                        <div className="pt-1">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                              location.kind === "sacred"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {location.kind}
                          </span>
                        </div>

                        <button
                          onClick={() => addStopToRoute(location)}
                          className="w-full rounded-xl bg-amber-500 px-3 py-2 font-semibold text-white transition hover:bg-amber-600"
                        >
                          Add to route
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

        <div className="space-y-6">
          <LocationSidePanel
            location={selected}
            nearbyWarning={nearbyWarning}
          />

          <div className="glow-card panel-ornament rounded-3xl p-6">
            <h3 className="text-2xl font-black text-white">Trip Planner</h3>
            <p className="mt-2 text-sm leading-7 text-white/65">
              Выбери точку A и точку B, а затем построй путь вручную или
              автоматически.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Point A
                </label>

                <div className="grid gap-3">
                  <select
                    value={startMode}
                    onChange={(e) =>
                      setStartMode(e.target.value as "user" | "location")
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                  >
                    <option value="user">My location</option>
                    <option value="location">Choose location</option>
                  </select>

                  {startMode === "location" && (
                    <select
                      value={startLocationId}
                      onChange={(e) => setStartLocationId(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                    >
                      <option value="">Select point A</option>
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
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Point B
                </label>

                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                >
                  <option value="">Select point B</option>
                  {mapLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white/80">
                    Stops on the way
                  </label>
                  <span className="text-xs text-white/45">
                    Click “Add to route” or use auto route
                  </span>
                </div>

                {routeStops.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/50">
                    No stops added yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routeStops.map((stop, index) => (
                      <div
                        key={stop.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {index + 1}. {stop.name}
                          </p>
                          <p className="text-xs text-white/50">{stop.kind}</p>
                        </div>

                        <button
                          onClick={() => removeStop(stop.id)}
                          className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={buildRoute}
                  className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-3 font-semibold text-amber-100 transition hover:bg-amber-500/20"
                >
                  Build manually
                </button>

                <button
                  onClick={autoBuildRoute}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Create route automatically
                </button>

                <button
                  onClick={clearRoute}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Clear
                </button>
              </div>

              {autoSuggestions.length > 0 && (
                <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
                  <h4 className="text-lg font-bold text-white">
                    Suggested cultural stops
                  </h4>
                  <div className="mt-3 space-y-2">
                    {autoSuggestions.map((stop) => (
                      <div
                        key={stop.id}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
                      >
                        {stop.name}{" "}
                        <span className="text-white/40">• {stop.kind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {routeBuilt && routePoints.length > 1 && (
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                  <h4 className="text-lg font-bold text-white">
                    Route summary
                  </h4>
                  <div className="mt-3 space-y-2 text-sm text-emerald-50">
                    <p>
                      <span className="font-semibold">Start:</span>{" "}
                      {getPointName(routePoints[0])}
                    </p>
                    <p>
                      <span className="font-semibold">Destination:</span>{" "}
                      {getPointName(routePoints[routePoints.length - 1])}
                    </p>
                    <p>
                      <span className="font-semibold">Stops:</span>{" "}
                      {routeStops.length}
                    </p>
                    <p>
                      <span className="font-semibold">Estimated distance:</span>{" "}
                      {formatDistance(totalDistance)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <PetroScanMock />
        <div className="col-start-2 col-end-4 h-full">
          <MySubmissions />
        </div>
      </div>
    </div>
  );
}
