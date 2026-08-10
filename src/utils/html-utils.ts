export const isScrolledToTop = (
  element: Pick<HTMLElement, 'scrollTop'>,
  offset = 0,
) => element.scrollTop < offset

export const isScrolledToBottom = (
  element: Pick<HTMLElement, 'scrollTop' | 'scrollHeight' | 'offsetHeight'>,
  offset = 0,
) => element.scrollTop > element.scrollHeight - element.offsetHeight - offset

export const scrollElement = (
  el: HTMLElement | null,
  { delta, magnetDistance }: { delta: number; magnetDistance: number },
) => {
  if (!el) return
  const newScrollTop = el.scrollTop + delta
  const atTop = isScrolledToTop({ scrollTop: newScrollTop }, magnetDistance)
  const atBottom = isScrolledToBottom(
    {
      scrollTop: newScrollTop,
      // NOTE: don't spread to get these, these are prototype accessors, not own properties.
      scrollHeight: el.scrollHeight,
      offsetHeight: el.offsetHeight,
    },
    magnetDistance,
  )
  el.scrollTo({
    top: atTop ? 0 : atBottom ? el.scrollHeight : newScrollTop,
    behavior: 'smooth',
  })
}
