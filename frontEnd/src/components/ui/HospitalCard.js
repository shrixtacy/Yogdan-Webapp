// Hospital list card
import { MapPin, Droplets, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function HospitalCard({ hospital, className }) {
  return (
    <div className={cn('rounded-3xl border border-border bg-white p-4 shadow-card', className)}>
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
          <Droplets className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{hospital.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
            <MapPin className="size-3" />{hospital.area} · {hospital.distanceKm} km
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hospital.bloodBank && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-primary">Blood bank</span>
            )}
            {hospital.open24h && (
              <span className="flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
                <Clock className="size-2.5" /> 24h
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
