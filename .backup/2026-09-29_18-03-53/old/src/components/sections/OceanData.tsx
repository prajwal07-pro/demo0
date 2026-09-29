import * as React from 'react';
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
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const LAYERS = [
  {
    id: 'sst',
    icon: Thermometer,
    label: 'Sea Surface Temperature',
    unit: '°C',
    description: 'Thermal fronts, upwelling, and anomaly detection.',
    accent: 'magenta' as const,
  },
  {
    id: 'chlorophyll',
    icon: Droplets,
    label: 'Chlorophyll-a',
    unit: 'mg/m³',
    description: 'Phytoplankton concentration — a proxy for ocean productivity.',
    accent: 'teal' as const,
  },
  {
    id: 'waveHeight',
    icon: Waves,
    label: 'Wave Height',
    unit: 'm',
    description: 'Significant wave height, period, and directional swell.',
    accent: 'cyan' as const,
  },
  {
    id: 'wind',
    icon: Wind,
    label: 'Wind Field',
    unit: 'm/s',
    description: 'Surface wind speed and direction from scatterometer and models.',
    accent: 'violet' as const,
  },
  {
    id: 'currents',
    icon: Activity,
    label: 'Ocean Currents',
    unit: 'm/s',
    description: 'Surface velocity fields driving drift, transport, and mixing.',
    accent: 'cyan' as const,
  },
];

/**
 * OceanData — showcases the layered ocean data products ORCA consumes.
 */
export function OceanData() {
  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      <div className="absolute inset-0 data-grid opacity-[0.12]" aria-hidden="true" />

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
                OCEAN DATA
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Every layer of the ocean,
              <br />
              <span className="text-gradient-cyan">rendered in motion.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-5 text-muted-foreground leading-relaxed"
            >
              SST, chlorophyll, wave height, wind, and currents — delivered
              with a shared timeline, opacity control, and playback speed.
              Available as overlays on the live map and in the 3D explorer.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp}>
            <Link to="/ocean">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Open Ocean Module
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {LAYERS.map((layer, i) => (
            <motion.div key={layer.id} variants={fadeInUp}>
              <LayerCard {...layer} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline teaser */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-white/10 bg-white/[0.015] p-6 lg:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] tracking-widest text-cyan/70">
                  TIMELINE PLAYBACK
                </span>
                <Badge variant="default" dot size="sm">
                  LIVE
                </Badge>
              </div>
              <h3 className="font-display text-xl font-semibold text-white">
                24-hour temporal playback across every layer
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Scrub through time, control playback speed, and watch fronts
                form, dissipate, and migrate — with synchronized overlays.
              </p>
            </div>

            <div className="flex-shrink-0 w-full md:w-80">
              <div className="relative">
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan to-teal" />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground">
                  <span>-24H</span>
                  <span>-12H</span>
                  <span className="text-cyan">NOW</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {[0.5, 1, 2, 4].map((s) => (
                  <span
                    key={s}
                    className={cn(
                      'rounded font-mono text-[10px] px-2 py-1',
                      s === 1
                        ? 'bg-cyan/15 text-cyan border border-cyan/30'
                        : 'text-muted-foreground border border-transparent'
                    )}
                  >
                    {s}×
                  </span>
                ))}
              </div>
            </div>
          </div>
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
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  unit: string;
  description: string;
  accent: 'cyan' | 'teal' | 'violet' | 'magenta';
  index: number;
}) {
  const accentStyles = {
    cyan: { border: 'border-cyan/20 hover:border-cyan/50', icon: 'text-cyan', bar: 'from-cyan/60' },
    teal: { border: 'border-teal/20 hover:border-teal/50', icon: 'text-teal', bar: 'from-teal/60' },
    violet: { border: 'border-violet/20 hover:border-violet/50', icon: 'text-violet', bar: 'from-violet/60' },
    magenta: { border: 'border-magenta/20 hover:border-magenta/50', icon: 'text-magenta', bar: 'from-magenta/60' },
  }[accent];

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-white/[0.015] p-5 transition-all overflow-hidden',
        accentStyles.border
      )}
    >
      <span
        className={cn(
          'absolute top-0 left-0 right-0 h-px bg-gradient-to-r to-transparent opacity-60',
          accentStyles.bar
        )}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
          <Icon className={cn('h-4 w-4', accentStyles.icon)} />
        </div>
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
          0{index + 1}
        </span>
      </div>

      <h3 className="font-display text-sm font-semibold text-white leading-snug">
        {label}
      </h3>
      <div className="mt-1 font-mono text-[10px] tracking-widest text-cyan/60">
        UNIT · {unit}
      </div>
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}