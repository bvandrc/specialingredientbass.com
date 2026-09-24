import { scrollElement } from '../scroll-utils'

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

describe('scrollElement', () => {
  it('scrolls by the delta, snapping to either end from inside the magnet', () => {
    const SCROLLS = [
      // Nowhere near either end, so the delta lands where it lands.
      { scrollTop: 300, delta: 100, top: 400 },
      // 60 - 30 = 30, inside 50px of the top.
      { scrollTop: 60, delta: -30, top: 0 },
      // 540 + 30 = 570, inside 50px of the 600px maximum.
      { scrollTop: 540, delta: 30, top: 1000 },
    ]

    for (const { scrollTop, delta, top } of SCROLLS) {
      const el = scrollable(scrollTop)

      scrollElement(el, { delta, magnetDistance: 50 })

      expect(el.scrollTo, `${scrollTop} by ${delta}`).toHaveBeenCalledWith({
        top,
        behavior: 'smooth',
      })
    }
  })
})
