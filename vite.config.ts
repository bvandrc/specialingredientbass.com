import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { getOEmbed } from './src/api/soundcloud'

const SC_DATA_FILE = 'soundcloud-data.json'

const gridCardDataCode = fs.readFileSync('./src/data/grid-card-data.tsx')
const scUrlMatches = gridCardDataCode
  .toString()
  .matchAll(/https:\/\/soundcloud\.com\/.*?(?=['"])/g)
const scUrls = Array.from(scUrlMatches).map((m) => m[0])

// The committed file is the fallback: a SoundCloud outage shouldn't be able to
// break `pnpm dev`/`pnpm build`, and it's only stale until the next good run.
try {
  const scTracks = await Promise.all(
    scUrls.map(async (url) => ({
      originalLink: url,
      ...(await getOEmbed({ url, maxheight: 166, auto_play: false })),
    })),
  )
  const contents = `${JSON.stringify(scTracks, null, 2)}\n`
  // avoid a no-op write, which would retrigger the dev server's config reload
  if (fs.readFileSync(SC_DATA_FILE, 'utf8') !== contents) {
    fs.writeFileSync(SC_DATA_FILE, contents)
  }
} catch (error) {
  if (!fs.existsSync(SC_DATA_FILE)) throw error
  console.warn(
    `[soundcloud] oEmbed fetch failed, reusing committed ${SC_DATA_FILE}:`,
    error instanceof Error ? error.message : error,
  )
}

export default defineConfig(() => ({
  base: '/',
  plugins: [tailwindcss(), react()],
  // soundcloud-widget references the bare Node global `global` at module
  // top level; this rewrites it to the browser's globalThis at build time.
  define: {
    global: 'globalThis',
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  } as const,
  // GitHub Pages (this site's production host) can't set custom response
  // headers, so these only take effect for local/CI preview — but CI's ZAP
  // scan runs against this preview server, so it's what keeps that scan green.
  preview: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Permissions-Policy':
        'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
  },
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
