import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    // Allow preview to accept requests from this external host
  preview: {
    allowedHosts: ['desafio-regimedomiciliar.onrender.com'],
  },
})
