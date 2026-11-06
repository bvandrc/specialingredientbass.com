import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { writeSoundcloudData } from './build/soundcloud-data'

await writeSoundcloudData()

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

/**
 * Preloads the latin-subset webfont files from `index.html`'s `<head>`.
 *
 * Without it the browser only requests a font once React has rendered text that
 * uses it, so the fallback font shows until then. Build-only, since dev serves
 * the fonts unhashed straight from `node_modules`.
 */
const preloadFonts = (): Plugin => ({
  name: 'preload-fonts',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (_html, { bundle }) =>
      Object.values(bundle ?? {})
        // `latin` only: the other subsets are `unicode-range`-gated, so the
        // browser fetches them only for text that needs them.
        .filter(({ fileName }) =>
          /-latin-\d+-normal-[\w-]+\.woff2$/.test(fileName)
        )
        .map(({ fileName }) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `/${fileName}`,
            // Fonts are always fetched in CORS mode, so a preload without
            // this goes unused and the font is downloaded twice.
            crossorigin: '',
          },
          injectTo: 'head',
        })),
  },
})

export default defineConfig(() => ({
  base: '/',
  plugins: [tailwindcss(), react(), notFoundForWellKnown(), preloadFonts()],
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
