// Welcome / landing screen shown to unauthenticated users
import { Link } from 'react-router-dom';
import { MapPinned, HeartHandshake, ShieldCheck } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { DemoNote } from '../../components/common/DemoNote';
import heartDrop from '../../assets/heart-drop.png';

const FEATURES = [
  { Icon: MapPinned,     title: 'Nearby, privately',       desc: 'Only approximate distances are ever shared.' },
  { Icon: HeartHandshake, title: 'Donor by choice',         desc: 'You decide if and when you\'re discoverable.' },
  { Icon: ShieldCheck,   title: 'Your records stay yours',  desc: 'Documents are private by default.' },
];

export default function WelcomePage() {
  return (
    <AppShell>
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-6 pt-6">
        {/* Hero */}
        <div className="relative flex flex-col items-center text-center">
          <div className="absolute top-6 size-56 rounded-full bg-accent blur-3xl" />
          <img src={heartDrop} alt="Yogdan" className="relative size-44 animate-float drop-shadow-xl" />
          <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.3em] text-primary">Yogdan</p>
          <h1 className="relative mt-2 text-[32px] font-bold leading-tight tracking-tight text-ink">
            Connecting donors,<br />saving lives.
          </h1>
          <p className="relative mt-3 max-w-xs text-[15px] text-muted">
            Request blood, volunteer as a donor and stand with your community — all in one private place.
          </p>
        </div>

        {/* Feature list */}
        <ul className="mt-8 space-y-3">
          {FEATURES.map(({ Icon, title, desc }) => (
            <li key={title} className="flex items-center gap-3 rounded-2xl glass p-3 shadow-soft">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="block text-xs text-muted">{desc}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-auto space-y-3 pt-8">
          <DemoNote>Preview mode: this app runs on sample data. No real donors, hospitals or SMS services are connected yet.</DemoNote>
          <Link to="/register">
            <Button>Create an account</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">I already have an account</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
