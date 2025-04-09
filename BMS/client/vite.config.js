import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Polyfill the `crypto` module
      globals: {
        crypto: true,
      },
    }),
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          xlsx: ['xlsx-js-style'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://server:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});