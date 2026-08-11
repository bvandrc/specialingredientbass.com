import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useId, useMemo, useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'
import { cn } from '@/utils'
import {
  isScrolledToBottom,
  isScrolledToTop,
  scrollElement,
} from '@/utils/scroll-utils'

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
    className={cn(
      // w-fit so the button hugs the icon: FontAwesome's own svg rules win
      // over width/height utilities, so sizing the button instead would
      // scale the pill without scaling the caret.
      'm-auto absolute left-0 right-0 z-10 flex w-fit', // position/layout
      'bg-[darkslateblue] opacity-80 rounded-lg cursor-pointer select-none' // appearance
    )}
    aria-label={`Scroll ${direction}`}
    aria-controls={scrollRegion.id}
    onClick={() =>
      scrollElement(scrollRegion, {
        delta: SCROLL_ARROW.clickDistance * (direction === 'up' ? -1 : 1),
        magnetDistance: SCROLL_ARROW.magnetDistance,
      })
    }
    {...props}>
    <Icon
      size="2x"
      icon={direction === 'up' ? faCaretUp : faCaretDown}
      aria-hidden
    />
  </button>
)

/** Scroll arrows for a scrollable region. Spread `scrollRegionProps` onto the element they should scroll. */
export const useArrowBtns = ({ isOpen }: { isOpen: boolean }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRegionId = useId() // the arrows point at this via aria-controls
  const { height = 0 } = useResizeObserver({
    ref: contentRef,
    box: 'content-box',
  })
  const [scrollTop, setScrollTop] = useState(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: need these, but TODO: figure out how to remove
  const [UpArrow, DownArrow] = useMemo(() => {
    const scrollRegion = contentRef.current
    if (
      !scrollRegion ||
      !isOpen ||
      scrollRegion.offsetHeight < SCROLL_ARROW.showThreshold * 2
    )
      return [null, null]

    const showUpArrow = !isScrolledToTop(
      scrollRegion,
      SCROLL_ARROW.showThreshold
    )
    const showDownArrow = !isScrolledToBottom(
      scrollRegion,
      SCROLL_ARROW.showThreshold
    )

    const upArrow = showUpArrow ? (
      <ScrollArrow
        direction="up"
        scrollRegion={scrollRegion}
        style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.distanceFromEdge }}
      />
    ) : null

    const downArrow = showDownArrow ? (
      <ScrollArrow
        direction="down"
        scrollRegion={scrollRegion}
        style={{ bottom: SCROLL_ARROW.distanceFromEdge }}
      />
    ) : null

    return [upArrow, downArrow]
  }, [height, scrollTop, isOpen])

  return {
    UpArrow,
    DownArrow,
    scrollRegionProps: {
      ref: contentRef,
      id: scrollRegionId,
      onScroll: (e: React.UIEvent<HTMLDivElement>) =>
        setScrollTop(e.currentTarget.scrollTop),
    },
  }
}
