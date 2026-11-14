// Generic info screen for About, Help, Terms, Privacy
import { useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

const CONTENT = {
  about: {
    title: 'About Yogdan',
    body: `Yogdan — Connecting Donors, Saving Lives.

Yogdan is a voluntary blood donation coordination platform that helps connect people who need blood with potential donors in their area.

We use staged, proximity-based matching to find opted-in donors closest to where blood is needed, respecting donor preferences and notification cooldowns at every step.

Yogdan is a discovery and coordination platform only. All donor eligibility checks, blood compatibility screening, cross-matching and transfusion decisions are carried out by qualified professionals at authorized blood banks and hospitals.

Version: 1.0.0 (Preview)`,
  },
  help: {
    title: 'Help & Support',
    body: `Getting started

Create an account, verify your mobile number, and complete your profile during onboarding.

Requesting blood

Tap the blood-drop button in the bottom navigation. Walk through the 6-step form with patient details, blood group, urgency, hospital, and location.

Becoming a donor

Go to Profile → Blood & donor details and enable "Discoverable as a donor". Donor consent is explicit — you will not be listed automatically.

Health check-ins

Your weekly check-in is a private record. It does not affect your donor status or notify anyone. Health data is never shared publicly.

Documents

All uploaded documents are private by default and are never shown on the community feed or leaderboard.

Demo mode

This preview uses sample data. No real SMS, matching or notifications are active.`,
  },
  terms: {
    title: 'Terms & Conditions',
    body: `These terms apply to your use of Yogdan in its current preview form.

1. Yogdan is a donor discovery and coordination platform. It is not a clinical service, blood bank or medical provider.

2. All donation eligibility, blood compatibility, cross-matching and transfusion decisions must be made by qualified professionals at authorized blood banks and hospitals.

3. Yogdan does not guarantee donor availability or the accuracy of blood group information provided by users.

4. Users must provide accurate information. Misuse of the platform, including false requests or impersonation, is prohibited.

5. Health records stored in the app are for personal reference only. They are not medical records and do not constitute medical advice.

6. Donor consent is explicit and can be withdrawn at any time from Profile → Blood & donor details.

7. This is a preview build. Features, data and terms may change.`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `Your privacy is fundamental to how Yogdan works.

What we collect
- Name, mobile number, email, and location (approximate only).
- Blood group (self-reported, unverified by default).
- Health check-in data (stored locally in your browser, private by default).
- Documents you upload (private by default, never shared publicly).

What we share
- Approximate distance to nearby blood requests (never your exact location).
- Your name and blood group only when you explicitly respond to a request.
- Verified donation counts for the leaderboard, only if you opt in to public ranking.

What we never do
- Share your contact information without your consent.
- Display your medical documents publicly.
- Use your health data for eligibility decisions.
- Sell or share your data with third parties for advertising.

Data deletion
You can delete your account and all associated data at any time from Profile → Settings.

Preview note
This is a local-storage demo. No data is transmitted to a remote server in this build.`,
  },
};

export default function InfoPage() {
  const { page } = useParams();
  const content = CONTENT[page] ?? { title: page, body: 'Content not found.' };

  return (
    <AppShell>
      <ScreenHeader title={content.title} back="/settings" />
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-card">
          {content.body.split('\n\n').map((para, i) => (
            <p key={i} className={`text-sm leading-relaxed text-ink mb-4 last:mb-0 ${para.length < 40 && !para.includes(' ') ? 'font-bold text-base' : ''}`}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
