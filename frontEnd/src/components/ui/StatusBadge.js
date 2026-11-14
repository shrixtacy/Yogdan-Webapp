// Verification / status badge with dot indicator
import { cn } from '../../lib/utils';

const TONES = {
  verified:  { dot: 'bg-success', label: 'text-success', bg: 'bg-success-soft' },
  pending:   { dot: 'bg-warning', label: 'text-warning', bg: 'bg-warning-soft' },
  rejected:  { dot: 'bg-primary', label: 'text-primary', bg: 'bg-accent' },
  unverified:{ dot: 'bg-muted',   label: 'text-muted',   bg: 'bg-secondary' },
  open:      { dot: 'bg-primary', label: 'text-primary', bg: 'bg-accent' },
  fulfilled: { dot: 'bg-success', label: 'text-success', bg: 'bg-success-soft' },
  cancelled: { dot: 'bg-muted',   label: 'text-muted',   bg: 'bg-secondary' },
  expired:   { dot: 'bg-muted',   label: 'text-muted',   bg: 'bg-secondary' },
};

export function StatusBadge({ status, label }) {
  const t = TONES[status] ?? TONES.unverified;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', t.bg, t.label)}>
      <span className={cn('size-1.5 rounded-full', t.dot)} />
      {label ?? status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
