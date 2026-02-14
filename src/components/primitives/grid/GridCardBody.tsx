import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getArrowBtns } from './getArrowBtns'

export const GridCardBody = ({
  children,
  isOpen,
  isExpandingRef,
  scrollToTop,
}: React.PropsWithChildren<{
  isOpen: boolean
  isExpandingRef: React.MutableRefObject<boolean>
  scrollToTop: () => void
}>) => {
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

  const [UpArrow, DownArrow] = useMemo(
    () =>
      getArrowBtns({
        scrollRegion: contentRef.current,
        isOpen: isOpen && !isExpandingRef.current,
      }),
    [height, scrollTop, isOpen, isExpandingRef],
  )

  return (
    <>
      {isOpen && UpArrow}
      <div
        className={classNames('collapse-content', { hidden: !isOpen })}
        ref={contentRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) {
            if (isOpen && isExpandingRef.current) {
              scrollToTop()
            }
            isExpandingRef.current = false
          }
        }}
      >
        {children}
      </div>
      {isOpen && DownArrow}
    </>
  )
}
