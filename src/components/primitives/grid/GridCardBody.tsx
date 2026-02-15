import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { GridCardsContextValue } from './GridCardsProvider'
import { getArrowBtns } from './getArrowBtns'

export const GridCardBody = ({
  children,
  isOpen,
  expandingRef,
  setExpandingRef,
  scrollToTop,
}: React.PropsWithChildren<
  {
    isOpen: boolean
    scrollToTop: () => void
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
          'relative overflow-y-auto transition-[max-height] duration-400 ease-in-out [&::-webkit-scrollbar]:hidden',
          isOpen ? 'max-h-100dvh' : 'max-h-0',
        )}
        ref={contentRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        // due to other cards collapsing, may need to scroll again once finished since proper position
        // on page can't be calculated while that collapse animation is occurring.
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) {
            if (isOpen && expandingRef?.current) {
              scrollToTop()
            }
            setExpandingRef(undefined)
          }
        }}
      >
        {children}
      </div>
      {isOpen && DownArrow}
    </>
  )
}
