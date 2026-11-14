// Submit and track donation records
import { useState } from 'react';
import { ShieldCheck, Upload, Plus } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/index';
import { fmtDate, ago } from '../../lib/yogdan/format';

function SubmitModal({ onClose, onSubmit }) {
  const { hospitals } = useStore();
  const [form, setForm] = useState({ date: '', hospital: '', notes: '' });
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[440px] rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-phone">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Record a donation</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full border border-border text-muted hover:bg-accent">✕</button>
        </div>
        <div className="space-y-4">
          <Input id="ddate" label="Donation date" type="date" value={form.date} onChange={(e) => up('date', e.target.value)} />
          <Input id="dhosp" label="Hospital / blood bank" placeholder="Where did you donate?"
            value={form.hospital} onChange={(e) => up('hospital', e.target.value)} />
          <Input id="dnotes" label="Notes (optional)" placeholder="Any details…"
            value={form.notes} onChange={(e) => up('notes', e.target.value)} />
          <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-xs text-muted">
            Your record will be marked <strong>Pending</strong> until verified by the blood bank or hospital. Only verified donations count toward the leaderboard.
          </div>
        </div>
        <div className="mt-5">
          <Button disabled={!form.date || !form.hospital.trim()}
            onClick={() => { onSubmit({ date: form.date, hospital: form.hospital.trim(), notes: form.notes.trim() }); onClose(); }}>
            Submit record
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DonationsPage() {
  const { donations, submitDonation } = useStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <AppShell>
      <ScreenHeader
        title="Donation History"
        back="/profile"
        right={
          <button type="button" onClick={() => setShowModal(true)}
            className="grid size-9 place-items-center rounded-full bg-gradient-crimson text-white shadow-crimson">
            <Plus className="size-4" />
          </button>
        }
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {donations.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="size-7" />}
            title="No donation records"
            description="Record a donation after visiting an authorized blood bank or hospital."
            action={<Button size="sm" onClick={() => setShowModal(true)}><Upload className="size-4" /> Record donation</Button>}
          />
        ) : (
          donations.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start gap-3">
                <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ${d.status === 'verified' ? 'bg-success-soft text-success' : 'bg-accent text-primary'}`}>
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink">{d.hospital}</p>
                  <p className="text-xs text-muted">{d.date ? fmtDate(d.date) : ''} · Submitted {ago(d.submittedAt)}</p>
                  <div className="mt-2"><StatusBadge status={d.status} /></div>
                </div>
              </div>
              {d.notes && <p className="mt-3 rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted">{d.notes}</p>}
            </Card>
          ))
        )}
      </div>

      {showModal && (
        <SubmitModal
          onClose={() => setShowModal(false)}
          onSubmit={submitDonation}
        />
      )}
    </AppShell>
  );
}
