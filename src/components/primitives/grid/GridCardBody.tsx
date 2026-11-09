import { cn } from '@/utils'
import type { GridCardsContextValue } from './GridCardsProvider'
import { useArrowBtns } from './useArrowBtns'

export const GridCardBody = ({
  isOpen,
  expandingRef,
  setExpandingRef,
  onExpandEnd,
  children,
}: {
  isOpen: boolean
  /** Called when the open transition finishes; not when a collapse does. */
  onExpandEnd: () => void
  children: React.ReactNode
} & Pick<GridCardsContextValue, 'expandingRef' | 'setExpandingRef'>) => {
  const { UpArrow, DownArrow, isScrollable, scrollRegionProps } = useArrowBtns({
    isOpen: isOpen && !expandingRef,
  })
  // A scroll container only while its contents overflow. iOS Safari hands a
  // drag to an `overflow: auto` box even when there's nothing in it to scroll,
  // and inside an iframe, like bvandercar.dev's live preview, doesn't pass the
  // drag on to the page, which then can't be scrolled by touching the card.
  const canScroll = isOpen && isScrollable

  return (
    <>
      {isOpen && UpArrow}
      <div
        data-testid="grid-card-body"
        className={cn(
          'grid min-h-0 transition-[grid-template-rows] duration-400 ease-in-out', // layout/animation
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) {
            setExpandingRef(undefined)
            if (isOpen) onExpandEnd()
          }
        }}>
        <div
          data-testid="grid-card-scroll-region"
          className={cn(
            'relative min-h-0', // position/layout
            '[&::-webkit-scrollbar]:hidden', // appearance
            isOpen && 'mb-1 py-1',
            canScroll ? 'overflow-y-auto' : 'overflow-hidden'
          )}
          // scrollable region must be keyboard-accessible (a11y); only when it scrolls
          tabIndex={canScroll ? 0 : -1}
          {...scrollRegionProps}>
          {children}
        </div>
      </div>
      {isOpen && DownArrow}
    </>
  )
}
