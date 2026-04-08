import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api/weather will be proxied
      '/api/weather': {
        target: 'https://api.open-meteo.com',
        changeOrigin: true,
        // Remove the /api/weather prefix before sending to open-meteo
        rewrite: (path) => path.replace(/^\/api\/weather/, '')
      }
    }
  }
})