// My blood requests — list, track, cancel
import { Link } from 'react-router-dom';
import { Plus, Droplets } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { useStore } from '../../store/index';
import { ago, until, fmtDate } from '../../lib/yogdan/format';
import { MATCH_STAGES } from '../../lib/yogdan/matching';
import { cn } from '../../lib/utils';

const URGENCY_COLOR = { critical: 'text-primary', urgent: 'text-warning', planned: 'text-success' };

export default function RequestsPage() {
  const { requests, cancelRequest } = useStore();
  const mine = requests.filter((r) => r.mine).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function handleCancel(id) {
    if (!window.confirm('Cancel this request?')) return;
    cancelRequest(id).catch((error) => window.alert(error.message));
  }

  return (
    <AppShell>
      <ScreenHeader
        title="My Requests"
        back="/"
        right={
          <Link to="/request" className="grid size-9 place-items-center rounded-full bg-gradient-crimson text-white shadow-crimson">
            <Plus className="size-4" />
          </Link>
        }
      />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-28 space-y-4">
        {mine.length === 0 ? (
          <EmptyState
            icon={<Droplets className="size-7" />}
            title="No requests yet"
            description="Create a blood request for yourself or someone in need."
            action={<Link to="/request"><Button size="sm">Create a request</Button></Link>}
          />
        ) : (
          mine.map((r) => (
            <Card key={r.id} className="space-y-4">
              {/* Top row */}
              <div className="flex items-start gap-3">
                <BloodGroupBadge group={r.bloodGroup} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-ink">{r.hospital}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className={cn('mt-0.5 text-xs font-bold', URGENCY_COLOR[r.urgency])}>
                    {r.urgency.charAt(0).toUpperCase() + r.urgency.slice(1)} · {r.units} unit{r.units > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted">
                    Needed {until(r.requiredBy)} · Posted {ago(r.createdAt)}
                  </p>
                </div>
              </div>

              {/* Matching progress */}
              {r.status === 'open' && (
                <div className="rounded-2xl bg-secondary/60 p-3">
                  <p className="mb-2 text-xs font-bold text-ink">
                    Matching stage {r.matchStage + 1}: {MATCH_STAGES[r.matchStage]?.label ?? 'Starting'}
                  </p>
                  <div className="flex gap-1.5">
                    {MATCH_STAGES.map((s, i) => (
                      <div key={i} className={cn('h-1.5 flex-1 rounded-full',
                        i <= r.matchStage ? 'bg-gradient-crimson' : 'bg-border')} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {r.notifiedDonorIds?.length ?? 0} donor{r.notifiedDonorIds?.length !== 1 ? 's' : ''} notified so far
                  </p>
                </div>
              )}

              {/* Responses */}
              {r.responses?.length > 0 && (
                <div className="rounded-2xl bg-success-soft/60 p-3 text-xs text-success font-semibold">
                  {r.responses.length} donor{r.responses.length > 1 ? 's' : ''} responded — coordinate through the hospital
                </div>
              )}

              {/* Cancel */}
              {r.status === 'open' && (
                <button type="button" onClick={() => handleCancel(r.id)}
                  className="w-full rounded-2xl border border-primary/20 py-2.5 text-sm font-semibold text-primary hover:bg-accent transition-colors">
                  Cancel request
                </button>
              )}
            </Card>
          ))
        )}
      </div>
      <BottomTabBar />
    </AppShell>
  );
}
