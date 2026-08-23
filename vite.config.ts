import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Routes to the Express server (server/index.js, run alongside via `npm run dev`)
      // so the browser sees same-origin requests during local development too.
      '/api': 'http://localhost:3001',
    },
  },
})
