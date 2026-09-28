/**
 * ORCA Animation System
 * Framer Motion variants and transitions used across the platform.
 * All animations are purpose-driven: communication, not decoration.
 */

import type { Variants, Transition } from 'framer-motion';

// ---------- Easing Curves ----------
export const EASINGS = {
  smooth: [0.22, 1, 0.36, 1] as const,
  cinematic: [0.65, 0, 0.35, 1] as const,
  sharp: [0.4, 0, 0.2, 1] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  ocean: [0.25, 0.1, 0.25, 1] as const,
} as const;

// ---------- Base Transitions ----------
export const transitions: Record<string, Transition> = {
  fast: { duration: 0.2, ease: EASINGS.sharp },
  base: { duration: 0.4, ease: EASINGS.smooth },
  slow: { duration: 0.8, ease: EASINGS.cinematic },
  cinematic: { duration: 1.2, ease: EASINGS.cinematic },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springSoft: { type: 'spring', stiffness: 150, damping: 25 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 },
};

// ---------- Fade Variants ----------
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
  exit: { opacity: 0, transition: transitions.fast },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
  exit: { opacity: 0, y: -20, transition: transitions.fast },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
  exit: { opacity: 0, y: 20, transition: transitions.fast },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: transitions.base },
  exit: { opacity: 0, x: 40, transition: transitions.fast },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: transitions.base },
  exit: { opacity: 0, x: -40, transition: transitions.fast },
};

// ---------- Scale Variants ----------
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.9, transition: transitions.fast },
};

export const scaleInCenter: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transitions.springSoft },
  exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
};

// ---------- Stagger Containers ----------
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ---------- Text Reveal (per character / word) ----------
export const textReveal: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.8, ease: EASINGS.cinematic },
  },
};

// ---------- Cinematic Scene Transitions ----------
export const sceneEnter: Variants = {
  hidden: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: EASINGS.cinematic },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)',
    transition: { duration: 0.8, ease: EASINGS.cinematic },
  },
};

// ---------- Glass Panel ----------
export const glassPanel: Variants = {
  hidden: { opacity: 0, y: 20, backdropFilter: 'blur(0px)' },
  visible: {
    opacity: 1,
    y: 0,
    backdropFilter: 'blur(12px)',
    transition: transitions.base,
  },
};

// ---------- Data Stream (for telemetry) ----------
export const dataStream: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: EASINGS.sharp },
  }),
};

// ---------- Hover Interactions ----------
export const hoverLift = {
  whileHover: { y: -4, transition: transitions.fast },
  whileTap: { y: 0, scale: 0.98 },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
    transition: transitions.fast,
  },
};

export const hoverScale = {
  whileHover: { scale: 1.03, transition: transitions.fast },
  whileTap: { scale: 0.97 },
};

// ---------- Page Transitions ----------
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASINGS.smooth },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: EASINGS.sharp },
  },
};

// ---------- Modal / Overlay ----------
export const overlayBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.springSoft,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: transitions.fast,
  },
};

// ---------- Loading / Pulse ----------
export const pulseGlow: Variants = {
  hidden: { opacity: 0.5, scale: 0.98 },
  visible: {
    opacity: [0.5, 1, 0.5],
    scale: [0.98, 1.02, 0.98],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ---------- Smooth Scroll Reveal ----------
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASINGS.cinematic },
  },
};

export const scrollRevealScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: EASINGS.cinematic },
  },
};

// ---------- Magnetic Button ----------
export const magneticButton = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: transitions.springBouncy },
  tap: { scale: 0.97 },
};

// ---------- Coordinate Label ----------
export const coordinateLabel: Variants = {
  hidden: { opacity: 0, y: -8, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: EASINGS.smooth },
  },
};

// ---------- Reduced Motion Helper ----------
export function getMotionProps(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: false as const,
      animate: 'visible' as const,
      exit: undefined,
      variants: fadeIn,
    };
  }
  return {};
}

// ---------- Viewport Configuration for Scroll Reveals ----------
export const viewportConfig = {
  once: true,
  margin: '-10% 0px -10% 0px',
} as const;

export const viewportConfigLoose = {
  once: true,
  margin: '-5% 0px -5% 0px',
} as const;