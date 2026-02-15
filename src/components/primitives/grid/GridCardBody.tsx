import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
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

  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height)
      }
    })

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current)
      }
    }
  }, [])

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
            isOpen ? 'overflow-y-auto' : 'overflow-hidden',
          )}
          ref={contentRef}
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          {children}
        </div>
      </div>
      {isOpen && DownArrow}
    </>
  )
}
