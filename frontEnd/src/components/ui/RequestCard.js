// Blood request card for lists and discover
import { MapPin, Clock, Droplets } from 'lucide-react';
import { BloodGroupBadge } from './Badge';
import { cn } from '../../lib/utils';
import { ago, until } from '../../lib/yogdan/format';

const URGENCY = {
  critical: { label: 'Critical', cls: 'text-primary' },
  urgent:   { label: 'Urgent',   cls: 'text-warning' },
  planned:  { label: 'Planned',  cls: 'text-success' },
};

export function RequestCard({ request, onRespond, responded, className }) {
  const urg = URGENCY[request.urgency] ?? URGENCY.planned;
  return (
    <div className={cn('rounded-3xl border border-border bg-white p-4 shadow-card', className)}>
      <div className="flex items-start gap-3">
        <BloodGroupBadge group={request.bloodGroup} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-ink truncate">{request.hospital}</p>
            <span className={cn('shrink-0 text-xs font-bold', urg.cls)}>{urg.label}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{request.locality} · {request.distanceKm} km</span>
            <span className="flex items-center gap-1"><Droplets className="size-3" />{request.units} unit{request.units > 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" />needed {until(request.requiredBy)}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted">Posted {ago(request.createdAt)}</p>
        </div>
      </div>
      {onRespond && !request.mine && (
        <button
          type="button"
          disabled={responded}
          onClick={() => onRespond(request.id)}
          className={cn(
            'mt-3 w-full rounded-2xl py-2.5 text-sm font-bold transition-all',
            responded
              ? 'bg-success-soft text-success'
              : 'bg-gradient-crimson text-white shadow-crimson hover:brightness-105 active:scale-[0.98]',
          )}
        >
          {responded ? '✓ Response sent' : 'I can help'}
        </button>
      )}
    </div>
  );
}
