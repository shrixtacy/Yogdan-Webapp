// Yellow demo/preview mode notice
import { FlaskConical } from 'lucide-react';

export function DemoNote({ children }) {
  return (
    <div className="flex gap-2 rounded-2xl border border-warning/30 bg-warning-soft/70 p-3 text-xs leading-relaxed text-ink">
      <FlaskConical className="mt-0.5 size-4 shrink-0 text-warning" />
      <div>{children}</div>
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
      <FlaskConical className="size-3" /> Demo
    </span>
  );
}
