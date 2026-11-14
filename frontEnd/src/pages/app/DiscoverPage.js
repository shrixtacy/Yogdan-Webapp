// Discover — nearby blood requests, hospitals, filters
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, List } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { RequestCard } from '../../components/ui/RequestCard';
import { HospitalCard } from '../../components/ui/HospitalCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useStore } from '../../store/index';
import { BLOOD_GROUPS } from '../../lib/yogdan/types';
import { cn } from '../../lib/utils';

const DISTANCES = [5, 10, 20, 50];
const TABS = ['Requests', 'Hospitals'];

export default function DiscoverPage() {
  const { requests, hospitals, respondedRequestIds, respondToRequest } = useStore();
  const [tab, setTab] = useState('Requests');
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState(null);
  const [maxKm, setMaxKm] = useState(null);

  const openRequests = useMemo(
    () => requests.filter((r) => !r.mine && r.status === 'open')
      .filter((r) => !bloodGroup || r.bloodGroup === bloodGroup)
      .filter((r) => !maxKm || r.distanceKm <= maxKm)
      .filter((r) => !search || r.hospital?.toLowerCase().includes(search.toLowerCase()) || r.locality?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.distanceKm - b.distanceKm),
    [requests, bloodGroup, maxKm, search],
  );

  const filteredHospitals = useMemo(
    () => hospitals
      .filter((h) => !maxKm || h.distanceKm <= maxKm)
      .filter((h) => !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.area.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.distanceKm - b.distanceKm),
    [hospitals, maxKm, search],
  );

  return (
    <AppShell>
      <div className="shrink-0 px-5 pb-2 pt-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Discover</h1>
        <p className="mt-0.5 text-sm text-muted">Nearby requests and blood banks</p>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            placeholder="Search hospital or area…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control h-[52px] w-full pl-11 pr-4"
          />
        </div>

        {/* Filters row */}
        <div className="mt-3 flex flex-wrap gap-2">
          {/* Blood group filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <SlidersHorizontal className="size-3.5 shrink-0 text-muted" />
            {['All', ...BLOOD_GROUPS.filter((g) => g !== 'Unknown')].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setBloodGroup(g === 'All' ? null : g)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold shrink-0 transition-colors',
                  (g === 'All' && !bloodGroup) || bloodGroup === g
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-muted hover:border-primary/40',
                )}
              >{g}</button>
            ))}
          </div>
        </div>

        {/* Distance chips */}
        <div className="mt-2 flex gap-2">
          <MapPin className="size-3.5 shrink-0 text-muted mt-1" />
          {[null, ...DISTANCES].map((km) => (
            <button
              key={km ?? 'any'}
              type="button"
              onClick={() => setMaxKm(km)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold shrink-0 transition-colors',
                maxKm === km ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted hover:border-primary/40',
              )}
            >{km ? `≤ ${km} km` : 'Any distance'}</button>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 rounded-2xl bg-secondary p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 rounded-xl py-2 text-sm font-semibold transition-all',
                tab === t ? 'bg-white text-ink shadow-soft' : 'text-muted',
              )}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-3 space-y-3">
        {tab === 'Requests' && (
          openRequests.length === 0
            ? <EmptyState icon={<List className="size-7" />} title="No requests found" description="Try widening your filters." />
            : openRequests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                responded={respondedRequestIds.includes(r.id)}
                onRespond={respondToRequest}
              />
            ))
        )}
        {tab === 'Hospitals' && (
          filteredHospitals.length === 0
            ? <EmptyState icon={<MapPin className="size-7" />} title="No hospitals found" description="Try a wider distance." />
            : filteredHospitals.map((h) => <HospitalCard key={h.id} hospital={h} />)
        )}

        <p className="pb-2 text-center text-xs text-muted pt-4">
          Distances are approximate. Donor contact is never shared publicly.
        </p>
      </div>
      <BottomTabBar />
    </AppShell>
  );
}
