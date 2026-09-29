import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Boxes, ArrowRight, RotateCw, MousePointer2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

/**
 * ExplorerPreview — dark cinematic section for the 3D Explorer.
 */
export function ExplorerPreview() {
  return (
    <section className="relative section-y bg-abyss overflow-hidden">
      <div className="absolute inset-0 data-grid opacity-[0.08]" aria-hidden="true" />
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet/[0.04] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-14 lg:gap-20 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-cyan/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                3D EXPLORER
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.08] text-balance"
            >
              Touch the ocean,
              <br />
              <span className="text-gradient-cyan">in three dimensions.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-white/70 leading-relaxed"
            >
              An interactive laboratory for orcas, satellites, vessels, buoys,
              sensors, and ocean currents. Rotate, zoom, and inspect any
              object.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 grid grid-cols-3 gap-3 max-w-md"
            >
              <Feature icon={RotateCw} label="ROTATE" />
              <Feature icon={ZoomIn} label="ZOOM" />
              <Feature icon={MousePointer2} label="INTERACT" />
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-9">
              <Link to="/explorer">
                <Button
                  size="lg"
                  leftIcon={<Boxes className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Enter 3D Explorer
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <ViewportPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ViewportPreview() {
  return (
    <div className="relative aspect-square rounded-2xl border border-cyan/20 bg-abyss/60 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.12)]">
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/60" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/60" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/60" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/60" />

      <div className="absolute inset-0 bg-gradient-to-b from-cyan/10 via-transparent to-abyss" />
      <div className="absolute inset-0 data-grid opacity-40" />

      <svg
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-40"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((p, i) => (
          <line
            key={i}
            x1="0"
            y1={200 - p * 180}
            x2="400"
            y2={200 - p * 180}
            stroke="#06b6d4"
            strokeWidth="0.4"
            strokeOpacity={1 - p * 0.7}
          />
        ))}
      </svg>

      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full text-cyan">
        <defs>
          <radialGradient id="orcaGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="220" rx="140" ry="120" fill="url(#orcaGlow2)" />
        <motion.g
          animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '200px 220px' }}
        >
          <ellipse
            cx="200"
            cy="220"
            rx="130"
            ry="50"
            fill="#0a0f1e"
            stroke="#22d3ee"
            strokeWidth="0.6"
            strokeOpacity="0.8"
          />
          <ellipse cx="200" cy="240" rx="100" ry="20" fill="#e2e8f0" fillOpacity="0.15" />
          <ellipse cx="240" cy="200" rx="16" ry="10" fill="#e2e8f0" fillOpacity="0.5" />
          <ellipse cx="240" cy="205" rx="3" ry="3" fill="#06b6d4" />
          <path
            d="M180 175 Q200 140 220 175 L220 185 Q200 180 180 185 Z"
            fill="#0a0f1e"
            stroke="#22d3ee"
            strokeWidth="0.6"
            strokeOpacity="0.8"
          />
          <path
            d="M70 220 Q50 210 40 220 Q50 230 70 220 Z"
            fill="#0a0f1e"
            stroke="#22d3ee"
            strokeWidth="0.6"
            strokeOpacity="0.8"
          />
        </motion.g>
      </svg>

      {[
        { x: '63%', y: '43%', label: 'DORSAL FIN' },
        { x: '50%', y: '72%', label: 'BELLY PATCH' },
        { x: '30%', y: '52%', label: 'TAIL FLUKE' },
      ].map((h) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute"
          style={{ left: h.x, top: h.y }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <span className="flex h-3 w-3 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-cyan/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[8px] tracking-widest text-cyan/80">
              {h.label}
            </span>
          </div>
        </motion.div>
      ))}

      <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2 rounded-md border border-white/10 bg-abyss/80 backdrop-blur-md px-2.5 h-7">
          <Boxes className="h-3 w-3 text-cyan" />
          <span className="font-mono text-[9px] tracking-widest text-cyan/80">
            ORCA · 3D LAB
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-abyss/80 backdrop-blur-md px-2.5 h-7">
          <span className="h-1 w-1 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest text-teal/80">
            60 FPS
          </span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
        <span className="font-mono text-[9px] tracking-widest text-white/50">
          OBJ · ORCA · POLY 12,840
        </span>
        <span className="font-mono text-[9px] tracking-widest text-cyan/70">
          VIEW · FRONT-3/4
        </span>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <Icon className="h-3.5 w-3.5 text-cyan mb-2" />
      <div className="font-mono text-[9px] tracking-widest text-cyan/70">
        {label}
      </div>
    </div>
  );
}