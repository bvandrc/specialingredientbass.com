export const isScrolledToTop = (
  element: Pick<HTMLElement, 'scrollTop'>,
  offset = 0,
) => element.scrollTop < offset

export const isScrolledToBottom = (
  element: Pick<HTMLElement, 'scrollTop' | 'scrollHeight' | 'offsetHeight'>,
  offset = 0,
) => element.scrollTop > element.scrollHeight - element.offsetHeight - offset

export const isScrollableY = (
  element: Pick<HTMLElement, 'scrollHeight' | 'clientHeight'>,
) => element.scrollHeight > element.clientHeight

export const scrollElement = (
  el: HTMLElement | null,
  { delta, magnetDistance }: { delta: number; magnetDistance: number },
) => {
  if (!el) return
  const newScrollTop = el.scrollTop + delta
  const atTop = isScrolledToTop({ scrollTop: newScrollTop }, magnetDistance)
  const atBottom = isScrolledToBottom(
    { ...el, scrollTop: newScrollTop },
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

export const getElementProps = <T extends HTMLElement>(
  element: T,
): React.HTMLAttributes<T> => {
  return Object.fromEntries(
    element
      .getAttributeNames()
      .map((name) => [name, element.getAttribute(name)]),
  )
}

export const triggerClick = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.target?.dispatchEvent(
      new MouseEvent('click', { ...event, view: undefined }),
    )
  }
}
