// Account creation — name, mobile, email or Google demo
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DemoBadge } from '../../components/common/DemoNote';
import { setDraft } from '../../store/index';
import { api } from '../../lib/api';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});

  const field = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }), error: errors[key] });

  function handleGoogleDemo() {
    setDraft({ name: '', email: '', mobile: '', authMethod: 'mock-google', mobileVerified: false });
    navigate('/onboarding');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your full name';
    if (!/^\+?[\d\s]{10,15}$/.test(form.mobile)) errs.mobile = 'Enter a valid mobile number';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await api.requestOtp({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), mobile: form.mobile.trim(), purpose: 'register' });
      setDraft({ name: form.name.trim(), email: form.email.trim().toLowerCase(), mobile: form.mobile.trim(), authMethod: 'email-otp', mobileVerified: false });
      navigate('/verify?mode=register');
    } catch (requestError) {
      setErrors({ submit: requestError.message });
    }
  }

  return (
    <AppShell>
      <ScreenHeader back="/welcome" />
      <form onSubmit={handleSubmit} className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6">
        <div className="text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-ink">Create an account</h1>
          <p className="mx-auto mt-2 max-w-[260px] text-sm text-muted">Request blood, or volunteer when you're ready — from one private profile.</p>
        </div>

        <button type="button" onClick={handleGoogleDemo}
          className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white text-[15px] font-semibold text-ink shadow-soft transition-colors hover:border-primary/30">
          <GoogleMark /> Continue with Google <DemoBadge />
        </button>

        <div className="my-6 flex items-center gap-4 text-xs text-muted">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          <Input id="name" label="Full name" autoComplete="name" placeholder="Your full name" {...field('name')} />
          <Input id="mobile" label="Mobile number" type="tel" inputMode="tel" placeholder="+91 98765 43210" hint="We'll verify this with a one-time code." {...field('mobile')} />
          <Input id="email" label="Email address" type="email" placeholder="you@example.com" {...field('email')} />
        </div>

        <div className="mt-auto pt-8">
          {errors.submit && <p className="mb-3 text-center text-xs font-semibold text-primary">{errors.submit}</p>}
          <Button type="submit">Continue <ArrowRight className="size-4" /></Button>
          <p className="mt-4 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-ink">Sign in</Link>
          </p>
        </div>
      </form>
    </AppShell>
  );
}
