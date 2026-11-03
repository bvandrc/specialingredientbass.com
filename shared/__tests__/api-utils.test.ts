import { setSearchParams } from '../api-utils'

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
