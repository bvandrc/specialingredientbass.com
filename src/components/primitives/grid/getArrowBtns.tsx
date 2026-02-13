import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { isScrolledToBottom, isScrolledToTop } from '../../../utils/html-utils'

const SCROLL_ARROW = {
  clickDistance: 150, // distance scrolled when arrow clicked
  magnetDistance: 100, // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  distanceFromEdge: 5, // pixels
  showThreshold: 50, // distance from top or bottom to show arrow
} as const

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

  const arrowProps = {
    size: '2x',
    className: 'scroll-arrow',
  } as const satisfies Partial<FontAwesomeIconProps>

  const UpArrow = showUpArrow ? (
    <FontAwesomeIcon
      {...arrowProps}
      icon={faCaretUp}
      onClick={() => {
        const newScrollTop = scrollRegion.scrollTop - SCROLL_ARROW.clickDistance
        scrollRegion.scrollTo({
          top: isScrolledToTop(
            { scrollTop: newScrollTop },
            SCROLL_ARROW.magnetDistance,
          )
            ? 0
            : newScrollTop,
          behavior: 'smooth',
        })
      }}
      style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.distanceFromEdge }}
    />
  ) : null

  const DownArrow = showDownArrow ? (
    <FontAwesomeIcon
      {...arrowProps}
      icon={faCaretDown}
      onClick={() => {
        const newScrollTop = scrollRegion.scrollTop + SCROLL_ARROW.clickDistance
        scrollRegion.scrollTo({
          top: isScrolledToBottom(
            {
              scrollHeight: scrollRegion.scrollHeight,
              offsetHeight: scrollRegion.offsetHeight,
              scrollTop: newScrollTop,
            },
            SCROLL_ARROW.magnetDistance,
          )
            ? scrollRegion.scrollHeight
            : newScrollTop,
          behavior: 'smooth',
        })
      }}
      style={{
        bottom: SCROLL_ARROW.distanceFromEdge,
      }}
    />
  ) : null
  return [UpArrow, DownArrow]
}
