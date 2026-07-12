import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GHPAGES_BASE é definido só no deploy do GitHub Pages (subcaminho /repo/)
  base: process.env.GHPAGES_BASE || '/',
  plugins: [react(), tailwindcss()],
})
