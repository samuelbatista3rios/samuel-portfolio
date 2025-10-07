import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// recria __dirname em ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: "/samuel-portfolio/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
