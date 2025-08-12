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
import { getIsMobile, isScrolledToBottom, isScrolledToTop, triggerClick } from '../utils/html-utils'

type IsExpandingState = ReturnType<typeof useState<React.RefObject<HTMLDivElement> | undefined>>

// Context to share expansion control across cards
const GridCardsContext = createContext<{
  openIds: string[]
  allIds: string[]
  allowMultipleOpen: boolean
  registerCard: (id: string, { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>) => void
  toggleCard: (id: string) => void
  isOpen: (id: string, { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>) => boolean
  expandingRef: IsExpandingState[0]
  setExpandingRef: IsExpandingState[1]
}>({
  openIds: [],
  allIds: [],
  allowMultipleOpen: !getIsMobile(),
  registerCard: () => {},
  toggleCard: () => {},
  isOpen: () => false,
  expandingRef: undefined,
  setExpandingRef: () => null,
})

export function useGridCards() {
  return useContext(GridCardsContext)
}

export function GridCardsProvider({
  children,
  allowMultipleOpen,
}: PropsWithChildren<{ allowMultipleOpen: boolean }>) {
  const [openIds, setOpenIds] = useState<string[]>([])
  const [allIds, setAllIds] = useState<string[]>([])
  const [expandingRef, setExpandingRef] = useState<React.RefObject<HTMLDivElement> | undefined>()

  const registerCard = useCallback(
    (id: string, { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>) => {
      if (!allIds.includes(id)) {
        setAllIds((prev) => [...prev, id])
      }
      if (initiallyOpen && !openIds.includes(id)) {
        setOpenIds((prev) => [...prev, id])
      }
    },
    [],
  )

  const toggleCard = (id: string) => {
    if (allowMultipleOpen) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  const isOpen = (id: string, { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>) =>
    openIds.includes(id) || (!allIds.includes(id) && initiallyOpen)

  return (
    <GridCardsContext.Provider
      value={{
        openIds,
        allIds,
        allowMultipleOpen,
        registerCard,
        toggleCard,
        isOpen,
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
  initiallyOpen: boolean
}>

export const GridCard = ({ title, initiallyOpen, children }: GridCardProps) => {
  const id = useId()
  const {
    toggleCard,
    registerCard,
    isOpen: checkIsOpen,
    expandingRef,
    setExpandingRef,
  } = useGridCards()

  useEffect(() => {
    registerCard(id, { initiallyOpen })
  }, [])

  const isOpen = checkIsOpen(id, { initiallyOpen })

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
      // scroll immediately if we can
      scrollToTop()
    }
    toggleCard(id)
  }, [isOpen])

  useEffect(() => {
    // starting the transition
    if (isOpen) {
      setExpandingRef(ref)
    }
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

  const [UpArrow, DownArrow] = useMemo(
    () => GetArrows({ scrollRegion: collapseContentRef.current, isOpen: isOpen && !expandingRef }),
    [height, scrollPosition, isOpen, expandingRef],
  )

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
            setExpandingRef(undefined)
          }
        }}
      >
        {children}
      </div>
      {isOpen && DownArrow}
    </div>
  )
}

const GetArrows = ({
  scrollRegion,
  isOpen,
}: {
  scrollRegion: HTMLDivElement | null
  isOpen: boolean
}) => {
  const ARROW_CLICK_SCROLL_DIST = 150 // distance scrolled when arrow clicked
  const ARROW_MAGNET_DISTANCE = 100 // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  const ARROW_DISTANCE_FROM_EDGE = 5 // pixels
  const ARROW_DISTANCE_SHOW_THRESHOLD = 50 // distance from top or bottom to show arrow

  if (!scrollRegion || !isOpen || scrollRegion.offsetHeight < ARROW_DISTANCE_SHOW_THRESHOLD * 2)
    return [null, null]

  const ScrollArrow = (props: Omit<FontAwesomeIconProps, 'size' | 'className'>) => (
    <FontAwesomeIcon size="2x" className="scroll-arrow" {...props} />
  )

  const UpArrow = isScrolledToTop(scrollRegion, ARROW_DISTANCE_SHOW_THRESHOLD) ? null : (
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

  const DownArrow = isScrolledToBottom(scrollRegion, ARROW_DISTANCE_SHOW_THRESHOLD) ? null : (
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
}
