import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'app',
  build: {
    outDir: '../dist',
  },
  server: {
    middlewareMode: true
  }
})
