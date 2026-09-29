import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          react: ['react', 'react-dom', 'react-router-dom'],

          // 3D engine
          three: ['three'],
          reactThree: [
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
            'postprocessing',
          ],

          // Maps
          map: ['maplibre-gl'],

          // Motion
          motion: ['framer-motion', 'gsap', 'lenis'],

          // Data
          data: ['@tanstack/react-query', 'zustand', 'zod'],

          // UI primitives
          ui: ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'maplibre-gl',
    ],
  },
  server: {
    host: true,
    port: 5173,
  },
});