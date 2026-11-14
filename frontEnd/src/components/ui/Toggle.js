// Accessible toggle switch
import { cn } from '../../lib/utils';

export function Toggle({ id, checked, onChange, label, description, disabled }) {
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start justify-between gap-4', disabled && 'opacity-50 pointer-events-none')}>
      <span>
        {label && <span className="block text-[15px] font-semibold text-ink">{label}</span>}
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          checked ? 'bg-gradient-crimson' : 'bg-border',
        )}
      >
        <span className={cn(
          'block size-4 rounded-full bg-white shadow-soft transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )} />
      </button>
    </label>
  );
}
