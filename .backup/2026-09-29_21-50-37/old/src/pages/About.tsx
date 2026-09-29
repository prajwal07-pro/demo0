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
  CheckCircle2,
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
  },
  {
    icon: Brain,
    title: 'Understand',
    description:
      'Ten specialized AI agents extract signal from noise — the risk, opportunity, and stories numbers alone cannot tell.',
  },
  {
    icon: Shield,
    title: 'Protect',
    description:
      'Deliver timely warnings and route intelligence that reduce risk for mariners, fisheries, and coastal communities.',
  },
  {
    icon: Target,
    title: 'Act',
    description:
      'Turn raw data into decisions: a route, a fleet movement, a fishing ground, a search pattern.',
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

export default function About() {
  return (
    <div className="relative bg-pearl text-ink">
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />

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
              <span className="h-px w-8 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                MISSION
              </span>
              <span className="h-px w-8 bg-ocean/40" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              A smarter ocean
              <br />
              <span className="text-gradient-navy">for a safer tomorrow.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto"
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
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6">
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
                className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft"
              >
                <div className="h-11 w-11 rounded-xl border border-ocean/15 bg-ice flex items-center justify-center mb-5">
                  <p.icon className="h-5 w-5 text-ocean" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Data sources */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl border border-ink/[0.08] bg-white p-8 lg:p-12 shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Globe2 className="h-4 w-4 text-ocean" />
                  <span className="font-mono text-[10px] tracking-widest text-ocean">
                    DATA PROVENANCE
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-ink tracking-tight text-balance">
                  Built on authoritative sources
                </h2>
                <p className="mt-5 text-ink-soft leading-relaxed">
                  ORCA does not fabricate data. Every layer and every
                  recommendation traces back to a named provider with a
                  timestamp and a reliability score.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="light-neutral" size="sm">
                    NO SYNTHETIC DATA
                  </Badge>
                  <Badge variant="light-neutral" size="sm">
                    FULLY AUDITABLE
                  </Badge>
                  <Badge variant="light-neutral" size="sm">
                    FAIL-SAFE UI
                  </Badge>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DATA_SOURCES.map((s) => (
                  <li
                    key={s.name}
                    className="rounded-xl border border-ink/[0.06] bg-pearl-soft p-4"
                  >
                    <div className="font-display text-sm font-semibold text-ink">
                      {s.name}
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-wider text-ocean">
                      {s.category.toUpperCase()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team + CTA */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-ocean/15 bg-ice/40 p-8 lg:p-10">
              <div className="flex items-center gap-2 mb-5">
                <Users className="h-4 w-4 text-ocean" />
                <span className="font-mono text-[10px] tracking-widest text-ocean">
                  TEAM
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink leading-snug">
                A community of scientists, engineers, and operators
              </h2>
              <p className="mt-4 text-sm text-ink-soft leading-relaxed">
                ORCA is designed with — and for — marine researchers, fishery
                analysts, coast guard officers, and students. If you work with
                the ocean, this platform is for you.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/community">
                  <Button
                    size="sm"
                    variant="secondary-light"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Join Community
                  </Button>
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Button
                    size="sm"
                    variant="ghost-light"
                    leftIcon={<Github className="h-3.5 w-3.5" />}
                  >
                    GitHub
                  </Button>
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-ink/[0.08] bg-white p-8 lg:p-10 shadow-soft flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="h-4 w-4 text-violet-dark" />
                <span className="font-mono text-[10px] tracking-widest text-violet-dark">
                  GET STARTED
                </span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink leading-snug">
                Explore the ocean with ORCA
              </h2>
              <p className="mt-4 text-sm text-ink-soft leading-relaxed flex-1">
                Dive into the live map, ask the AI assistant anything, or run
                a simulation to see what a smarter ocean feels like.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/map">
                  <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Explore Live Map
                  </Button>
                </Link>
                <Link to="/assistant">
                  <Button
                    size="sm"
                    variant="secondary-light"
                    leftIcon={<Waves className="h-3.5 w-3.5" />}
                  >
                    Talk to ORCA
                  </Button>
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-ink/[0.06] flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 text-ocean" />
                <a
                  href="mailto:hello@orca.marine"
                  className="font-mono text-[11px] tracking-wider text-ink-soft hover:text-ocean transition-colors"
                >
                  hello@orca.marine
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {[
              'REAL-TIME DATA',
              'AUDITABLE ANSWERS',
              'NO SYNTHETIC VALUES',
              'OPEN PLATFORM',
            ].map((t) => (
              <div key={t} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-ocean" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink-soft">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* reserved */}
      <div className={cn('hidden')} aria-hidden="true" />
    </div>
  );
}