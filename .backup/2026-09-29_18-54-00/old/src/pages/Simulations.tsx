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
import { Input, Textarea } from '@/components/ui/Input';
import {
  SIMULATION_SCENARIOS,
  type SimulationScenarioId,
} from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const SCENARIO_ICONS: Record<
  SimulationScenarioId,
  React.ComponentType<{ className?: string }>
> = {
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
    setStatus('running');
    setTimeout(() => setStatus('idle'), 2200);
  };

  return (
    <div className="relative bg-pearl text-ink">
      {/* Header */}
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                SIMULATION LAB
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              Model the ocean
              <br />
              <span className="text-gradient-navy">before it happens.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-2xl text-base text-ink-soft leading-relaxed"
            >
              Configure a scenario and run it against fused ocean and weather
              fields. Each result is a physically-grounded, auditable summary.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Workspace */}
      <section className="relative py-10 lg:py-14 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Left: Scenario list */}
            <aside className="rounded-2xl border border-ink/[0.08] bg-white p-3 shadow-soft h-fit">
              <div className="px-3 py-2 font-mono text-[10px] tracking-widest text-ocean">
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
                          'w-full flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                          active
                            ? 'border-ocean/25 bg-ocean/[0.06]'
                            : 'border-transparent hover:bg-ink/[0.03]'
                        )}
                      >
                        <div
                          className={cn(
                            'h-8 w-8 shrink-0 rounded-lg border flex items-center justify-center mt-0.5',
                            active
                              ? 'border-ocean/30 bg-ice'
                              : 'border-ink/10 bg-pearl-soft'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-3.5 w-3.5',
                              active ? 'text-ocean' : 'text-mist-deep'
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              'text-xs font-medium truncate',
                              active ? 'text-ink' : 'text-ink-soft'
                            )}
                          >
                            {s.label}
                          </div>
                          <div className="text-[10px] text-mist-deep line-clamp-2 mt-0.5">
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
            <div className="flex flex-col gap-5">
              {/* Scenario header */}
              <div className="rounded-2xl border border-ocean/15 bg-ice/40 p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl border border-ocean/25 bg-white flex items-center justify-center shrink-0">
                    {React.createElement(SCENARIO_ICONS[scenario.id], {
                      className: 'h-5 w-5 text-ocean',
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] tracking-widest text-ocean">
                      SCENARIO · {String(scenario.id).toUpperCase()}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-ink mt-1">
                      {scenario.label}
                    </h2>
                    <p className="text-sm text-ink-soft mt-1 leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parameters */}
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-5">
                  <Settings2 className="h-3.5 w-3.5 text-ocean" />
                  <div className="font-mono text-[10px] tracking-widest text-ocean">
                    PARAMETERS
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    variant="default"
                    label="LOCATION NAME"
                    value={params.location}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, location: e.target.value }))
                    }
                    leftIcon={<MapPin className="h-3.5 w-3.5" />}
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="TIME STEP (HOURS)"
                    type="number"
                    value={params.timeStep}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, timeStep: Number(e.target.value) }))
                    }
                    leftIcon={<Clock className="h-3.5 w-3.5" />}
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="LATITUDE"
                    type="number"
                    step="0.01"
                    value={params.lat}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, lat: Number(e.target.value) }))
                    }
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="LONGITUDE"
                    type="number"
                    step="0.01"
                    value={params.lng}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, lng: Number(e.target.value) }))
                    }
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="START TIME"
                    type="datetime-local"
                    value={params.startTime}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, startTime: e.target.value }))
                    }
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="END TIME"
                    type="datetime-local"
                    value={params.endTime}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, endTime: e.target.value }))
                    }
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="VESSEL SPEED (KN)"
                    type="number"
                    value={params.vesselSpeed}
                    onChange={(e) =>
                      setParams((p) => ({
                        ...p,
                        vesselSpeed: Number(e.target.value),
                      }))
                    }
                    leftIcon={<Gauge className="h-3.5 w-3.5" />}
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                  <Input
                    variant="default"
                    label="VESSEL HEADING (°)"
                    type="number"
                    value={params.vesselHeading}
                    onChange={(e) =>
                      setParams((p) => ({
                        ...p,
                        vesselHeading: Number(e.target.value),
                      }))
                    }
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20"
                  />
                </div>

                <div className="mt-4">
                  <Textarea
                    variant="default"
                    label="NOTES"
                    placeholder="Any additional context for this simulation…"
                    value={params.notes}
                    onChange={(e) =>
                      setParams((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="!bg-pearl-soft !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20 placeholder:!text-ink-muted"
                  />
                </div>
              </div>

              {/* Run */}
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-full border',
                        status === 'running'
                          ? 'border-ocean/40 bg-ocean/10 text-ocean'
                          : 'border-ink/10 bg-pearl-soft text-ink-soft'
                      )}
                    >
                      {status === 'running' ? 'RUNNING…' : 'READY'}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-mist-deep">
                      BACKEND PROXY REQUIRED
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary-light" size="md">
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
                      className="mt-5 pt-5 border-t border-ink/[0.06]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-ocean animate-pulse" />
                        <span className="font-mono text-[10px] tracking-widest text-ocean">
                          DISPATCHING SCENARIO TO ENGINE…
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-ink/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-ocean to-cyan-dark"
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
              <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
                <FlaskConical className="h-6 w-6 text-mist-deep mx-auto mb-3" />
                <p className="font-mono text-[10px] tracking-widest text-ocean">
                  NO RESULTS YET
                </p>
                <p className="mt-2 text-xs text-ink-soft max-w-md mx-auto">
                  Run a scenario to see visualizations, metrics, and an
                  auditable summary of model assumptions and data sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}