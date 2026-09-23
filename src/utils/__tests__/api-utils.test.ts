import { makeRequest, setSearchParams } from '../api-utils'

const ok = (body = '') =>
  vi.fn(async () => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: async () => body,
  }))

describe('setSearchParams', () => {
  it('writes each param onto the url', () => {
    const url = new URL('https://example.com/oembed')

    setSearchParams(url, { format: 'json', maxwidth: 600 })

    expect(url.search).toBe('?format=json&maxwidth=600')
  })

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

  it('replaces a param the url already carried', () => {
    const url = new URL('https://example.com/oembed?format=xml')

    setSearchParams(url, { format: 'json' })

    expect(url.search).toBe('?format=json')
  })

  it('leaves the url alone when given nothing', () => {
    const url = new URL('https://example.com/oembed?a=1')

    setSearchParams(url)

    expect(url.search).toBe('?a=1')
  })
})

describe('makeRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the method and the params on one url', async () => {
    const fetch = ok()
    vi.stubGlobal('fetch', fetch)

    await makeRequest('GET', 'https://example.com/oembed', { format: 'json' })

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/oembed?format=json',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('keeps the request options the caller passed', async () => {
    const fetch = ok()
    vi.stubGlobal('fetch', fetch)

    await makeRequest(
      'POST',
      'https://example.com/x',
      {},
      {
        headers: { Accept: 'application/json' },
      }
    )

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/x',
      expect.objectContaining({
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
    )
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

  it('resolves to the response when it is ok', async () => {
    vi.stubGlobal('fetch', ok('{}'))

    await expect(
      makeRequest('GET', 'https://example.com/x')
    ).resolves.toMatchObject({ ok: true })
  })
})
