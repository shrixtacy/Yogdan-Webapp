// Community feed post card
import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Flag } from 'lucide-react';
import { Avatar } from './Avatar';
import { cn } from '../../lib/utils';
import { ago } from '../../lib/yogdan/format';

const KIND_BADGE = {
  story:        { label: 'Story',        cls: 'bg-accent text-primary' },
  announcement: { label: 'Announcement', cls: 'bg-ink text-white' },
  event:        { label: 'Event',        cls: 'bg-warning-soft text-warning' },
  awareness:    { label: 'Awareness',    cls: 'bg-success-soft text-success' },
};

export function CommunityPost({ post, currentUserId, onLike, onDelete, onReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwn = post.authorId === currentUserId;
  const kind = KIND_BADGE[post.kind] ?? KIND_BADGE.story;

  return (
    <article className="rounded-3xl border border-border bg-white p-4 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar name={post.authorName} hue={post.authorHue} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-ink">{post.authorName}</p>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', kind.cls)}>{kind.label}</span>
          </div>
          <p className="text-[11px] text-muted">{ago(post.createdAt)}</p>
        </div>
        <div className="relative">
          <button type="button" aria-label="Post options" onClick={() => setMenuOpen((v) => !v)}
            className="grid size-8 place-items-center rounded-full text-muted hover:bg-accent">
            <MoreHorizontal className="size-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 w-44 rounded-2xl border border-border bg-white py-1 shadow-card">
              {isOwn ? (
                <button type="button" onClick={() => { onDelete?.(post.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-accent">
                  <Trash2 className="size-4" /> Delete post
                </button>
              ) : (
                <button type="button" onClick={() => { onReport?.(post.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-accent">
                  <Flag className="size-4" /> Report post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <p className="mt-3 text-[15px] leading-relaxed text-ink">{post.text}</p>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
        <button type="button" onClick={() => onLike?.(post.id)}
          className={cn('flex items-center gap-1.5 text-sm font-semibold transition-colors', post.likedByMe ? 'text-primary' : 'text-muted hover:text-primary')}>
          <Heart className={cn('size-4', post.likedByMe && 'fill-current')} /> {post.likes}
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <MessageCircle className="size-4" /> {post.comments?.length ?? 0}
        </button>
        <button type="button" className="ml-auto flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <Share2 className="size-4" /> Share
        </button>
      </div>
    </article>
  );
}
