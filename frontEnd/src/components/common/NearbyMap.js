import { useMemo, useState } from 'react';
import { Crosshair, Droplets, Hospital, MapPin, Navigation, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { findNearbyHospitals, mapUrl } from '../../lib/nearby';

function markerPosition(item, index, coordinates) {
  if (coordinates && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)) {
    const delta = 0.1;
    const left = ((item.longitude - (coordinates.longitude - delta)) / (2 * delta)) * 100;
    const top = ((coordinates.latitude + delta - item.latitude) / (2 * delta)) * 100;
    return {
      left: `${Math.max(5, Math.min(95, left))}%`,
      top: `${Math.max(5, Math.min(88, top))}%`,
    };
  }
  const seed = item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), index * 17);
  const angle = (seed % 360) * (Math.PI / 180);
  const radius = Math.min(37, 13 + (item.distanceKm ?? 4) * 1.15);
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius * 0.72}%`,
  };
}

export function NearbyMap({ requests, hospitals, onHospitalsLoaded }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationLabel, setLocationLabel] = useState('Using approximate area');
  const [coordinates, setCoordinates] = useState(null);
  const [liveHospitals, setLiveHospitals] = useState([]);
  const [lookupError, setLookupError] = useState('');

  const displayedHospitals = coordinates ? liveHospitals : hospitals;
  const places = useMemo(() => [
    ...(filter !== 'hospitals' ? requests.filter((request) => request.status === 'open').map((request) => ({ ...request, kind: 'request', label: 'Blood request' })) : []),
    ...(filter !== 'requests' ? displayedHospitals.map((hospital) => ({ ...hospital, kind: 'hospital', label: hospital.bloodBank ? 'Hospital · Blood bank' : 'Hospital' })) : []),
  ], [displayedHospitals, filter, requests]);

  function locate() {
    if (!navigator.geolocation) {
      setLocationLabel('Location unavailable · showing nearby sample data');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const nextCoordinates = { latitude: coords.latitude, longitude: coords.longitude };
        setCoordinates(nextCoordinates);
        setLocationLabel('Live location · nearby data from OpenStreetMap');
        setLookupError('');
        try {
          const nextHospitals = await findNearbyHospitals(nextCoordinates);
          setLiveHospitals(nextHospitals);
          onHospitalsLoaded?.(nextHospitals);
        } catch (error) {
          setLiveHospitals([]);
          setLookupError(error.message);
        } finally {
          setLocating(false);
        }
      },
      () => { setLocationLabel('Permission unavailable · using approximate area'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-ink">Nearby care</h2>
          <p className="text-xs text-muted">{locationLabel}</p>
        </div>
        <button type="button" onClick={locate} disabled={locating} className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
          <Crosshair className={cn('size-3.5', locating && 'animate-spin')} /> {locating ? 'Locating' : 'Use my location'}
        </button>
      </div>

      <div className="relative h-[260px] overflow-hidden rounded-[28px] border border-white/80 bg-[#f7e9e7] shadow-card">
        {coordinates ? (
          <iframe title="Live nearby map" src={mapUrl(coordinates)} className="absolute inset-0 h-full w-full border-0" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(28deg, transparent 47%, rgba(255,255,255,.9) 48%, transparent 50%), linear-gradient(112deg, transparent 47%, rgba(255,255,255,.9) 48%, transparent 50%), linear-gradient(rgba(220,180,177,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(220,180,177,.32) 1px, transparent 1px)', backgroundSize: '100% 100%, 100% 100%, 42px 42px, 42px 42px' }} />
            <div className="absolute left-[18%] top-[22%] h-28 w-44 rotate-12 rounded-[45%] bg-[#e6f0df]/80" />
            <div className="absolute bottom-[10%] right-[8%] h-32 w-48 -rotate-12 rounded-[45%] bg-[#e6f0df]/70" />
          </>
        )}
        <div className="absolute left-1/2 top-1/2 z-10 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-ink text-white shadow-lg">
          <Navigation className="size-4 fill-current" />
        </div>
        {places.map((place, index) => (
          <button key={`${place.kind}-${place.id}`} type="button" aria-label={`${place.label}: ${place.hospital ?? place.name ?? place.patientName}`} onClick={() => setSelected(place)} className={cn('absolute z-20 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-white shadow-md transition-transform hover:scale-110', place.kind === 'request' ? 'bg-primary' : 'bg-[#2f6d5a]')} style={markerPosition(place, index, coordinates)}>
            {place.kind === 'request' ? <Droplets className="size-4" /> : <Hospital className="size-4" />}
          </button>
        ))}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex gap-1 rounded-2xl border border-white/70 bg-white/85 p-1 backdrop-blur">
          {[['all', 'All'], ['requests', 'Blood requests'], ['hospitals', 'Hospitals']].map(([value, label]) => (
            <button key={value} type="button" onClick={() => { setFilter(value); setSelected(null); }} className={cn('flex-1 rounded-xl px-2 py-2 text-[10px] font-bold', filter === value ? 'bg-ink text-white' : 'text-muted')}>{label}</button>
          ))}
        </div>
      </div>
      {lookupError && <p className="text-xs text-primary">{lookupError}. You can retry from the map.</p>}
      {coordinates && !locating && !lookupError && liveHospitals.length === 0 && (
        <p className="text-xs text-muted">No hospitals or blood banks were listed within 10 km of this location.</p>
      )}

      {selected && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-soft">
          <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl text-white', selected.kind === 'request' ? 'bg-primary' : 'bg-[#2f6d5a]')}>
            {selected.kind === 'request' ? <Droplets className="size-4" /> : <Hospital className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{selected.hospital ?? selected.name ?? selected.patientName}</p>
            <p className="flex items-center gap-1 text-xs text-muted"><MapPin className="size-3" />{selected.locality ?? selected.area} · {selected.distanceKm} km</p>
          </div>
          <button type="button" onClick={() => setSelected(null)} aria-label="Close location details"><X className="size-4 text-muted" /></button>
          {selected.kind === 'request' && <Link to="/discover" className="text-xs font-bold text-primary">View</Link>}
        </div>
      )}
    </section>
  );
}
