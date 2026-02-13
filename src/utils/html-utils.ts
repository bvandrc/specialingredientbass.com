const MOBILE_WIDTH = 800

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

export const getWindowWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

export const getIsMobile = () => getWindowWidth() < MOBILE_WIDTH

export const htmlToElement = (html: string) => {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}

export const triggerClick = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.target?.dispatchEvent(
      new MouseEvent('click', { ...event, view: undefined }),
    )
  }
}
