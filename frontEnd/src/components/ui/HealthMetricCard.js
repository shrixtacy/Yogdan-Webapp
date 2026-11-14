// Health metric summary card with mini sparkline
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

function MiniChart({ values, color }) {
  if (!values || values.length < 2) return null;
  const h = 32;
  const w = 80;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color ?? '#B51F2B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HealthMetricCard({ label, value, unit, values, trend, lastDate, color, className }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  return (
    <div className={cn('rounded-3xl border border-border bg-white p-4 shadow-card', className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">
            {value} <span className="text-sm font-normal text-muted">{unit}</span>
          </p>
          {lastDate && <p className="mt-0.5 text-[11px] text-muted">{lastDate}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {trend && (
            <span className={cn('flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              trend === 'up' ? 'bg-success-soft text-success' : trend === 'down' ? 'bg-accent text-primary' : 'bg-secondary text-muted')}>
              <TrendIcon className="size-3" />
            </span>
          )}
          {values && <MiniChart values={values} color={color} />}
        </div>
      </div>
    </div>
  );
}
