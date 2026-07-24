import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, writeFileSync } from 'node:fs'

const sitesWorker = () => ({
  name: 'sites-worker-entry',
  closeBundle() {
    mkdirSync('dist/server', { recursive: true })
    writeFileSync('dist/server/index.js', `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) return response
    return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request))
  }
}
`)
  },
})

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), sitesWorker()],
})
