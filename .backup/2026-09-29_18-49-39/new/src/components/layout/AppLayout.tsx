import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navigation/Navbar';
import { Sidebar, MobileBottomNav } from '@/components/navigation/Sidebar';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { Footer } from '@/components/navigation/Footer';
import { Toaster } from '@/components/ui/Toaster';
import { NavigationProgress } from '@/components/layout/NavigationProgress';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { ShortcutsOverlay } from '@/components/layout/ShortcutsOverlay';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { useLenisSetup, getLenis } from '@/hooks/useLenis';
import { useUI } from '@/store/useAppStore';
import { usePageView } from '@/hooks/usePageView';

/**
 * Routes that render on the dark operational surface.
 * Every other route is treated as an editorial/content surface.
 */
const WORKBENCH_ROUTES = ['/map', '/assistant', '/explorer'];

/**
 * AppLayout — main product shell.
 *
 * RENDERING CONTRACT:
 *  - The routed page content (Outlet) must mount IMMEDIATELY on route change.
 *  - We do NOT wrap the Outlet in AnimatePresence with mode="wait" — that
 *    pattern blocks the new child from mounting until the exit animation
 *    completes, and if interrupted it leaves a blank screen.
 *  - Instead we use a keyed motion.div that remounts on every pathname
 *    change with a short entry animation only. There is no exit phase.
 *  - Scroll position resets to top on every route change.
 *
 * SURFACE:
 *  - The shell background adapts to the route: workbench routes use the
 *    dark operational surface, everything else uses the light editorial
 *    surface. Individual pages may override this by declaring their own
 *    background — that is expected and supported.
 */
export function AppLayout() {
  useLenisSetup();
  usePageView();
  const location = useLocation();
  const { mobileNavOpen } = useUI();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  const isWorkbench = WORKBENCH_ROUTES.some((p) => location.pathname.startsWith(p));
  const isFullScreen =
    location.pathname.startsWith('/map') ||
    location.pathname.startsWith('/assistant') ||
    location.pathname.startsWith('/explorer');

  return (
    <div
      className={
        isWorkbench
          ? 'relative min-h-screen bg-abyss text-white'
          : 'relative min-h-screen bg-pearl text-ink'
      }
    >
      {/* Fixed ambient background — matches shell tone */}
      <AmbientBackground
        tone={isWorkbench ? 'dark' : 'light'}
        particles
        grid
      />

      {/* Top-of-page progress bar */}
      <NavigationProgress />

      {/* Navbar */}
      <Navbar />

      {/* Main region */}
      <div className="relative z-10 flex pt-16 min-h-screen">
        <Sidebar />

        <main className="relative flex-1 min-w-0 pb-20 lg:pb-0">
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

      {/* Global overlays */}
      <MobileBottomNav />
      <CommandPalette />
      <ShortcutsOverlay />
      <Toaster />
      <OfflineBanner />

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-abyss/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
}