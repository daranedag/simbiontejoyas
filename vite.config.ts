import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

export default defineConfig({
  // GitHub Pages supplies this in CI. Leave it as / for local development and custom domains.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
