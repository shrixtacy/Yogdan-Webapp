import { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/index';

const SECTIONS = [
  { title: 'Personal details', fields: [['dateOfBirth', 'Date of birth', 'date'], ['gender', 'Gender (optional)', 'text'], ['address', 'Address or locality', 'textarea']] },
  { title: 'Emergency contact', fields: [['emergencyName', 'Contact name', 'text'], ['emergencyMobile', 'Contact mobile', 'tel']] },
  { title: 'Medical history', fields: [['conditions', 'Known conditions', 'textarea'], ['allergies', 'Allergies', 'textarea'], ['surgeries', 'Previous surgeries or hospitalizations', 'textarea'], ['familyHistory', 'Family medical history', 'textarea']] },
  { title: 'Medication history', fields: [['currentMedications', 'Current medications', 'textarea'], ['pastMedications', 'Past medications', 'textarea'], ['medicationNotes', 'Medication notes and changes', 'textarea']] },
];

export default function HealthPassportPage() {
  const { account, updateProfile } = useStore();
  const [form, setForm] = useState(() => ({ ...(account?.healthPassport ?? {}) }));
  const [saved, setSaved] = useState(false);
  if (!account) return null;

  function update(key, value) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save(event) {
    event.preventDefault();
    updateProfile({ healthPassport: form });
    setSaved(true);
  }

  return (
    <AppShell>
      <ScreenHeader title="Health Passport" back="/health" />
      <form onSubmit={save} className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 pb-8">
        <Card className="border-primary/15 bg-accent/50">
          <div className="flex gap-3">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted">A private, structured record for your own health history. It is not a diagnosis and is not shared publicly.</p>
          </div>
        </Card>
        {SECTIONS.map((section) => (
          <section key={section.title} className="space-y-3">
            <p className="px-1 text-xs font-bold uppercase tracking-widest text-muted">{section.title}</p>
            <Card className="space-y-4">
              {section.fields.map(([key, label, type]) => type === 'textarea'
                ? <Textarea key={key} id={key} label={label} value={form[key] ?? ''} onChange={(e) => update(key, e.target.value)} maxLength={1000} />
                : <Input key={key} id={key} label={label} type={type} value={form[key] ?? ''} onChange={(e) => update(key, e.target.value)} maxLength={200} />)}
            </Card>
          </section>
        ))}
        <Button type="submit"><Save className="size-4" />{saved ? 'Saved' : 'Save health passport'}</Button>
      </form>
    </AppShell>
  );
}
