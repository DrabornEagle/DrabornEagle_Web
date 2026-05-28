import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/AnyelaBorn/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/dkd-anyela-born-v12.js',
        chunkFileNames: 'assets/dkd-anyela-born-v12-[hash].js',
        assetFileNames: 'assets/dkd-anyela-born-v12-[name][extname]'
      }
    }
  }
});
