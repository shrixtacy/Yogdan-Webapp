// Home dashboard — donor identity, nearby requests, health overview, impact stats
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, MapPin, ChevronRight, Droplets, ArrowRight,
  Activity, CalendarCheck2, ShieldCheck, Trophy, Users, HeartPulse,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { Avatar } from '../../components/ui/Avatar';
import { BloodGroupBadge, Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { RequestCard } from '../../components/ui/RequestCard';
import { NearbyMap } from '../../components/common/NearbyMap';
import { useStore } from '../../store/index';
import { greeting, fmtDate } from '../../lib/yogdan/format';
import {
  isAssessmentDue, nextAssessmentDate, verifiedDonationCount,
  DONATION_MILESTONES, latestAssessment, shouldShowReminder,
} from '../../lib/yogdan/rules';

const FEELING = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'];
const FEELING_EMOJI = ['', '😞', '😕', '😐', '😊', '😄'];

// Assessment reminder modal — dismissible bottom sheet
function AssessmentReminder({ onStart, onSnooze, onSkip }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[440px] rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-phone animate-fade-up">
        <div className="mb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>
        <div className="mt-4 flex flex-col items-center text-center gap-2">
          <div className="grid size-14 place-items-center rounded-3xl bg-accent text-primary">
            <HeartPulse className="size-7" />
          </div>
          <h2 className="mt-2 text-xl font-bold text-ink">Time for your weekly check-in</h2>
          <p className="max-w-xs text-sm text-muted">It takes about a minute. Your records are private and informational only.</p>
        </div>
        <div className="mt-6 space-y-2">
          <Button onClick={onStart}>Start check-in</Button>
          <Button variant="outline" onClick={onSnooze}>Remind me later</Button>
          <button type="button" onClick={onSkip} className="w-full text-center text-sm text-muted py-2">
            Skip this week
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const {
    account, assessments, requests, donations, respondedRequestIds,
    notifications, updateProfile, snoozeReminder, skipReminderThisWeek, hospitals,
    setHospitals, respondToRequest, reminder,
  } = useStore();

  const [reminderDismissed, setReminderDismissed] = useState(false);

  if (!account) return null;

  const nearby = useMemo(
    () => requests.filter((r) => !r.mine && r.status === 'open')
      .sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3),
    [requests],
  );

  const unread = notifications.some((n) => !n.read);
  const due = isAssessmentDue(assessments, new Date());
  const nextDate = nextAssessmentDate(assessments);
  const last = latestAssessment(assessments);
  const verified = verifiedDonationCount(donations);
  const nextMilestone = DONATION_MILESTONES.find((m) => m > verified) ?? null;

  const showReminder = !reminderDismissed
    && shouldShowReminder(assessments, reminder, account.weeklyReminder !== false, new Date());

  return (
    <AppShell>
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28 pt-6">

        {/* Header */}
        <header className="flex items-center gap-3">
          <Link to="/profile"><Avatar name={account.name} size={48} /></Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{greeting()},</p>
            <h1 className="truncate text-xl font-bold tracking-tight text-ink">{account.name.split(' ')[0]}</h1>
            <p className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="size-3" />{account.locality}, {account.city}
            </p>
          </div>
          <Link to="/notifications" aria-label="Notifications"
            className="relative grid size-12 place-items-center rounded-full bg-[#191919] text-white shadow-soft">
            <Bell className="size-5" />
            {unread && <span className="absolute right-3 top-3 size-2.5 rounded-full border-2 border-white bg-primary" />}
          </Link>
        </header>

        {/* Section A — Donor identity */}
        <Card className="animate-fade-up">
          <div className="flex items-center gap-4">
            <Link to="/blood"><BloodGroupBadge group={account.bloodGroup} size="lg" /></Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-ink">Donor identity</p>
                <Badge tone={account.bloodVerification === 'verified' ? 'success' : 'muted'}>
                  {account.bloodVerification === 'verified' ? '✓' : '○'} {account.bloodVerification}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                Last donation: {account.lastDonationDate ? fmtDate(account.lastDonationDate) : 'Not recorded'}
              </p>
              {account.donorConsent ? (
                <div className="mt-3">
                  <Toggle
                    id="avail-toggle"
                    checked={account.available}
                    onChange={(v) => updateProfile({ available: v })}
                    label={account.available ? 'Available to donate' : 'Paused'}
                  />
                </div>
              ) : (
                <Link to="/blood"
                  className="mt-3 flex items-center justify-between rounded-2xl bg-secondary px-3 py-2 text-sm font-semibold text-ink">
                  Not discoverable as donor
                  <span className="flex items-center text-xs font-bold text-primary">
                    Opt in <ChevronRight className="size-4" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </Card>

        {/* Section B — Nearby map */}
        <NearbyMap requests={requests} hospitals={hospitals} onHospitalsLoaded={setHospitals} />

        {/* Section C — Request CTA */}
        <div className="relative min-h-[136px] shrink-0 overflow-hidden rounded-[24px] bg-[#191919] p-5 text-white shadow-card">
          <div className="absolute right-5 top-5 size-10 rounded-full bg-[#E63946]/20" />
          <div className="relative grid size-10 place-items-center rounded-xl bg-[#E63946]">
            <Droplets className="size-7 opacity-95" />
          </div>
          <p className="relative mt-3 text-[19px] font-extrabold leading-tight tracking-tight">Someone might need you today.</p>
          <p className="relative mt-1 max-w-[280px] text-xs leading-relaxed text-white/80">Request blood for yourself or someone in need.</p>
          <Link to="/request"
            className="relative mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-[#E63946] px-4 text-xs font-bold text-white transition-transform hover:brightness-110 active:scale-95">
            Request blood <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Section B — Health overview */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-bold tracking-tight text-ink">Health overview</h2>
            <Link to="/health" className="text-sm font-bold text-primary">
              {last ? 'View all' : 'History'}
            </Link>
          </div>
          {!last ? (
            <Card className="flex flex-col items-center py-8 text-center">
              <HeartPulse className="mb-3 size-10 text-primary" />
              <p className="font-semibold text-ink">No health records yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted">
                Complete a weekly check-in to start your private record.
              </p>
              <Link to="/health/assessment" className="mt-4">
                <Button size="sm">Start check-in</Button>
              </Link>
            </Card>
          ) : (
            <Link to="/health">
              <Card tone="glass" className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{FEELING_EMOJI[last.feeling] ?? '😐'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">
                      This week: {FEELING[last.feeling] ?? 'Recorded'}
                    </p>
                    <p className="text-xs text-muted">Checked in {fmtDate(last.date, 'd MMM')}</p>
                  </div>
                  <ChevronRight className="size-4 text-muted" />
                </div>
                {(last.bp || last.haemoglobin) && (
                  <div className="flex gap-4 border-t border-border/40 pt-3">
                    {last.bp && (
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">BP</p>
                        <p className="text-sm font-bold text-ink">{last.bp}</p>
                      </div>
                    )}
                    {last.haemoglobin && (
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">Hb</p>
                        <p className="text-sm font-bold text-ink">{last.haemoglobin} g/dL</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          )}
        </section>

        {/* Section D — Nearby requests */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-bold tracking-tight text-ink">Nearby requests</h2>
            <Link to="/discover" className="text-sm font-bold text-primary">See all</Link>
          </div>
          {nearby.length === 0 ? (
            <Card className="py-6 text-center">
              <p className="text-sm text-muted">No open requests near you right now</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {nearby.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  responded={respondedRequestIds.includes(r.id)}
                  onRespond={respondToRequest}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section E — Your impact */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-bold tracking-tight text-ink">Your impact</h2>
            <span className="text-xs font-semibold text-muted">Keep showing up</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <ShieldCheck className="size-4" />, value: verified, label: 'Verified donations' },
              { icon: <Trophy className="size-4" />, value: nextMilestone ? `${verified}/${nextMilestone}` : '★', label: 'Next milestone' },
              { icon: <Users className="size-4" />, value: respondedRequestIds.length, label: 'Community actions' },
            ].map(({ icon, value, label }) => (
              <Card key={label} className="p-3 text-center">
                <div className="mx-auto grid size-8 place-items-center rounded-xl bg-accent text-primary">{icon}</div>
                <p className="mt-2 text-lg font-bold text-ink">{value}</p>
                <p className="text-[10px] leading-tight text-muted">{label}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section F — Weekly assessment */}
        <Card tone="blush" className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-white text-primary">
            <CalendarCheck2 className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Weekly check-in</p>
            <p className="text-xs text-muted">
              {due
                ? 'Due now · about 1 minute'
                : nextDate
                  ? `Completed · next on ${fmtDate(nextDate.toISOString(), 'EEE, d MMM')}`
                  : 'Start your first check-in'}
            </p>
          </div>
          {due
            ? <Link to="/health/assessment"><Button size="sm">Start</Button></Link>
            : <Badge tone="success">Done ✓</Badge>}
        </Card>

      </div>
      <BottomTabBar />

      {/* Assessment reminder modal */}
      {showReminder && (
        <AssessmentReminder
          onStart={() => { setReminderDismissed(true); window.location.href = '/health/assessment'; }}
          onSnooze={() => { snoozeReminder(4); setReminderDismissed(true); }}
          onSkip={() => { skipReminderThisWeek(); setReminderDismissed(true); }}
        />
      )}
    </AppShell>
  );
}
