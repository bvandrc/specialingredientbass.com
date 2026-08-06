import fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { getOEmbed } from './src/api/soundcloud'

const gridCardDataCode = fs.readFileSync('./src/data/grid-card-data.tsx')
const scUrlMatches = gridCardDataCode
  .toString()
  .matchAll(/https:\/\/soundcloud\.com\/.*?(?=['"])/g)
const scUrls = Array.from(scUrlMatches).map((m) => m[0])
const scTracks = await Promise.all(
  scUrls.map(async (url) => ({
    originalLink: url,
    ...(await getOEmbed({ url, maxheight: 166, auto_play: false })),
  })),
)
fs.writeFileSync(
  'soundcloud-data.json',
  `${JSON.stringify(scTracks, null, 2)}\n`,
)

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
