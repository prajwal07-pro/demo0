import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Radar,
  ArrowRight,
  Ship,
  Thermometer,
  Waves,
  Fish,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { OCEAN_LAYERS } from '@/lib/constants';

/**
 * LiveMapPreview — dark cinematic feature section.
 * The map canvas stays visually dominant; surrounding chrome is compact.
 */
export function LiveMapPreview() {
  const [hoveredLayer, setHoveredLayer] = React.useState<string | null>(null);

  return (
    <section className="relative section-y bg-abyss overflow-hidden">
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet/[0.04] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-14 lg:gap-20 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-cyan/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                LIVE MARINE MAP
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.08] text-balance"
            >
              Every vessel.
              <br />
              Every layer.
              <br />
              <span className="text-gradient-cyan">One map.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-white/70 leading-relaxed"
            >
              A professional GIS workspace for marine operations. Track live
              vessels, overlay ocean data layers, monitor risks, and inspect
              any target — without leaving the map.
            </motion.p>

            <motion.ul variants={fadeInUp} className="mt-8 flex flex-col gap-3">
              {[
                'Real-time AIS vessel tracking',
                'SST, chlorophyll, wave, wind, currents',
                'Fishing zones, protected areas, geofences',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-sm text-white/85"
                >
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-cyan shrink-0" />
                  {t}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeInUp}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link to="/map">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Open Live Map
                </Button>
              </Link>
              <Badge variant="neutral" size="md">
                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                CONNECTED
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative"
          >
            <MapPreviewCanvas
              hoveredLayer={hoveredLayer}
              onHoverLayer={setHoveredLayer}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MapPreviewCanvas({
  hoveredLayer,
  onHoverLayer,
}: {
  hoveredLayer: string | null;
  onHoverLayer: (id: string | null) => void;
}) {
  return (
    <div className="relative aspect-[4/3] rounded-2xl border border-cyan/20 bg-abyss/60 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.12)]">
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/60" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/60" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/60" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/60" />

      <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark via-midnight to-abyss" />
      <div className="absolute inset-0 data-grid opacity-40" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="landGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          d="M170 130 Q175 100 190 90 Q205 82 220 95 Q235 108 232 135 Q228 165 205 190 Q190 205 175 200 Q160 195 158 175 Q156 150 170 130 Z"
          fill="url(#landGrad2)"
          stroke="#06b6d4"
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />
        <ellipse
          cx="180"
          cy="225"
          rx="10"
          ry="14"
          fill="url(#landGrad2)"
          stroke="#06b6d4"
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />
      </svg>

      <VesselMarkers />
      <FishingZoneHalo />

      <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-abyss/80 backdrop-blur-md px-2.5 h-8">
          <Radar className="h-3 w-3 text-cyan" />
          <span className="font-mono text-[9px] tracking-widest text-cyan/80">
            BAY OF BENGAL
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-abyss/80 backdrop-blur-md px-2.5 h-8">
          <span className="h-1 w-1 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest text-teal/80">
            LIVE
          </span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
        {OCEAN_LAYERS.slice(0, 5).map((layer) => (
          <button
            key={layer.id}
            onMouseEnter={() => onHoverLayer(layer.id)}
            onMouseLeave={() => onHoverLayer(null)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-widest transition-colors',
              hoveredLayer === layer.id
                ? 'border-cyan/60 bg-cyan/20 text-cyan'
                : 'border-white/10 bg-abyss/80 backdrop-blur-md text-white/60 hover:border-cyan/40 hover:text-cyan'
            )}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: layer.color }}
            />
            {layer.id.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 right-3 z-10 font-mono text-[9px] tracking-widest text-cyan/70">
        15.0°N 85.0°E · Z5.0
      </div>

      <div className="absolute top-14 right-3 z-10 hidden md:flex flex-col gap-1.5">
        <LegendChip icon={Ship} label="VESSELS" color="text-cyan" />
        <LegendChip icon={Thermometer} label="SST" color="text-magenta" />
        <LegendChip icon={Fish} label="PFZ" color="text-teal" />
        <LegendChip icon={Waves} label="CURRENTS" color="text-violet" />
        <LegendChip icon={Wind} label="WIND" color="text-amber-400" />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent"
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function LegendChip({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded border border-white/10 bg-abyss/70 backdrop-blur-md px-1.5 py-1">
      <Icon className={cn('h-2.5 w-2.5', color)} />
      <span className="font-mono text-[8px] tracking-widest text-white/60">
        {label}
      </span>
    </div>
  );
}

function VesselMarkers() {
  const markers = [
    { x: '38%', y: '42%', color: '#3b82f6' },
    { x: '52%', y: '58%', color: '#22c55e' },
    { x: '44%', y: '72%', color: '#f59e0b' },
    { x: '62%', y: '38%', color: '#8b5cf6' },
    { x: '30%', y: '58%', color: '#06b6d4' },
    { x: '58%', y: '68%', color: '#3b82f6' },
    { x: '48%', y: '48%', color: '#22c55e' },
    { x: '70%', y: '52%', color: '#64748b' },
  ];

  return (
    <>
      {markers.map((m, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: m.x,
            top: m.y,
            backgroundColor: m.color,
            boxShadow: `0 0 8px ${m.color}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        />
      ))}
    </>
  );
}

function FishingZoneHalo() {
  return (
    <motion.div
      className="absolute"
      style={{ left: '42%', top: '60%', width: '20%', height: '18%' }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-full bg-teal/10 blur-md" />
        <div className="absolute inset-0 rounded-full border border-teal/60 border-dashed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest text-teal">
          PFZ
        </div>
      </div>
    </motion.div>
  );
}