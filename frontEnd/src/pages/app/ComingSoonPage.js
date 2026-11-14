// Generic coming soon placeholder for unbuilt sections
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { cn } from '../../lib/utils';

export default function ComingSoonPage({ title, tabs = false, back = false }) {
  return (
    <AppShell>
      {(title || back !== false) && <ScreenHeader title={title} back={back} />}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <div className="grid size-16 place-items-center rounded-3xl bg-accent text-primary">
          <span className="text-2xl">🔧</span>
        </div>
        <h2 className="text-xl font-bold text-ink">{title ?? 'Coming soon'}</h2>
        <p className="max-w-xs text-sm text-muted">This section is under construction. Check back soon.</p>
      </div>
      {tabs && <BottomTabBar />}
    </AppShell>
  );
}
