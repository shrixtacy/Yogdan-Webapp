// Form input with label, hint and error states
import { cn } from '../../lib/utils';

export function Input({ label, hint, error, id, className, trailing, ...props }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <label htmlFor={id} className="block text-[13px] font-bold tracking-[0.01em] text-ink">{label}</label>}
      <div className="group relative">
        <input
          id={id}
          className={cn(
            'h-[52px] w-full rounded-2xl border bg-white/90 px-4 text-[15px] font-medium text-ink shadow-soft outline-none transition-all placeholder:text-muted/80 hover:border-primary/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10',
            error ? 'border-primary bg-accent/20 focus:ring-primary/15' : 'border-border',
            trailing && 'pr-12',
          )}
          aria-invalid={!!error}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-3 flex items-center">{trailing}</div>}
      </div>
      {error  && <p className="text-xs font-semibold text-primary">{error}</p>}
      {!error && hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, hint, error, id, className, ...props }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <label htmlFor={id} className="block text-[13px] font-bold tracking-[0.01em] text-ink">{label}</label>}
      <textarea
        id={id}
        className={cn(
          'min-h-28 w-full resize-y rounded-2xl border bg-white/90 px-4 py-3 text-[15px] font-medium leading-relaxed text-ink shadow-soft outline-none transition-all placeholder:text-muted/80 hover:border-primary/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10',
          error ? 'border-primary bg-accent/20 focus:ring-primary/15' : 'border-border',
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs font-semibold text-primary">{error}</p>}
      {!error && hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
