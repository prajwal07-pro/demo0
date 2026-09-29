import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

// ---------- Real page components ----------
// Every page below has a real implementation in src/pages/ and must be
// imported directly. Do NOT replace these with local placeholder functions.
import Home from '@/pages/Home';
import LiveMap from '@/pages/LiveMap';
import AIAssistant from '@/pages/AIAssistant';
import Intelligence from '@/pages/Intelligence';
import Vessels from '@/pages/Vessels';
import Ocean from '@/pages/Ocean';
import Simulations from '@/pages/Simulations';
import Explorer from '@/pages/Explorer';
import Learning from '@/pages/Learning';
import Games from '@/pages/Games';
import Community from '@/pages/Community';
import Alerts from '@/pages/Alerts';
import About from '@/pages/About';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

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

  // ORCA initialization sequence — kept short so users are not blocked.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
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
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  />
                </div>
                <div className="flex flex-col gap-1 mt-2 w-full text-left">
                  <BootLine label="CONNECTING OCEAN DATA" delay={0.05} />
                  <BootLine label="CONNECTING AIS STREAM" delay={0.25} />
                  <BootLine label="CONNECTING EARTH OBSERVATION" delay={0.45} />
                  <BootLine label="INITIALIZING AI AGENTS" delay={0.65} />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative"
          >
            <BrowserRouter>
              <ErrorBoundary>
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
              </ErrorBoundary>
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
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-cyan/60"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.15, duration: 0.25 }}
        className="h-1 w-1 rounded-full bg-teal"
      />
      <span>{label}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.25 }}
        className="ml-auto text-teal"
      >
        OK
      </motion.span>
    </motion.div>
  );
}

export default App;