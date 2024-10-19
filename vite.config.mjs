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
    outDir: mode === 'production' ? '../dist/client' : '../dist/server',
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: 'esbuild',
    rollupOptions: {
      input: mode === 'production' 
        ? path.resolve(__dirname, 'app/index.html')
        : path.resolve(__dirname, 'app/entry-server.jsx'),
      output: {
        format: mode === 'production' ? 'es' : 'cjs',
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
}))
