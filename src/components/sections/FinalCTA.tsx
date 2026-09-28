import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageSquare,
  Waves,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { EASINGS, fadeInUp, staggerContainer } from '@/lib/animations';

/**
 * FinalCTA — closing hero of the home page story.
 * Invites the user to enter the platform.
 */
export function FinalCTA() {
  return (
    <section className="relative py-28 lg:py-40 bg-abyss overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 data-grid opacity-[0.15]" aria-hidden="true" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[1000px] rounded-full bg-cyan/[0.05] blur-[160px]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.95)_100%)]" aria-hidden="true" />

      {/* Animated orca silhouette behind */}
      <OrcaBackdrop />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 mb-6 rounded-full border border-cyan/30 bg-cyan/[0.05] px-4 py-1.5"
          >
            <Sparkles className="h-3 w-3 text-cyan" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/90">
              READY WHEN YOU ARE
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] text-white"
          >
            Dive into
            <br />
            <span className="text-gradient-cyan">a smarter ocean.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Explore the live map, ask the AI assistant anything, or run a
            simulation — the entire ORCA platform is one click away.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/map">
              <Button
                size="xl"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                magnetic
              >
                Explore Live Ocean
              </Button>
            </Link>
            <Link to="/assistant">
              <Button
                size="xl"
                variant="secondary"
                leftIcon={<MessageSquare className="h-4 w-4" />}
              >
                Talk to ORCA
              </Button>
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={fadeInUp}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          >
            <TrustItem icon={Waves} label="REAL-TIME DATA" />
            <TrustItem icon={ShieldCheck} label="AUDITABLE ANSWERS" />
            <TrustItem icon={Zap} label="NO SYNTHETIC VALUES" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom HUD line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
    </section>
  );
}

// ---------- Backdrop Orca ----------
function OrcaBackdrop() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.8, ease: EASINGS.cinematic }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 400"
        className="w-full max-w-4xl text-cyan/5"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="finalOrcaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="200" rx="280" ry="160" fill="url(#finalOrcaGlow)" />
        <motion.g
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M80 220 Q150 130 260 130 Q370 130 440 220 Q370 240 300 245 Q230 250 160 240 Q120 235 80 220 Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M260 130 Q290 90 320 130 L320 145 Q290 140 260 145 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

// ---------- Trust Item ----------
function TrustItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-cyan/70" />
      <span className="font-mono text-[10px] tracking-[0.2em] text-cyan/70">
        {label}
      </span>
    </div>
  );
}

// reserved
void cn;