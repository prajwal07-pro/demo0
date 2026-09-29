import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';

import { AppLayout } from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import LiveMap from '@/pages/LiveMap';
import AIAssistant from '@/pages/AIAssistant';

// Lazy-loaded pages (populated in later phases)
const Vessels = () => <PlaceholderPage title="Vessel Intelligence" />;
const Ocean = () => <PlaceholderPage title="Ocean Intelligence" />;
const Simulations = () => <PlaceholderPage title="Simulation Lab" />;
const Explorer = () => <PlaceholderPage title="3D Explorer" />;
const Learning = () => <PlaceholderPage title="Learning Lab" />;
const Games = () => <PlaceholderPage title="Marine Games" />;
const Community = () => <PlaceholderPage title="Community" />;
const About = () => <PlaceholderPage title="About / Mission" />;
const Intelligence = () => <PlaceholderPage title="Intelligence" />;
const Alerts = () => <PlaceholderPage title="Risk & Alerts" />;
const Profile = () => <PlaceholderPage title="Profile" />;
const Settings = () => <PlaceholderPage title="Settings" />;
const NotFound = () => <PlaceholderPage title="404 — Not Found" />;

// ---------- TanStack Query Client ----------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll (global)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Cinematic ORCA initialization sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-abyss text-cyan"
          >
            <div className="flex flex-col items-center gap-6 max-w-md px-6 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full border border-cyan/30 opacity-75" />
                <div className="absolute inset-2 animate-pulse rounded-full border border-teal/50" />
                <div className="h-12 w-12 rounded-full bg-cyan/20 blur-xl" />
                <span className="relative font-display text-sm font-bold tracking-widest text-cyan">
                  ORCA
                </span>
              </div>

              <div className="flex flex-col items-center gap-3 w-full">
                <p className="telemetry-text animate-pulse">INITIALIZING ORCA CORE</p>
                <div className="h-1 w-64 overflow-hidden rounded-full bg-midnight">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan to-teal"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                  />
                </div>
                <div className="flex flex-col gap-1 mt-2 w-full text-left">
                  <BootLine label="CONNECTING OCEAN DATA" delay={0.1} />
                  <BootLine label="CONNECTING AIS STREAM" delay={0.35} />
                  <BootLine label="CONNECTING EARTH OBSERVATION" delay={0.6} />
                  <BootLine label="INITIALIZING AI AGENTS" delay={0.9} />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/map" element={<LiveMap />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                  <Route path="/intelligence" element={<Intelligence />} />
                  <Route path="/vessels" element={<Vessels />} />
                  <Route path="/ocean" element={<Ocean />} />
                  <Route path="/simulations" element={<Simulations />} />
                  <Route path="/explorer" element={<Explorer />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/explore" element={<Navigate to="/map" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}

// ---------- Boot Sequence Line ----------
function BootLine({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-cyan/60"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        className="h-1 w-1 rounded-full bg-teal"
      />
      <span>{label}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.3 }}
        className="ml-auto text-teal"
      >
        OK
      </motion.span>
    </motion.div>
  );
}

// ---------- Placeholder Page ----------
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="text-center max-w-lg">
        <div className="font-mono text-[10px] tracking-[0.3em] text-cyan/60 mb-3">
          ORCA · MODULE
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          This module is scheduled for a subsequent build phase. Continue with{' '}
          <span className="font-mono text-cyan">NEXT</span> to proceed.
        </p>
      </div>
    </div>
  );
}

export default App;