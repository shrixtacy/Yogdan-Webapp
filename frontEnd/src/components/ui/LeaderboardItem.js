// Leaderboard row item
import { Avatar } from './Avatar';
import { cn } from '../../lib/utils';

const RANK_STYLES = {
  1: 'bg-[#FFD700]/20 text-[#B8860B] font-black',
  2: 'bg-[#C0C0C0]/20 text-[#808080] font-black',
  3: 'bg-[#CD7F32]/20 text-[#8B4513] font-black',
};

export function LeaderboardItem({ entry, rank, isCurrentUser }) {
  return (
    <div className={cn(
      'flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors',
      isCurrentUser ? 'bg-accent border border-primary/20' : 'bg-white border border-border',
    )}>
      <span className={cn('grid size-8 shrink-0 place-items-center rounded-xl text-sm', RANK_STYLES[rank] ?? 'bg-secondary text-muted font-semibold')}>
        {rank}
      </span>
      <Avatar name={entry.name} hue={entry.hue} size={36} />
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold truncate', isCurrentUser ? 'text-primary' : 'text-ink')}>
          {entry.name} {isCurrentUser && '(you)'}
        </p>
        <p className="text-xs text-muted">{entry.locality}</p>
      </div>
      <div className="text-right">
        <p className="text-base font-bold text-primary">{entry.verifiedAll}</p>
        <p className="text-[10px] text-muted">donations</p>
      </div>
    </div>
  );
}
