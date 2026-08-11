import { cn } from '../../../utils/cn'
import type { GridCardsContextValue } from './GridCardsProvider'
import { useArrowBtns } from './useArrowBtns'

export const GridCardBody = ({
  children,
  isOpen,
  expandingRef,
  setExpandingRef,
}: React.PropsWithChildren<
  {
    isOpen: boolean
  } & Pick<GridCardsContextValue, 'expandingRef' | 'setExpandingRef'>
>) => {
  const { UpArrow, DownArrow, scrollRegionProps } = useArrowBtns({
    isOpen: isOpen && !expandingRef,
  })

  return (
    <>
      {isOpen && UpArrow}
      <div
        data-testid="grid-card-body"
        className={cn(
          'grid min-h-0 transition-[grid-template-rows] duration-400 ease-in-out', // layout/animation
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) {
            setExpandingRef(undefined)
          }
        }}
      >
        <div
          className={cn(
            'relative min-h-0', // position/layout
            '[&::-webkit-scrollbar]:hidden', // appearance
            isOpen ? 'overflow-y-auto mb-1 py-1' : 'overflow-hidden',
          )}
          // scrollable region must be keyboard-accessible (a11y); only when open
          tabIndex={isOpen ? 0 : -1}
          {...scrollRegionProps}
        >
          {children}
        </div>
      </div>
      {isOpen && DownArrow}
    </>
  )
}
