import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import {
  isScrolledToBottom,
  isScrolledToTop,
  scrollElement,
} from '../../../utils/html-utils'

const SCROLL_ARROW = {
  clickDistance: 150, // distance scrolled when arrow clicked
  magnetDistance: 100, // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  distanceFromEdge: 5, // pixels
  showThreshold: 50, // distance from top or bottom to show arrow
} as const

const ARROW_CLASS = classNames(
  'm-auto absolute left-0 right-0 z-10 flex items-center justify-center w-20 h-15', // position/layout
  'bg-[darkslateblue] opacity-80 rounded-lg cursor-pointer select-none', // appearance
)

export const getArrowBtns = ({
  scrollRegion,
  isOpen,
}: {
  scrollRegion: HTMLDivElement | null
  isOpen: boolean
}) => {
  if (
    !scrollRegion ||
    !isOpen ||
    scrollRegion.offsetHeight < SCROLL_ARROW.showThreshold * 2
  )
    return [null, null]

  const showUpArrow = !isScrolledToTop(scrollRegion, SCROLL_ARROW.showThreshold)
  const showDownArrow = !isScrolledToBottom(
    scrollRegion,
    SCROLL_ARROW.showThreshold,
  )

  const scrollBy = (delta: number) =>
    scrollElement(scrollRegion, {
      delta,
      magnetDistance: SCROLL_ARROW.magnetDistance,
    })

  const UpArrow = showUpArrow ? (
    <button
      type="button"
      data-testid="up-arrow"
      className={ARROW_CLASS}
      aria-label="Scroll up"
      onClick={() => scrollBy(-SCROLL_ARROW.clickDistance)}
      style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.distanceFromEdge }}
    >
      <Icon size="2x" icon={faCaretUp} aria-hidden />
    </button>
  ) : null

  const DownArrow = showDownArrow ? (
    <button
      type="button"
      data-testid="down-arrow"
      className={ARROW_CLASS}
      aria-label="Scroll down"
      onClick={() => scrollBy(SCROLL_ARROW.clickDistance)}
      style={{ bottom: SCROLL_ARROW.distanceFromEdge }}
    >
      <Icon size="2x" icon={faCaretDown} aria-hidden />
    </button>
  ) : null

  return [UpArrow, DownArrow]
}
