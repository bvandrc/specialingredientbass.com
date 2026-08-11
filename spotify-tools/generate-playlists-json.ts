import { pick } from 'es-toolkit'
import fs from 'vite-plugin-fs/browser'

import { sdk } from './spotify'

const { display_name } = await sdk.currentUser.profile()

sdk.getAllPlaylists().then(async (playlists) => {
  const data = playlists
    .filter(({ owner }) => owner.display_name === display_name)
    .map((pl) => ({
      ...pick(pl, ['name', 'id', 'description', 'public']),
      url: pl.external_urls.spotify,
      track_count: pl.tracks?.total,
    }))
  await fs.writeFile('spotify-playlists.json', JSON.stringify(data, null, 2))
})
