import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Maximize2, Compass, Layers } from 'lucide-react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { cn } from '@/lib/utils';

export interface MapControlsProps {
  map: MapLibreMap | null;
  /** Optional callback to toggle the layers panel. */
  onToggleLayers?: () => void;
  className?: string;
}

/**
 * MapControls — floating control cluster for a MapLibre instance.
 *
 * Provides zoom in/out, reset view, and a layers toggle. Positioned at
 * the bottom-right of the map container. Follows the dark marine
 * workbench palette so it reads cleanly over the GIS canvas.
 */
export function MapControls({ map, onToggleLayers, className }: MapControlsProps) {
  const [bearing, setBearing] = React.useState(0);

  React.useEffect(() => {
    if (!map) return;
    const handleRotate = () => setBearing(map.getBearing());
    map.on('rotate', handleRotate);
    return () => {
      map.off('rotate', handleRotate);
    };
  }, [map]);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleReset = () => {
    map?.easeTo({ bearing: 0, pitch: 0, duration: 500 });
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-abyss/85 backdrop-blur-md p-1.5',
        className
      )}
      role="group"
      aria-label="Map controls"
    >
      <ControlButton
        label="Zoom in"
        icon={<Plus className="h-3.5 w-3.5 text-white" />}
        onClick={handleZoomIn}
      />
      <ControlButton
        label="Zoom out"
        icon={<Minus className="h-3.5 w-3.5 text-white" />}
        onClick={handleZoomOut}
      />
      <ControlButton
        label={`Reset bearing (${Math.round(bearing)}°)`}
        icon={
          <motion.div
            animate={{ rotate: -bearing }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Compass className="h-3.5 w-3.5 text-white" />
          </motion.div>
        }
        onClick={handleReset}
      />
      {onToggleLayers && (
        <ControlButton
          label="Toggle layers"
          icon={<Layers className="h-3.5 w-3.5 text-white" />}
          onClick={onToggleLayers}
        />
      )}
      <ControlButton
        label="Reset view"
        icon={<Maximize2 className="h-3.5 w-3.5 text-white/60" />}
        onClick={handleReset}
      />
    </div>
  );
}

function ControlButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center hover:border-cyan/40 hover:bg-white/[0.06] transition-colors"
    >
      {icon}
    </button>
  );
}