// Notification list item
import { Bell, Droplets, HeartPulse, Trophy, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ago } from '../../lib/yogdan/format';

const KIND_ICON = {
  nearby:       <Droplets className="size-4" />,
  responses:    <Users className="size-4" />,
  updates:      <Bell className="size-4" />,
  verification: <ShieldCheck className="size-4" />,
  assessment:   <HeartPulse className="size-4" />,
  community:    <Users className="size-4" />,
  achievements: <Trophy className="size-4" />,
};

export function NotificationCard({ notification, onRead }) {
  return (
    <button
      type="button"
      onClick={() => onRead?.(notification.id)}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-colors',
        notification.read ? 'bg-white' : 'bg-accent/60',
      )}
    >
      <div className={cn('grid size-9 shrink-0 place-items-center rounded-xl', notification.read ? 'bg-secondary text-muted' : 'bg-accent text-primary')}>
        {KIND_ICON[notification.kind] ?? <Bell className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold text-ink', !notification.read && 'text-ink')}>{notification.title}</p>
        {notification.body && <p className="mt-0.5 text-xs text-muted leading-relaxed">{notification.body}</p>}
        <p className="mt-1 text-[11px] text-muted">{ago(notification.at)}</p>
      </div>
      {!notification.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
    </button>
  );
}
