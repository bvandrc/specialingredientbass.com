import { makeRequest, setSearchParams } from '../api-utils'

describe('setSearchParams', () => {
  it('leaves out the ones that are undefined', () => {
    const url = new URL('https://example.com/oembed')

    // An optional argument the caller did not pass should not become "undefined".
    setSearchParams(url, { format: 'json', color: undefined })

    expect(url.search).toBe('?format=json')
  })

  it('keeps a false, which is a value rather than an omission', () => {
    const url = new URL('https://example.com/oembed')

    setSearchParams(url, { show_artwork: false })

    expect(url.search).toBe('?show_artwork=false')
  })
})

describe('makeRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("throws on a failed response rather than handing back the browser's ok:false", async () => {
    // `fetch` only rejects on a network error, so a 404 would otherwise be
    // read as a successful response with nothing in it.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'no such track',
      }))
    )

    await expect(makeRequest('GET', 'https://example.com/x')).rejects.toThrow(
      '404: Not Found - no such track'
    )
  })
})
