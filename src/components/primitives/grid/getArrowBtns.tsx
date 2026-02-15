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
    className: classNames(
      'm-auto absolute left-0 right-0 z-10 block w-20 h-15', // position/layout
      'bg-[darkslateblue] opacity-80 rounded-lg text-center cursor-pointer select-none', // appearance
    ),
  } as const satisfies Partial<IconProps>

  const UpArrow = showUpArrow ? (
    <Icon
      {...arrowProps}
      data-testid="up-arrow"
      icon={faCaretUp}
      onClick={() =>
        scrollElement(scrollRegion, {
          delta: -SCROLL_ARROW.clickDistance,
          magnetDistance: SCROLL_ARROW.magnetDistance,
        })
      }
      style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.distanceFromEdge }}
    />
  ) : null

  const DownArrow = showDownArrow ? (
    <Icon
      {...arrowProps}
      data-testid="down-arrow"
      icon={faCaretDown}
      onClick={() =>
        scrollElement(scrollRegion, {
          delta: SCROLL_ARROW.clickDistance,
          magnetDistance: SCROLL_ARROW.magnetDistance,
        })
      }
      style={{
        bottom: SCROLL_ARROW.distanceFromEdge,
      }}
    />
  ) : null
  return [UpArrow, DownArrow]
}
