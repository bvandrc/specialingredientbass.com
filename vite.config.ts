import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import { defineConfig } from 'vite'
import { getOEmbed } from './src/api/soundcloud'

const gridBodyCode = fs.readFileSync('./src/components/GridBody.tsx')
const scUrlMatches = gridBodyCode.toString().matchAll(/https:\/\/soundcloud\.com\/.*?(?=['"])/g)
const scUrls = Array.from(scUrlMatches).map((m) => m[0])
const scTracks = await Promise.all(
  scUrls.map(async (url) => ({
    originalLink: url,
    ...(await getOEmbed({ url, maxheight: 166, auto_play: false })),
  })),
)
fs.writeFileSync('soundcloud-data.json', JSON.stringify(scTracks, null, 2) + '\n')

export default defineConfig(() => ({
  base: `/`,
  plugins: [react()],
  build: {
    target: 'esnext',
    modulePreload: false,
  },
}))
