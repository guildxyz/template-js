import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

export default defineConfig(({ command, mode, ssrBuild }) => ({
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
    outDir: ssrBuild ? '../dist/server' : '../dist/client',
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: 'esbuild',
    rollupOptions: {
      input: ssrBuild 
        ? path.resolve(__dirname, 'app/entry-server.jsx')
        : path.resolve(__dirname, 'app/index.html'),
      output: {
        format: ssrBuild ? 'cjs' : 'es',
      },
    },
    ssr: ssrBuild ? './entry-server.jsx' : undefined,
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
