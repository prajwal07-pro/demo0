import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NavigationProgress — a slim top-of-page progress bar that appears on
 * every client-side route change and completes once the new route has
 * mounted.
 *
 * It serves two purposes:
 *  1. Immediate visual feedback when the user clicks a nav link.
 *  2. A cue that a route chunk is being lazily loaded.
 *
 * Rendered at the very top of the shell, under the Navbar.
 */
export function NavigationProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setVisible(true);
    setProgress(0);

    // Ramp up quickly then slow.
    const t1 = window.setTimeout(() => setProgress(35), 30);
    const t2 = window.setTimeout(() => setProgress(70), 180);
    const t3 = window.setTimeout(() => setProgress(92), 420);
    const t4 = window.setTimeout(() => setProgress(100), 620);
    const t5 = window.setTimeout(() => setVisible(false), 820);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan via-teal to-cyan shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}