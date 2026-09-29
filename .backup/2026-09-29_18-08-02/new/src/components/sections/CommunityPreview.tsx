import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  ArrowRight,
  MapPin,
  MessageSquare,
  Sparkles,
  Hash,
  TrendingUp,
  ThumbsUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const PREVIEW_POSTS = [
  {
    author: { name: 'Dr. A. Mehta', role: 'Marine Scientist', initials: 'AM' },
    title: 'Unusual SST anomaly in the Bay of Bengal',
    excerpt:
      'Persistent warm patch observed offshore Paradip for the last 5 days.',
    region: 'Bay of Bengal',
    reactions: 42,
    comments: 12,
    tags: ['sst', 'anomaly'],
  },
  {
    author: { name: 'R. Krishnan', role: 'Researcher', initials: 'RK' },
    title: 'Open dataset: AIS anomalies 2024',
    excerpt:
      '4,200 AIS gaps across the Arabian Sea, looking for collaborators.',
    region: 'Arabian Sea',
    reactions: 78,
    comments: 24,
    tags: ['ais', 'open-data'],
  },
];

/**
 * CommunityPreview — light content section.
 */
export function CommunityPreview() {
  return (
    <section className="relative section-y bg-pearl text-ink overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-20 items-center">
          {/* Feed preview */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-2 lg:order-1 flex flex-col gap-4"
          >
            {PREVIEW_POSTS.map((p, i) => (
              <motion.div key={p.title} variants={fadeInUp}>
                <PostPreview {...p} index={i} />
              </motion.div>
            ))}

            <motion.div
              variants={fadeInUp}
              className="rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-soft flex items-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-ocean" />
                <span className="font-mono text-[10px] tracking-widest text-ocean">
                  TRENDING
                </span>
              </div>
              {['bay-of-bengal', 'sst-anomaly', 'pfz-2024'].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-soft"
                >
                  <Hash className="h-2.5 w-2.5 text-ocean/60" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-1 lg:order-2"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                RESEARCH COMMUNITY
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance"
            >
              Built with
              <br />
              <span className="text-gradient-navy">the researchers.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-ink-soft leading-relaxed"
            >
              Share observations, publish analyses, collaborate on open
              datasets, and join working groups with scientists and operators
              worldwide.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 grid grid-cols-2 gap-4 max-w-sm"
            >
              <StatBlock value="12.4K" label="MEMBERS" icon={Users} />
              <StatBlock value="24.2K" label="OBSERVATIONS" icon={Sparkles} />
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-9 flex flex-wrap gap-3">
              <Link to="/community">
                <Button
                  size="lg"
                  leftIcon={<Users className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Join Community
                </Button>
              </Link>
              <Badge variant="success" size="md" dot>
                LIVE FEED
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PostPreview({
  author,
  title,
  excerpt,
  region,
  reactions,
  comments,
  tags,
  index,
}: {
  author: { name: string; role: string; initials: string };
  title: string;
  excerpt: string;
  region: string;
  reactions: number;
  comments: number;
  tags: string[];
  index: number;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-abyss font-display font-bold text-[10px]">
          {author.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink truncate">
              {author.name}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-ocean/70 truncate">
              {author.role.toUpperCase()}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-mist-deep">
            <MapPin className="h-2.5 w-2.5" />
            {region}
          </div>
        </div>
        <span className="font-mono text-[9px] tracking-widest text-mist">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="font-display text-base font-semibold text-ink leading-snug">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-ink-soft line-clamp-2">
        {excerpt}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-pearl-soft px-2 py-0.5 font-mono text-[9px] text-ocean"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/[0.06] flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
          <ThumbsUp className="h-3 w-3" />
          {reactions}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
          <MessageSquare className="h-3 w-3" />
          {comments}
        </span>
        <span className="ml-auto font-mono text-[9px] tracking-widest text-ocean">
          VIEW →
        </span>
      </div>
    </div>
  );
}

function StatBlock({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] tracking-widest text-mist-deep">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-ocean/70" />
      </div>
      <div className="font-display text-2xl font-bold text-ink tabular-nums">
        {value}
      </div>
    </div>
  );
}