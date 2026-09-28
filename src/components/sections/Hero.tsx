import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Play, ChevronDown } from 'lucide-react';
import { OceanScene } from '@/components/3d/OceanScene';
import { OrcaModel } from '@/components/3d/OrcaModel';
import { SatelliteModel } from '@/components/3d/SatelliteModel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataStream } from '@/components/ui/DataStream';
import { cn } from '@/lib/utils';
import { EASINGS } from '@/lib/animations';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Hero — cinematic ocean hero for the ORCA platform.
 * Uses OceanScene (React Three Fiber) for the 3D environment:
 *  - Procedural orca
 *  - Earth observation satellite with sensor beam
 *  - Data particles
 * Mouse subtly influences camera; scroll produces a cinematic journey.
 */
export function Hero() {
  const navigate = useNavigate();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Scroll-driven cinematic transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const sceneOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0]);

  // Mouse parallax
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    if (reducedMotion) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [reducedMotion]);

  const cameraPos: [number, number, number] = [
    mouse.x * 1.2,
    2.5 + mouse.y * 0.6,
    9 - mouse.y * 0.4,
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-abyss"
      aria-label="ORCA hero"
    >
      {/* ---------- 3D Scene Layer ---------- */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: sceneScale, opacity: sceneOpacity }}
      >
        <OceanScene
          cameraPosition={cameraPos}
          cameraFov={55}
          mood="night"
          showParticles
          className="h-full w-full"
        >
          {/* Orca — flagship */}
          <OrcaModel
            position={[0, -0.4, 0]}
            scale={1.1}
            animated
            followCamera
            holographic
          />

          {/* Orbiting satellite */}
          <SatelliteModel
            orbiting
            orbitRadius={7}
            orbitSpeed={0.08}
            scale={0.5}
            sensorBeam
            beamTarget={[0, -3, 0]}
            showLabel={false}
          />

          {/* Secondary orca in the distance for depth */}
          <OrcaModel
            position={[-4, 0.6, -3]}
            scale={0.5}
            animated
            followCamera={false}
            holographic={false}
          />
        </OceanScene>
      </motion.div>

      {/* ---------- Atmospheric overlays ---------- */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Top scan lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,6,23,0.85)_100%)]" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-abyss via-abyss/80 to-transparent" />
      </div>

      {/* ---------- HUD chrome ---------- */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute top-20 left-6 font-mono text-[10px] tracking-widest text-cyan/50">
          ORCA · LIVE ENVIRONMENT
        </div>
        <div className="absolute top-20 right-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-teal/80">
            SATELLITE SYNC · 04:22 UTC
          </span>
        </div>
        <div className="absolute bottom-24 left-6 hidden md:block">
          <span className="font-mono text-[10px] tracking-widest text-cyan/40">
            15.0000°N 85.0000°E · BAY OF BENGAL
          </span>
        </div>
        <div className="absolute bottom-24 right-6 hidden md:block">
          <span className="font-mono text-[10px] tracking-widest text-cyan/40">
            DEPTH · 3200 M
          </span>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <motion.div
        className="relative z-30 flex min-h-[100svh] flex-col justify-center px-6 lg:px-12"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASINGS.cinematic }}
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                DATA
              </span>
              <span className="text-cyan/40">×</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                OCEAN
              </span>
              <span className="text-cyan/40">×</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                AI
              </span>
              <span className="text-cyan/40">×</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                IMPACT
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-white">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASINGS.cinematic }}
              >
                A SMARTER OCEAN
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: EASINGS.cinematic }}
              >
                FOR A SAFER
              </motion.span>
              <motion.span
                className="block text-gradient-cyan"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: EASINGS.cinematic }}
              >
                TOMORROW.
              </motion.span>
            </h1>

            {/* Subhead */}
            <motion.p
              className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              ORCA fuses satellite Earth observation, AIS vessel intelligence,
              oceanographic models, and a network of AI agents into one
              operating picture — for marine research, safety, and sustainability.
            </motion.p>

            {/* CTA row */}
            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
            >
              <Button
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate('/map')}
                magnetic
              >
                Explore Live Ocean
              </Button>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<MessageSquare className="h-4 w-4" />}
                onClick={() => navigate('/assistant')}
              >
                Talk to ORCA
              </Button>
              <button
                className="hidden md:inline-flex items-center gap-2 text-xs font-mono tracking-widest text-muted-foreground hover:text-cyan transition-colors"
                onClick={() => navigate('/about')}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:border-cyan/40">
                  <Play className="h-3 w-3" />
                </span>
                WATCH THE MISSION
              </button>
            </motion.div>

            {/* Status chips */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Badge variant="success" dot>
                32,489 LIVE VESSELS
              </Badge>
              <Badge variant="default" dot>
                12+ OCEAN DATA LAYERS
              </Badge>
              <Badge variant="violet">
                24/7 AI AGENTS
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] tracking-widest">
            SCROLL TO DIVE
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.div>
      </motion.div>

      {/* Thin data stream line at very bottom */}
      <div className="absolute bottom-0 inset-x-0 z-30 h-px overflow-hidden">
        <DataStream direction="horizontal" speed={0.7} particles={false} />
      </div>
    </section>
  );
}