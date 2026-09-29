import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ArrowRight,
  Bot,
  User as UserIcon,
  Sparkles,
  Database,
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

/**
 * AIAssistantPreview — showcases the ORCA assistant on the home page.
 * Renders a stylized, non-interactive chat transcript.
 */
export function AIAssistantPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan/[0.04] blur-[140px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 data-grid opacity-[0.1]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Chat mock */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <ChatMock />
          </motion.div>

          {/* Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-cyan/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                AI MARINE ASSISTANT
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Ask the ocean
              <br />
              <span className="text-gradient-cyan">anything.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-muted-foreground leading-relaxed"
            >
              ORCA reasons over satellite imagery, AIS, in-situ observations,
              and model output to answer domain questions with citations,
              confidence, and an auditable reasoning summary.
            </motion.p>

            <motion.ul variants={fadeInUp} className="mt-8 flex flex-col gap-3">
              {[
                'Natural-language queries over live ocean data',
                'Map cards, charts, and tables returned inline',
                'Full source provenance per answer',
                'Voice input and file upload support',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-white/90">
                  <Check className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp} className="mt-9 flex flex-wrap gap-3">
              <Link to="/assistant">
                <Button
                  size="lg"
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Talk to ORCA
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Chat transcript mock ----------
function ChatMock() {
  return (
    <div className="relative rounded-2xl border border-cyan/20 bg-abyss/60 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.15)]">
      {/* HUD corners */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/60" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/60" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/60" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/60" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="h-8 w-8 rounded-md border border-cyan/30 bg-cyan/10 flex items-center justify-center">
          <Bot className="h-3.5 w-3.5 text-cyan" />
        </div>
        <div className="flex-1">
          <div className="font-display text-sm font-semibold text-white">
            ORCA Assistant
          </div>
          <div className="font-mono text-[9px] tracking-widest text-cyan/60">
            ONLINE · 10 AGENTS READY
          </div>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
      </div>

      {/* Transcript */}
      <div className="p-5 flex flex-col gap-5">
        <div className="flex gap-3 flex-row-reverse">
          <div className="h-8 w-8 shrink-0 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
            Show fishing zones near Paradip and explain why they were selected.
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-8 w-8 shrink-0 rounded-lg border border-cyan/30 bg-cyan/10 flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 text-cyan" />
          </div>
          <div className="max-w-[85%] rounded-2xl border border-cyan/15 bg-abyss/60 backdrop-blur-md px-4 py-3">
            <p className="text-sm text-white leading-relaxed">
              I found <strong className="text-cyan">2 potential fishing zones</strong>{' '}
              offshore Paradip. The primary zone spans ~120 km² with a
              probability of 0.72 and a confidence of 0.65.
            </p>

            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] tracking-widest text-cyan/70">
                  FISHING ZONE MAP
                </span>
                <span className="font-mono text-[9px] text-teal">● LIVE</span>
              </div>
              <MiniMap />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="default" size="sm">
                <Database className="h-2.5 w-2.5" />
                INCOIS PFZ
              </Badge>
              <Badge variant="teal" size="sm">
                <Database className="h-2.5 w-2.5" />
                COPERNICUS SST
              </Badge>
              <Badge variant="violet" size="sm">
                <Sparkles className="h-2.5 w-2.5" />
                4 AGENTS
              </Badge>
            </div>

            <button className="mt-3 font-mono text-[10px] tracking-widest text-cyan/70 hover:text-cyan">
              WHY THIS? →
            </button>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 h-11">
          <span className="text-sm text-muted-foreground flex-1">
            Ask ORCA anything…
          </span>
          <span className="h-7 w-7 rounded-md bg-gradient-to-r from-cyan to-teal flex items-center justify-center">
            <ArrowRight className="h-3.5 w-3.5 text-abyss" />
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniMap() {
  return (
    <div className="relative aspect-[16/8] rounded-md overflow-hidden bg-gradient-to-br from-ocean-dark to-abyss">
      <div className="absolute inset-0 data-grid opacity-30" />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M90 30 Q100 15 115 20 Q125 30 120 55 Q115 75 100 80 Q90 75 88 55 Q86 40 90 30 Z"
          fill="#0f766e"
          fillOpacity="0.4"
          stroke="#06b6d4"
          strokeWidth="0.5"
          strokeOpacity="0.6"
        />
      </svg>
      <motion.div
        className="absolute rounded-full border border-dashed border-teal/60"
        style={{ left: '58%', top: '40%', width: '22%', height: '38%' }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest text-teal">
          PFZ
        </span>
      </motion.div>
      <span
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_#06b6d4]"
        style={{ left: '40%', top: '50%' }}
      />
      <span
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_#06b6d4]"
        style={{ left: '70%', top: '60%' }}
      />
    </div>
  );
}