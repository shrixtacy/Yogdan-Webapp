// Community — donor feed, stories, events, announcements
import { useState } from 'react';
import { Plus, Info, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { CommunityPost } from '../../components/ui/CommunityPost';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/index';
import { cn } from '../../lib/utils';

const FILTERS = ['All', 'Stories', 'Events', 'Announcements', 'Awareness'];
const KIND_MAP = {
  Stories: 'story',
  Events: 'event',
  Announcements: 'announcement',
  Awareness: 'awareness',
};

function CreatePostModal({ onClose, onCreate }) {
  const [text, setText] = useState('');
  const [kind, setKind] = useState('story');
  const KINDS = ['story', 'awareness', 'event', 'announcement'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[440px] rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-phone">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">New post</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full border border-border text-muted hover:bg-accent">✕</button>
        </div>

        {/* Kind picker */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {KINDS.map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)}
              className={cn('rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors',
                kind === k ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted')}>
              {k}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a story, spread awareness, or post about an event…"
          rows={4}
          className="form-control min-h-28 w-full resize-none"
        />

        <div className="mt-3 flex gap-2 rounded-2xl bg-secondary/60 p-3 text-xs text-muted">
          <Info className="size-3.5 shrink-0 mt-0.5 text-muted" />
          Never share patient details, medical documents or personal contact information in public posts.
        </div>

        <div className="mt-4">
          <Button
            disabled={!text.trim()}
            onClick={() => { onCreate({ kind, text: text.trim() }); onClose(); }}
          >Publish</Button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { posts, account, toggleLike, createPost, deletePost, blockedUserIds } = useStore();
  const [filter, setFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);

  const visible = posts
    .filter((p) => !blockedUserIds?.includes(p.authorId))
    .filter((p) => filter === 'All' || p.kind === KIND_MAP[filter]);

  return (
    <AppShell>
      <div className="shrink-0 px-5 pb-2 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Community</h1>
            <p className="mt-0.5 text-sm text-muted">Stories, events and awareness</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/leaderboard" aria-label="Hall of Fame"
              className="grid size-11 place-items-center rounded-full border border-border bg-white text-primary shadow-soft transition-transform hover:border-primary/30 active:scale-95">
              <Trophy className="size-5" />
            </Link>
            {account && (
              <button type="button" onClick={() => setShowCreate(true)} aria-label="Create post"
                className="grid size-11 place-items-center rounded-full bg-gradient-crimson text-white shadow-crimson hover:brightness-105 active:scale-95">
                <Plus className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={cn('rounded-full border px-4 py-1.5 text-xs font-semibold shrink-0 transition-colors',
                filter === f ? 'border-[#191919] bg-[#191919] text-white' : 'border-[#EAEAEA] bg-white text-[#858585] hover:border-[#191919]')}>
              {f}
            </button>
          ))}
        </div>

        {/* Community guidelines notice */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#191919] px-4 py-2.5 text-xs text-white/70">
          <Info className="size-3.5 shrink-0 text-muted" />
          Be respectful. No patient info or medical documents. Posts may be moderated.
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-3 space-y-3">
        {visible.length === 0 ? (
          <EmptyState
            icon={<span className="text-2xl">💬</span>}
            title="No posts yet"
            description="Be the first to share a story or announce an event."
          />
        ) : (
          visible.map((post) => (
            <CommunityPost
              key={post.id}
              post={post}
              currentUserId={account?.id}
              onLike={toggleLike}
              onDelete={(id) => deletePost(id)}
              onReport={(id) => alert(`Post ${id} reported. Our team will review it.`)}
            />
          ))
        )}
      </div>

      {showCreate && (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
          onCreate={(data) => createPost(data)}
        />
      )}

      <BottomTabBar />
    </AppShell>
  );
}
