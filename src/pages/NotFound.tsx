import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Waves } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg text-center"
      >
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-cyan/30" />
          <div className="absolute inset-2 rounded-full border border-teal/40" />
          <Compass className="h-10 w-10 text-cyan relative" />
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-cyan/60 mb-3">
          ERROR · 404
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
          Off the chart.
        </h1>
        <p className="mt-4 text-muted-foreground">
          The coordinates you entered don't correspond to any known route.
          Let's get you back to familiar waters.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Return Home
            </Button>
          </Link>
          <Link to="/map">
            <Button
              size="md"
              variant="secondary"
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