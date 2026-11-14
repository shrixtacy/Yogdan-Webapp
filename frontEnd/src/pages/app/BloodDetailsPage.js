// Blood type, donor details and notification preferences
import { useState } from 'react';
import { Info, ShieldCheck, Droplets, CalendarCheck2 } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { BloodGroupPicker } from '../../components/common/BloodGroupPicker';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useStore } from '../../store/index';
import { fmtDate } from '../../lib/yogdan/format';
import { DONATION_MILESTONES, verifiedDonationCount } from '../../lib/yogdan/rules';

const COMPAT = {
  'O-':  { canDonateTo: 'All types',           canReceiveFrom: 'O-' },
  'O+':  { canDonateTo: 'O+, A+, B+, AB+',    canReceiveFrom: 'O+, O-' },
  'A-':  { canDonateTo: 'A-, A+, AB-, AB+',   canReceiveFrom: 'A-, O-' },
  'A+':  { canDonateTo: 'A+, AB+',            canReceiveFrom: 'A+, A-, O+, O-' },
  'B-':  { canDonateTo: 'B-, B+, AB-, AB+',   canReceiveFrom: 'B-, O-' },
  'B+':  { canDonateTo: 'B+, AB+',            canReceiveFrom: 'B+, B-, O+, O-' },
  'AB-': { canDonateTo: 'AB-, AB+',           canReceiveFrom: 'All negative types' },
  'AB+': { canDonateTo: 'AB+',               canReceiveFrom: 'All types' },
};

export default function BloodDetailsPage() {
  const { account, donations, updateProfile } = useStore();
  if (!account) return null;

  const [editing, setEditing] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(account.bloodGroup);
  const [lastDate, setLastDate] = useState(account.lastDonationDate ?? '');

  const verified = verifiedDonationCount(donations);
  const nextMilestone = DONATION_MILESTONES.find((m) => m > verified);
  const compat = COMPAT[account.bloodGroup];

  function save() {
    updateProfile({ bloodGroup, lastDonationDate: lastDate || undefined });
    setEditing(false);
  }

  return (
    <AppShell>
      <ScreenHeader title="Blood & Donor Details" back="/profile" right={
        !editing && (
          <button type="button" onClick={() => setEditing(true)}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-soft hover:bg-accent">
            Edit
          </button>
        )
      } />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4 space-y-5">

        {/* Blood group identity */}
        <Card className="animate-fade-up">
          <div className="flex items-center gap-4">
            <BloodGroupBadge group={account.bloodGroup} size="lg" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-bold text-ink">{account.bloodGroup}</p>
                <StatusBadge status={account.bloodVerification} />
              </div>
              {account.bloodVerification !== 'verified' && (
                <p className="mt-0.5 text-xs text-muted">Upload a blood group report to get verified</p>
              )}
            </div>
          </div>
        </Card>

        {/* Edit blood group */}
        {editing && (
          <section>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Change blood group</p>
            <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />
            <div className="mt-3">
              <Input id="lastDate" label="Last donation date" type="date" value={lastDate}
                onChange={(e) => setLastDate(e.target.value)} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={save}>Save changes</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </section>
        )}

        {/* Donor availability */}
        <Card>
          <div className="space-y-4">
            <Toggle id="donor-consent"
              checked={account.donorConsent ?? false}
              onChange={(v) => updateProfile({ donorConsent: v, available: v ? account.available : false })}
              label="Discoverable as a donor"
              description="Nearby requests matching your blood group may contact you." />
            {account.donorConsent && (
              <Toggle id="available"
                checked={account.available ?? false}
                onChange={(v) => updateProfile({ available: v })}
                label="Available to donate now"
                description="Pause without losing your donor opt-in." />
            )}
          </div>
        </Card>

        {/* Last donation */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
              <CalendarCheck2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Last donation</p>
              <p className="text-xs text-muted">
                {account.lastDonationDate
                  ? fmtDate(account.lastDonationDate)
                  : 'Not recorded'}
              </p>
            </div>
          </div>
        </Card>

        {/* Donation progress */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Your contribution</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Verified', value: verified },
              { label: 'Next milestone', value: nextMilestone ? `${verified}/${nextMilestone}` : '★' },
              { label: 'Pending', value: donations.filter((d) => d.status === 'pending').length },
            ].map(({ label, value }) => (
              <Card key={label} className="p-3 text-center">
                <p className="text-xl font-bold text-primary">{value}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted">{label}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Compatibility chart */}
        {compat && (
          <section>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Compatibility (general reference)</p>
            <Card className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary">
                  <Droplets className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-muted">Can donate to</p>
                  <p className="text-sm font-semibold text-ink">{compat.canDonateTo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-muted">Can receive from</p>
                  <p className="text-sm font-semibold text-ink">{compat.canReceiveFrom}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-2xl bg-secondary/60 p-3 text-xs text-muted">
                <Info className="size-3.5 shrink-0 mt-0.5" />
                General reference only. All compatibility, cross-matching and clinical decisions must be made by qualified professionals at authorized blood banks.
              </div>
            </Card>
          </section>
        )}

        {/* Notification prefs */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Notification preferences</p>
          <Card className="space-y-4">
            {[
              { key: 'notifyNearby',       label: 'Nearby request alerts',    desc: 'Requests matching your blood group within range' },
              { key: 'notifyResponses',    label: 'Request responses',        desc: 'When someone responds to your request' },
              { key: 'notifyVerification', label: 'Donation verification',    desc: 'When your donation proof is reviewed' },
            ].map(({ key, label, desc }) => (
              <Toggle key={key} id={key}
                checked={account[key] !== false}
                onChange={(v) => updateProfile({ [key]: v })}
                label={label} description={desc} />
            ))}
          </Card>
        </section>

      </div>
    </AppShell>
  );
}
