// Status and blood group badges
import { cn } from '../../lib/utils';

export function Badge({ children, tone = 'muted', className }) {
  const tones = {
    muted:    'bg-muted/10 text-muted',
    crimson:  'bg-gradient-crimson text-white',
    blush:    'bg-accent text-primary',
    success:  'bg-success-soft text-success',
    warning:  'bg-warning-soft text-warning',
    ink:      'bg-ink text-white',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', tones[tone], className)}>
      {children}
    </span>
  );
}

export function BloodGroupBadge({ group, size = 'md' }) {
  const isUnknown = group === 'Unknown';
  const sizes = { sm: 'size-10 rounded-xl text-sm', md: 'size-14 rounded-2xl text-lg', lg: 'size-20 rounded-3xl text-2xl' };
  return (
    <div className={cn('grid shrink-0 place-items-center font-bold tracking-tight', isUnknown ? 'border border-dashed border-primary/40 bg-accent text-primary' : 'bg-gradient-crimson text-white shadow-crimson', sizes[size])}>
      {isUnknown ? 'Unknown' : group}
    </div>
  );
}
