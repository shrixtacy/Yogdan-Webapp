// Activity & donation history timeline
import { useState } from 'react';
import { Droplets, HeartPulse, Trophy, Users, ShieldCheck, FileText } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Timeline } from '../../components/ui/Timeline';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/index';
import { ago } from '../../lib/yogdan/format';
import { cn } from '../../lib/utils';

const FILTERS = ['All', 'Requests', 'Donations', 'Assessments'];

export default function ActivityPage() {
  const { requests, donations, assessments, respondedRequestIds } = useStore();
  const [filter, setFilter] = useState('All');

  // Build timeline items
  const items = [];

  requests.filter((r) => r.mine).forEach((r) => {
    if (filter === 'All' || filter === 'Requests') {
      items.push({
        id: `req-${r.id}`,
        icon: <Droplets className="size-4" />,
        iconBg: 'bg-accent text-primary',
        title: `Request: ${r.bloodGroup} · ${r.hospital}`,
        description: `${r.units} unit${r.units > 1 ? 's' : ''} · ${r.urgency}`,
        time: ago(r.createdAt),
        badge: <StatusBadge status={r.status} />,
        date: r.createdAt,
      });
    }
  });

  respondedRequestIds.forEach((id, i) => {
    if (filter === 'All' || filter === 'Requests') {
      const req = requests.find((r) => r.id === id);
      items.push({
        id: `resp-${id}`,
        icon: <Users className="size-4" />,
        iconBg: 'bg-success-soft text-success',
        title: `Responded to a ${req?.bloodGroup ?? ''} request`,
        description: req ? `${req.hospital} · ${req.locality}` : '',
        time: req ? ago(req.createdAt) : '',
        date: req?.createdAt ?? new Date(Date.now() - i * 3600000).toISOString(),
      });
    }
  });

  donations.forEach((d) => {
    if (filter === 'All' || filter === 'Donations') {
      items.push({
        id: `don-${d.id}`,
        icon: d.status === 'verified' ? <ShieldCheck className="size-4" /> : <FileText className="size-4" />,
        iconBg: d.status === 'verified' ? 'bg-success-soft text-success' : 'bg-accent text-primary',
        title: d.status === 'verified' ? 'Donation verified' : 'Donation proof submitted',
        description: d.hospital ?? '',
        time: ago(d.submittedAt),
        badge: <StatusBadge status={d.status} />,
        date: d.submittedAt,
      });
    }
  });

  assessments.forEach((a) => {
    if (filter === 'All' || filter === 'Assessments') {
      items.push({
        id: `as-${a.id}`,
        icon: <HeartPulse className="size-4" />,
        iconBg: 'bg-secondary text-muted',
        title: 'Weekly check-in completed',
        description: a.feeling ? `Feeling: ${['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'][a.feeling]}` : '',
        time: ago(a.date),
        date: a.date,
      });
    }
  });

  // Sort by date descending
  items.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell>
      <ScreenHeader title="Activity" back="/profile" />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3 shrink-0">
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={cn('rounded-full border px-4 py-1.5 text-xs font-semibold shrink-0 transition-colors',
              filter === f ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted hover:border-primary/40')}>
            {f}
          </button>
        ))}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<Trophy className="size-6" />}
            title="No activity yet"
            description="Your requests, donations, and check-ins will appear here."
            action={<Link to="/request"><Button size="sm">Create a request</Button></Link>}
          />
        ) : (
          <Timeline items={items} />
        )}
      </div>
    </AppShell>
  );
}
