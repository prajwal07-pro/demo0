/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // ---------- Deep marine (dark) ----------
        abyss: {
          DEFAULT: '#020617',
          light: '#0a0f1e',
        },
        midnight: {
          DEFAULT: '#0b1120',
          light: '#111827',
          dark: '#030712',
        },
        ocean: {
          DEFAULT: '#0c4a6e',
          light: '#0e7490',
          dark: '#082f49',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2',
        },
        teal: {
          DEFAULT: '#14b8a6',
          light: '#2dd4bf',
          dark: '#0f766e',
        },
        turquoise: {
          DEFAULT: '#40e0d0',
          light: '#7fffd4',
          dark: '#00ced1',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        magenta: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
          dark: '#db2777',
        },

        // ---------- Light marine (new) ----------
        // Cool, professional surfaces for content sections, cards, and
        // editorial layouts. Text on these surfaces must be dark.
        pearl: {
          DEFAULT: '#F7FBFC', // main light surface
          soft: '#EEF6F8',    // subtle secondary surface
          deep: '#E4F1F5',    // deeper surface / dividers
        },
        ice: {
          DEFAULT: '#D6E9EF', // pale blue / hover state
          deep: '#BFDAE3',    // strong pale-blue accent
        },
        mist: {
          DEFAULT: '#94A8B8', // muted blue-gray text on light
          deep: '#5F7284',
        },
        ink: {
          DEFAULT: '#0F172A', // primary text on light surfaces
          soft: '#1E293B',    // secondary text on light
          muted: '#475569',   // tertiary text on light
        },

        // ---------- Semantic ----------
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          deep: '#047857',
        },
        warning: {
          DEFAULT: '#F4B942',
          light: '#FCD34D',
          deep: '#B45309',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          deep: '#991B1B',
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: '#38BDF8',
          deep: '#0369A1',
        },
        accent: {
          DEFAULT: '#FF7A59', // warm coral for CTAs / warnings
          light: '#FF9A80',
          deep: '#C2410C',
        },

        // ---------- shadcn tokens ----------
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'data-stream': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'data-stream': 'data-stream 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'fade-up': 'fade-up 0.4s ease-out both',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ocean-depth': 'linear-gradient(to bottom, #020617, #0b1120, #0c4a6e, #06b6d4)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        'pearl-gradient': 'linear-gradient(180deg, #F7FBFC 0%, #EEF6F8 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-magenta': '0 0 20px rgba(236, 72, 153, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        // Light-mode soft elevation
        'soft': '0 2px 12px rgba(15, 23, 42, 0.05)',
        'soft-md': '0 8px 24px rgba(15, 23, 42, 0.08)',
        'soft-lg': '0 16px 48px rgba(15, 23, 42, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
      lineHeight: {
        relaxed: '1.7',
        loose: '1.9',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};