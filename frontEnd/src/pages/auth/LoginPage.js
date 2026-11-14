// Sign in with email or mobile number
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DemoNote } from '../../components/common/DemoNote';
import { setDraft, useStore } from '../../store/index';
import { api } from '../../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { account } = useStore();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim()) { setError('Enter your email address or mobile number.'); return; }
    api.requestOtp({ name: account?.name ?? 'Yogdan member', identifier: identifier.trim(), purpose: 'login' })
      .then((result) => { setDraft({ name: account?.name ?? '', email: result.email, mobile: result.mobile, identifier: identifier.trim(), authMethod: 'email-otp', mobileVerified: false }); navigate('/verify?mode=login'); })
      .catch((requestError) => setError(requestError.message));
  }

  return (
    <AppShell>
      <ScreenHeader back="/welcome" />
      <form onSubmit={handleSubmit} className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6">
        <div className="text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-ink">Welcome back</h1>
          <p className="mx-auto mt-2 max-w-[260px] text-sm text-muted">Enter your email or mobile number and we'll send a one-time code.</p>
        </div>

        <div className="mt-10">
          <Input id="identifier" label="Email or mobile number" autoComplete="username" placeholder="you@example.com or +91 98765 43210"
          value={identifier} onChange={(e) => setIdentifier(e.target.value)} error={error} />
          {account && !useStore.getState().signedIn && (
            <p className="mt-2 text-xs text-muted">Tip: this device has an account for {account.mobile.replace(/.(?=.{3})/g, '•')}</p>
          )}
        </div>

        <div className="mt-auto space-y-4 pt-8">
          <DemoNote>We will send a one-time verification code to the email address on your Yogdan account.</DemoNote>
          <Button type="submit">Send code <ArrowRight className="size-4" /></Button>
          <p className="text-center text-sm text-muted">
            New to Yogdan?{' '}
            <Link to="/register" className="font-semibold text-ink">Create an account</Link>
          </p>
        </div>
      </form>
    </AppShell>
  );
}
