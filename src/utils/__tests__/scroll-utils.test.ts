import {
  isScrolledToBottom,
  isScrolledToTop,
  scrollElement,
} from '../scroll-utils'

/** A scrollable element, with the metrics these helpers read off one. */
const scrollable = (scrollTop: number) => {
  const el = {
    scrollTop,
    scrollHeight: 1000,
    offsetHeight: 400,
    scrollTo: vi.fn(),
  }
  return el as unknown as HTMLElement & { scrollTo: ReturnType<typeof vi.fn> }
}

describe('isScrolledToTop', () => {
  it('counts anything within the offset as the top', () => {
    expect(isScrolledToTop({ scrollTop: 40 }, 50)).toBe(true)
    expect(isScrolledToTop({ scrollTop: 50 }, 50)).toBe(false)
  })

  it('never reports the top at the default offset', () => {
    // `scrollTop < 0` cannot hold, so the zero default is unsatisfiable. Every
    // caller passes a magnet distance, so nothing in the app reaches it.
    expect(isScrolledToTop({ scrollTop: 0 })).toBe(false)
  })
})

describe('isScrolledToBottom', () => {
  const METRICS = { scrollHeight: 1000, offsetHeight: 400 }

  it('counts anything within the offset as the bottom', () => {
    // The last scrollable pixel is 600: scrollHeight less the visible height.
    expect(isScrolledToBottom({ ...METRICS, scrollTop: 560 }, 50)).toBe(true)
    expect(isScrolledToBottom({ ...METRICS, scrollTop: 550 }, 50)).toBe(false)
  })

  it('never reports the bottom at the default offset', () => {
    // The same unsatisfiable default as its sibling: `scrollTop` tops out at
    // the very value it would have to exceed.
    expect(isScrolledToBottom({ ...METRICS, scrollTop: 600 })).toBe(false)
  })
})

describe('scrollElement', () => {
  const MAGNET = { delta: 0, magnetDistance: 50 }

  it('scrolls by the delta when nowhere near either end', () => {
    const el = scrollable(300)

    scrollElement(el, { ...MAGNET, delta: 100 })

    expect(el.scrollTo).toHaveBeenCalledWith({ top: 400, behavior: 'smooth' })
  })

  it('snaps to the top once the delta lands inside the magnet', () => {
    const el = scrollable(60)

    scrollElement(el, { ...MAGNET, delta: -30 })

    expect(el.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('snaps to the bottom the same way', () => {
    const el = scrollable(540)

    // 540 + 30 = 570, inside 50px of the 600px maximum.
    scrollElement(el, { ...MAGNET, delta: 30 })

    expect(el.scrollTo).toHaveBeenCalledWith({
      top: 1000,
      behavior: 'smooth',
    })
  })

  it('does nothing when there is no element yet', () => {
    expect(() => scrollElement(null, MAGNET)).not.toThrow()
  })
})
