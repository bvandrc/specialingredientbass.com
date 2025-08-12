import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { MergeExclusive } from 'type-fest'
import { getIsMobile, isScrolledToBottom, isScrolledToTop, triggerClick } from '../utils/html-utils'

type IsExpandingState = ReturnType<typeof useState<React.RefObject<HTMLDivElement> | undefined>>

// Context to share expansion control across cards
const GridCardsContext = createContext<{
  openIds: string[]
  allowMultipleOpen: boolean
  registerCard: (id: string) => void
  toggleCard: (id: string) => void
  expandingRef: IsExpandingState[0]
  setExpandingRef: IsExpandingState[1]
}>({
  openIds: [],
  toggleCard: () => {},
  allowMultipleOpen: !getIsMobile(),
  registerCard: () => {},
  expandingRef: undefined,
  setExpandingRef: () => null,
})

export function useGridCards() {
  return useContext(GridCardsContext)
}

export function GridCardsProvider({
  children,
  initialOpen,
  allowMultipleOpen,
}: PropsWithChildren<
  MergeExclusive<
    { initialOpen: 'all' | 'none' | string[]; allowMultipleOpen: true },
    { initialOpen: 'none' | [string]; allowMultipleOpen: false }
  >
>) {
  const [openIds, setOpenIds] = useState<string[]>(Array.isArray(initialOpen) ? initialOpen : [])
  const [expandingRef, setExpandingRef] = useState<React.RefObject<HTMLDivElement>>()

  const registerCard = useCallback(
    (id: string) => {
      if (initialOpen === 'all' && !openIds.includes(id)) {
        // Need to register  in the case of `all`.
        setOpenIds((prev) => [...prev, id])
      }
    },
    [initialOpen],
  )

  const toggleCard = (id: string) => {
    if (allowMultipleOpen) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <GridCardsContext.Provider
      value={{
        openIds,
        toggleCard,
        registerCard,
        allowMultipleOpen,
        expandingRef,
        setExpandingRef,
      }}
    >
      {children}
    </GridCardsContext.Provider>
  )
}

export type GridCardProps = PropsWithChildren<{
  title: string
}>

export const GridCard = ({ title, children }: GridCardProps) => {
  const id = useId()
  const { openIds, toggleCard, registerCard, expandingRef, setExpandingRef } = useGridCards()

  useEffect(() => {
    registerCard(id)
  }, [])

  const isOpen = openIds.includes(id)

  const ref = useRef<HTMLDivElement>(null)

  const [scrollPosition, setScrollPosition] = useState(0)
  const [height, setHeight] = useState<number>(0)
  const titleRef = useRef<HTMLDivElement>(null)
  const collapseContentRef = useRef<HTMLDivElement>(null)

  const titleId = useId()

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      const topItem = getIsMobile() ? titleRef : ref
      topItem.current!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleCollapseClick = useCallback(() => {
    if (!isOpen) {
      setExpandingRef(ref)
      // scroll immediately if we can
      scrollToTop()
    }
    toggleCard(id)
  }, [isOpen])

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height)
      }
    })

    if (collapseContentRef.current) {
      observer.observe(collapseContentRef.current)
    }

    return () => {
      if (collapseContentRef.current) {
        observer.unobserve(collapseContentRef.current)
      }
    }
  }, [])

  const [UpArrow, DownArrow] = useMemo(() => {
    const scrollRegion = collapseContentRef.current
    if (!scrollRegion || !isOpen) return [null, null]

    const ARROW_CLICK_SCROLL_DIST = 150 // distance scrolled when arrow clicked
    const ARROW_MAGNET_DISTANCE = 100 // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
    const ARROW_DISTANCE_FROM_EDGE = 5 // pixels

    const ScrollArrow = (props: Omit<FontAwesomeIconProps, 'size' | 'className'>) => (
      <FontAwesomeIcon size="2x" className="scroll-arrow" {...props} />
    )

    const UpArrow = isScrolledToTop(scrollRegion, 50) ? null : (
      <ScrollArrow
        icon={faCaretUp}
        onClick={() => {
          const newScrollTop = scrollRegion.scrollTop - ARROW_CLICK_SCROLL_DIST
          scrollRegion.scrollTo({
            top: isScrolledToTop({ scrollTop: newScrollTop }, ARROW_MAGNET_DISTANCE)
              ? 0
              : newScrollTop,
            behavior: 'smooth',
          })
        }}
        style={{ top: scrollRegion.offsetTop + ARROW_DISTANCE_FROM_EDGE }}
      />
    )

    const DownArrow = isScrolledToBottom(scrollRegion, 50) ? null : (
      <ScrollArrow
        icon={faCaretDown}
        onClick={() => {
          const newScrollTop = scrollRegion.scrollTop + ARROW_CLICK_SCROLL_DIST
          scrollRegion.scrollTo({
            top: isScrolledToBottom(
              {
                scrollHeight: scrollRegion.scrollHeight,
                offsetHeight: scrollRegion.offsetHeight,
                scrollTop: newScrollTop,
              },
              ARROW_MAGNET_DISTANCE,
            )
              ? scrollRegion.scrollHeight
              : newScrollTop,
            behavior: 'smooth',
          })
        }}
        style={{
          bottom: ARROW_DISTANCE_FROM_EDGE,
        }}
      />
    )
    return [UpArrow, DownArrow]
  }, [height, scrollPosition])

  return (
    <div className="grid-card" role="region" aria-labelledby={titleId} ref={ref}>
      <div
        className="card-title"
        role="button"
        tabIndex={0}
        onKeyDown={triggerClick}
        onClick={handleCollapseClick}
        ref={titleRef}
      >
        <h2 id={titleId}>{title}</h2>
        <FontAwesomeIcon
          size="lg"
          icon={faCaretDown}
          className={classNames(`collapse-caret`, { open: isOpen })}
        />
      </div>
      {isOpen && UpArrow}
      <div
        className={classNames('collapse-content', { hidden: !isOpen })}
        ref={collapseContentRef}
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollTop)}
        // due to other cards collapsing, may need to scroll again once finished since proper position
        // on page can't be calculated while that collapse animation is occurring.
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) {
            if (isOpen && expandingRef?.current) {
              scrollToTop()
            }
            requestAnimationFrame(() => {
              setExpandingRef(undefined)
            })
          }
        }}
      >
        {children}
      </div>
      {isOpen && DownArrow}
    </div>
  )
}
