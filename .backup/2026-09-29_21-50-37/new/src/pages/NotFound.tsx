import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Waves } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 bg-pearl text-ink">
      <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg text-center"
      >
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-ocean/30" />
          <div className="absolute inset-2 rounded-full border border-ocean/40" />
          <div className="h-16 w-16 rounded-full bg-ice flex items-center justify-center">
            <Compass className="h-8 w-8 text-ocean relative" />
          </div>
        </div>

        <div className="font-mono text-[10px] tracking-[0.3em] text-ocean mb-3">
          ERROR · 404
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink">
          Off the chart.
        </h1>
        <p className="mt-5 text-ink-soft leading-relaxed">
          The coordinates you entered don't correspond to any known route.
          Let's get you back to familiar waters.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Return Home
            </Button>
          </Link>
          <Link to="/map">
            <Button
              size="md"
              variant="secondary-light"
              leftIcon={<Waves className="h-4 w-4" />}
            >
              Open Live Map
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}