import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * PageLoading — Suspense fallback for lazy-loaded route pages.
 *
 * Renders a minimal, on-brand loading surface that fills the content area
 * so there is never a blank screen while a route chunk is downloading.
 */
export function PageLoading() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center bg-abyss px-6">
      <div className="absolute inset-0 data-grid opacity-[0.08]" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative flex flex-col items-center gap-4"
      >
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-cyan/25" />
          <div className="absolute inset-1.5 rounded-full border border-teal/30" />
          <Loader2 className="relative h-5 w-5 animate-spin text-cyan" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            LOADING MODULE
          </p>
          <div className="h-0.5 w-32 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan to-teal"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}