import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Lokaal: Vite stuurt /api en /sanctum door naar Laravel, zo lijkt het één domein (TO 7)
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/sanctum': 'http://localhost:8000',
    },
  },
  // Online: Laravel geeft de React-build zelf aan de browser vanuit backend/public/app (TO 7.2)
  base: command === 'build' ? '/app/' : '/',
  build: {
    outDir: '../backend/public/app',
    emptyOutDir: true,
  },
}))
