import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 512,
    }),
  ],
  root: 'app',
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: 'esbuild',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'app/index.html'),
      },
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    middlewareMode: true
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
}))
