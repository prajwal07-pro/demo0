import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Waves,
  Wind,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const LAYERS = [
  {
    id: 'sst',
    icon: Thermometer,
    label: 'Sea Surface Temperature',
    unit: '°C',
    description: 'Thermal fronts, upwelling, and anomaly detection.',
    accent: 'text-accent',
  },
  {
    id: 'chlorophyll',
    icon: Droplets,
    label: 'Chlorophyll-a',
    unit: 'mg/m³',
    description: 'A direct proxy for ocean productivity and bloom dynamics.',
    accent: 'text-success',
  },
  {
    id: 'waveHeight',
    icon: Waves,
    label: 'Wave Height',
    unit: 'm',
    description: 'Significant wave height, period, and directional swell.',
    accent: 'text-info',
  },
  {
    id: 'wind',
    icon: Wind,
    label: 'Wind Field',
    unit: 'm/s',
    description: 'Surface wind speed and direction from scatterometer and models.',
    accent: 'text-violet',
  },
  {
    id: 'currents',
    icon: Activity,
    label: 'Ocean Currents',
    unit: 'm/s',
    description: 'Surface velocity fields driving drift, transport, and mixing.',
    accent: 'text-cyan-dark',
  },
];

/**
 * OceanData — light content section.
 *
 * Visual role: continues the bright editorial rhythm after WhyOrca.
 * Uses a card grid, but with restrained shadows and clear typography.
 */
export function OceanData() {
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
                OCEAN DATA
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance"
            >
              Every layer of the ocean,
              <br />
              <span className="text-gradient-navy">rendered in motion.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-ink-soft leading-relaxed"
            >
              SST, chlorophyll, waves, wind, and currents — delivered with a
              shared timeline and playback. Available as overlays on the live
              map and in the 3D explorer.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="shrink-0">
            <Link to="/ocean">
              <Button
                variant="secondary-light"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Open Ocean Module
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Layer cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {LAYERS.map((layer) => (
            <motion.div key={layer.id} variants={fadeInUp}>
              <LayerCard {...layer} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LayerCard({
  icon: Icon,
  label,
  unit,
  description,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  unit: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-ink/10 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5">
      <div className="h-10 w-10 rounded-lg border border-ink/10 bg-pearl-deep flex items-center justify-center mb-4">
        <Icon className={cn('h-4 w-4', accent)} />
      </div>
      <h3 className="font-display text-sm font-semibold text-ink leading-snug">
        {label}
      </h3>
      <div className="mt-1 font-mono text-[10px] tracking-widest text-mist-deep">
        UNIT · {unit}
      </div>
      <p className="mt-3 text-xs text-ink-soft leading-relaxed">
        {description}
      </p>
    </div>
  );
}