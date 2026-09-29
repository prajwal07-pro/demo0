import * as React from 'react';
import maplibregl from 'maplibre-gl';
import { createRoot, type Root } from 'react-dom/client';
import { Ship } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VESSEL_TYPES, type VesselTypeId } from '@/lib/constants';
import type { AISVessel } from '@/types';

export interface VesselMarkerProps {
  vessel: AISVessel;
  selected?: boolean;
  hovered?: boolean;
  onClick?: (vessel: AISVessel) => void;
}

interface ManagedMarker {
  marker: maplibregl.Marker;
  root: Root;
  element: HTMLDivElement;
}

/**
 * Imperatively add, update, and remove vessel markers on a MapLibre
 * instance. Markers are React-rendered into a DOM node that MapLibre
 * positions at the vessel's coordinates.
 *
 * Usage:
 *   const controller = createVesselMarkerController(map);
 *   controller.sync(vessels, { selectedMmsi, onSelect });
 *   // ...on unmount:
 *   controller.destroy();
 */
export function createVesselMarkerController(map: maplibregl.Map) {
  const markers = new Map<string, ManagedMarker>();

  function sync(
    vessels: AISVessel[],
    options: {
      selectedMmsi?: string | null;
      hoveredMmsi?: string | null;
      onSelect?: (vessel: AISVessel) => void;
    }
  ) {
    const seen = new Set<string>();

    vessels.forEach((vessel) => {
      const existing = markers.get(vessel.mmsi);
      const isSelected = options.selectedMmsi === vessel.mmsi;
      const isHovered = options.hoveredMmsi === vessel.mmsi;

      if (existing) {
        // Update position and props.
        existing.marker.setLngLat([vessel.position.lng, vessel.position.lat]);
        existing.root.render(
          <VesselMarkerView
            vessel={vessel}
            selected={isSelected}
            hovered={isHovered}
            onClick={options.onSelect}
          />
        );
      } else {
        // Create a new marker.
        const element = document.createElement('div');
        element.style.pointerEvents = 'auto';
        const root = createRoot(element);

        root.render(
          <VesselMarkerView
            vessel={vessel}
            selected={isSelected}
            hovered={isHovered}
            onClick={options.onSelect}
          />
        );

        const marker = new maplibregl.Marker({
          element,
          anchor: 'center',
        })
          .setLngLat([vessel.position.lng, vessel.position.lat])
          .addTo(map);

        markers.set(vessel.mmsi, { marker, root, element });
      }

      seen.add(vessel.mmsi);
    });

    // Remove markers that are no longer present.
    for (const [mmsi, managed] of markers.entries()) {
      if (!seen.has(mmsi)) {
        managed.marker.remove();
        managed.root.unmount();
        markers.delete(mmsi);
      }
    }
  }

  function destroy() {
    for (const managed of markers.values()) {
      managed.marker.remove();
      managed.root.unmount();
    }
    markers.clear();
  }

  return { sync, destroy };
}

/* -------------------------------------------------------------------------- */
/*                              Marker View                                   */
/* -------------------------------------------------------------------------- */

function VesselMarkerView({
  vessel,
  selected,
  hovered,
  onClick,
}: VesselMarkerProps) {
  const config = VESSEL_TYPES.find((v) => v.id === vessel.type);
  const color = config?.color ?? '#94a3b8';

  const size = selected ? 40 : hovered ? 34 : 28;

  return (
    <button
      type="button"
      onClick={() => onClick?.(vessel)}
      aria-label={`Vessel ${vessel.name}`}
      className="group relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Selection halo */}
      {selected && (
        <span
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ border: `1.5px solid ${color}`, opacity: 0.6 }}
        />
      )}

      {/* Inner icon */}
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full border-2 transition-all',
          selected ? 'shadow-lg' : ''
        )}
        style={{
          width: size - 6,
          height: size - 6,
          backgroundColor: '#020617',
          borderColor: color,
        }}
      >
        <Ship className="h-3 w-3" style={{ color }} />
      </span>

      {/* Hover label */}
      <span
        className={cn(
          'absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded-md border bg-abyss/95 backdrop-blur-md px-2 py-1 text-[10px] text-white transition-opacity',
          hovered || selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
        style={{ borderColor: `${color}60` }}
      >
        <span className="font-display font-medium">{vessel.name}</span>
      </span>
    </button>
  );
}

export { VesselMarkerView };

// Ensure VesselTypeId is referenced so the import is not tree-shaken
// in environments that only use the controller and not the view type.
void (null as unknown as VesselTypeId);