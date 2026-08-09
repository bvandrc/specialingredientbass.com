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
  // Spreading `el` would drop scrollHeight/offsetHeight — they're prototype
  // accessors, not own properties — so name them explicitly.
  const atBottom = isScrolledToBottom(
    {
      scrollTop: newScrollTop,
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

export const htmlToElement = (html: string) => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

/** Makes a `role="button"` element respond to Enter/Space like a real button. */
export const triggerClick = (event: React.KeyboardEvent<HTMLElement>) => {
  if (event.key === 'Enter' || event.key === ' ') {
    // Space would otherwise scroll the page.
    event.preventDefault()
    event.currentTarget.click()
  }
}
