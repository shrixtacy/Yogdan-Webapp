// 4-step onboarding wizard: About you / Blood group / Location / Your choice
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Info, HeartHandshake, ArrowRight, LocateFixed } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BloodGroupPicker } from '../../components/common/BloodGroupPicker';
import { DemoBadge } from '../../components/common/DemoNote';
import { getDraft, useStore, clearDraft } from '../../store/index';
import { cn } from '../../lib/utils';

const STEPS = ['About you', 'Blood group', 'Location', 'Your choice'];

function ProgressBar({ step }) {
  return (
    <div className="mb-6 flex gap-1.5">
      {STEPS.map((_, i) => (
        <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', i <= step ? 'bg-gradient-crimson' : 'bg-border')} />
      ))}
    </div>
  );
}

function Heading({ title, sub }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="whitespace-pre-line text-[26px] font-bold leading-tight tracking-tight text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-[290px] text-sm text-muted">{sub}</p>
    </div>
  );
}

function Toggle({ id, checked, onChange, label, description }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-[15px] font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 cursor-pointer accent-primary" />
    </label>
  );
}

function Checkbox({ id, checked, onChange, children }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <button id={id} type="button" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded border-2 transition-colors', checked ? 'border-transparent bg-gradient-crimson text-white' : 'border-border bg-white')}>
        {checked && <span className="text-xs">✓</span>}
      </button>
      <span className="text-sm leading-relaxed text-ink">{children}</span>
    </label>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [draft, setLocalDraft] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', dob: '', locality: '', city: '', approx: false, location: null, locationAccuracyMeters: null, locationCapturedAt: null });
  const [bloodGroup, setBloodGroup] = useState(null);
  const [consent, setConsent] = useState({ donor: false, available: false, contact: false, terms: false, privacy: false, donorAck: false });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const d = getDraft();
    if (!d) { navigate('/register', { replace: true }); return; }
    setLocalDraft(d);
    setForm((f) => ({ ...f, name: d.name, email: d.email, mobile: d.mobile }));
  }, []);

  const up = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const con = (key, val) => setConsent((c) => ({ ...c, [key]: val }));

  function captureLocation() {
    if (!navigator.geolocation) {
      setErrors({ locality: 'Location is not supported by this browser. Enter your locality and city manually.' });
      return;
    }
    setErrors({});
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let locality = '';
        let city = '';
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`);
          if (response.ok) {
            const result = await response.json();
            locality = result.address?.suburb || result.address?.neighbourhood || result.address?.town || '';
            city = result.address?.city || result.address?.municipality || result.address?.state_district || '';
          }
        } catch {
          // GPS coordinates remain usable when reverse geocoding is unavailable.
        }
        setForm((current) => ({
          ...current,
          approx: true,
          locality: locality || current.locality,
          city: city || current.city,
          location: { type: 'Point', coordinates: [position.coords.longitude, position.coords.latitude] },
          locationAccuracyMeters: position.coords.accuracy,
          locationCapturedAt: new Date().toISOString(),
        }));
      },
      (error) => {
        setErrors({ locality: error.code === error.PERMISSION_DENIED ? 'Location permission was denied. Allow it in your browser or enter your area manually.' : 'We could not determine your location. Try again or enter your area manually.' });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function validate() {
    const e = {};
    if (step === 0) {
      if (form.name.trim().length < 2) e.name = 'Please enter your full name';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
      if (!/^\+?[\d\s]{10,15}$/.test(form.mobile)) e.mobile = 'Enter a valid mobile number';
    }
    if (step === 1 && !bloodGroup) e.bloodGroup = 'Choose your blood group';
    if (step === 2 && (!form.locality.trim() || !form.city.trim())) e.locality = 'Enter your locality and city';
    if (step === 3) {
      if (!consent.terms || !consent.privacy) e.terms = 'Please accept the Terms and Privacy Policy';
      if (consent.donor && !consent.donorAck) e.donorAck = 'Please confirm donor consent';
    }
    return e;
  }

  async function handleNext() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 3) { setStep(step + 1); return; }
    const nowIso = new Date().toISOString();
    setSaving(true);
    try {
      await completeOnboarding({
        name: form.name.trim(), email: form.email.trim(), mobile: form.mobile.trim(),
        mobileVerified: draft?.mobileVerified ?? false,
        verificationToken: draft?.verificationToken,
        authMethod: draft?.authMethod ?? 'mock-mobile',
        dob: form.dob || undefined,
        locality: form.locality.trim(), city: form.city.trim(),
        approxLocationShared: form.approx,
        location: form.location,
        locationAccuracyMeters: form.locationAccuracyMeters,
        locationCapturedAt: form.locationCapturedAt,
        bloodGroup: bloodGroup ?? 'Unknown', bloodVerification: 'unverified',
        donorConsent: consent.donor, donorConsentAt: consent.donor ? nowIso : undefined,
        available: consent.donor && consent.available,
        contactSharing: consent.contact ? 'after-accept' : 'never',
        termsAcceptedAt: nowIso, privacyAcceptedAt: nowIso,
      });
      clearDraft();
      navigate('/', { replace: true });
    } catch (requestError) {
      setErrors({ submit: requestError.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="grid shrink-0 grid-cols-[48px_1fr_48px] items-center px-3 pb-2 pt-4">
        <div>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="grid size-11 place-items-center rounded-full text-ink hover:bg-white">
              ‹
            </button>
          )}
        </div>
        <span className="text-center text-xs font-semibold text-muted">{step + 1}/{STEPS.length}</span>
        <div />
      </div>

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6">
        <ProgressBar step={step} />

        {step === 0 && (
          <div className="animate-fade-up space-y-4">
            <Heading title="Tell us about you" sub="This helps hospitals and requesters know who they're talking to." />
            {draft?.authMethod === 'mock-google' && <DemoBadge>Google sign-in not connected — enter details manually</DemoBadge>}
            <Input id="name" label="Full name" value={form.name} onChange={(e) => up('name', e.target.value)} error={errors.name} />
            <Input id="email" label="Email" type="email" value={form.email} onChange={(e) => up('email', e.target.value)} error={errors.email} />
            <Input id="mobile" label="Mobile number" type="tel" value={form.mobile} onChange={(e) => up('mobile', e.target.value)} error={errors.mobile} hint={draft?.mobileVerified ? 'Verified with demo code' : undefined} disabled={!!draft?.mobileVerified} />
            <Input id="dob" label="Date of birth (optional)" type="date" value={form.dob} onChange={(e) => up('dob', e.target.value)} />
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <Heading title="Your blood group" sub="Pick what your report says. Not sure? Choose Unknown — we'll never guess it for you." />
            <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />
            {errors.bloodGroup && <p className="mt-3 text-xs font-semibold text-primary">{errors.bloodGroup}</p>}
            <div className="mt-5 flex gap-3 rounded-2xl glass-blush p-4 text-xs leading-relaxed text-ink">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              Your blood group will show as <strong>unverified</strong> until you upload a report and it's checked by an authorised blood bank.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up space-y-4">
            <Heading title="Where are you based?" sub="Used to show nearby requests. Others only ever see an approximate distance." />
            <button type="button" onClick={captureLocation}
              className={cn('flex w-full items-center gap-3 rounded-2xl border p-4 text-left shadow-soft transition-colors', form.approx ? 'border-primary/50 bg-white' : 'border-border bg-white')}>
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><LocateFixed className="size-5" /></span>
              <span>
                <span className="block text-sm font-semibold text-ink">{form.approx ? 'Precise location captured' : 'Use my precise location'}</span>
                <span className="block text-xs text-muted">{form.approx ? `GPS accuracy about ${Math.round(form.locationAccuracyMeters || 0)} m · shown to others as approximate distance` : 'Used privately for nearby matching and distance calculations'}</span>
              </span>
            </button>
            <Input id="locality" label="Locality / neighbourhood" placeholder="e.g. Salt Lake" value={form.locality} onChange={(e) => up('locality', e.target.value)} error={errors.locality} />
            <Input id="city" label="City" placeholder="e.g. Kolkata" value={form.city} onChange={(e) => up('city', e.target.value)} />
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-up space-y-4">
            <Heading title={'Your data.\nYour choice.'} sub="You can request blood without becoming a donor. Change any of this later in Settings." />
            <div className="rounded-3xl border border-border bg-white p-4 shadow-card space-y-4">
              <Toggle id="donor" checked={consent.donor} onChange={(v) => setConsent((c) => ({ ...c, donor: v, available: v ? c.available : false, donorAck: v ? c.donorAck : false }))} label="Be discoverable as a donor" description="Nearby requests for your blood group may reach you. Off by default." />
              {consent.donor && <Toggle id="avail" checked={consent.available} onChange={(v) => con('available', v)} label="I'm available right now" description="Pause anytime from Home." />}
              <Toggle id="contact" checked={consent.contact} onChange={(v) => con('contact', v)} label="Share my number after I accept" description="Otherwise you'll coordinate inside Yogdan only." />
            </div>
            {consent.donor && (
              <div className="rounded-2xl glass-blush p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink"><HeartHandshake className="size-4 text-primary" /> Donor consent</div>
                <Checkbox id="donorAck" checked={consent.donorAck} onChange={(v) => con('donorAck', v)}>
                  I consent to being matched with nearby blood requests. I understand Yogdan doesn't decide whether I can donate — eligibility and screening are done by qualified staff at the blood bank.
                </Checkbox>
                {errors.donorAck && <p className="text-xs font-semibold text-primary">{errors.donorAck}</p>}
              </div>
            )}
            <div className="space-y-3 px-1">
              <Checkbox id="terms" checked={consent.terms} onChange={(v) => con('terms', v)}>
                I agree to the <Link to="/info/terms" className="font-semibold text-primary">Terms & Conditions</Link>
              </Checkbox>
              <Checkbox id="privacy" checked={consent.privacy} onChange={(v) => con('privacy', v)}>
                I've read the <Link to="/info/privacy" className="font-semibold text-primary">Privacy Policy</Link>
              </Checkbox>
              {errors.terms && <p className="text-xs font-semibold text-primary">{errors.terms}</p>}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-3 pt-8">
          {errors.submit && <p className="text-center text-xs font-semibold text-primary">{errors.submit}</p>}
          <Button onClick={handleNext} disabled={saving}>
            {saving ? 'Saving…' : step < 3 ? <>Continue <ArrowRight className="size-4" /></> : 'Get started'}
          </Button>
          {step > 0 && (
            <button type="button" className="w-full text-center text-sm text-muted" onClick={() => setStep(step - 1)}>Back</button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
