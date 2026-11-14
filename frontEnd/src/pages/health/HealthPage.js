import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, CalendarCheck2, ChevronRight, ClipboardList,
  FileText, HeartPulse, Info, Pill, Scale, ShieldCheck, Sparkles,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useStore } from '../../store/index';
import { isAssessmentDue, nextAssessmentDate, latestAssessment } from '../../lib/yogdan/rules';
import { fmtDate } from '../../lib/yogdan/format';

const FEELING_LABEL = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'];
const FEELING_EMOJI = ['', '😞', '😕', '😐', '😊', '😄'];
const DAY_MS = 24 * 60 * 60 * 1000;

function DottedActivityChart({ assessments }) {
  const recent = [...assessments].reverse().slice(-8);
  const values = recent.map((assessment) => assessment.feeling).filter(Boolean);
  const chartValues = values.length ? values : [];
  const columns = 24;
  const rows = 7;

  return (
    <div className="mt-4">
      {chartValues.length === 0 ? (
        <div className="flex h-[148px] items-center justify-center rounded-2xl bg-[#fafafa] text-center text-xs text-[#858585]">
          Complete a check-in to see your health activity here.
        </div>
      ) : (
        <div className="relative h-[148px] overflow-hidden rounded-2xl bg-[#fafafa] px-2 py-4">
          <div className="grid h-full grid-cols-[repeat(24,minmax(0,1fr))] grid-rows-7 gap-x-1.5 gap-y-1">
            {Array.from({ length: columns * rows }).map((_, index) => {
              const column = index % columns;
              const row = Math.floor(index / columns);
              const sourceIndex = Math.floor((column / columns) * chartValues.length);
              const height = chartValues[sourceIndex] ?? 0;
              const active = height > 0 && row >= rows - Math.max(1, height);
              return <span key={index} className={`size-1.5 rounded-full justify-self-center ${active ? 'bg-primary' : 'bg-[#e3e3e3]'}`} />;
            })}
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-between px-1 text-[10px] font-medium text-[#a5a5a5]">
        <span>{recent[0] ? fmtDate(recent[0].date, 'd MMM') : 'Start'}</span>
        <span>{recent.length > 2 ? 'Assessment trend' : 'No trend yet'}</span>
        <span>{recent[recent.length - 1] ? fmtDate(recent[recent.length - 1].date, 'd MMM') : 'Today'}</span>
      </div>
    </div>
  );
}

function DateTimeline({ assessments }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => new Date(today.getTime() - (6 - index) * DAY_MS));
  const recordedDates = new Set(assessments.map((assessment) => assessment.date?.slice(0, 10)));
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      {days.map((day) => {
        const key = day.toISOString().slice(0, 10);
        const isToday = key === today.toISOString().slice(0, 10);
        return (
          <div key={key} className={`min-w-[48px] rounded-2xl border px-2 py-2 text-center ${isToday ? 'border-primary bg-primary text-white' : 'border-[#eaeaea] bg-white text-[#858585]'}`}>
            <p className="text-[10px] font-semibold">{fmtDate(day.toISOString(), 'EEE')}</p>
            <p className="mt-1 text-sm font-bold">{day.getDate()}</p>
            {recordedDates.has(key) && <span className={`mx-auto mt-1 block size-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-primary'}`} />}
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, unit, detail, tone }) {
  return (
    <Card className="min-h-[132px] border-[#eaeaea] bg-white p-4">
      <div className="flex items-start justify-between">
        <span className={`grid size-9 place-items-center rounded-xl ${tone}`}><Icon className="size-4" /></span>
        <ChevronRight className="size-4 text-[#b8b8b8]" />
      </div>
      <p className="mt-3 text-[11px] font-semibold text-[#858585]">{label}</p>
      <p className="mt-0.5 truncate text-2xl font-bold tracking-tight text-[#191919]">
        {value} <span className="text-xs font-medium text-[#858585]">{unit}</span>
      </p>
      <p className="mt-0.5 truncate text-[10px] text-[#a5a5a5]">{detail}</p>
    </Card>
  );
}

export default function HealthPage() {
  const { assessments, documents = [] } = useStore();
  const due = isAssessmentDue(assessments, new Date());
  const nextDate = nextAssessmentDate(assessments);
  const last = latestAssessment(assessments);
  const lastHb = assessments.find((assessment) => assessment.haemoglobin != null);
  const lastWeight = assessments.find((assessment) => assessment.weight != null);
  const lastBp = assessments.find((assessment) => assessment.bp);
  const journey = [
    ...assessments.map((assessment) => ({ date: assessment.date, title: 'Health assessment completed', detail: FEELING_LABEL[assessment.feeling] ?? 'Check-in recorded', icon: ClipboardList })),
    ...documents.map((document) => ({ date: document.uploadedAt, title: 'Medical document uploaded', detail: document.category, icon: FileText })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <AppShell>
      <ScreenHeader title="Health Overview" back="/" />
      <div className="no-scrollbar flex-1 overflow-y-auto bg-[#f5f5f3] px-5 pb-8">
        {!assessments.length && !documents.length && (
          <Card className="mt-8 border-[#eaeaea] bg-white p-7 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#fcebed] text-primary"><HeartPulse className="size-8" /></span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#191919]">Start your health assessment</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#858585]">Complete your private health check-in to build your dashboard from recorded information.</p>
            <Link to="/health/assessment" className="mt-6 inline-flex"><Button>Begin assessment <ArrowRight className="size-4" /></Button></Link>
            <p className="mt-4 text-[11px] text-[#a5a5a5]">Informational only. This does not replace professional medical advice.</p>
          </Card>
        )}
        {(assessments.length > 0 || documents.length > 0) && (
        <>
        <section className="pt-2">
          <p className="text-xs font-medium text-[#858585]">Your health activity</p>
          <div className="mt-1 flex items-end justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-[#191919]">A clearer view of you</h1>
            <span className="grid size-10 place-items-center rounded-full bg-[#fcebed] text-primary"><HeartPulse className="size-5" /></span>
          </div>
        </section>

        <Card className="mt-5 border-[#eaeaea] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#858585]">Your health overview</p>
              <p className="mt-1 text-sm text-[#858585]">{last ? `Last assessed ${fmtDate(last.date, 'd MMM yyyy')}` : 'Build your private health record'}</p>
            </div>
            <Badge tone={due ? 'warning' : 'success'}>{due ? 'Assessment due' : 'On track'}</Badge>
          </div>
          <DottedActivityChart assessments={assessments} />
          <DateTimeline assessments={assessments} />
        </Card>

        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div><h2 className="text-lg font-bold text-[#191919]">Today’s health statistics</h2><p className="text-xs text-[#858585]">Only recorded readings are shown</p></div>
            <Activity className="size-5 text-primary" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard icon={HeartPulse} label="Wellbeing" value={last?.feeling ? `${last.feeling}/5` : '—'} unit="" detail={last ? FEELING_LABEL[last.feeling] : 'No assessment'} tone="bg-[#fcebed] text-primary" />
            <StatCard icon={Activity} label="Blood pressure" value={lastBp?.bp ?? '—'} unit="" detail={lastBp ? fmtDate(lastBp.date, 'd MMM') : 'No reading yet'} tone="bg-[#eee9fb] text-[#6957a4]" />
            <StatCard icon={HeartPulse} label="Haemoglobin" value={lastHb?.haemoglobin ?? '—'} unit={lastHb ? 'g/dL' : ''} detail={lastHb ? fmtDate(lastHb.date, 'd MMM') : 'No reading yet'} tone="bg-[#fcebed] text-[#c92735]" />
            <StatCard icon={Scale} label="Weight" value={lastWeight?.weight ?? '—'} unit={lastWeight ? 'kg' : ''} detail={lastWeight ? fmtDate(lastWeight.date, 'd MMM') : 'No reading yet'} tone="bg-[#e6f3eb] text-[#2f7b55]" />
          </div>
        </section>

        <Card className="mt-5 border-0 bg-[#1c1c1c] p-5 text-white">
          <div className="flex items-start justify-between">
            <div><p className="text-xs font-medium text-white/55">HEALTH INSIGHTS</p><h2 className="mt-1 text-xl font-bold">Your latest signal</h2></div>
            <Sparkles className="size-5 text-[#e63946]" />
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div><p className="text-xs text-white/55">Current wellbeing</p><p className="mt-1 text-4xl font-bold">{last?.feeling ? `${last.feeling}/5` : '—'}</p></div>
            <p className="text-right text-xs text-white/55">{last ? fmtDate(last.date, 'd MMM yyyy') : 'No assessment yet'}</p>
          </div>
          <div className="mt-5 flex h-16 items-end gap-1">
            {[...assessments].reverse().slice(-7).map((assessment, index, list) => <span key={`${assessment.id}-${index}`} className={`flex-1 rounded-t ${index === list.length - 1 ? 'bg-[#e63946]' : 'bg-white/25'}`} style={{ height: `${Math.max(14, (assessment.feeling ?? 0) * 18)}%` }} />)}
            {!last && <p className="w-full text-xs text-white/45">Complete an assessment to build insights.</p>}
          </div>
          <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/60">This is a personal tracking view, not a medical diagnosis or eligibility decision.</p>
        </Card>

        <Card className={`mt-5 border-[#eaeaea] bg-white ${due ? 'border-primary/30' : ''}`}>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#fcebed] text-primary"><CalendarCheck2 className="size-5" /></span>
            <div className="min-w-0 flex-1"><h2 className="font-bold text-[#191919]">Your health assessment</h2><p className="text-xs text-[#858585]">{due ? 'Start today’s check-in' : nextDate ? `Next on ${fmtDate(nextDate.toISOString(), 'EEE, d MMM')}` : 'Keep your record up to date'}</p></div>
            <Link to={due ? '/health/assessment' : '/health/history'}><Button size="sm">{due ? 'Start' : 'History'}</Button></Link>
          </div>
        </Card>

        <section className="mt-7">
          <div className="flex items-end justify-between"><div><h2 className="text-lg font-bold text-[#191919]">Your health journey</h2><p className="text-xs text-[#858585]">Recent records and updates</p></div><Link to="/health/history" className="text-xs font-bold text-primary">View all</Link></div>
          <div className="mt-3 divide-y divide-[#eaeaea] rounded-3xl border border-[#eaeaea] bg-white px-4">
            {journey.length === 0 ? <p className="py-5 text-sm text-[#858585]">Your assessments and uploaded records will appear here.</p> : journey.map(({ date, title, detail, icon: Icon }) => <div key={`${title}-${date}`} className="flex items-center gap-3 py-3"><span className="grid size-9 place-items-center rounded-xl bg-[#fcebed] text-primary"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#191919]">{title}</p><p className="text-xs text-[#858585]">{detail}</p></div><p className="text-[10px] text-[#a5a5a5]">{fmtDate(date, 'd MMM')}</p></div>)}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-lg font-bold text-[#191919]">Health records</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: 'Health Passport', detail: 'Personal history', icon: ShieldCheck, to: '/health/passport' },
              { label: 'Medical documents', detail: `${documents.length} saved`, icon: FileText, to: '/documents' },
              { label: 'Medication history', detail: 'View passport', icon: Pill, to: '/health/passport' },
              { label: 'Assessment history', detail: `${assessments.length} recorded`, icon: ClipboardList, to: '/health/history' },
            ].map(({ label, detail, icon: Icon, to }) => <Link key={label} to={to}><Card className="flex items-center gap-3 border-[#eaeaea] bg-white p-3"><span className="grid size-9 place-items-center rounded-xl bg-[#fcebed] text-primary"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-[#191919]">{label}</span><span className="text-[10px] text-[#858585]">{detail}</span></span><ChevronRight className="size-4 text-[#b8b8b8]" /></Card></Link>)}
          </div>
        </section>

        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-xs text-[#858585]"><Info className="mt-0.5 size-3.5 shrink-0" />Health records are informational only. Yogdan does not diagnose, assess donor fitness, or determine eligibility.</div>
        </>
        )}
      </div>
    </AppShell>
  );
}
