// OTP verification — 6-digit code sent to the account email
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Button } from '../../components/ui/Button';
import { OtpInput } from '../../components/common/OtpInput';
import { DemoNote } from '../../components/common/DemoNote';
import { getDraft, setDraft, useStore } from '../../store/index';
import { api } from '../../lib/api';

const RESEND_SECS = 30;

export default function VerifyPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get('mode') ?? 'register';
  const draft = getDraft();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_SECS);
  const timerRef = useRef(null);

  const { signIn, hydrateFromApi } = useStore();

  useEffect(() => {
    startCooldown();
    return () => clearInterval(timerRef.current);
  }, []);

  async function resendCode() {
    try {
      await api.requestOtp(mode === 'login'
        ? { name: draft?.name || 'Yogdan member', identifier: draft?.identifier || draft?.email || draft?.mobile || '', purpose: 'login' }
        : { name: draft?.name || 'Yogdan member', email: draft?.email || '', mobile: draft?.mobile || '', purpose: 'register' });
      startCooldown();
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function startCooldown() {
    setCooldown(RESEND_SECS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCooldown((c) => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; }), 1000);
  }

  async function handleVerify() {
    if (otp.length < 6) { setError('Please enter all 6 digits.'); return; }
    try {
      if (mode === 'login') {
        const result = await api.verifyOtp({ identifier: draft?.identifier || draft?.email || draft?.mobile || '', otp, purpose: 'login' });
        localStorage.setItem('yogdan-access-token', result.token);
        signIn();
        await hydrateFromApi();
        navigate('/', { replace: true });
      } else {
        const result = await api.verifyOtp({ mobile: draft?.mobile ?? '', email: draft?.email ?? '', otp, purpose: 'register' });
        if (draft) setDraft({ ...draft, mobileVerified: true, verificationToken: result.verificationToken });
        navigate('/onboarding');
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const displayMobile = draft?.mobile ?? '';

  return (
    <AppShell>
      <ScreenHeader back={mode === 'login' ? '/login' : '/register'} />
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6">
        <div className="text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-ink">Verify your sign-in</h1>
          <p className="mt-2 text-sm text-muted">
            Enter the code we sent to{' '}
            <span className="font-semibold text-primary">{displayMobile}</span>
          </p>
        </div>

        <div className="mt-10">
          <OtpInput value={otp} onChange={(v) => { setOtp(v); setError(''); }} />
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          {cooldown > 0 ? `Resend code in 00:${String(cooldown).padStart(2, '0')}` : (
            <button type="button" className="font-semibold text-primary" onClick={resendCode}>Resend code</button>
          )}
        </p>

        <div className="mt-6">
          <DemoNote>We sent a one-time verification code to your email. The code expires in 10 minutes.</DemoNote>
        </div>

        {error && <p className="mt-3 text-center text-xs font-semibold text-primary">{error}</p>}

        <div className="mt-auto space-y-3 pt-8">
          <Button onClick={handleVerify}>Verify code</Button>
          <button type="button" className="w-full text-center text-sm text-muted" onClick={() => navigate(-1)}>
            Change email or mobile number
          </button>
        </div>
      </div>
    </AppShell>
  );
}
