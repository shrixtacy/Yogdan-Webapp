// Vertical activity timeline
import { cn } from '../../lib/utils';

export function Timeline({ items }) {
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="flex gap-4 pb-6 last:pb-0">
          {/* Spine */}
          <div className="flex flex-col items-center">
            <div className={cn('grid size-9 shrink-0 place-items-center rounded-xl', item.iconBg ?? 'bg-accent text-primary')}>
              {item.icon}
            </div>
            {i < items.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
          </div>
          {/* Content */}
          <div className="flex-1 pt-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-ink leading-snug">{item.title}</p>
              <span className="shrink-0 text-[11px] text-muted">{item.time}</span>
            </div>
            {item.description && <p className="mt-0.5 text-xs text-muted">{item.description}</p>}
            {item.badge && <div className="mt-1.5">{item.badge}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
