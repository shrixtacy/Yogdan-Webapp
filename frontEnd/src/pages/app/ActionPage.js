import { Link } from 'react-router-dom';
import {
  Ambulance, CalendarPlus, Clock3, Droplets, Hospital, MapPin,
  Pill, ShieldAlert, Stethoscope, ChevronRight,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/index';

const ACTIONS = [
  { label: 'Request blood', description: 'Find donors for a patient', icon: Droplets, to: '/request', tone: 'bg-accent text-primary' },
  { label: 'Emergency SOS', description: 'Save an emergency incident locally', icon: ShieldAlert, kind: 'Emergency SOS', tone: 'bg-primary text-white' },
  { label: 'Find hospitals nearby', description: 'Browse hospitals and blood banks', icon: Hospital, to: '/discover', tone: 'bg-secondary text-ink' },
  { label: 'Find medical shops', description: 'Pharmacy discovery is coming next', icon: Pill, kind: 'Medical shop search', tone: 'bg-secondary text-ink' },
  { label: 'Book appointment', description: 'Keep upcoming care in one place', icon: CalendarPlus, kind: 'Appointment booking', tone: 'bg-secondary text-ink' },
];

export default function ActionPage() {
  const { actionHistory = [], addAction } = useStore();

  function record(kind) {
    addAction({ kind, status: 'saved locally' });
  }

  return (
    <AppShell>
      <ScreenHeader title="Action Hub" back={false} />
      <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-28">
        <Card className="border-0 bg-[#191919] text-white">
          <div className="flex items-start gap-3">
            <Ambulance className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
            <div>
              <p className="font-semibold text-white">What do you need today?</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">Choose an action. Your activity is kept in this device's history.</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {ACTIONS.map(({ label, description, icon: Icon, to, kind, tone }) => {
            const content = (
              <>
                <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tone}`}><Icon className="size-5" /></span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-semibold text-ink">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{description}</span>
                </span>
                <ChevronRight className="size-5 text-muted" />
              </>
            );
            return to
              ? <Link key={label} to={to} onClick={() => record(label)}><Card className="flex items-center gap-3 transition-colors hover:border-[#E63946]/40">{content}</Card></Link>
              : <button key={label} type="button" onClick={() => record(kind)} className="w-full text-left"><Card className="flex items-center gap-3 transition-colors hover:border-[#E63946]/40">{content}</Card></button>;
          })}
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Clock3 className="size-4 text-primary" />
            <h2 className="font-bold text-ink">Action history</h2>
          </div>
          {actionHistory.length === 0 ? (
            <Card className="py-6 text-center text-sm text-muted">Your requests, bookings, and saved actions will appear here.</Card>
          ) : (
            <div className="space-y-2">
              {actionHistory.slice(0, 10).map((action) => (
                <Card key={action.id} className="flex items-center gap-3 p-3">
                  <MapPin className="size-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{action.kind}</p>
                    <p className="text-xs text-muted">{new Date(action.createdAt).toLocaleString()} · {action.status}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomTabBar />
    </AppShell>
  );
}
