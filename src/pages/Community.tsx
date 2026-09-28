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
import { fadeInUp, staggerContainer } from '@/lib/animations';

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

const FEED: Post[] = [
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
      'Ground-truthed yesterday\'s PFZ forecast. Catch rates were 3x above baseline in the predicted zone. Model is holding up well.',
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

/**
 * Community — research network and observations feed.
 * Combines the vibe of a research platform, GitHub, and Discord — but
 * native to ORCA. Data integrity: user posts are clearly attributed.
 */
export default function Community() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            MODULE · COMMUNITY
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Research Community
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 max-w-2xl text-muted-foreground">
          Share observations, publish analyses, and collaborate across the
          marine research network.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Feed */}
        <div>
          {/* Composer */}
          <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.015] p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-semibold text-xs">
                YOU
              </div>
              <div className="flex-1">
                <button className="w-full text-left rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-muted-foreground hover:border-cyan/40 hover:text-white transition-colors">
                  Share an observation, analysis, or question…
                </button>
              </div>
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Post
              </Button>
            </div>
          </div>

          {/* Feed list */}
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {FEED.map((post) => (
              <motion.li key={post.id} variants={fadeInUp}>
                <PostCard post={post} />
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Right sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Community stats */}
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-cyan" />
              <div className="font-mono text-[10px] tracking-widest text-cyan/70">
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

          {/* Trending topics */}
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-cyan" />
              <div className="font-mono text-[10px] tracking-widest text-cyan/70">
                TRENDING
              </div>
            </div>
            <ul className="flex flex-col gap-2">
              {TRENDING_TOPICS.map((t) => (
                <li key={t.tag}>
                  <button className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/5 transition-colors">
                    <Hash className="h-3 w-3 text-cyan/60" />
                    <span className="flex-1 text-xs text-white">{t.tag}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {t.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested */}
          <div className="rounded-xl border border-cyan/20 bg-cyan/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-cyan" />
              <div className="font-mono text-[10px] tracking-widest text-cyan/70">
                SUGGESTED
              </div>
            </div>
            <p className="text-sm text-white leading-snug">
              Join the <span className="text-cyan">Bay of Bengal SST Working Group</span>
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              42 researchers collaborating on monsoon-ocean coupling.
            </p>
            <Button size="sm" variant="secondary" fullWidth className="mt-4">
              Join Group
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const typeBadge = {
    observation: { variant: 'default' as const, label: 'OBSERVATION' },
    analysis: { variant: 'violet' as const, label: 'ANALYSIS' },
    project: { variant: 'teal' as const, label: 'PROJECT' },
    question: { variant: 'warning' as const, label: 'QUESTION' },
  }[post.type];

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.015] p-5 hover:border-cyan/20 transition-colors">
      {/* Author header */}
      <header className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-xs shrink-0">
          {post.author.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">
              {post.author.name}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-cyan/60">
              {post.author.role.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
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

      {/* Content */}
      <h3 className="font-display text-lg font-semibold text-white mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-cyan/70"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Actions */}
      <footer className="mt-5 pt-4 border-t border-white/5 flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan transition-colors">
          <ThumbsUp className="h-3.5 w-3.5" />
          {post.reactions}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan transition-colors">
          <MessageSquare className="h-3.5 w-3.5" />
          {post.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan transition-colors">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan transition-colors">
          <Bookmark className="h-3.5 w-3.5" />
          Save
        </button>
      </footer>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
        {label.toUpperCase()}
      </div>
      <div className="font-display text-lg font-semibold text-white tabular-nums mt-0.5">
        {value}
      </div>
    </div>
  );
}

// reserved for future use
void cn;