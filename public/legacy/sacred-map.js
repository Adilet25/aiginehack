import { placePoints } from './experience.js';

export const atlasCopy = {
  ru: { title: 'Карта Кыргызстана', itinerary: 'На автомобиле', unavailable: 'Дорожные данные недоступны.', mapUnavailable: 'Карта не загрузилась. Выберите место в списке.', all: 'Вся карта', route: 'Показать маршрут', edit: 'Исправить карту', approach: 'Абшыр-Ата · маршрут до подъезда', north: 'С', hour: 'ч', minute: 'мин', labels: ['Бишкек', 'Ош', 'Нарын', 'Иссык-Куль', 'Токтогульское вдхр.'] },
  ky: { title: 'Кыргызстандын картасы', itinerary: 'Унаа менен', unavailable: 'Жол маалыматы жеткиликсиз.', mapUnavailable: 'Карта жүктөлгөн жок. Тизмеден жерди тандаңыз.', all: 'Толук карта', route: 'Багытты көрсөтүү', edit: 'Картаны оңдоо', approach: 'Абшыр-Ата · унаа жолу кире беришке чейин', north: 'Т', hour: 'саат', minute: 'мүн', labels: ['Бишкек', 'Ош', 'Нарын', 'Ысык-Көл', 'Токтогул суу сактагычы'] },
  en: { title: 'Map of Kyrgyzstan', itinerary: 'By car', unavailable: 'Road data is unavailable.', mapUnavailable: 'The map could not load. Choose a place from the list.', all: 'Full map', route: 'Show route', edit: 'Improve the map', approach: 'Abshyr-Ata · driving route ends at the access point', north: 'N', hour: 'h', minute: 'min', labels: ['Bishkek', 'Osh', 'Naryn', 'Issyk-Kul', 'Toktogul Reservoir'] },
};

function readAtlasFile(name) {
  return fetch(new URL('./assets/atlas-' + name + '.json', import.meta.url)).then(response => {
    if (!response.ok) throw new Error('Atlas asset not available');
    return response.json();
  });
}

let roads;
export function loadRoads() {
  roads ??= readAtlasFile('roads').then(data => data.routes).catch(error => {
    roads = undefined;
    throw error;
  });
  return roads;
}

let geography;
let leaflet;
function loadLeaflet() {
  leaflet ??= import('./vendor/leaflet/leaflet.js').then(() => globalThis.L);
  return leaflet;
}

export function roadLegs(stops, routes) {
  if (!routes || stops.length < 2) return [];
  const legs = stops.slice(1).map((stop, index) => routes[stops[index] + '-' + stop]);
  return legs.every(Boolean) ? legs : [];
}

function decodeRoad(encoded) {
  let index = 0;
  let lat = 0;
  let lng = 0;
  function readDelta() {
    let result = 0;
    let shift = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 31) << shift;
      shift += 5;
    } while (byte >= 32);
    return result & 1 ? ~(result >> 1) : result >> 1;
  }
  const path = [];
  while (index < encoded.length) {
    lat += readDelta();
    lng += readDelta();
    path.push([lat / 1e6, lng / 1e6]);
  }
  return path;
}

const atlasBounds = [[39.2, 69.1], [43.35, 80.3]];
const labels = [[42.8746, 74.5698], [40.438, 72.97], [41.4287, 75.9911], [42.47, 77.25], [41.75, 73.2]];

export async function mountSacredMap(frame, names, copy, choose, motion) {
  geography ??= readAtlasFile('geography').catch(error => {
    geography = undefined;
    throw error;
  });
  const [L, mapData] = await Promise.all([loadLeaflet(), geography]);
  if (!frame.isConnected || frame.closest('[hidden]')) return;
  const canvas = frame.querySelector('.atlas-map');
  const map = L.map(canvas, {
    attributionControl: false, zoomControl: false, scrollWheelZoom: false,
    minZoom: 4, maxZoom: 17, zoomSnap: .25, zoomDelta: 1,
    maxBounds: [[34, 61], [48, 87]], maxBoundsViscosity: .9,
    zoomAnimation: !motion,
  });
  map.createPane('paperGeography').style.zIndex = 205;
  map.createPane('streetDetail').style.zIndex = 215;
  map.createPane('paperGrid').style.zIndex = 220;
  L.geoJSON(mapData, {
    pane: 'paperGeography', interactive: false,
    style: ({ properties }) => {
      if (properties.water) return { color: '#757e67', weight: 1.3, fillColor: '#9ca58b', fillOpacity: .9 };
      if (properties.name === 'Kyrgyzstan') {
        return { color: '#775332', weight: 1.7, dashArray: '5 3', fillColor: '#f3deb0', fillOpacity: .7 };
      }
      return { color: '#9c794e', weight: .95, fillColor: '#be955d', fillOpacity: .19 };
    },
  }).addTo(map);
  const sheet = L.layerGroup().addTo(map);
  const grid = { pane: 'paperGrid', weight: 1, color: '#865d32', opacity: .23, dashArray: '2 5', interactive: false };
  for (let longitude = 66; longitude <= 83; longitude += 2) {
    L.polyline([[36, longitude], [46, longitude]], grid).addTo(sheet);
  }
  for (let latitude = 36; latitude <= 46; latitude++) {
    L.polyline([[latitude, 65], [latitude, 85]], grid).addTo(sheet);
  }
  labels.forEach((latLng, i) => {
    L.tooltip({ permanent: true, direction: 'center', className: 'atlas-geographic-label ' + (i > 2 ? 'atlas-water-label' : '') })
      .setLatLng(latLng).setContent(copy.labels[i]).addTo(sheet);
  });
  const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    pane: 'streetDetail', maxNativeZoom: 19, noWrap: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
  });

  function updateDetail() {
    if (map.getZoom() >= 8) {
      streets.addTo(map);
      return;
    }
    streets.remove();
    frame.removeAttribute('data-streets');
    if (!map.hasLayer(sheet)) sheet.addTo(map);
  }

  streets.on('tileload', () => {
    if (!map.hasLayer(streets)) return;
    frame.dataset.streets = 'true';
    sheet.remove();
  });
  map.on('zoomend', updateDetail);
  L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 85 }).addTo(map);

  const routeLayer = L.layerGroup().addTo(map);
  const markers = placePoints.map(({ lat, lng }, index) => {
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({ className: 'atlas-marker', html: '<span class="atlas-pin"></span>', iconSize: [36, 36], iconAnchor: [18, 18] }),
    });
    marker.on('add', () => marker.getElement().setAttribute('aria-label', names[index]));
    marker.bindTooltip(names[index], {
      permanent: true, direction: index === 2 ? 'left' : 'right',
      offset: [index === 2 ? -13 : 13, 0], className: 'atlas-place-label',
    });
    marker.on('click', () => choose(index));
    return marker.addTo(map);
  });

  let routeBounds;
  let fitMode = 'all';
  function fitView() {
    if (!fitMode) return;
    const bounds = fitMode === 'route' ? routeBounds : atlasBounds;
    if (!bounds) return;
    const inset = fitMode === 'all' ? 24 : map.getSize().x > 560 ? 76 : 48;
    map.fitBounds(bounds, {
      animate: false, paddingTopLeft: [inset, 78], paddingBottomRight: [inset, 65], maxZoom: 10,
    });
  }
  function updateLabelSides() {
    markers.forEach((marker, index) => {
      const x = map.latLngToContainerPoint(marker.getLatLng()).x;
      const left = x >= map.getSize().x - 135 || (index === 2 && x > 135);
      const side = left ? 'left' : 'right';
      const tooltip = marker.getTooltip();
      if (tooltip.options.direction === side) return;
      tooltip.options.direction = side;
      tooltip.options.offset = L.point(left ? -13 : 13, 0);
      tooltip.update();
    });
  }
  map.on('moveend', updateLabelSides);
  map.on('dragstart', () => { fitMode = undefined; });
  const showRoute = frame.querySelector('[data-map-command="route"]');
  function setStops(stops, legs, selected, focusRoute) {
    markers.forEach((marker, index) => {
      const pin = marker.getElement();
      const order = stops.indexOf(index);
      pin.querySelector('.atlas-pin').textContent = order < 0 ? '✦' : order + 1;
      pin.dataset.inRoute = String(order >= 0);
      pin.dataset.selected = String(selected === index);
      pin.setAttribute('aria-pressed', String(selected === index));
    });
    const key = legs.length ? stops.join(',') : '';
    if (showRoute.dataset.stops !== key) {
      showRoute.dataset.stops = key;
      routeLayer.clearLayers();
      const paths = legs.map(leg => decodeRoad(leg.geometry));
      for (const path of paths) {
        L.polyline(path, { weight: 6, color: '#f5dfaa', opacity: .9, interactive: false }).addTo(routeLayer);
        L.polyline(path, { weight: 3, color: '#882f25', dashArray: '5 4', interactive: false }).addTo(routeLayer);
        for (const endpoint of [path[0], path.at(-1)]) {
          L.circleMarker(endpoint, { radius: 3, color: '#882f25', fillColor: '#f5dfaa', weight: 1.5, fillOpacity: 1, interactive: false }).addTo(routeLayer);
        }
      }
      routeBounds = paths.length ? L.latLngBounds(paths.flat()) : undefined;
      showRoute.disabled = !routeBounds;
      if (!routeBounds && fitMode === 'route') {
        fitMode = 'all';
        fitView();
      }
    }
    if (focusRoute && routeBounds) {
      fitMode = 'route';
      fitView();
    }
  }

  function handleControls(event) {
    const command = event.target.closest('[data-map-command]')?.dataset.mapCommand;
    if (!command) return;
    if (command === 'out' || command === 'in') fitMode = undefined;
    if (command === 'out') map.zoomOut();
    if (command === 'in') map.zoomIn();
    if (command === 'all' || (command === 'route' && routeBounds)) {
      fitMode = command;
      map.invalidateSize({ pan: false });
      fitView();
    }
  }

  frame.addEventListener('click', handleControls);
  const resize = new ResizeObserver(() => {
    map.invalidateSize({ pan: false });
    fitView();
  });
  resize.observe(canvas);
  fitView();
  return {
    setStops,
    dispose() {
      resize.disconnect();
      frame.removeEventListener('click', handleControls);
      map.remove();
    },
  };
}
