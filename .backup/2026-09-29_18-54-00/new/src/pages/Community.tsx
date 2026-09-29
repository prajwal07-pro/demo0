import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Share2,
  Bookmark,
  ThumbsUp,
  MapPin,
  Plus,
  TrendingUp,
  Sparkles,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea, Input } from '@/components/ui/Input';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAppStore, useUser } from '@/store/useAppStore';

interface Post {
  id: string;
  author: { name: string; role: string; initials: string };
  timestamp: string;
  title: string;
  content: string;
  tags: string[];
  region: string;
  reactions: number;
  comments: number;
  type: 'observation' | 'analysis' | 'project' | 'question';
}

const INITIAL_FEED: Post[] = [
  {
    id: 'p1',
    author: { name: 'Dr. A. Mehta', role: 'Marine Scientist', initials: 'AM' },
    timestamp: '2h ago',
    title: 'Unusual SST anomaly in the Bay of Bengal',
    content:
      'Persistent warm patch (2°C above climatology) observed offshore Paradip for the last 5 days. Correlating with weakening monsoon winds and lower chlorophyll.',
    tags: ['sst', 'bay-of-bengal', 'anomaly'],
    region: 'Bay of Bengal',
    reactions: 42,
    comments: 12,
    type: 'observation',
  },
  {
    id: 'p2',
    author: { name: 'R. Krishnan', role: 'Researcher', initials: 'RK' },
    timestamp: '6h ago',
    title: 'Open dataset: AIS anomalies 2024',
    content:
      'Curated a dataset of ~4,200 AIS gaps from the Arabian Sea. Looking for collaborators to cross-reference with SAR imagery.',
    tags: ['ais', 'open-data', 'collaboration'],
    region: 'Arabian Sea',
    reactions: 78,
    comments: 24,
    type: 'project',
  },
  {
    id: 'p3',
    author: { name: 'S. Iyer', role: 'Fisheries Analyst', initials: 'SI' },
    timestamp: '1d ago',
    title: 'PFZ verification — Kochi offshore',
    content:
      "Ground-truthed yesterday's PFZ forecast. Catch rates were 3x above baseline in the predicted zone. Model is holding up well.",
    tags: ['pfz', 'validation', 'fisheries'],
    region: 'Kochi',
    reactions: 156,
    comments: 31,
    type: 'analysis',
  },
];

const TRENDING_TOPICS = [
  { tag: 'bay-of-bengal', count: 234 },
  { tag: 'sst-anomaly', count: 187 },
  { tag: 'pfz-2024', count: 152 },
  { tag: 'ais-gaps', count: 98 },
  { tag: 'cyclone-mocha', count: 76 },
];

export default function Community() {
  const { isAuthenticated } = useUser();
  const showToast = useAppStore((s) => s.showToast);

  const [posts, setPosts] = React.useState<Post[]>(INITIAL_FEED);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [composerTitle, setComposerTitle] = React.useState('');
  const [composerBody, setComposerBody] = React.useState('');

  const [liked, setLiked] = React.useState<Record<string, boolean>>({});
  const [saved, setSaved] = React.useState<Record<string, boolean>>({});

  const requireAuth = (label: string): boolean => {
    if (isAuthenticated) return true;
    showToast(`Sign in to ${label}.`, 'info');
    return false;
  };

  const handleOpenComposer = () => {
    if (!requireAuth('create a post')) return;
    setComposerOpen(true);
  };

  const handlePublish = () => {
    const title = composerTitle.trim();
    const body = composerBody.trim();
    if (!title || !body) {
      showToast('Title and body are required.', 'warning');
      return;
    }
    const post: Post = {
      id: `p_${Date.now()}`,
      author: { name: 'You', role: 'Operator', initials: 'YO' },
      timestamp: 'now',
      title,
      content: body,
      tags: ['community'],
      region: 'Global',
      reactions: 0,
      comments: 0,
      type: 'observation',
    };
    setPosts((prev) => [post, ...prev]);
    setComposerOpen(false);
    setComposerTitle('');
    setComposerBody('');
    showToast('Post published locally.', 'success');
  };

  const toggleLike = (id: string) => {
    if (!requireAuth('like posts')) return;
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    if (!requireAuth('save posts')) return;
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.content });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${post.title} — ${post.content}`);
        showToast('Post copied to clipboard.', 'success');
      }
    } catch {
      /* user cancelled or clipboard failed — ignore */
    }
  };

  const handleJoinGroup = () => {
    if (!requireAuth('join groups')) return;
    showToast('Join request sent (demo).', 'success');
  };

  return (
    <div className="relative bg-pearl text-ink">
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                RESEARCH COMMUNITY
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              Share observations,
              <br />
              <span className="text-gradient-navy">build the network.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-2xl text-base text-ink-soft leading-relaxed"
            >
              Publish analyses, collaborate on open datasets, and join working
              groups with scientists and operators worldwide.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <div>
              <div className="mb-5 rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-semibold text-xs">
                    YOU
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={handleOpenComposer}
                      className="w-full text-left rounded-xl border border-ink/10 bg-pearl-soft px-4 py-2.5 text-sm text-ink-muted hover:border-ocean/40 hover:text-ink transition-colors"
                    >
                      Share an observation, analysis, or question…
                    </button>
                  </div>
                  <Button
                    size="sm"
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    onClick={handleOpenComposer}
                  >
                    Post
                  </Button>
                </div>
              </div>

              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {posts.map((post) => (
                  <motion.li key={post.id} variants={fadeInUp}>
                    <PostCard
                      post={post}
                      liked={Boolean(liked[post.id])}
                      saved={Boolean(saved[post.id])}
                      onLike={() => toggleLike(post.id)}
                      onSave={() => toggleSave(post.id)}
                      onShare={() => handleShare(post)}
                      onComment={() => showToast('Comments (demo) — coming soon.', 'info')}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <aside className="flex flex-col gap-5">
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-ocean" />
                  <div className="font-mono text-[10px] tracking-widest text-ocean">
                    NETWORK · STATS
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Members" value="12.4K" />
                  <Stat label="Active today" value="1.8K" />
                  <Stat label="Observations" value="24.2K" />
                  <Stat label="Projects" value="312" />
                </div>
              </div>

              <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-ocean" />
                  <div className="font-mono text-[10px] tracking-widest text-ocean">
                    TRENDING
                  </div>
                </div>
                <ul className="flex flex-col gap-1">
                  {TRENDING_TOPICS.map((t) => (
                    <li key={t.tag}>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Filtering by #${t.tag} (demo)`, 'info')
                        }
                        className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-ink/[0.04] transition-colors"
                      >
                        <Hash className="h-3 w-3 text-ocean/60" />
                        <span className="flex-1 text-xs text-ink">{t.tag}</span>
                        <span className="font-mono text-[9px] text-mist-deep">
                          {t.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-ocean/20 bg-ice/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-ocean" />
                  <div className="font-mono text-[10px] tracking-widest text-ocean">
                    SUGGESTED
                  </div>
                </div>
                <p className="text-sm text-ink leading-snug">
                  Join the{' '}
                  <span className="text-ocean font-medium">
                    Bay of Bengal SST Working Group
                  </span>
                </p>
                <p className="mt-2 text-[11px] text-ink-soft">
                  42 researchers collaborating on monsoon-ocean coupling.
                </p>
                <Button
                  variant="secondary-light"
                  size="sm"
                  fullWidth
                  className="mt-4"
                  onClick={handleJoinGroup}
                >
                  Join Group
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Dialog
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="Share an observation"
        description="Publish a note, analysis, or question for the ORCA community."
        size="lg"
        footer={
          <>
            <Button variant="ghost-light" size="md" onClick={() => setComposerOpen(false)}>
              Cancel
            </Button>
            <Button size="md" onClick={handlePublish}>
              Publish
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            variant="light"
            label="TITLE"
            placeholder="A short, descriptive title"
            value={composerTitle}
            onChange={(e) => setComposerTitle(e.target.value)}
          />
          <Textarea
            variant="light"
            label="BODY"
            placeholder="Describe what you observed, what you're working on, or what you want to ask…"
            value={composerBody}
            onChange={(e) => setComposerBody(e.target.value)}
            rows={6}
          />
          <p className="text-[11px] text-ink-soft leading-relaxed">
            Posts are stored locally in your browser during this phase. No
            backend publishing is wired yet.
          </p>
        </div>
      </Dialog>
    </div>
  );
}

function PostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
  onComment,
}: {
  post: Post;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onComment: () => void;
}) {
  const typeBadge: {
    variant: 'light-info' | 'light-violet' | 'light-teal' | 'light-warning';
    label: string;
  } = {
    observation: { variant: 'light-info', label: 'OBSERVATION' },
    analysis: { variant: 'light-violet', label: 'ANALYSIS' },
    project: { variant: 'light-teal', label: 'PROJECT' },
    question: { variant: 'light-warning', label: 'QUESTION' },
  }[post.type];

  return (
    <article className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft">
      <header className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-xs shrink-0">
          {post.author.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink truncate">
              {post.author.name}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-ocean/70 truncate">
              {post.author.role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-mist-deep">
            <span>{post.timestamp}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" />
              {post.region}
            </span>
          </div>
        </div>
        <Badge variant={typeBadge.variant} size="sm">
          {typeBadge.label}
        </Badge>
      </header>

      <h3 className="font-display text-lg font-semibold text-ink mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-ink-soft leading-relaxed">{post.content}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-pearl-soft px-2 py-0.5 font-mono text-[10px] text-ocean"
          >
            #{t}
          </span>
        ))}
      </div>

      <footer className="mt-5 pt-4 border-t border-ink/[0.06] flex items-center gap-4">
        <button
          type="button"
          onClick={onLike}
          className={cn(
            'flex items-center gap-1.5 text-xs transition-colors',
            liked ? 'text-ocean' : 'text-ink-soft hover:text-ocean'
          )}
        >
          <ThumbsUp className={cn('h-3.5 w-3.5', liked && 'fill-current')} />
          {post.reactions + (liked ? 1 : 0)}
        </button>
        <button
          type="button"
          onClick={onComment}
          className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ocean transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {post.comments}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ocean transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
        <button
          type="button"
          onClick={onSave}
          className={cn(
            'ml-auto flex items-center gap-1.5 text-xs transition-colors',
            saved ? 'text-ocean' : 'text-ink-soft hover:text-ocean'
          )}
        >
          <Bookmark className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </footer>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/[0.06] bg-pearl-soft p-3">
      <div className="font-mono text-[9px] tracking-widest text-mist-deep">
        {label.toUpperCase()}
      </div>
      <div className="font-display text-lg font-semibold text-ink tabular-nums mt-0.5">
        {value}
      </div>
    </div>
  );
}