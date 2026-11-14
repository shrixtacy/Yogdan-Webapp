// Weekly health assessment — step-by-step check-in
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, HeartPulse } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/index';
import { cn } from '../../lib/utils';

const FEELINGS = [
  { value: 1, emoji: '😞', label: 'Struggling' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

const TOTAL_STEPS = 8;
const SECTION_QUESTIONS = [
  ['Daily function', 'How health affects everyday life'],
  ['Heart and circulation', 'Record symptoms for professional follow-up'],
  ['Nutrition and digestion', 'Food, appetite, and digestive wellbeing'],
  ['Sleep and movement', 'Rest and physical activity patterns'],
  ['Mental wellbeing', 'A private, non-diagnostic emotional check-in'],
  ['Medication and care', 'Current treatment and healthcare access'],
];
const QUESTIONS = [
  ['How would you rate your general health?', 'Did health concerns limit your usual activities?', 'Did you have difficulty completing daily tasks?', 'Did you feel unusually tired during the day?', 'Did you experience pain that affected your routine?'],
  ['Have you experienced chest discomfort?', 'Have you felt short of breath at rest or with activity?', 'Have you noticed unusual palpitations?', 'Have you had fainting or near-fainting?', 'Have you noticed new swelling in your legs?'],
  ['Was your appetite different from usual?', 'Were you able to access regular balanced meals?', 'Did you notice an unplanned weight change?', 'Did you experience ongoing nausea or vomiting?', 'Did you have persistent abdominal or bowel changes?'],
  ['How rested did you feel after sleeping?', 'Did you have trouble falling or staying asleep?', 'How many days were you physically active?', 'Did symptoms prevent you from moving normally?', 'Did you spend long periods sitting most days?'],
  ['Did you feel down or hopeless?', 'Did you feel nervous, anxious, or on edge?', 'Did you lose interest in activities you usually enjoy?', 'Did you feel able to cope with daily stress?', 'Did you have someone you could talk to when needed?'],
  ['Did you take medicines as prescribed?', 'Did you start, stop, or change any medicine?', 'Did you experience a possible medicine side effect?', 'Did you attend a planned healthcare appointment?', 'Do you need help arranging follow-up care?'],
];

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { saveAssessment } = useStore();

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    feeling: null,
    healthChanges: '',
    symptoms: '',
    recentDonation: null,
    visitedDoctor: null,
    additionalInfo: '',
    bp: '',
    haemoglobin: '',
    weight: '',
    sleep: '',
    activity: '',
    diet: '',
    medicationChanges: '',
    mentalHealthNote: '',
    sectionAnswers: {},
  });

  const up = (key, val) => setData((d) => ({ ...d, [key]: val }));

  async function handleFinish() {
    try {
      await saveAssessment({
      feeling: data.feeling,
      healthChanges: data.healthChanges.trim() || null,
      symptoms: data.symptoms.trim() || null,
      recentDonation: data.recentDonation,
      visitedDoctor: data.visitedDoctor,
      additionalInfo: data.additionalInfo.trim() || null,
      bp: data.bp.trim() || null,
      haemoglobin: data.haemoglobin ? parseFloat(data.haemoglobin) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      sleep: data.sleep.trim() || null,
      activity: data.activity.trim() || null,
      diet: data.diet.trim() || null,
      medicationChanges: data.medicationChanges.trim() || null,
      mentalHealthNote: data.mentalHealthNote.trim() || null,
      sectionAnswers: data.sectionAnswers,
      });
      navigate('/health');
    } catch (requestError) {
      window.alert(requestError.message);
    }
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="grid shrink-0 grid-cols-[48px_1fr_48px] items-center px-3 pb-2 pt-4">
        <div>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-white">
              <ChevronLeft className="size-5" />
            </button>
          )}

          {step >= 4 && (
            <div className="animate-fade-up space-y-5">
              <div className="text-center">
                <h1 className="text-[26px] font-bold tracking-tight text-ink">{SECTION_QUESTIONS[step - 4][0]}</h1>
                <p className="mt-2 text-sm text-muted">{SECTION_QUESTIONS[step - 4][1]}</p>
              </div>
              {QUESTIONS[step - 4].map((question, index) => {
                const key = `${step - 4}-${index}`;
                const value = data.sectionAnswers[key];
                return <div key={key} className="rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-semibold text-ink">{index + 1}. {question}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {['No', 'Somewhat', 'Yes', 'Prefer not to say'].map((option) => <button key={option} type="button" onClick={() => setData((current) => ({ ...current, sectionAnswers: { ...current.sectionAnswers, [key]: option } }))} className={cn('rounded-xl border px-2 py-2 text-xs font-semibold', value === option ? 'border-primary bg-accent text-primary' : 'border-border text-muted')}>{option}</button>)}
                  </div>
                </div>;
              })}
            </div>
          )}
        </div>
        <div className="text-center">
          <span className="text-xs font-semibold text-muted">Step {step + 1} of {TOTAL_STEPS}</span>
          <div className="mt-1.5 flex gap-1 justify-center">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={cn('h-1 w-8 rounded-full transition-colors', i <= step ? 'bg-gradient-crimson' : 'bg-border')} />
            ))}
          </div>
        </div>
        <div />
      </div>

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6">

        {/* Step 0 — Wellbeing */}
        {step === 0 && (
          <div className="animate-fade-up">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-3xl bg-accent text-primary">
                <HeartPulse className="size-8" />
              </div>
              <h1 className="text-[26px] font-bold tracking-tight text-ink">How are you feeling?</h1>
              <p className="mt-2 text-sm text-muted">Your wellbeing this week</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {FEELINGS.map((f) => (
                <button key={f.value} type="button" onClick={() => up('feeling', f.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all',
                    data.feeling === f.value ? 'border-primary bg-accent scale-105' : 'border-border bg-white hover:border-primary/40',
                  )}>
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-[10px] font-semibold text-muted leading-tight text-center">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Health changes & symptoms */}
        {step === 1 && (
          <div className="animate-fade-up space-y-6">
            <div className="text-center">
              <h1 className="text-[26px] font-bold tracking-tight text-ink">Any changes?</h1>
              <p className="mt-2 text-sm text-muted">Skip anything that doesn't apply</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Recent health changes?</label>
              <textarea value={data.healthChanges} onChange={(e) => up('healthChanges', e.target.value)}
                placeholder="e.g. started new medication, feeling more tired…"
                rows={3} className="form-control min-h-24 w-full resize-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Any current symptoms or concerns?</label>
              <textarea value={data.symptoms} onChange={(e) => up('symptoms', e.target.value)}
                placeholder="e.g. mild headache, feeling feverish…"
                rows={3} className="form-control min-h-24 w-full resize-none" />
            </div>

            {/* Yes/No questions */}
            {[
              { key: 'recentDonation', q: 'Have you donated blood recently?' },
              { key: 'visitedDoctor', q: 'Have you visited a healthcare professional recently?' },
              { key: 'medicationChanges', q: 'Have your medications changed recently?', text: true },
            ].map(({ key, q }) => (
              <div key={key}>
                <p className="mb-2 text-sm font-semibold text-ink">{q}</p>
                {key === 'medicationChanges' ? (
                  <textarea value={data[key]} onChange={(e) => up(key, e.target.value)}
                    placeholder="Name the medicine or change, if you want to remember it"
                    rows={2} className="form-control min-h-20 w-full resize-none" />
                ) : <div className="flex gap-3">
                  {['Yes', 'No'].map((opt) => (
                    <button key={opt} type="button"
                      onClick={() => up(key, opt === 'Yes')}
                      className={cn('flex-1 rounded-2xl border py-3 text-sm font-semibold transition-all',
                        data[key] === (opt === 'Yes') ? 'border-primary bg-accent text-primary' : 'border-border bg-white text-muted hover:border-primary/40')}>
                      {opt}
                    </button>
                  ))}
                </div>}
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — Optional measurements */}
        {step === 2 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <h1 className="text-[26px] font-bold tracking-tight text-ink">Optional readings</h1>
              <p className="mt-2 text-sm text-muted">Skip any you haven't measured — never estimate</p>
            </div>

            <Input id="bp" label="Blood pressure (optional)" placeholder="e.g. 120/80" value={data.bp}
              onChange={(e) => up('bp', e.target.value)} hint="Format: systolic/diastolic" />
            <Input id="hb" label="Haemoglobin g/dL (optional)" type="number" inputMode="decimal"
              placeholder="e.g. 13.5" value={data.haemoglobin} onChange={(e) => up('haemoglobin', e.target.value)} />
            <Input id="wt" label="Weight kg (optional)" type="number" inputMode="decimal"
              placeholder="e.g. 68" value={data.weight} onChange={(e) => up('weight', e.target.value)} />

            <Input id="sleep" label="Average sleep (optional)" placeholder="e.g. 7 hours" value={data.sleep}
              onChange={(e) => up('sleep', e.target.value)} />
            <Input id="activity" label="Movement or exercise (optional)" placeholder="e.g. Walked 3 times this week" value={data.activity}
              onChange={(e) => up('activity', e.target.value)} />
            <Input id="diet" label="Nutrition note (optional)" placeholder="e.g. Appetite was normal" value={data.diet}
              onChange={(e) => up('diet', e.target.value)} />

            <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-xs text-muted">
              These are personal notes only. Yogdan does not use them to decide your eligibility to donate.
            </div>
          </div>
        )}

        {/* Step 3 — Additional notes + summary */}
        {step === 3 && (
          <div className="animate-fade-up space-y-5">
            <div className="text-center">
              <h1 className="text-[26px] font-bold tracking-tight text-ink">Anything else?</h1>
              <p className="mt-2 text-sm text-muted">Optional — add any notes you'd like to keep</p>
            </div>

            <textarea value={data.additionalInfo} onChange={(e) => up('additionalInfo', e.target.value)}
              placeholder="Any other health information you'd like to note…"
              rows={4} className="form-control min-h-28 w-full resize-none" />

            {/* Summary */}
            <div className="rounded-3xl border border-border bg-white p-4 shadow-card space-y-2">
              <p className="text-sm font-bold text-ink mb-3">Your check-in summary</p>
              {data.feeling && <div className="flex justify-between text-sm"><span className="text-muted">Feeling</span><span className="font-semibold text-ink">{FEELINGS[data.feeling - 1]?.emoji} {FEELINGS[data.feeling - 1]?.label}</span></div>}
              {data.bp && <div className="flex justify-between text-sm"><span className="text-muted">Blood pressure</span><span className="font-semibold text-ink">{data.bp}</span></div>}
              {data.haemoglobin && <div className="flex justify-between text-sm"><span className="text-muted">Haemoglobin</span><span className="font-semibold text-ink">{data.haemoglobin} g/dL</span></div>}
              {data.weight && <div className="flex justify-between text-sm"><span className="text-muted">Weight</span><span className="font-semibold text-ink">{data.weight} kg</span></div>}
              {data.recentDonation !== null && <div className="flex justify-between text-sm"><span className="text-muted">Recent donation</span><span className="font-semibold text-ink">{data.recentDonation ? 'Yes' : 'No'}</span></div>}
            </div>

            <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-xs text-muted">
              Health records are informational only. Yogdan does not generate medical diagnoses or determine donor eligibility.
            </div>
          </div>
        )}

        <div className="mt-auto space-y-3 pt-8">
          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !data.feeling}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish}>Save check-in</Button>
          )}
          {step === 0 && (
            <button type="button" onClick={() => navigate('/health')} className="w-full text-center text-sm text-muted">
              Skip this week
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
