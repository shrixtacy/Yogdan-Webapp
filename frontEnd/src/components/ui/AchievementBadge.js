// Achievement badge card
import { cn } from '../../lib/utils';

const BADGES = {
  'first-donation':   { icon: '🩸', label: 'First Donation',         desc: 'First verified donation recorded' },
  'life-supporter':   { icon: '🛡️', label: 'Life Supporter',         desc: 'Multiple verified donations' },
  'consistent':       { icon: '🔁', label: 'Consistent Contributor',  desc: 'Regular donations over time' },
  'champion':         { icon: '🏆', label: 'Community Champion',      desc: 'Outstanding community contribution' },
  'verified-donor':   { icon: '✅', label: 'Verified Donor',          desc: 'Blood group verified by blood bank' },
};

export function AchievementBadge({ type, earned, className }) {
  const badge = BADGES[type] ?? { icon: '⭐', label: type, desc: '' };
  return (
    <div className={cn(
      'flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center',
      earned ? 'border-primary/20 bg-accent' : 'border-border bg-white opacity-50',
      className,
    )}>
      <span className="text-2xl">{badge.icon}</span>
      <p className={cn('text-xs font-bold leading-tight', earned ? 'text-primary' : 'text-muted')}>{badge.label}</p>
      <p className="text-[10px] text-muted leading-tight">{badge.desc}</p>
    </div>
  );
}

export { BADGES };
