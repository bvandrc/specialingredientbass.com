import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { pick } from 'es-toolkit'
import { defineConfig, type Plugin } from 'vite'

import { getIframeSrc, getOEmbed, SC_PLAYER_HEIGHT } from './src/api/soundcloud'

const SC_DATA_FILE = 'soundcloud-data.json'

const gridCardDataCode = fs.readFileSync('./src/data/grid-card-data.tsx')
const scUrlMatches = gridCardDataCode
  .toString()
  .matchAll(/https:\/\/soundcloud\.com\/.*?(?=['"])/g)
const scUrls = Array.from(scUrlMatches).map((m) => m[0])

const scTracks = await Promise.all(
  scUrls.map(async (url) => {
    const oEmbed = await getOEmbed({
      url,
      maxheight: SC_PLAYER_HEIGHT,
      auto_play: false,
    })
    return {
      originalUrl: url,
      iframeSrc: getIframeSrc(oEmbed.html),
      // the rest of the oEmbed response is unused, and this file ships in the bundle
      ...pick(oEmbed, ['title', 'description', 'thumbnail_url']),
    }
  })
)
const contents = `${JSON.stringify(scTracks, null, 2)}\n`
// avoid a no-op write, which would retrigger the dev server's config reload
if (fs.readFileSync(SC_DATA_FILE, 'utf8') !== contents) {
  fs.writeFileSync(SC_DATA_FILE, contents)
}

/**
 * Has `vite preview` answer a `/.well-known/` path with no file behind it with
 * a 404, as GitHub Pages does.
 *
 * The preview server's SPA fallback otherwise serves `index.html` with a 200,
 * which Lighthouse's `ai-catalog.json` audit reads as a broken manifest.
 */
const notFoundForWellKnown = (): Plugin => ({
  name: 'not-found-for-well-known',
  configurePreviewServer: (server) => {
    const { outDir } = server.config.build
    server.middlewares.use('/.well-known/', (req, res, next) => {
      // `req.url` is relative to the mount path here.
      const file = path.join(outDir, '.well-known', req.url ?? '')
      if (fs.existsSync(file)) return next()
      res.statusCode = 404
      res.end()
    })
  },
})

export default defineConfig(() => ({
  base: '/',
  plugins: [tailwindcss(), react(), notFoundForWellKnown()],
  resolve: {
    tsconfigPaths: true,
  },
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
