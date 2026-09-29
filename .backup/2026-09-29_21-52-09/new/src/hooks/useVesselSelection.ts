import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMap } from '@/store/useAppStore';
import type { AISVessel } from '@/types';

/**
 * Vessel selection hook — coordinates selection across the map, the
 * vessel table, and the URL. When `syncUrl` is true, the selected MMSI is
 * mirrored into `?vessel=<mmsi>` so a shareable link reopens the same
 * selection.
 *
 * The actual fetching of a vessel from the URL param is left to the page
 * that owns the map — this hook only handles the state and the URL sync.
 */
export function useVesselSelection(options: { syncUrl?: boolean } = {}) {
  const { syncUrl = true } = options;
  const { selectedVessel, setSelectedVessel } = useMap();
  const [searchParams, setSearchParams] = useSearchParams();

  const select = useCallback(
    (vessel: AISVessel | null) => {
      setSelectedVessel(vessel);
      if (syncUrl) {
        const next = new URLSearchParams(searchParams);
        if (vessel) next.set('vessel', vessel.mmsi);
        else next.delete('vessel');
        setSearchParams(next, { replace: true });
      }
    },
    [setSelectedVessel, syncUrl, searchParams, setSearchParams]
  );

  const clear = useCallback(() => select(null), [select]);

  return {
    selectedVessel,
    selectedMmsi: searchParams.get('vessel'),
    selectVessel: select,
    clearVessel: clear,
  };
}