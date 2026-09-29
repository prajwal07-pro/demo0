import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { PageLoading } from '@/components/layout/PageLoading';
import { queryClient } from '@/lib/queryClient';
import { useAppReady } from '@/hooks/useAppReady';

// ---------- Lazy-loaded route components ----------
// Every module is code-split so the initial bundle stays small. The
// Suspense fallback (<PageLoading />) ensures there is never a blank
// screen while a chunk is downloading.
const Home = lazy(() => import('@/pages/Home'));
const LiveMap = lazy(() => import('@/pages/LiveMap'));
const AIAssistant = lazy(() => import('@/pages/AIAssistant'));
const Intelligence = lazy(() => import('@/pages/Intelligence'));
const Vessels = lazy(() => import('@/pages/Vessels'));
const Ocean = lazy(() => import('@/pages/Ocean'));
const Simulations = lazy(() => import('@/pages/Simulations'));
const Explorer = lazy(() => import('@/pages/Explorer'));
const Learning = lazy(() => import('@/pages/Learning'));
const Games = lazy(() => import('@/pages/Games'));
const Community = lazy(() => import('@/pages/Community'));
const Alerts = lazy(() => import('@/pages/Alerts'));
const About = lazy(() => import('@/pages/About'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  const { ready, stage, elapsed } = useAppReady();
  const progress = Math.min(elapsed / 1600, 1);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {!ready ? (
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
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-cyan/80 animate-pulse">
                  {stage}
                </p>
                <div className="h-1 w-64 overflow-hidden rounded-full bg-midnight">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan to-teal"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex flex-col gap-1 mt-2 w-full text-left">
                  <BootLine label="CONNECTING OCEAN DATA" delay={0.1} />
                  <BootLine label="CONNECTING AIS STREAM" delay={0.35} />
                  <BootLine label="CONNECTING EARTH OBSERVATION" delay={0.6} />
                  <BootLine label="INITIALIZING AI AGENTS" delay={0.85} />
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
                <Suspense fallback={<PageLoading />}>
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
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}

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