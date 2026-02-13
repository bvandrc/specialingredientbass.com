import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { getArrowBtns } from './getArrowBtns'

export const GridCardBody = ({
  children,
  contentRef,
  isOpen,
  expandingRef,
  height,
  setExpandingRef,
  scrollToTop,
}: React.PropsWithChildren<{
  contentRef: React.RefObject<HTMLDivElement>
  isOpen: boolean
  expandingRef: React.RefObject<HTMLDivElement> | undefined
  setExpandingRef: (ref: React.RefObject<HTMLDivElement> | undefined) => void
  scrollToTop: () => void
  height: number
}>) => {
  const [scrollTop, setScrollTop] = useState(0)

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
        className={classNames('collapse-content', { hidden: !isOpen })}
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
