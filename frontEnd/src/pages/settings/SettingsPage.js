// Settings — privacy, notifications, account
import { ChevronRight, Eye, Bell, MapPin, FileText, LogOut, Trash2, Info, HelpCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Toggle';
import { useStore } from '../../store/index';

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

function Row({ icon, label, onClick, right }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/50">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-primary">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-ink">{label}</span>
      {right ?? <ChevronRight className="size-4 text-muted" />}
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { account, updateProfile, signOut, deleteAccount } = useStore();
  if (!account) return null;

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
      <ScreenHeader title="Settings" back="/profile" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6 space-y-5">

        <Section title="Privacy & visibility">
          <div className="px-4 py-3.5 space-y-4">
            <Toggle id="donorVis" label="Discoverable as donor" description="Let nearby requests find you"
              checked={account.donorConsent ?? false}
              onChange={(v) => updateProfile({ donorConsent: v, available: v ? account.available : false })} />
            <Toggle id="contactShare" label="Share contact after accepting" description="Your number is shared only after you accept"
              checked={account.contactSharing === 'after-accept'}
              onChange={(v) => updateProfile({ contactSharing: v ? 'after-accept' : 'never' })} />
            <Toggle id="publicRanking" label="Appear on public leaderboard"
              description="Your verified donations show on the Hall of Fame"
              checked={account.publicRanking !== false}
              onChange={(v) => updateProfile({ publicRanking: v })} />
          </div>
        </Section>

        <Section title="Notifications">
          <div className="px-4 py-3.5 space-y-4">
            <Toggle id="notNearby" label="Nearby request alerts"
              checked={account.notifyNearby !== false}
              onChange={(v) => updateProfile({ notifyNearby: v })} />
            <Toggle id="notResponses" label="Donor responses"
              checked={account.notifyResponses !== false}
              onChange={(v) => updateProfile({ notifyResponses: v })} />
            <Toggle id="notVerif" label="Donation verification updates"
              checked={account.notifyVerification !== false}
              onChange={(v) => updateProfile({ notifyVerification: v })} />
            <Toggle id="notAssessment" label="Weekly check-in reminders"
              checked={account.weeklyReminder !== false}
              onChange={(v) => updateProfile({ weeklyReminder: v })} />
          </div>
        </Section>

        <Section title="Help & info">
          <Row icon={<HelpCircle className="size-4" />} label="Help & support" onClick={() => navigate('/info/help')} />
          <Row icon={<Info className="size-4" />} label="About Yogdan" onClick={() => navigate('/info/about')} />
          <Row icon={<Shield className="size-4" />} label="Privacy policy" onClick={() => navigate('/info/privacy')} />
          <Row icon={<FileText className="size-4" />} label="Terms & conditions" onClick={() => navigate('/info/terms')} />
        </Section>

        <Section title="Account">
          <Row icon={<LogOut className="size-4" />} label="Sign out" onClick={handleSignOut} right={null} />
          <Row icon={<Trash2 className="size-4 text-primary" />} label="Delete account & all data"
            onClick={handleDelete} right={null} />
        </Section>

      </div>
    </AppShell>
  );
}
