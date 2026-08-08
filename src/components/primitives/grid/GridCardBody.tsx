import classNames from 'classnames'
import { useMemo, useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'
import type { GridCardsContextValue } from './GridCardsProvider'
import { getArrowBtns } from './getArrowBtns'

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
  const contentRef = useRef<HTMLDivElement>(null)

  const { height = 0 } = useResizeObserver({
    ref: contentRef,
    box: 'content-box',
  })

  const [scrollTop, setScrollTop] = useState(0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: need these, but TODO: figure out how to remove
  const [UpArrow, DownArrow] = useMemo(
    () =>
      getArrowBtns({
        scrollRegion: contentRef.current,
        isOpen: isOpen && !expandingRef,
      }),
    [height, scrollTop, isOpen, expandingRef],
  )

  return (
    <>
      {isOpen && UpArrow}
      <div
        data-testid="grid-card-body"
        className={classNames(
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
          className={classNames(
            'relative min-h-0', // position/layout
            '[&::-webkit-scrollbar]:hidden', // appearance
            isOpen ? 'overflow-y-auto mb-1 py-1' : 'overflow-hidden',
          )}
          ref={contentRef}
          // scrollable region must be keyboard-accessible (a11y); only when open
          tabIndex={isOpen ? 0 : -1}
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          {children}
        </div>
      </div>
      {isOpen && DownArrow}
    </>
  )
}
