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
})
