import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
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
import {
  getIsMobile,
  isScrolledToBottom,
  isScrolledToTop,
  triggerClick,
} from '../../../utils/html-utils'

export type GridCardProps = PropsWithChildren<{
  title: string
  initiallyOpen: boolean
}>

type ExpandingRef = React.RefObject<HTMLDivElement> | undefined

type GridCardsContextValue = {
  openIds: string[]
  allIds: string[]
  allowMultipleOpen: boolean
  registerCard: (id: string, opts: Pick<GridCardProps, 'initiallyOpen'>) => void
  toggleCard: (id: string) => void
  isOpen: (id: string, opts: Pick<GridCardProps, 'initiallyOpen'>) => boolean
  expandingRef: ExpandingRef
  setExpandingRef: (ref: ExpandingRef) => void
}

const GridCardsContext = createContext<GridCardsContextValue | null>({
  openIds: [],
  allIds: [],
  allowMultipleOpen: !getIsMobile(),
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is fine
  registerCard: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is fine
  toggleCard: () => {},
  isOpen: () => false,
  expandingRef: undefined,
  setExpandingRef: () => null,
})

export function useGridCards() {
  const ctx = useContext(GridCardsContext)
  if (!ctx)
    throw new Error('useGridCards must be used within GridCardsProvider')
  return ctx
}

export function GridCardsProvider({
  children,
  allowMultipleOpen,
}: PropsWithChildren<{ allowMultipleOpen: boolean }>) {
  const [openIds, setOpenIds] = useState<string[]>([])
  const [allIds, setAllIds] = useState<string[]>([])
  const [expandingRef, setExpandingRef] = useState<ExpandingRef>(undefined)

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
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  const isOpen = (
    id: string,
    { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>,
  ) => openIds.includes(id) || (!allIds.includes(id) && initiallyOpen)

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

export const GridCard = ({ title, initiallyOpen, children }: GridCardProps) => {
  const id = useId()
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

  const [scrollPosition, setScrollPosition] = useState(0)
  const [height, setHeight] = useState<number>(0)

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      const topItem = getIsMobile() ? titleRef : cardRef
      topItem.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleTitleClick = useCallback(() => {
      // scroll immediately if we can
    if (!isOpen) scrollToTop()
    toggleCard(id)
  }, [isOpen])

  useEffect(() => {
    // starting the transition
    if (isOpen) setExpandingRef(cardRef)
  }, [isOpen])

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

  const [UpArrow, DownArrow] = useMemo(
    () =>
      GetArrows({
        scrollRegion: contentRef.current,
        isOpen: isOpen && !expandingRef,
      }),
    [height, scrollPosition, isOpen, expandingRef],
  )

  return (
    <section className="grid-card" aria-labelledby={titleId} ref={cardRef}>
      {/** biome-ignore lint/a11y/useSemanticElements: is fine as Div */}
      <div
        className="card-title"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={triggerClick}
        onClick={handleTitleClick}
        ref={titleRef}
      >
        <h2 id={titleId}>{title}</h2>
        <FontAwesomeIcon
          size="lg"
          icon={faCaretDown}
          className={classNames('collapse-caret', { open: isOpen })}
          aria-hidden
        />
      </div>
      {isOpen && UpArrow}
      <div
        className={classNames('collapse-content', { hidden: !isOpen })}
        ref={contentRef}
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
    </section>
  )
}

const SCROLL_ARROW = {
  clickDistance: 150, // distance scrolled when arrow clicked
  magnetDistance: 100, // when new scroll is within this distance from top/bottom, just scroll all the way to top/bottom
  distanceFromEdge: 5, // pixels
  showThreshold: 50, // distance from top or bottom to show arrow
} as const

const GetArrows = ({
  scrollRegion,
  isOpen,
}: {
  scrollRegion: HTMLDivElement | null
  isOpen: boolean
}) => {
  if (
    !scrollRegion ||
    !isOpen ||
    scrollRegion.offsetHeight < SCROLL_ARROW.showThreshold * 2
  )
    return [null, null]

  const ScrollArrow = (
    props: Omit<FontAwesomeIconProps, 'size' | 'className'>,
  ) => <FontAwesomeIcon size="2x" className="scroll-arrow" {...props} />

  const showUpArrow = !isScrolledToTop(scrollRegion, SCROLL_ARROW.showThreshold)
  const showDownArrow = !isScrolledToBottom(
    scrollRegion,
    SCROLL_ARROW.showThreshold,
  )

  const UpArrow = showUpArrow ? (
    <ScrollArrow
      icon={faCaretUp}
      onClick={() => {
        const newScrollTop = scrollRegion.scrollTop - SCROLL_ARROW.clickDistance
        scrollRegion.scrollTo({
          top: isScrolledToTop(
            { scrollTop: newScrollTop },
            SCROLL_ARROW.magnetDistance,
          )
            ? 0
            : newScrollTop,
          behavior: 'smooth',
        })
      }}
      style={{ top: scrollRegion.offsetTop + SCROLL_ARROW.distanceFromEdge }}
    />
  ) : null

  const DownArrow = showDownArrow ? (
    <ScrollArrow
      icon={faCaretDown}
      onClick={() => {
        const newScrollTop = scrollRegion.scrollTop + SCROLL_ARROW.clickDistance
        scrollRegion.scrollTo({
          top: isScrolledToBottom(
            {
              scrollHeight: scrollRegion.scrollHeight,
              offsetHeight: scrollRegion.offsetHeight,
              scrollTop: newScrollTop,
            },
            SCROLL_ARROW.magnetDistance,
          )
            ? scrollRegion.scrollHeight
            : newScrollTop,
          behavior: 'smooth',
        })
      }}
      style={{
        bottom: SCROLL_ARROW.distanceFromEdge,
      }}
    />
  ) : null
  return [UpArrow, DownArrow]
}
