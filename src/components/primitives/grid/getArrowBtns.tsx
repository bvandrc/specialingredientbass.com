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

type ArrowDirection = 'up' | 'down'

const ScrollArrow = ({
  direction,
  scrollRegion,
  ...props
}: {
  direction: ArrowDirection
  scrollRegion: HTMLDivElement
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'>) => (
  <button
    type="button"
    data-testid={`${direction}-arrow`}
    className={classNames(
      // w-fit so the button hugs the icon: FontAwesome's own svg rules win
      // over width/height utilities, so sizing the button instead would
      // scale the pill without scaling the caret.
      'm-auto absolute left-0 right-0 z-10 flex w-fit', // position/layout
      'bg-[darkslateblue] opacity-80 rounded-lg cursor-pointer select-none', // appearance
    )}
    aria-label={`Scroll ${direction}`}
    onClick={() =>
      scrollElement(scrollRegion, {
        delta: SCROLL_ARROW.clickDistance * (direction === 'up' ? -1 : 1),
        magnetDistance: SCROLL_ARROW.magnetDistance,
      })
    }
    {...props}
  >
    <Icon
      size="2x"
      icon={direction === 'up' ? faCaretUp : faCaretDown}
      aria-hidden
    />
  </button>
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

  const UpArrow = showUpArrow ? (
    <ScrollArrow
      direction="up"
      scrollRegion={scrollRegion}
      style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.distanceFromEdge }}
    />
  ) : null

  const DownArrow = showDownArrow ? (
    <ScrollArrow
      direction="down"
      scrollRegion={scrollRegion}
      style={{ bottom: SCROLL_ARROW.distanceFromEdge }}
    />
  ) : null

  return [UpArrow, DownArrow]
}
