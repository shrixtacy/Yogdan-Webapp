// Notification centre
import { Bell, CheckCheck } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { NotificationCard } from '../../components/ui/NotificationCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/index';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppShell>
      <ScreenHeader
        title="Notifications"
        back="/"
        right={
          unread > 0 && (
            <button type="button" onClick={markAllRead}
              className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-soft hover:bg-accent">
              <CheckCheck className="size-3.5" /> All read
            </button>
          )
        }
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="size-7" />}
            title="No notifications yet"
            description="Request alerts, donation updates and community activity will appear here."
          />
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onRead={markNotificationRead}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
