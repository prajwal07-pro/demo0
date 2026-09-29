import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/**
 * OfflineBanner — surfaces a persistent notice when the browser reports
 * the network is offline. Data-dependent pages will continue to render
 * with their "unavailable" states; this banner explains why.
 */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed top-16 inset-x-0 z-30 flex justify-center pointer-events-none px-4"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-auto mt-2 inline-flex items-center gap-2.5 rounded-full border border-warning/30 bg-warning/[0.10] backdrop-blur-md px-4 py-1.5">
            <WifiOff className="h-3.5 w-3.5 text-warning-deep" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-warning-deep">
              OFFLINE · LIVE DATA PAUSED
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}