import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar, MobileBottomNav } from '@/components/navigation/Sidebar';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { Footer } from '@/components/navigation/Footer';
import { useLenisSetup, getLenis } from '@/hooks/useLenis';
import { useUI } from '@/store/useAppStore';

/**
 * AppLayout — main product shell.
 *
 * RENDERING CONTRACT:
 *  - The routed page content (Outlet) must mount IMMEDIATELY on route change.
 *  - We do NOT wrap the Outlet in AnimatePresence with mode="wait", because
 *    that pattern blocks the new child from mounting until the exit animation
 *    completes. If the exit animation is ever interrupted (rapid navigation,
 *    back/forward button, Lenis interference) the new page never mounts and
 *    the user sees a blank screen until refresh.
 *  - Instead we use a keyed motion.div that remounts on every pathname change
 *    with a short entry animation only. There is no exit phase.
 *  - Scroll position resets to top on every route change.
 */
export function AppLayout() {
  useLenisSetup();
  const location = useLocation();
  const { mobileNavOpen } = useUI();

  // Reset scroll position on route change.
  // Lenis owns the scroll state, so we reset both the underlying window and
  // the Lenis instance to guarantee the new page starts at the top.
  useEffect(() => {
    // Always reset native scroll (covers the case Lenis is not ready yet).
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Reset the managed smooth scroller.
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  // Footer is hidden on full-screen workbench pages.
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
          {/*
            Keyed motion.div — remounts on pathname change.
            Entry-only animation; no exit phase → new content mounts instantly.
          */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>

          {!isFullScreen && <Footer />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {/* Global command palette */}
      <CommandPalette />

      {/* Mobile nav open overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-abyss/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
}