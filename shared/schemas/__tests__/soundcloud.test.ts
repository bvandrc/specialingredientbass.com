import {
  type SoundcloudTrackData,
  soundcloudTrackDataSchema,
} from '../soundcloud'

describe('soundcloudTrackDataSchema', () => {
  const TRACK_DATA = {
    originalUrl: 'https://soundcloud.com/special-ingredient/plant-life-vol-1',
    iframeSrc: 'https://w.soundcloud.com/player/?url=x',
    title: 'Plant Life Vol. 1 by Special Ingredient',
    thumbnail_url: 'https://i1.sndcdn.com/artworks-abc-t500x500.jpg',
    description: 'Take a journey :)',
  } satisfies SoundcloudTrackData

  it('accepts a track as the build writes it', () => {
    expect(soundcloudTrackDataSchema.safeParse(TRACK_DATA).success).toBe(true)
  })

  it('rejects a track whose player src is not a URL', () => {
    // `getIframeSrc` passes the iframe's src through as-is, URL or not.
    const BAD = { ...TRACK_DATA, iframeSrc: '&lt;not a url&gt;' }

    expect(soundcloudTrackDataSchema.safeParse(BAD).success).toBe(false)
  })
})
