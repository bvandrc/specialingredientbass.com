import fs from 'node:fs'
import { pick } from 'es-toolkit'

import { soundcloudTrackDataSchema } from '../shared/schemas/soundcloud'
import { SC_PLAYER_HEIGHT } from '../shared/soundcloud'
import { getIframeSrc, getOEmbed } from './soundcloud-oembed'

const SC_DATA_FILE = 'soundcloud-data.json'
const GRID_CARD_DATA_FILE = './src/data/grid-card-data.tsx'

const fetchTrackData = async (url: string) => {
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
}

/**
 * Rewrites `soundcloud-data.json` from SoundCloud's oEmbed API, for every
 * SoundCloud URL in `grid-card-data.tsx`.
 *
 * Leaves the file alone when nothing changed, so a dev server watching it
 * doesn't reload for nothing.
 */
export async function writeSoundcloudData() {
  const scUrls = Array.from(
    fs
      .readFileSync(GRID_CARD_DATA_FILE, 'utf8')
      .matchAll(/https:\/\/soundcloud\.com\/.*?(?=['"])/g),
    (m) => m[0]
  )

  // Checked before it's written, since the site renders it unchecked.
  const scTracks = soundcloudTrackDataSchema
    .array()
    .parse(await Promise.all(scUrls.map(fetchTrackData)))

  const contents = `${JSON.stringify(scTracks, null, 2)}\n`
  // a no-op write would retrigger the dev server's config reload
  if (fs.readFileSync(SC_DATA_FILE, 'utf8') !== contents) {
    fs.writeFileSync(SC_DATA_FILE, contents)
  }
}
