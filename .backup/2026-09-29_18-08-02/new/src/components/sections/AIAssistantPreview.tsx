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
 * AIAssistantPreview — light content section.
 * Shows a stylized transcript on a bright surface.
 */
export function AIAssistantPreview() {
  return (
    <section className="relative section-y bg-pearl text-ink overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-20 items-center">
          {/* Chat preview */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <ChatPreview />
          </motion.div>

          {/* Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                AI MARINE ASSISTANT
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance"
            >
              Ask the ocean
              <br />
              <span className="text-gradient-navy">anything.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-ink-soft leading-relaxed"
            >
              ORCA reasons over satellite imagery, AIS, in-situ observations,
              and model output — answering domain questions with citations and
              an auditable reasoning summary.
            </motion.p>

            <motion.ul variants={fadeInUp} className="mt-8 flex flex-col gap-3">
              {[
                'Natural-language queries over live ocean data',
                'Map cards, charts, and tables returned inline',
                'Full source provenance per answer',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink-soft">
                  <Check className="h-4 w-4 text-ocean shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp} className="mt-9">
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

function ChatPreview() {
  return (
    <div className="relative rounded-2xl border border-ink/10 bg-white shadow-soft-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/[0.06]">
        <div className="h-8 w-8 rounded-lg border border-ocean/20 bg-ice flex items-center justify-center">
          <Bot className="h-3.5 w-3.5 text-ocean" />
        </div>
        <div className="flex-1">
          <div className="font-display text-sm font-semibold text-ink">
            ORCA Assistant
          </div>
          <div className="font-mono text-[9px] tracking-widest text-ocean/70">
            ONLINE · 10 AGENTS READY
          </div>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
      </div>

      {/* Transcript */}
      <div className="p-5 flex flex-col gap-5 bg-pearl-soft/40">
        <div className="flex gap-3 flex-row-reverse">
          <div className="h-8 w-8 shrink-0 rounded-lg border border-ink/10 bg-white flex items-center justify-center">
            <UserIcon className="h-3.5 w-3.5 text-ink-muted" />
          </div>
          <div className="max-w-[85%] rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink shadow-soft">
            Show fishing zones near Paradip and explain why they were selected.
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-8 w-8 shrink-0 rounded-lg border border-ocean/20 bg-ice flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 text-ocean" />
          </div>
          <div className="max-w-[85%] rounded-2xl border border-ocean/15 bg-white px-4 py-3 shadow-soft">
            <p className="text-sm text-ink leading-relaxed">
              I found <strong className="text-ocean">2 potential fishing zones</strong>{' '}
              offshore Paradip. The primary zone spans ~120 km² with a
              probability of 0.72.
            </p>

            <div className="mt-3 rounded-lg border border-ink/10 bg-pearl-soft p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] tracking-widest text-ocean">
                  FISHING ZONE MAP
                </span>
                <span className="font-mono text-[9px] text-success">
                  ● LIVE
                </span>
              </div>
              <MiniMap />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="default" size="sm">
                <Database className="h-2.5 w-2.5" />
                INCOIS PFZ
              </Badge>
              <Badge variant="violet" size="sm">
                <Sparkles className="h-2.5 w-2.5" />
                4 AGENTS
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-ink/[0.06] p-3 bg-white">
        <div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-pearl-soft px-3 h-11">
          <span className="text-sm text-ink-muted flex-1">
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
    <div className="relative aspect-[16/8] rounded-md overflow-hidden bg-ice">
      <div className="absolute inset-0 data-grid-light opacity-70" />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M90 30 Q100 15 115 20 Q125 30 120 55 Q115 75 100 80 Q90 75 88 55 Q86 40 90 30 Z"
          fill="#0F766E"
          fillOpacity="0.35"
          stroke="#0E7490"
          strokeWidth="0.5"
          strokeOpacity="0.7"
        />
      </svg>
      <motion.div
        className="absolute rounded-full border border-dashed border-teal-dark/60"
        style={{ left: '58%', top: '40%', width: '22%', height: '38%' }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest text-teal-dark">
          PFZ
        </span>
      </motion.div>
      <span
        className="absolute h-1.5 w-1.5 rounded-full bg-ocean shadow-[0_0_6px_rgba(12,74,110,0.6)]"
        style={{ left: '40%', top: '50%' }}
      />
      <span
        className="absolute h-1.5 w-1.5 rounded-full bg-ocean shadow-[0_0_6px_rgba(12,74,110,0.6)]"
        style={{ left: '70%', top: '60%' }}
      />
    </div>
  );
}