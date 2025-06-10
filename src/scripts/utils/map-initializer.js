import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
   iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export function initMap(mapId, center = [-6.2, 106.8], zoom = 5) {
  const container = L.DomUtil.get(mapId);

  if (container._leaflet_id) {
    container._leaflet_id = null;
  }

  const map = L.map(mapId).setView(center, zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  return map;
}

export function addMarkers(map, stories) {
  const markers = [];

  stories.forEach((story) => {
    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`<strong>${story.name || 'Lokasi'}</strong><br>${story.description || ''}`);
      markers.push(marker);
    }
  });

  return markers;
}

