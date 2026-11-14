// Reusable button component with gradient and outline variants
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Button({ children, variant = 'primary', size = 'lg', loading, className, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none';
  const variants = {
    primary: 'bg-gradient-crimson text-white shadow-crimson hover:brightness-105 rounded-2xl',
    outline: 'border border-border bg-white text-ink hover:border-primary/40 rounded-2xl',
    ghost:   'text-primary hover:bg-accent rounded-xl',
    ink:     'bg-ink text-white hover:opacity-90 rounded-2xl',
    danger:  'border border-primary/30 bg-white text-primary hover:bg-accent rounded-2xl',
  };
  const sizes = {
    lg: 'h-14 w-full px-5 text-[15px]',
    md: 'h-11 px-5 text-sm',
    sm: 'h-9 px-4 text-xs rounded-full',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
