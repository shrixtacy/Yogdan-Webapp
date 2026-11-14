// Blood group selection grid used in onboarding
import { cn } from '../../lib/utils';

const KNOWN = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function BloodGroupPicker({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {KNOWN.map((group) => (
          <button
            key={group} type="button"
            onClick={() => onChange(group)}
            className={cn('rounded-2xl border py-3 text-sm font-bold transition-all', value === group ? 'border-primary/60 bg-gradient-crimson text-white shadow-crimson' : 'border-border bg-white text-ink hover:border-primary/30')}
          >
            {group}
          </button>
        ))}
      </div>
      <button
        type="button" onClick={() => onChange('Unknown')}
        className={cn('w-full rounded-2xl border py-3 text-sm font-semibold transition-all', value === 'Unknown' ? 'border-primary/60 bg-accent text-primary' : 'border-border bg-white text-ink hover:border-primary/30')}
      >
        I don't know yet
      </button>
    </div>
  );
}
