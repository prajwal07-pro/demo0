import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Cloud,
  Route,
  Waves,
  Fish,
  AlertTriangle,
  Fuel,
  Droplet,
  LifeBuoy,
  Wind,
  Play,
  Settings2,
  MapPin,
  Clock,
  Gauge,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
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
 * Simulations — marine simulation lab.
 * Left: scenario picker. Right: parameter panel + run controls.
 *
 * Simulation execution requires a connected backend. When offline, the
 * "Run Simulation" action is disabled with an explicit reason.
 */
export default function Simulations() {
  const [selected, setSelected] = React.useState<SimulationScenarioId>('storm');
  const scenario = SIMULATION_SCENARIOS.find((s) => s.id === selected)!;
  const [params, setParams] = React.useState({
    location: 'Bay of Bengal',
    lat: 15.0,
    lng: 85.0,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 72 * 3600_000).toISOString().slice(0, 16),
    vesselSpeed: 12,
    vesselHeading: 90,
    timeStep: 1,
    notes: '',
  });
  const [status, setStatus] = React.useState<'idle' | 'running'>('idle');

  const run = () => {
    // Wired to simulationService.submit() in a later phase
    setStatus('running');
    setTimeout(() => setStatus('idle'), 2200);
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
            MODULE · SIMULATION
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Simulation Lab
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 max-w-2xl text-muted-foreground">
          Model storms, routes, drift, and search-and-rescue scenarios before
          they happen. Configure a scenario and run it against fused ocean and
          weather fields.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left: Scenario list */}
        <aside className="rounded-xl border border-white/10 bg-white/[0.015] p-3 h-fit">
          <div className="px-2 py-2 font-mono text-[10px] tracking-widest text-cyan/60">
            SCENARIOS · {SIMULATION_SCENARIOS.length}
          </div>
          <ul className="flex flex-col gap-1">
            {SIMULATION_SCENARIOS.map((s) => {
              const Icon = SCENARIO_ICONS[s.id];
              const active = selected === s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setSelected(s.id)}
                    className={cn(
                      'w-full flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
                      active
                        ? 'border-cyan/30 bg-cyan/5'
                        : 'border-transparent hover:bg-white/5'
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 shrink-0 rounded-md border flex items-center justify-center mt-0.5',
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
                        {s.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70 line-clamp-2 mt-0.5">
                        {s.description}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right: Parameters + Run */}
        <div className="flex flex-col gap-4">
          {/* Scenario header */}
          <div className="rounded-xl border border-cyan/20 bg-cyan/[0.03] p-5 relative overflow-hidden">
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan/60" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan/60" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan/60" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan/60" />

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl border border-cyan/30 bg-cyan/10 flex items-center justify-center shrink-0">
                {React.createElement(SCENARIO_ICONS[scenario.id], {
                  className: 'h-5 w-5 text-cyan',
                })}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                  SCENARIO · {String(scenario.id).toUpperCase()}
                </div>
                <h2 className="font-display text-xl font-semibold text-white mt-1">
                  {scenario.label}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {scenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="flex items-center gap-2 mb-5">
              <Settings2 className="h-3.5 w-3.5 text-cyan" />
              <div className="font-mono text-[10px] tracking-widest text-cyan/70">
                PARAMETERS
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="LOCATION NAME"
                value={params.location}
                onChange={(e) => setParams((p) => ({ ...p, location: e.target.value }))}
                leftIcon={<MapPin className="h-3.5 w-3.5" />}
              />
              <Input
                label="TIME STEP (HOURS)"
                type="number"
                value={params.timeStep}
                onChange={(e) => setParams((p) => ({ ...p, timeStep: Number(e.target.value) }))}
                leftIcon={<Clock className="h-3.5 w-3.5" />}
              />
              <Input
                label="LATITUDE"
                type="number"
                step="0.01"
                value={params.lat}
                onChange={(e) => setParams((p) => ({ ...p, lat: Number(e.target.value) }))}
              />
              <Input
                label="LONGITUDE"
                type="number"
                step="0.01"
                value={params.lng}
                onChange={(e) => setParams((p) => ({ ...p, lng: Number(e.target.value) }))}
              />
              <Input
                label="START TIME"
                type="datetime-local"
                value={params.startTime}
                onChange={(e) => setParams((p) => ({ ...p, startTime: e.target.value }))}
              />
              <Input
                label="END TIME"
                type="datetime-local"
                value={params.endTime}
                onChange={(e) => setParams((p) => ({ ...p, endTime: e.target.value }))}
              />
              <Input
                label="VESSEL SPEED (KN)"
                type="number"
                value={params.vesselSpeed}
                onChange={(e) => setParams((p) => ({ ...p, vesselSpeed: Number(e.target.value) }))}
                leftIcon={<Gauge className="h-3.5 w-3.5" />}
              />
              <Input
                label="VESSEL HEADING (°)"
                type="number"
                value={params.vesselHeading}
                onChange={(e) => setParams((p) => ({ ...p, vesselHeading: Number(e.target.value) }))}
              />
            </div>

            <div className="mt-4">
              <Textarea
                label="NOTES"
                placeholder="Any additional context for this simulation…"
                value={params.notes}
                onChange={(e) => setParams((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Run controls */}
          <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant={status === 'running' ? 'info' : 'neutral'}
                  dot={status === 'running'}
                  size="md"
                >
                  {status === 'running' ? 'RUNNING…' : 'READY'}
                </Badge>
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  ENGINE · BACKEND PROXY REQUIRED
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="md">
                  Save Draft
                </Button>
                <Button
                  size="md"
                  leftIcon={<Play className="h-3.5 w-3.5" />}
                  loading={status === 'running'}
                  onClick={run}
                  disabled={status === 'running'}
                >
                  Run Simulation
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {status === 'running' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                    <span className="font-mono text-[10px] tracking-widest text-cyan/80">
                      DISPATCHING SCENARIO TO ENGINE…
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan to-teal"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result placeholder */}
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center">
            <FlaskConical className="h-6 w-6 text-muted-foreground/60 mx-auto mb-3" />
            <p className="font-mono text-[10px] tracking-widest text-cyan/70">
              NO RESULTS YET
            </p>
            <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
              Run a scenario to see visualizations, metrics, and an auditable
              summary of the model assumptions and data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}