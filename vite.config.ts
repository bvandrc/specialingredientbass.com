import * as fs from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { getOEmbed } from './src/api/soundcloud'

const gridCardDataCode = fs.readFileSync('./src/constants/grid-card-data.tsx')
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
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  } as const,
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
