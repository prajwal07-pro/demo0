import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Maximize2, Compass, Layers } from 'lucide-react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { cn } from '@/lib/utils';

export interface MapControlsProps {
  map: MapLibreMap | null;
  /** Optional callback to toggle the layers panel. */
  onToggleLayers?: () => void;
  /**
   * Surface tone. Defaults to `dark` because the map workbench is dark.
   * Use `light` when embedding MapControls on a light editorial surface.
   */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * MapControls — floating control cluster for a MapLibre instance.
 *
 * Provides zoom in/out, reset view, and a layers toggle. Positioned at
 * the bottom-right of the map container. Supports both light and dark
 * tones so it can be dropped into either context without visual clashes.
 */
export function MapControls({
  map,
  onToggleLayers,
  tone = 'dark',
  className,
}: MapControlsProps) {
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

  const isLight = tone === 'light';

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-1.5 rounded-xl border p-1.5',
        isLight
          ? 'border-ink/10 bg-white/95 shadow-soft-md backdrop-blur-md'
          : 'border-white/10 bg-abyss/85 backdrop-blur-md',
        className
      )}
      role="group"
      aria-label="Map controls"
    >
      <ControlButton
        label="Zoom in"
        icon={
          <Plus
            className={cn('h-3.5 w-3.5', isLight ? 'text-ink' : 'text-white')}
          />
        }
        onClick={handleZoomIn}
        light={isLight}
      />
      <ControlButton
        label="Zoom out"
        icon={
          <Minus
            className={cn('h-3.5 w-3.5', isLight ? 'text-ink' : 'text-white')}
          />
        }
        onClick={handleZoomOut}
        light={isLight}
      />
      <ControlButton
        label={`Reset bearing (${Math.round(bearing)}°)`}
        icon={
          <motion.div
            animate={{ rotate: -bearing }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Compass
              className={cn('h-3.5 w-3.5', isLight ? 'text-ink' : 'text-white')}
            />
          </motion.div>
        }
        onClick={handleReset}
        light={isLight}
      />
      {onToggleLayers && (
        <ControlButton
          label="Toggle layers"
          icon={
            <Layers
              className={cn('h-3.5 w-3.5', isLight ? 'text-ink' : 'text-white')}
            />
          }
          onClick={onToggleLayers}
          light={isLight}
        />
      )}
      <ControlButton
        label="Reset view"
        icon={
          <Maximize2
            className={cn(
              'h-3.5 w-3.5',
              isLight ? 'text-mist-deep' : 'text-white/60'
            )}
          />
        }
        onClick={handleReset}
        light={isLight}
      />
    </div>
  );
}

function ControlButton({
  label,
  icon,
  onClick,
  light,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  light: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
        light
          ? 'border-ink/10 bg-white hover:border-ocean/40 hover:bg-ocean/[0.04]'
          : 'border-white/10 bg-white/[0.03] hover:border-cyan/40 hover:bg-white/[0.06]'
      )}
    >
      {icon}
    </button>
  );
}