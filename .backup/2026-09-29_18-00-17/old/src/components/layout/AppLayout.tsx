import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar, MobileBottomNav } from '@/components/navigation/Sidebar';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { Footer } from '@/components/navigation/Footer';
import { useLenisSetup } from '@/hooks/useLenis';
import { useUI } from '@/store/useAppStore';
import { pageTransition } from '@/lib/animations';

/**
 * AppLayout — main product shell.
 *
 * Renders:
 *  - Top Navbar (fixed)
 *  - Sidebar (desktop, collapsible)
 *  - Main content area (routed)
 *  - Bottom mobile nav
 *  - Global command palette
 *  - Footer (only on marketing pages, hidden on full-screen workbenches)
 *
 * Automatically initializes Lenis smooth scrolling.
 */
export function AppLayout() {
  useLenisSetup();
  const location = useLocation();
  const { mobileNavOpen } = useUI();

  // Hide footer on full-screen workbench pages
  const isFullScreen =
    location.pathname.startsWith('/map') ||
    location.pathname.startsWith('/assistant') ||
    location.pathname.startsWith('/explorer');

  return (
    <div className="relative min-h-screen bg-abyss text-foreground">
      {/* Background atmosphere */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-violet/5 blur-[120px]" />
      </div>

      {/* Top navbar */}
      <Navbar />

      {/* Main region */}
      <div className="relative z-10 flex pt-16 min-h-screen">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="relative flex-1 min-w-0 pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

          {!isFullScreen && <Footer />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {/* Global command palette */}
      <CommandPalette />

      {/* Mobile nav open overlay (reserved for future drawer expansion) */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-abyss/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}