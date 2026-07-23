import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/II-Amazon-Tech-Energy-/',
  plugins: [react(), tailwindcss()],
})
