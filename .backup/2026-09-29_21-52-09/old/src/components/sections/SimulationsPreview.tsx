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
import { Button } from '@/components/ui/Button';
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
 * SimulationsPreview — light content section.
 */
export function SimulationsPreview() {
  return (
    <section className="relative section-y bg-pearl-soft text-ink overflow-hidden">
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
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                SIMULATION LAB
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance"
            >
              Model the ocean
              <br />
              <span className="text-gradient-navy">before it happens.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-ink-soft leading-relaxed"
            >
              Nine physically-grounded scenarios to explore storms, drift,
              routing, collision risk, and search-and-rescue — against fused
              ocean and weather fields.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="shrink-0">
            <Link to="/simulations">
              <Button
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {SIMULATION_SCENARIOS.slice(0, 6).map((s, i) => {
            const Icon = SCENARIO_ICONS[s.id] ?? FlaskConical;
            return (
              <motion.div key={s.id} variants={fadeInUp}>
                <ScenarioCard
                  icon={Icon}
                  label={s.label}
                  description={s.description}
                  index={i}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ScenarioCard({
  icon: Icon,
  label,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  index: number;
}) {
  return (
    <Link
      to="/simulations"
      className="group relative block rounded-2xl border border-ink/10 bg-white p-6 shadow-soft transition-all hover:shadow-soft-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="h-11 w-11 rounded-xl border border-ocean/15 bg-ice flex items-center justify-center">
          <Icon className="h-5 w-5 text-ocean" />
        </div>
        <span className="font-mono text-[9px] tracking-widest text-mist-deep">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="font-display text-base font-semibold text-ink leading-snug">
        {label}
      </h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-2">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-ocean">
        RUN
        <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}