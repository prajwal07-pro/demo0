import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  ArrowRight,
  Cloud,
  Route,
  Waves,
  Fish,
  AlertTriangle,
  Fuel,
  Droplet,
  LifeBuoy,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SIMULATION_SCENARIOS, type SimulationScenarioId } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const SCENARIO_ICONS: Record<SimulationScenarioId, React.ComponentType<{ className?: string }>> = {
  storm: Cloud,
  route: Route,
  current: Waves,
  fishing: Fish,
  collision: AlertTriangle,
  fuel: Fuel,
  pollution: Droplet,
  sar: LifeBuoy,
  weather: Wind,
};

/**
 * SimulationsPreview — home page feature for the Simulation Lab.
 * Shows the scenario catalog as an interactive-looking grid.
 */
export function SimulationsPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      <div className="absolute inset-0 data-grid opacity-[0.1]" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-teal/[0.04] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div className="max-w-2xl">
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-cyan/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                SIMULATION LAB
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Model the ocean
              <br />
              <span className="text-gradient-cyan">before it happens.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-5 text-muted-foreground leading-relaxed"
            >
              Nine physically-grounded scenarios let you explore storms,
              drift, routing, collision risk, and search-and-rescue — against
              fused ocean and weather fields.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp}>
            <Link to="/simulations">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<FlaskConical className="h-4 w-4" />}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Open Simulation Lab
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scenario grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {SIMULATION_SCENARIOS.slice(0, 10).map((s, i) => {
            const Icon = SCENARIO_ICONS[s.id] ?? FlaskConical;
            return (
              <motion.div key={s.id} variants={fadeInUp}>
                <ScenarioTile
                  icon={Icon}
                  label={s.label}
                  index={i}
                  featured={i === 0}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom strip */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center gap-4 justify-center"
        >
          <Badge variant="neutral" size="md">
            9 SCENARIOS
          </Badge>
          <Badge variant="default" size="md" dot>
            TIME-STEPPED
          </Badge>
          <Badge variant="violet" size="md">
            MULTI-AGENT OUTPUT
          </Badge>
          <Badge variant="teal" size="md">
            AUDITABLE
          </Badge>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- Scenario Tile ----------
function ScenarioTile({
  icon: Icon,
  label,
  index,
  featured = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  index: number;
  featured?: boolean;
}) {
  return (
    <Link
      to="/simulations"
      className={cn(
        'group relative block rounded-xl border bg-white/[0.015] p-4 transition-all overflow-hidden',
        featured
          ? 'border-cyan/40 bg-cyan/[0.04]'
          : 'border-white/10 hover:border-cyan/40 hover:bg-white/[0.03]'
      )}
    >
      {/* Top accent line */}
      <span
        className={cn(
          'absolute top-0 left-0 right-0 h-px bg-gradient-to-r to-transparent',
          featured ? 'from-cyan/80' : 'from-cyan/30 opacity-0 group-hover:opacity-100'
        )}
      />

      {/* Scan overlay on hover */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/0 group-hover:via-cyan/60 to-transparent animate-scan" />
      </span>

      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'h-10 w-10 rounded-lg border flex items-center justify-center transition-colors',
            featured
              ? 'border-cyan/50 bg-cyan/15'
              : 'border-white/10 bg-white/5 group-hover:border-cyan/40 group-hover:bg-cyan/10'
          )}
        >
          <Icon
            className={cn(
              'h-4 w-4 transition-colors',
              featured ? 'text-cyan' : 'text-muted-foreground group-hover:text-cyan'
            )}
          />
        </div>
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="font-display text-xs font-semibold text-white leading-tight">
        {label}
      </div>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-cyan/60 group-hover:text-cyan">
        RUN
        <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}