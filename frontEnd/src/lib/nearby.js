const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const EARTH_RADIUS_KM = 6371;

function distanceKm(from, to) {
  const latDelta = (to.lat - from.lat) * Math.PI / 180;
  const lonDelta = (to.lon - from.lon) * Math.PI / 180;
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.sin(lonDelta / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearbyHospitals({ latitude, longitude }, radiusMeters = 10000) {
  const radiusKm = radiusMeters / 1000;
  const latitudeDelta = radiusKm / 111;
  const longitudeDelta = radiusKm / (111 * Math.max(Math.cos(latitude * Math.PI / 180), 0.1));
  const viewbox = [
    longitude - longitudeDelta,
    latitude + latitudeDelta,
    longitude + longitudeDelta,
    latitude - latitudeDelta,
  ].join(',');
  const search = (params) => fetch(`${NOMINATIM_URL}?format=jsonv2&limit=50&viewbox=${viewbox}&bounded=1&${params}`)
    .then((response) => {
      if (!response.ok) throw new Error('Nearby hospital data is temporarily unavailable');
      return response.json();
    });
  const [hospitals, bloodBanks] = await Promise.all([
    search('amenity=hospital'),
    search('q=blood%20bank'),
  ]);

  return [...hospitals, ...bloodBanks]
    .map((place) => {
      const lat = Number(place.lat);
      const lon = Number(place.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const distance = distanceKm({ lat: latitude, lon: longitude }, { lat, lon });
      return {
        id: `osm-${place.osm_type}-${place.osm_id}`,
        name: place.display_name?.split(',')[0] || 'Unnamed healthcare facility',
        area: place.display_name?.split(',').slice(1, 3).join(',').trim() || 'Nearby',
        distanceKm: Math.round(distance * 10) / 10,
        bloodBank: bloodBanks.some((bloodBank) => bloodBank.osm_type === place.osm_type && bloodBank.osm_id === place.osm_id),
        open24h: false,
        latitude: lat,
        longitude: lon,
        source: 'OpenStreetMap',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .filter((place, index, places) => places.findIndex((item) => item.name === place.name) === index)
    .slice(0, 30);
}

export function mapUrl({ latitude, longitude }) {
  const delta = 0.1;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}
