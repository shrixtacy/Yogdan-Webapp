// Profile — full dashboard with all sections
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Trash2, Bell, Shield, Droplets, ChevronRight,
  MapPin, HeartPulse, FileText, Trophy, Users, Activity,
  Settings, HelpCircle, Info,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Avatar } from '../../components/ui/Avatar';
import { BloodGroupBadge, Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AchievementBadge } from '../../components/ui/AchievementBadge';
import { useStore } from '../../store/index';
import { verifiedDonationCount, DONATION_MILESTONES } from '../../lib/yogdan/rules';

function SettingsRow({ icon, label, to, onClick, destructive }) {
  const cls = `flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#f5f5f3] ${destructive ? 'text-[#E63946]' : 'text-[#191919]'}`;
  const inner = (
    <>
      <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${destructive ? 'bg-[#fcebed] text-[#E63946]' : 'bg-[#f5f5f3] text-[#191919]'}`}>{icon}</span>
      <span className="flex-1 text-left text-sm font-semibold">{label}</span>
      <ChevronRight className="size-4 text-muted" />
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

function Section({ title, children }) {
  return (
    <section>
      <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">{title}</p>
      <Card className="overflow-hidden p-0 divide-y divide-border">
        {children}
      </Card>
    </section>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { account, signOut, deleteAccount, donations, assessments, respondedRequestIds, notifications } = useStore();
  if (!account) return null;

  const verified = verifiedDonationCount(donations);
  const unread = notifications.filter((n) => !n.read).length;
  const nextMilestone = DONATION_MILESTONES.find((m) => m > verified);

  // Earned badges
  const earnedBadges = [
    verified >= 1 && 'first-donation',
    verified >= 3 && 'life-supporter',
    verified >= 5 && 'consistent',
    account.bloodVerification === 'verified' && 'verified-donor',
  ].filter(Boolean);

  function handleSignOut() {
    if (window.confirm('Sign out?')) { signOut(); navigate('/welcome', { replace: true }); }
  }
  function handleDelete() {
    if (window.confirm('Delete your account and all data permanently? This cannot be undone.')) {
      deleteAccount(); navigate('/welcome', { replace: true });
    }
  }

  return (
    <AppShell>
      <ScreenHeader title="Profile" back={false} />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-28">

        {/* Identity card */}
        <Card className="animate-fade-up border-0 bg-[#191919] text-white">
          <div className="flex items-center gap-4">
            <Avatar name={account.name} size={72} />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-lg text-white">{account.name}</p>
              <p className="flex items-center gap-1 text-xs text-white/60 mt-0.5">
                <MapPin className="size-3" />{account.locality}, {account.city}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <BloodGroupBadge group={account.bloodGroup} size="sm" />
                <StatusBadge status={account.bloodVerification} />
                {account.available && <Badge tone="success">Available</Badge>}
              </div>
            </div>
          </div>
          {account.email && (
            <p className="mt-3 text-xs text-white/60 border-t border-white/10 pt-3">{account.email} · {account.mobile}</p>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Verified donations', value: verified },
            { label: unread > 0 ? `${unread} unread` : 'All read', value: respondedRequestIds.length, sub: 'responses' },
            { label: 'Check-ins', value: assessments.length },
          ].map(({ label, value, sub }) => (
            <Card key={label} className="p-3 text-center">
              <p className="text-xl font-bold text-primary">{value}</p>
              <p className="text-[10px] leading-tight text-muted">{label}</p>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        {earnedBadges.length > 0 && (
          <section>
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">Achievements</p>
            <div className="grid grid-cols-4 gap-2">
              {earnedBadges.map((type) => <AchievementBadge key={type} type={type} earned />)}
            </div>
          </section>
        )}

        {/* Blood & health */}
        <Section title="Blood & Health">
          <SettingsRow icon={<Droplets className="size-4" />} label="Blood & donor details" to="/blood" />
          <SettingsRow icon={<HeartPulse className="size-4" />} label="Health overview" to="/health" />
          <SettingsRow icon={<FileText className="size-4" />} label="Documents" to="/documents" />
        </Section>

        {/* Activity */}
        <Section title="Activity">
          <SettingsRow icon={<Activity className="size-4" />} label="Activity timeline" to="/activity" />
          <SettingsRow icon={<Droplets className="size-4" />} label="Donation history" to="/donations" />
          <SettingsRow icon={<Trophy className="size-4" />} label="Hall of Fame" to="/leaderboard" />
          <SettingsRow icon={<Bell className="size-4" />} label={`Notifications${unread > 0 ? ` (${unread})` : ''}`} to="/notifications" />
        </Section>

        {/* Settings & info */}
        <Section title="App">
          <SettingsRow icon={<Settings className="size-4" />} label="Settings & privacy" to="/settings" />
          <SettingsRow icon={<HelpCircle className="size-4" />} label="Help" to="/info/help" />
          <SettingsRow icon={<Info className="size-4" />} label="About Yogdan" to="/info/about" />
        </Section>

        {/* Sign out */}
        <Section title="Account">
          <SettingsRow icon={<LogOut className="size-4" />} label="Sign out" onClick={handleSignOut} />
          <SettingsRow icon={<Trash2 className="size-4 text-primary" />} label="Delete account & all data" onClick={handleDelete} destructive />
        </Section>

        <p className="pb-2 text-center text-xs text-muted">Signed in · {account.mobile}</p>
      </div>
      <BottomTabBar />
    </AppShell>
  );
}
