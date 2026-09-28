import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Waves,
  Satellite,
  Brain,
  Shield,
  Users,
  Globe2,
  Sparkles,
  Target,
  ArrowRight,
  Github,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const PILLARS = [
  {
    icon: Satellite,
    title: 'Observe',
    description:
      'Fuse satellite Earth observation, AIS signals, in-situ buoys, and numerical models into one coherent picture.',
    accent: 'cyan' as const,
  },
  {
    icon: Brain,
    title: 'Understand',
    description:
      'Ten specialized AI agents extract signal from noise: risk, opportunity, and the stories that numbers alone cannot tell.',
    accent: 'violet' as const,
  },
  {
    icon: Shield,
    title: 'Protect',
    description:
      'Deliver timely warnings and route intelligence that reduce risk for mariners, fisheries, and coastal communities.',
    accent: 'teal' as const,
  },
  {
    icon: Target,
    title: 'Act',
    description:
      'Turn raw data into decisions: a route, a fleet movement, a fishing ground, a search pattern.',
    accent: 'magenta' as const,
  },
];

const DATA_SOURCES = [
  { name: 'Copernicus Marine Service', category: 'Ocean model & satellite' },
  { name: 'NOAA', category: 'Weather & SST' },
  { name: 'INCOIS', category: 'PFZ & ocean state' },
  { name: 'ISRO / Bhuvan', category: 'Earth observation' },
  { name: 'MarineTraffic / AIS providers', category: 'Vessel tracking' },
  { name: 'Argo Floats', category: 'Subsurface profiles' },
];

/**
 * About — mission, values, data provenance, and team.
 */
export default function About() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 data-grid opacity-20" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.95)_100%)]" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-cyan/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                MISSION
              </span>
              <span className="h-px w-8 bg-cyan/40" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]"
            >
              A smarter ocean
              <br />
              for a safer tomorrow.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              ORCA exists because the ocean is too important — and too
              complex — to be understood in fragments. We fuse satellites,
              vessels, sensors, and models into a single intelligence layer
              that anyone can question, audit, and act on.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              className={cn(
                'relative rounded-xl border p-6 bg-white/[0.015] overflow-hidden',
                p.accent === 'cyan' && 'border-cyan/20',
                p.accent === 'violet' && 'border-violet/20',
                p.accent === 'teal' && 'border-teal/20',
                p.accent === 'magenta' && 'border-magenta/20'
              )}
            >
              <span
                className={cn(
                  'absolute top-0 left-0 w-3 h-3 border-t border-l',
                  p.accent === 'cyan' && 'border-cyan/60',
                  p.accent === 'violet' && 'border-violet/60',
                  p.accent === 'teal' && 'border-teal/60',
                  p.accent === 'magenta' && 'border-magenta/60'
                )}
              />
              <div
                className={cn(
                  'h-11 w-11 rounded-lg border flex items-center justify-center mb-4',
                  p.accent === 'cyan' && 'border-cyan/30 bg-cyan/10',
                  p.accent === 'violet' && 'border-violet/30 bg-violet/10',
                  p.accent === 'teal' && 'border-teal/30 bg-teal/10',
                  p.accent === 'magenta' && 'border-magenta/30 bg-magenta/10'
                )}
              >
                <p.icon
                  className={cn(
                    'h-5 w-5',
                    p.accent === 'cyan' && 'text-cyan',
                    p.accent === 'violet' && 'text-violet',
                    p.accent === 'teal' && 'text-teal',
                    p.accent === 'magenta' && 'text-magenta'
                  )}
                />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Data sources */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe2 className="h-4 w-4 text-cyan" />
                <span className="font-mono text-[10px] tracking-widest text-cyan/70">
                  DATA PROVENANCE
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                Built on authoritative sources
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                ORCA does not fabricate data. Every layer and every
                recommendation traces back to a named provider with a
                timestamp and a reliability score.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="neutral" size="sm">
                  NO SYNTHETIC DATA
                </Badge>
                <Badge variant="neutral" size="sm">
                  FULLY AUDITABLE
                </Badge>
                <Badge variant="neutral" size="sm">
                  FAIL-SAFE UI
                </Badge>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DATA_SOURCES.map((s) => (
                <li
                  key={s.name}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="font-display text-sm font-semibold text-white">
                    {s.name}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wider text-cyan/60">
                    {s.category.toUpperCase()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team + CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-cyan/20 bg-cyan/[0.03] p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-cyan" />
              <span className="font-mono text-[10px] tracking-widest text-cyan/70">
                TEAM
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-white">
              A community of scientists, engineers, and operators
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              ORCA is designed with — and for — marine researchers, fishery
              analysts, coast guard officers, and students. If you work with
              the ocean, this platform is for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/community">
                <Button
                  size="sm"
                  variant="secondary"
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Join Community
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noreferrer noopener">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Github className="h-3.5 w-3.5" />}
                >
                  GitHub
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-8 lg:p-10 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-violet" />
              <span className="font-mono text-[10px] tracking-widest text-violet/70">
                GET STARTED
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-white">
              Explore the ocean with ORCA
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
              Dive into the live map, ask the AI assistant anything, or run a
              simulation to see what a smarter ocean feels like.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/map">
                <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  Explore Live Map
                </Button>
              </Link>
              <Link to="/assistant">
                <Button size="sm" variant="secondary" leftIcon={<Waves className="h-3.5 w-3.5" />}>
                  Talk to ORCA
                </Button>
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
              <Mail className="h-3.5 w-3.5 text-cyan/60" />
              <a
                href="mailto:hello@orca.marine"
                className="font-mono text-[11px] tracking-wider text-muted-foreground hover:text-cyan transition-colors"
              >
                hello@orca.marine
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}