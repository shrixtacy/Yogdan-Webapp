// Health assessment history — review previous check-ins
import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/index';
import { fmtDate } from '../../lib/yogdan/format';
import { cn } from '../../lib/utils';

const FEELING_LABEL = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'];
const FEELING_EMOJI = ['', '😞', '😕', '😐', '😊', '😄'];

function AssessmentRow({ a, onDelete }) {
  const [open, setOpen] = useState(false);
  const fields = [
    a.bp          && { label: 'Blood pressure', value: a.bp },
    a.haemoglobin && { label: 'Haemoglobin', value: `${a.haemoglobin} g/dL` },
    a.weight      && { label: 'Weight', value: `${a.weight} kg` },
    a.recentDonation !== null && a.recentDonation !== undefined
                  && { label: 'Recent donation', value: a.recentDonation ? 'Yes' : 'No' },
    a.visitedDoctor !== null && a.visitedDoctor !== undefined
                  && { label: 'Visited doctor', value: a.visitedDoctor ? 'Yes' : 'No' },
    a.symptoms    && { label: 'Symptoms', value: a.symptoms },
    a.healthChanges && { label: 'Health changes', value: a.healthChanges },
    a.additionalInfo && { label: 'Notes', value: a.additionalInfo },
  ].filter(Boolean);

  return (
    <Card className="overflow-hidden p-0">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <span className="text-2xl">{FEELING_EMOJI[a.feeling] ?? '😐'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{FEELING_LABEL[a.feeling] ?? 'Check-in recorded'}</p>
          <p className="text-xs text-muted">{fmtDate(a.date, 'EEE, d MMM yyyy')}</p>
        </div>
        {open ? <ChevronUp className="size-4 text-muted" /> : <ChevronDown className="size-4 text-muted" />}
      </button>

      {open && fields.length > 0 && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-2">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 text-sm">
              <span className="text-muted">{label}</span>
              <span className="font-semibold text-ink text-right max-w-[180px]">{value}</span>
            </div>
          ))}
          <button type="button" onClick={() => onDelete(a.id)}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <Trash2 className="size-3.5" /> Delete this record
          </button>
        </div>
      )}
    </Card>
  );
}

export default function HealthHistoryPage() {
  const { assessments, deleteAssessment } = useStore();

  return (
    <AppShell>
      <ScreenHeader title="Health History" back="/health" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {assessments.length === 0 ? (
          <EmptyState
            icon={<span className="text-3xl">📋</span>}
            title="No history yet"
            description="Complete a weekly check-in to build your personal health record."
            action={<Link to="/health/assessment"><Button size="sm">Start check-in</Button></Link>}
          />
        ) : (
          assessments.map((a) => (
            <AssessmentRow key={a.id} a={a} onDelete={deleteAssessment} />
          ))
        )}
      </div>
    </AppShell>
  );
}
