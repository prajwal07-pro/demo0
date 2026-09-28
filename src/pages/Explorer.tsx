import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Boxes,
  Satellite,
  Ship,
  Anchor,
  Waves,
  CircleDot,
  Fish,
  Wind,
  Info,
  RotateCcw,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { OceanScene } from '@/components/3d/OceanScene';
import { OrcaModel } from '@/components/3d/OrcaModel';
import { VesselModel } from '@/components/3d/VesselModel';
import { SatelliteModel } from '@/components/3d/SatelliteModel';
import { BuoyModel } from '@/components/3d/BuoyModel';
import { UnderwaterSensor } from '@/components/3d/UnderwaterSensor';
import { SubmarineModel } from '@/components/3d/SubmarineModel';
import { MarineDrone } from '@/components/3d/MarineDrone';
import { OceanCurrentField } from '@/components/3d/OceanCurrentField';
import { type VesselTypeId } from '@/lib/constants';

type ExplorerObjectId =
  | 'orca'
  | 'satellite'
  | 'cargo'
  | 'fishing'
  | 'research'
  | 'buoy'
  | 'sensor'
  | 'submarine'
  | 'drone'
  | 'currents';

interface ExplorerObject {
  id: ExplorerObjectId;
  label: string;
  category: 'biology' | 'space' | 'vessels' | 'sensors' | 'ocean';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EXPLORER_OBJECTS: ExplorerObject[] = [
  {
    id: 'orca',
    label: 'Orca',
    category: 'biology',
    description:
      'Apex marine predator. ORCA uses orca telemetry and behaviour as an indicator of ocean health and prey availability.',
    icon: Fish,
  },
  {
    id: 'satellite',
    label: 'Earth Observation Satellite',
    category: 'space',
    description:
      'Polar-orbiting platforms carry radiometers and radar that measure SST, chlorophyll, wind, and sea state.',
    icon: Satellite,
  },
  {
    id: 'cargo',
    label: 'Cargo Vessel',
    category: 'vessels',
    description:
      'Bulk carriers and container ships generating AIS tracks that shape global trade and emissions visibility.',
    icon: Ship,
  },
  {
    id: 'fishing',
    label: 'Fishing Vessel',
    category: 'vessels',
    description:
      'Monitored to detect illegal, unreported, and unregulated fishing, and to protect marine stocks.',
    icon: Ship,
  },
  {
    id: 'research',
    label: 'Research Vessel',
    category: 'vessels',
    description:
      'Deploys sensors, CTDs, and autonomous platforms that anchor in-situ validation of satellite products.',
    icon: Ship,
  },
  {
    id: 'buoy',
    label: 'Ocean Buoy',
    category: 'sensors',
    description:
      'Moored platforms measuring wave spectra, SST, salinity, and air-sea flux at fixed locations.',
    icon: CircleDot,
  },
  {
    id: 'sensor',
    label: 'Underwater Sensor',
    category: 'sensors',
    description:
      'Subsurface moorings capture temperature, salinity, and current profiles beneath the surface layer.',
    icon: Anchor,
  },
  {
    id: 'submarine',
    label: 'Autonomous Vehicle',
    category: 'sensors',
    description:
      'AUVs and gliders survey large areas autonomously, filling gaps between satellites and moorings.',
    icon: Waves,
  },
  {
    id: 'drone',
    label: 'Marine Drone',
    category: 'sensors',
    description:
      'Aerial platforms for coastal surveys, illegal fishing detection, and search-and-rescue support.',
    icon: Wind,
  },
  {
    id: 'currents',
    label: 'Ocean Currents',
    category: 'ocean',
    description:
      'Surface and subsurface flow fields that drive heat transport, larval dispersal, and drift trajectories.',
    icon: Waves,
  },
];

const CATEGORY_LABELS: Record<ExplorerObject['category'], string> = {
  biology: 'BIOLOGY',
  space: 'SPACE',
  vessels: 'VESSELS',
  sensors: 'SENSORS',
  ocean: 'OCEAN',
};

/**
 * Explorer — interactive 3D laboratory.
 * Left: object catalog. Center: 3D viewer. Right: info panel.
 */
export default function Explorer() {
  const [selected, setSelected] = React.useState<ExplorerObjectId>('orca');
  const [infoOpen, setInfoOpen] = React.useState(true);
  const obj = EXPLORER_OBJECTS.find((o) => o.id === selected)!;

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Left: object catalog */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-white/5 bg-abyss/40 backdrop-blur-md">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-cyan" />
            <div>
              <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                3D EXPLORER
              </div>
              <div className="font-display text-sm font-semibold text-white">
                Object Catalog
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 no-scrollbar">
          {(Object.keys(CATEGORY_LABELS) as ExplorerObject['category'][]).map((cat) => {
            const items = EXPLORER_OBJECTS.filter((o) => o.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="mb-4">
                <div className="px-2 py-1.5 font-mono text-[9px] tracking-widest text-cyan/50">
                  {CATEGORY_LABELS[cat]}
                </div>
                <ul className="flex flex-col gap-0.5">
                  {items.map((o) => {
                    const Icon = o.icon;
                    const active = o.id === selected;
                    return (
                      <li key={o.id}>
                        <button
                          onClick={() => setSelected(o.id)}
                          className={cn(
                            'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs transition-colors border',
                            active
                              ? 'border-cyan/30 bg-cyan/10 text-cyan'
                              : 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-white'
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="flex-1 truncate">{o.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Center: 3D viewport */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-3 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-white/10 bg-abyss/80 backdrop-blur-md px-3 h-10">
            <Boxes className="h-4 w-4 text-cyan" />
            <span className="font-mono text-[10px] tracking-widest text-cyan/80">
              ORCA · 3D LAB
            </span>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="pointer-events-auto h-10 w-10 rounded-lg border border-white/10 bg-abyss/80 backdrop-blur-md flex items-center justify-center hover:border-cyan/40"
            aria-label="Toggle info panel"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <OceanScene cameraPosition={[0, 2, 8]} mood="night" postprocessing>
          <ExplorerScene objectId={selected} />
        </OceanScene>

        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-abyss/80 backdrop-blur-md px-3 h-9">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
            OBJECT · {obj.label.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <button
            className="h-9 w-9 rounded-lg border border-white/10 bg-abyss/80 backdrop-blur-md flex items-center justify-center hover:border-cyan/40"
            aria-label="Reset view"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Right: info panel */}
      <AnimatePresence>
        {infoOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden xl:flex flex-col shrink-0 border-l border-white/5 bg-abyss/40 backdrop-blur-md overflow-hidden"
          >
            <div className="p-5 w-[360px]">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="default" size="sm">
                  {CATEGORY_LABELS[obj.category]}
                </Badge>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="h-7 w-7 rounded-md border border-white/10 hover:border-cyan/40 flex items-center justify-center"
                  aria-label="Close info panel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <h2 className="font-display text-2xl font-semibold text-white mb-1">
                {obj.label}
              </h2>
              <div className="font-mono text-[10px] tracking-widest text-cyan/60 mb-5">
                ID · {String(obj.id).toUpperCase()}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {obj.description}
              </p>

              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="font-mono text-[10px] tracking-widest text-cyan/60 mb-3">
                  INTERACTIONS
                </div>
                <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-cyan" />
                    Drag to rotate
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-cyan" />
                    Scroll to zoom
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-cyan" />
                    Right-drag to pan
                  </li>
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Scene renderer ----------

function ExplorerScene({ objectId }: { objectId: ExplorerObjectId }) {
  // Cargo / fishing / research all share VesselModel with different types
  const vesselTypes: Partial<Record<ExplorerObjectId, VesselTypeId>> = {
    cargo: 'cargo',
    fishing: 'fishing',
    research: 'research',
  };

  return (
    <>
      <OceanCurrentField extent={30} resolution={30} flowSpeed={0.5} />

      {objectId === 'orca' && (
        <OrcaModel position={[0, 0, 0]} scale={1.4} animated followCamera={false} />
      )}

      {objectId === 'satellite' && (
        <>
          <EarthFallback />
          <SatelliteModel position={[0, 3, 0]} scale={0.9} orbiting orbitRadius={4} sensorBeam />
        </>
      )}

      {vesselTypes[objectId] && (
        <VesselModel
          type={vesselTypes[objectId]!}
          position={[0, 0, 0]}
          scale={1.5}
          showLabel
          name={
            objectId === 'cargo'
              ? 'MV Sample Cargo'
              : objectId === 'fishing'
                ? 'FV Sample Fisher'
                : 'RV Sample Research'
          }
          mmsi="000000000"
        />
      )}

      {objectId === 'buoy' && <BuoyModel position={[0, 0, 0]} scale={2} beacon />}

      {objectId === 'sensor' && (
        <UnderwaterSensor position={[0, 0, 0]} scale={2} sonar />
      )}

      {objectId === 'submarine' && (
        <SubmarineModel position={[0, 0, 0]} scale={1.4} searchlight />
      )}

      {objectId === 'drone' && (
        <MarineDrone position={[0, 1.5, 0]} scale={1.4} scanning />
      )}

      {objectId === 'currents' && (
        <>
          <OceanCurrentField extent={20} resolution={40} flowSpeed={1.2} y={0} />
          <OceanCurrentField extent={20} resolution={40} flowSpeed={0.8} y={-2} seed={99} />
        </>
      )}
    </>
  );
}

/**
 * Very simple Earth fallback to give the satellite scene context without
 * requiring the full textured EarthGlobe (which loads textures).
 */
function EarthFallback() {
  return (
    <mesh position={[0, -4, 0]}>
      <sphereGeometry args={[3, 48, 32]} />
      <meshStandardMaterial
        color="#0c4a6e"
        roughness={0.7}
        metalness={0.2}
        emissive="#06b6d4"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}