// Leaderboard & Hall of Fame
import { useState } from 'react';
import { Trophy, Info } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { LeaderboardItem } from '../../components/ui/LeaderboardItem';
import { Avatar } from '../../components/ui/Avatar';
import { useStore } from '../../store/index';
import { rankBoard, verifiedDonationCount } from '../../lib/yogdan/rules';
import { cn } from '../../lib/utils';

function Podium({ top3 }) {
  const order = [top3[1], top3[0], top3[2]].filter(Boolean);
  const heights = [top3[1] ? 80 : 0, 110, top3[2] ? 60 : 0];
  const ranks = [2, 1, 3];
  const MEDALS = ['🥈', '🥇', '🥉'];

  return (
    <div className="flex items-end justify-center gap-3 pb-4 pt-2">
      {order.map((entry, i) => (
        <div key={entry.id} className="flex flex-col items-center gap-2">
          <span className="text-2xl">{MEDALS[i]}</span>
          <Avatar name={entry.name} hue={entry.hue} size={48} />
          <div className="text-center">
            <p className="max-w-[80px] truncate text-xs font-semibold text-ink">{entry.name.split(' ')[0]}</p>
            <p className="text-sm font-bold text-primary">{entry.verifiedAll}</p>
          </div>
          <div
            className={cn(
              'w-20 rounded-t-2xl flex items-center justify-center text-white font-bold text-lg',
              i === 1 ? 'bg-gradient-crimson shadow-crimson' : 'bg-secondary border border-border text-muted',
            )}
            style={{ height: heights[i] }}
          >
            {ranks[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const { leaderboard, account, donations } = useStore();
  const [board, setBoard] = useState('all');

  const ranked = rankBoard(leaderboard, board);
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const myVerified = verifiedDonationCount(donations);
  const myRank = account
    ? ranked.findIndex((e) => e.name === account.name) + 1
    : null;

  return (
    <AppShell>
      <ScreenHeader title="Hall of Fame" back="/" />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-4">
        {/* Board toggle */}
        <div className="flex gap-1 rounded-2xl bg-secondary p-1 mb-4">
          {['all', 'month'].map((b) => (
            <button key={b} type="button" onClick={() => setBoard(b)}
              className={cn('flex-1 rounded-xl py-2 text-sm font-semibold transition-all',
                board === b ? 'bg-white text-ink shadow-soft' : 'text-muted')}>
              {b === 'all' ? 'All time' : 'This month'}
            </button>
          ))}
        </div>

        {/* My rank banner */}
        {account && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-accent px-4 py-3 border border-primary/20">
            <Trophy className="size-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Your standing</p>
              <p className="text-xs text-muted">
                {myVerified} verified donation{myVerified !== 1 ? 's' : ''} ·{' '}
                {myRank ? `Rank #${myRank}` : 'Not on public board'}
              </p>
            </div>
          </div>
        )}

        {/* Podium */}
        {top3.length >= 1 && <Podium top3={top3} />}

        {/* Rest of the list */}
        <div className="space-y-2">
          {rest.map((entry, i) => (
            <LeaderboardItem
              key={entry.id}
              entry={entry}
              rank={i + 4}
              isCurrentUser={account?.name === entry.name}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-secondary/60 px-4 py-3 text-xs text-muted">
          <Info className="size-3.5 shrink-0 mt-0.5" />
          Only verified donations count. Eligibility and screening decisions are made by qualified staff at authorized blood banks — the leaderboard does not encourage or reward excessive donation.
        </div>
      </div>
    </AppShell>
  );
}
