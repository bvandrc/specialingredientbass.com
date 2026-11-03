import { getOEmbed } from '../soundcloud'

const TRACK_URL = 'https://soundcloud.com/special-ingredient/plant-life-vol-1'

/** The parts of an oEmbed response the build writes out, plus some it drops. */
const OEMBED = {
  title: 'Plant Life Vol. 1 by Special Ingredient',
  thumbnail_url: 'https://i1.sndcdn.com/artworks-abc-t500x500.jpg',
  html: '<iframe width="100%" height="166" src="https://w.soundcloud.com/player/?url=x"></iframe>',
  description: 'Take a journey :)',
  author_name: 'Special Ingredient',
  version: 1,
}

const mockFetch = (body: unknown) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json(body))
  )
}

describe('getOEmbed', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hands back only the fields the build writes out', async () => {
    mockFetch(OEMBED)

    expect(await getOEmbed({ url: TRACK_URL })).toEqual({
      title: OEMBED.title,
      thumbnail_url: OEMBED.thumbnail_url,
      html: OEMBED.html,
      description: OEMBED.description,
    })
  })

  it('accepts a track with no description', async () => {
    mockFetch({ ...OEMBED, description: null })

    expect(await getOEmbed({ url: TRACK_URL })).toMatchObject({
      description: null,
    })
  })

  it('rejects a response missing a field the page renders, naming the track', async () => {
    const MALFORMED = [
      // `SoundcloudTrack` strips the artist suffix off it.
      { ...OEMBED, title: undefined },
      // `SoundcloudTrack` rewrites it to the smaller artwork variant.
      { ...OEMBED, thumbnail_url: undefined },
      { ...OEMBED, thumbnail_url: 'not a url' },
      // Where the player's iframe src comes from.
      { ...OEMBED, html: undefined },
    ]

    for (const body of MALFORMED) {
      mockFetch(body)

      await expect(
        getOEmbed({ url: TRACK_URL }),
        JSON.stringify(body)
      ).rejects.toThrow(TRACK_URL)
    }
  })
})
