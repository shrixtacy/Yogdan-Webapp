// Empty state illustration with message and optional action
import { cn } from '../../lib/utils';

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center py-10 text-center', className)}>
      {icon && (
        <div className="mb-4 grid size-16 place-items-center rounded-3xl bg-accent text-primary">
          {icon}
        </div>
      )}
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
