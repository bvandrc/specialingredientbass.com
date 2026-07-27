import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon as Icon,
  type FontAwesomeIconProps as IconProps,
} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import {
  isScrolledToBottom,
  isScrolledToTop,
  scrollElement,
} from '../../../utils/html-utils'

const SCROLL_ARROW = {
  CLICK_DISTANCE: 150, // distance scrolled when arrow clicked
  MAGNET_DISTANCE: 100, // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  DISTANCE_FROM_EDGE: 5, // pixels
  SHOW_THRESHOLD: 50, // distance from top or bottom to show arrow
} as const

const ARROW_PROPS = {
  size: '2x',
  className: classNames(
    'm-auto absolute left-0 right-0 z-10 block w-20 h-15', // position/layout
    'bg-[darkslateblue] opacity-80 rounded-lg text-center cursor-pointer select-none', // appearance
  ),
} as const satisfies Partial<IconProps>

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
    scrollRegion.offsetHeight < SCROLL_ARROW.SHOW_THRESHOLD * 2
  )
    return [null, null]

  const showUpArrow = !isScrolledToTop(
    scrollRegion,
    SCROLL_ARROW.SHOW_THRESHOLD,
  )
  const showDownArrow = !isScrolledToBottom(
    scrollRegion,
    SCROLL_ARROW.SHOW_THRESHOLD,
  )

  const UpArrow = showUpArrow ? (
    <Icon
      {...ARROW_PROPS}
      data-testid="up-arrow"
      icon={faCaretUp}
      onClick={() =>
        scrollElement(scrollRegion, {
          delta: -SCROLL_ARROW.CLICK_DISTANCE,
          magnetDistance: SCROLL_ARROW.MAGNET_DISTANCE,
        })
      }
      style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.DISTANCE_FROM_EDGE }}
    />
  ) : null

  const DownArrow = showDownArrow ? (
    <Icon
      {...ARROW_PROPS}
      data-testid="down-arrow"
      icon={faCaretDown}
      onClick={() =>
        scrollElement(scrollRegion, {
          delta: SCROLL_ARROW.CLICK_DISTANCE,
          magnetDistance: SCROLL_ARROW.MAGNET_DISTANCE,
        })
      }
      style={{
        bottom: SCROLL_ARROW.DISTANCE_FROM_EDGE,
      }}
    />
  ) : null
  return [UpArrow, DownArrow]
}
