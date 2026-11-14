// Styled checkbox with label
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Checkbox({ id, checked, onChange, children, error }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <button
          id={id}
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={cn(
            'mt-0.5 grid size-5 shrink-0 place-items-center rounded border-2 transition-colors',
            checked ? 'border-primary bg-primary text-white' : 'border-border bg-white',
          )}
        >
          {checked && <Check className="size-3 stroke-[3]" />}
        </button>
        <span className="text-sm leading-relaxed text-ink">{children}</span>
      </label>
      {error && <p className="mt-1.5 ml-8 text-xs font-semibold text-primary">{error}</p>}
    </div>
  );
}
