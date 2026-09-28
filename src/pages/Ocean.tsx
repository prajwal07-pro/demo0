import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Waves,
  Wind,
  Activity,
  Layers,
  Play,
  Pause,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OCEAN_LAYERS, type OceanLayerId } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import { fadeInUp, staggerContainer } from '@/lib/animations';

/**
 * Ocean — ocean intelligence workspace.
 *
 * Renders data-layer toggles, a large playback control for time,
 * and a "layer availability" grid that honestly shows which datasets
 * are currently wired up vs. awaiting a live source.
 *
 * Data integrity: layer status comes from state, not invented numbers.
 */
export default function Ocean() {
  const activeLayers = useAppStore((s) => s.activeLayers);
  const setActiveLayers = useAppStore((s) => s.setActiveLayers);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const setIsPlaying = useAppStore((s) => s.setIsPlaying);
  const playbackSpeed = useAppStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useAppStore((s) => s.setPlaybackSpeed);
  const timeRange = useAppStore((s) => s.timeRange);

  const toggleLayer = (id: OceanLayerId) => {
    if (activeLayers.includes(id)) {
      setActiveLayers(activeLayers.filter((l) => l !== id));
    } else {
      setActiveLayers([...activeLayers, id]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            MODULE · OCEANOGRAPHY
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Ocean Intelligence
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 max-w-2xl text-muted-foreground">
          Sea surface temperature, chlorophyll, currents, wave height, wind,
          and bathymetry — fused from satellite, model, and in-situ sources.
        </motion.p>
      </motion.div>

      {/* Layout: Layers + Playback + Availability grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left: Layer toggles */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-white/10 bg-white/[0.015] p-5 h-fit"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-cyan" />
            <div>
              <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                DATA LAYERS
              </div>
              <div className="font-display text-base font-semibold text-white">
                {activeLayers.length} active
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-1.5">
            {OCEAN_LAYERS.map((layer) => {
              const active = activeLayers.includes(layer.id);
              const Icon = LAYER_ICONS[layer.id];
              return (
                <li key={layer.id}>
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                      active
                        ? 'border-cyan/30 bg-cyan/5'
                        : 'border-transparent hover:bg-white/5'
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 shrink-0 rounded-md border flex items-center justify-center',
                        active
                          ? 'border-cyan/40 bg-cyan/10'
                          : 'border-white/10 bg-white/5'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-3.5 w-3.5',
                          active ? 'text-cyan' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          'text-xs font-medium truncate',
                          active ? 'text-white' : 'text-muted-foreground'
                        )}
                      >
                        {layer.label}
                      </div>
                      <div className="font-mono text-[9px] text-cyan/50">
                        {layer.unit}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'h-3 w-3 rounded-full border transition-colors',
                        active ? 'border-cyan bg-cyan' : 'border-white/20'
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.aside>

        {/* Right: Playback + grid */}
        <div className="flex flex-col gap-4">
          {/* Playback bar */}
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-10 w-10 rounded-lg border border-cyan/30 bg-cyan/10 flex items-center justify-center hover:bg-cyan/20 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-cyan" />
                  ) : (
                    <Play className="h-4 w-4 text-cyan ml-0.5" />
                  )}
                </button>
                <div>
                  <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                    TIMELINE
                  </div>
                  <div className="font-display text-sm text-white">
                    {new Date(timeRange.start).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative h-2 rounded-full bg-white/5">
                  <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-cyan to-teal" />
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-cyan bg-abyss" />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground">
                  <span>-24H</span>
                  <span>-12H</span>
                  <span>NOW</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[0.5, 1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={cn(
                      'h-7 px-2.5 rounded-md font-mono text-[10px] transition-colors',
                      playbackSpeed === s
                        ? 'bg-cyan/15 text-cyan border border-cyan/30'
                        : 'text-muted-foreground hover:bg-white/5 border border-transparent'
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Calendar className="h-3.5 w-3.5" />}
              >
                Range
              </Button>
            </div>
          </div>

          {/* Availability grid */}
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                  DATA SOURCE STATUS
                </div>
                <div className="font-display text-base font-semibold text-white">
                  Layer Availability
                </div>
              </div>
              <Badge variant="neutral" size="sm">
                LIVE REQUIRED
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {OCEAN_LAYERS.map((layer) => {
                const active = activeLayers.includes(layer.id);
                const Icon = LAYER_ICONS[layer.id];
                return (
                  <div
                    key={layer.id}
                    className="rounded-lg border border-white/5 bg-white/[0.015] p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-3.5 w-3.5 text-cyan/60" />
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                        {active ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="font-display text-xs font-medium text-white truncate">
                      {layer.label}
                    </div>
                    <div className="mt-2 font-mono text-[9px] tracking-widest text-amber-400/80">
                      WAITING FOR LIVE DATA
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 flex items-start gap-3">
              <span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <p className="text-[11px] text-amber-100/80 leading-relaxed">
                Ocean layers require a connected backend that proxies provider
                datasets (e.g. Copernicus, NOAA, INCOIS). ORCA never fabricates
                values — when a source is not wired up, the layer renders as
                <span className="font-mono mx-1">DATA UNAVAILABLE</span>
                rather than showing placeholder numbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Icon map ----------
const LAYER_ICONS: Record<OceanLayerId, React.ComponentType<{ className?: string }>> = {
  sst: Thermometer,
  chlorophyll: Droplets,
  waveHeight: Waves,
  windSpeed: Wind,
  currents: Activity,
  bathymetry: Layers,
  salinity: Droplets,
  dissolvedOxygen: Droplets,
};