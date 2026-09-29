import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Layers,
  Radar,
  Search,
  Maximize2,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useMap as useMapState } from '@/store/useAppStore';
import {
  MAP_DEFAULTS,
  OCEAN_LAYERS,
  VESSEL_TYPES,
  type OceanLayerId,
} from '@/lib/constants';

/**
 * LiveMap — full-screen professional marine GIS.
 *
 * This page is intentionally dark: it is a GIS workbench, not an editorial
 * page. The palette is the deep marine theme so that the map canvas reads
 * as a professional operational surface.
 */
export default function LiveMap() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<MapLibreMap | null>(null);
  const [cursor, setCursor] = React.useState({
    lat: MAP_DEFAULTS.center[1],
    lng: MAP_DEFAULTS.center[0],
  });
  const [layersOpen, setLayersOpen] = React.useState(true);

  const {
    viewState,
    activeLayers,
    setActiveLayers,
    selectedVessel,
    setSelectedVessel,
  } = useMapState();

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style:
        import.meta.env.VITE_MAP_STYLE_URL ??
        'https://demotiles.maplibre.org/style.json',
      center: [viewState.center.lng, viewState.center.lat],
      zoom: viewState.zoom,
      minZoom: MAP_DEFAULTS.minZoom,
      maxZoom: MAP_DEFAULTS.maxZoom,
      attributionControl: false,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
    });

    map.on('mousemove', (e) => {
      setCursor({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLayer = (id: string) => {
    const layerId = id as OceanLayerId;
    if (activeLayers.includes(layerId)) {
      setActiveLayers(activeLayers.filter((l: OceanLayerId) => l !== layerId));
    } else {
      setActiveLayers([...activeLayers, layerId]);
    }
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-abyss">
      {/* Map canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_200px_rgba(2,6,23,0.85)]" />

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-white/10 bg-abyss/85 backdrop-blur-md px-3 h-10">
          <Radar className="h-4 w-4 text-cyan" />
          <span className="font-mono text-[10px] tracking-widest text-cyan/80">
            LIVE MARINE MAP
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse ml-1" />
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-white/10 bg-abyss/85 backdrop-blur-md px-3 h-10 min-w-[260px]">
          <Search className="h-3.5 w-3.5 text-white/50" />
          <input
            placeholder="Search vessel, region, MMSI..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex-1" />

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Layers className="h-3.5 w-3.5" />}
          onClick={() => setLayersOpen((v) => !v)}
          className="pointer-events-auto"
        >
          Layers
        </Button>
      </div>

      {/* Left: Layers panel */}
      <AnimatePresence>
        {layersOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute left-4 top-20 bottom-4 z-20 w-80 rounded-2xl border border-white/10 bg-abyss/90 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div>
                <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                  DATA LAYERS
                </div>
                <div className="font-display text-base font-semibold text-white">
                  Ocean Overlays
                </div>
              </div>
              <button
                onClick={() => setLayersOpen(false)}
                className="h-7 w-7 rounded-md border border-white/10 hover:border-cyan/40 flex items-center justify-center"
                aria-label="Close layers"
              >
                <X className="h-3.5 w-3.5 text-white/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
              <div className="font-mono text-[9px] tracking-widest text-cyan/60 px-2 mb-2">
                OCEAN DATA
              </div>
              <ul className="flex flex-col gap-1.5 mb-4">
                {OCEAN_LAYERS.map((layer) => (
                  <LayerRow
                    key={layer.id}
                    label={layer.label}
                    color={layer.color}
                    active={activeLayers.includes(layer.id)}
                    onToggle={() => toggleLayer(layer.id)}
                  />
                ))}
              </ul>

              <div className="font-mono text-[9px] tracking-widest text-cyan/60 px-2 mb-2">
                VESSEL TYPES
              </div>
              <ul className="flex flex-col gap-1.5">
                {VESSEL_TYPES.map((vt) => (
                  <li
                    key={vt.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: vt.color }}
                    />
                    <span className="text-xs text-white/70 flex-1">
                      {vt.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/[0.06] p-3">
              <div className="font-mono text-[9px] tracking-widest text-magenta/80 px-2 mb-1">
                ⚠ DATA SOURCE
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed px-2">
                Live AIS and ocean data streams require a connected backend.
                When unavailable, layers remain disabled and are clearly
                marked.
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Right: Selected vessel detail */}
      <AnimatePresence>
        {selectedVessel && (
          <motion.aside
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute right-4 top-20 bottom-4 z-20 w-96 rounded-2xl border border-cyan/25 bg-abyss/90 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div>
                <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                  VESSEL DETAIL
                </div>
                <div className="font-display text-lg font-semibold text-white truncate">
                  {selectedVessel.name}
                </div>
                <div className="font-mono text-[10px] text-cyan/70">
                  MMSI {selectedVessel.mmsi}
                </div>
              </div>
              <button
                onClick={() => setSelectedVessel(null)}
                className="h-7 w-7 rounded-md border border-white/10 hover:border-cyan/40 flex items-center justify-center"
                aria-label="Close vessel details"
              >
                <X className="h-3.5 w-3.5 text-white/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <DetailField label="TYPE" value={selectedVessel.type.toUpperCase()} />
                <DetailField label="FLAG" value={selectedVessel.flag ?? '—'} />
                <DetailField
                  label="SPEED"
                  value={`${selectedVessel.speed.toFixed(1)} kn`}
                />
                <DetailField
                  label="HEADING"
                  value={`${selectedVessel.heading.toFixed(0)}°`}
                />
                <DetailField
                  label="DESTINATION"
                  value={selectedVessel.destination ?? '—'}
                />
                <DetailField
                  label="LAST UPDATE"
                  value={new Date(selectedVessel.lastUpdate).toLocaleTimeString()}
                />
                <DetailField
                  label="POSITION"
                  value={`${selectedVessel.position.lat.toFixed(3)}, ${selectedVessel.position.lng.toFixed(3)}`}
                  wide
                />
                {selectedVessel.riskScore !== undefined && (
                  <DetailField
                    label="RISK SCORE"
                    value={`${selectedVessel.riskScore}`}
                    wide
                    accent={selectedVessel.riskScore > 60 ? 'critical' : 'ok'}
                  />
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                >
                  View Full Vessel Profile
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 rounded-lg border border-white/10 bg-abyss/85 backdrop-blur-md px-4 py-2">
          <span className="font-mono text-[10px] tracking-widest text-cyan/80">
            ◆ {cursor.lat.toFixed(4)}°N {cursor.lng.toFixed(4)}°E
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[10px] tracking-widest text-white/60">
            ZOOM {viewState.zoom.toFixed(1)}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            className="h-9 w-9 rounded-lg border border-white/10 bg-abyss/85 backdrop-blur-md flex items-center justify-center hover:border-cyan/40"
            aria-label="Zoom in"
            onClick={() => mapRef.current?.zoomIn()}
          >
            <span className="text-lg leading-none text-white">+</span>
          </button>
          <button
            className="h-9 w-9 rounded-lg border border-white/10 bg-abyss/85 backdrop-blur-md flex items-center justify-center hover:border-cyan/40"
            aria-label="Zoom out"
            onClick={() => mapRef.current?.zoomOut()}
          >
            <span className="text-lg leading-none text-white">−</span>
          </button>
          <button
            className="h-9 w-9 rounded-lg border border-white/10 bg-abyss/85 backdrop-blur-md flex items-center justify-center hover:border-cyan/40"
            aria-label="Reset view"
            onClick={() =>
              mapRef.current?.flyTo({
                center: MAP_DEFAULTS.center,
                zoom: MAP_DEFAULTS.zoom,
              })
            }
          >
            <Maximize2 className="h-3.5 w-3.5 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LayerRow({
  label,
  color,
  active,
  onToggle,
}: {
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors border',
          active
            ? 'border-cyan/30 bg-cyan/[0.08]'
            : 'border-transparent hover:bg-white/[0.04]'
        )}
      >
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span
          className={cn(
            'flex-1 text-xs',
            active ? 'text-white' : 'text-white/60'
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'h-3 w-3 rounded-full border transition-colors',
            active ? 'border-cyan bg-cyan' : 'border-white/20'
          )}
        />
      </button>
    </li>
  );
}

function DetailField({
  label,
  value,
  wide = false,
  accent = 'ok',
}: {
  label: string;
  value: string;
  wide?: boolean;
  accent?: 'ok' | 'warning' | 'critical';
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.06] bg-white/[0.02] p-3',
        wide && 'col-span-2'
      )}
    >
      <div className="font-mono text-[9px] tracking-widest text-cyan/60 mb-1">
        {label}
      </div>
      <div
        className={cn(
          'font-mono text-sm truncate',
          accent === 'ok' && 'text-white',
          accent === 'warning' && 'text-amber-400',
          accent === 'critical' && 'text-magenta'
        )}
      >
        {value}
      </div>
    </div>
  );
}