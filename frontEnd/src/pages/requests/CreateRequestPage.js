// Multi-step blood request creation
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, MapPin, Clock, User, Droplets, Hospital, Info } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BloodGroupPicker } from '../../components/common/BloodGroupPicker';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/index';
import { BLOOD_GROUPS } from '../../lib/yogdan/types';
import { MATCH_STAGES } from '../../lib/yogdan/matching';
import { cn } from '../../lib/utils';

const STEPS = ['Patient', 'Blood', 'Urgency', 'Hospital', 'Location', 'Review'];
const URGENCY_OPTIONS = [
  { value: 'critical', label: 'Critical', desc: 'Needed within hours', cls: 'border-primary/50 bg-accent' },
  { value: 'urgent',   label: 'Urgent',   desc: 'Needed within 1–2 days', cls: 'border-warning/50 bg-warning-soft/40' },
  { value: 'planned',  label: 'Planned',  desc: 'Needed within a few days', cls: 'border-success/40 bg-success-soft/40' },
];

function StepHeader({ step, onBack }) {
  return (
    <div className="grid shrink-0 grid-cols-[48px_1fr_48px] items-center px-3 pb-2 pt-4">
      <div>
        {step > 0 && (
          <button type="button" onClick={onBack}
            className="grid size-11 place-items-center rounded-full text-ink hover:bg-white">
            <ChevronLeft className="size-5" />
          </button>
        )}
      </div>
      <div className="text-center">
        <span className="text-xs font-semibold text-muted">Step {step + 1} of {STEPS.length}</span>
        <div className="mt-1.5 flex gap-1 justify-center">
          {STEPS.map((_, i) => (
            <div key={i} className={cn('h-1 w-6 rounded-full transition-colors', i <= step ? 'bg-gradient-crimson' : 'bg-border')} />
          ))}
        </div>
        <span className="mt-1 block text-[11px] text-muted">{STEPS[step]}</span>
      </div>
      <div />
    </div>
  );
}

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const { createRequest, account, hospitals } = useStore();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    forSelf: true,
    patientName: '',
    patientAge: '',
    relation: '',
    bloodGroup: null,
    units: 1,
    urgency: 'urgent',
    requiredBy: '',
    hospital: '',
    hospitalArea: '',
    locality: account?.locality ?? '',
    contactName: account?.name ?? '',
    notes: '',
  });

  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (step === 0) {
      if (!form.forSelf && !form.patientName.trim()) e.patientName = 'Enter the patient name';
      if (!form.patientAge || isNaN(form.patientAge)) e.patientAge = 'Enter a valid age';
    }
    if (step === 1 && !form.bloodGroup) e.bloodGroup = 'Select a blood group';
    if (step === 2 && !form.requiredBy) e.requiredBy = 'Select a required-by date';
    if (step === 3 && !form.hospital.trim()) e.hospital = 'Enter the hospital name';
    if (step === 4 && !form.locality.trim()) e.locality = 'Enter the locality';
    return e;
  }

  function handleNext() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    try {
      await createRequest({
      patientName: form.forSelf ? (account?.name ?? 'Self') : form.patientName.trim(),
      patientAge: parseInt(form.patientAge),
      relation: form.forSelf ? 'Self' : form.relation || 'Family',
      bloodGroup: form.bloodGroup,
      units: form.units,
      urgency: form.urgency,
      requiredBy: new Date(form.requiredBy).toISOString(),
      hospital: form.hospital.trim(),
      hospitalArea: form.hospitalArea.trim(),
      locality: form.locality.trim(),
      contactName: form.contactName.trim(),
      notes: form.notes.trim(),
      distanceKm: 0,
      });
      navigate('/requests');
    } catch (requestError) {
      setErrors({ submit: requestError.message });
    }
  }

  return (
    <AppShell>
      <StepHeader step={step} onBack={() => step === 0 ? navigate(-1) : setStep(step - 1)} />

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6">
        {errors.submit && <p className="mb-3 text-center text-xs font-semibold text-primary">{errors.submit}</p>}

        {/* Step 0 — Patient */}
        {step === 0 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-primary">
                <User className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-ink">Who needs blood?</h1>
            </div>
            <div className="flex gap-2">
              {[{ v: true, l: 'Myself' }, { v: false, l: 'Someone else' }].map(({ v, l }) => (
                <button key={l} type="button" onClick={() => up('forSelf', v)}
                  className={cn('flex-1 rounded-2xl border py-3 text-sm font-semibold transition-all',
                    form.forSelf === v ? 'border-primary bg-accent text-primary' : 'border-border bg-white text-muted')}>
                  {l}
                </button>
              ))}
            </div>
            {!form.forSelf && (
              <Input id="pname" label="Patient name" placeholder="First name or initials"
                value={form.patientName} onChange={(e) => up('patientName', e.target.value)} error={errors.patientName} />
            )}
            <Input id="page" label="Patient age" type="number" inputMode="numeric" placeholder="e.g. 45"
              value={form.patientAge} onChange={(e) => up('patientAge', e.target.value)} error={errors.patientAge} />
            {!form.forSelf && (
              <Input id="rel" label="Relation (optional)" placeholder="e.g. Father, Friend"
                value={form.relation} onChange={(e) => up('relation', e.target.value)} />
            )}
          </div>
        )}

        {/* Step 1 — Blood group & units */}
        {step === 1 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-primary">
                <Droplets className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-ink">Blood needed</h1>
            </div>
            <BloodGroupPicker value={form.bloodGroup} onChange={(v) => up('bloodGroup', v)} />
            {errors.bloodGroup && <p className="text-xs font-semibold text-primary">{errors.bloodGroup}</p>}
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Units required</p>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => up('units', Math.max(1, form.units - 1))}
                  className="grid size-11 place-items-center rounded-full border border-border bg-white text-xl font-bold text-ink hover:bg-accent">−</button>
                <span className="w-8 text-center text-2xl font-bold text-ink">{form.units}</span>
                <button type="button" onClick={() => up('units', Math.min(10, form.units + 1))}
                  className="grid size-11 place-items-center rounded-full bg-gradient-crimson text-white text-xl font-bold shadow-crimson hover:brightness-105">+</button>
              </div>
              <p className="mt-2 text-xs text-muted">As advised by your treating hospital</p>
            </div>
          </div>
        )}

        {/* Step 2 — Urgency & date */}
        {step === 2 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-primary">
                <Clock className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-ink">Urgency</h1>
            </div>
            <div className="space-y-3">
              {URGENCY_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => up('urgency', opt.value)}
                  className={cn('flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all',
                    form.urgency === opt.value ? opt.cls + ' border-opacity-100' : 'border-border bg-white')}>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{opt.label}</p>
                    <p className="text-xs text-muted">{opt.desc}</p>
                  </div>
                  {form.urgency === opt.value && <span className="text-primary">✓</span>}
                </button>
              ))}
            </div>
            <Input id="rby" label="Required by" type="datetime-local"
              value={form.requiredBy} onChange={(e) => up('requiredBy', e.target.value)} error={errors.requiredBy}
              hint="As specified by the treating team" />
          </div>
        )}

        {/* Step 3 — Hospital */}
        {step === 3 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-primary">
                <MapPin className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-ink">Hospital</h1>
            </div>
            <Input id="hosp" label="Hospital name" placeholder="e.g. AIIMS Bhubaneswar"
              value={form.hospital} onChange={(e) => up('hospital', e.target.value)} error={errors.hospital} />
            <Input id="harea" label="Hospital area / address" placeholder="e.g. Sijua, Bhubaneswar"
              value={form.hospitalArea} onChange={(e) => up('hospitalArea', e.target.value)} />

            {/* Quick-pick nearby */}
            {hospitals.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Nearby hospitals</p>
                <div className="space-y-2">
                  {hospitals.slice(0, 3).map((h) => (
                    <button key={h.id} type="button"
                      onClick={() => { up('hospital', h.name); up('hospitalArea', h.area); }}
                      className={cn('flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                        form.hospital === h.name ? 'border-primary bg-accent' : 'border-border bg-white hover:bg-secondary/50')}>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink">{h.name}</p>
                        <p className="text-xs text-muted">{h.area} · {h.distanceKm} km</p>
                      </div>
                      {form.hospital === h.name && <span className="text-primary text-sm">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Input id="contact" label="Safe contact name" placeholder="Name of person to reach"
              value={form.contactName} onChange={(e) => up('contactName', e.target.value)} />
          </div>
        )}

        {/* Step 4 — Location & matching preview */}
        {step === 4 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-primary">
                <MapPin className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-ink">Matching area</h1>
              <p className="mt-1 text-sm text-muted">Donors are notified in expanding radius stages</p>
            </div>
            <Input id="loc" label="Locality" placeholder="e.g. Salt Lake, Kolkata"
              value={form.locality} onChange={(e) => up('locality', e.target.value)} error={errors.locality} />
            <Input id="notes" label="Additional notes (optional)"
              placeholder="Any instructions from the hospital…"
              value={form.notes} onChange={(e) => up('notes', e.target.value)} />

            {/* Radius preview */}
            <div className="rounded-3xl border border-border bg-white p-4 shadow-card">
              <p className="mb-3 text-sm font-bold text-ink">How matching works</p>
              <div className="space-y-2">
                {MATCH_STAGES.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn('grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold',
                      i === 0 ? 'bg-gradient-crimson text-white' : 'bg-secondary text-muted')}>
                      {i + 1}
                    </div>
                    <p className="text-sm text-ink">{s.label}</p>
                    {i === 0 && <span className="ml-auto text-xs font-semibold text-primary">First</span>}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Donor consent, availability and cooldown rules are always respected.</p>
            </div>
          </div>
        )}

        {/* Step 5 — Review */}
        {step === 5 && (
          <div className="animate-fade-up space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-ink">Review request</h1>
              <p className="mt-1 text-sm text-muted">Double-check before submitting</p>
            </div>
            <Card className="space-y-3">
              {[
                { label: 'Patient', value: form.forSelf ? 'Myself' : form.patientName || 'Not specified' },
                { label: 'Age', value: form.patientAge },
                { label: 'Blood group', value: form.bloodGroup },
                { label: 'Units', value: form.units },
                { label: 'Urgency', value: URGENCY_OPTIONS.find((u) => u.value === form.urgency)?.label },
                { label: 'Required by', value: form.requiredBy ? new Date(form.requiredBy).toLocaleString() : '—' },
                { label: 'Hospital', value: form.hospital || '—' },
                { label: 'Area', value: form.hospitalArea || '—' },
                { label: 'Locality', value: form.locality || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold text-ink">{value}</span>
                </div>
              ))}
            </Card>
            <div className="flex items-start gap-2 rounded-2xl bg-secondary/60 px-4 py-3 text-xs text-muted">
              <Info className="size-3.5 shrink-0 mt-0.5" />
              Submitting will begin the matching process. Donors in eligible stages will be notified according to availability and consent rules.
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto space-y-3 pt-8">
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Submit request</Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
