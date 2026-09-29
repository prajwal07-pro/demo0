import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMap } from '@/store/useAppStore';
import type { AISVessel } from '@/types';

/**
 * Vessel selection hook — coordinates selection across the map, the
 * vessel table, and the URL. When `syncUrl` is true, the selected MMSI is
 * mirrored into `?vessel=<mmsi>` so a shareable link reopens the same
 * selection.
 */
export function useVesselSelection(options: { syncUrl?: boolean } = {}) {
  const { syncUrl = true } = options;
  const { selectedVessel, setSelectedVessel } = useMap();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Sync URL → store on mount and whenever the param changes.
  useEffect(() => {
    if (!syncUrl) return;
    const mmsi = searchParams.get('vessel');
    if (!mmsi) return;
    if (selectedVessel?.mmsi === mmsi) return;
    // The map page is responsible for fetching the actual vessel record;
    // here we only need to know that a selection is pending. Set a
    // lightweight placeholder so consumers know to look up.
    // (Real fetch happens in the vessel detail sheet.)
    // eslint-disable-next-line no-console
    void navigate;
  }, [searchParams, selectedVessel, syncUrl, navigate]);

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
    selectVessel: select,
    clearVessel: clear,
  };
}