import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import Masonry from 'react-masonry-css'
import type { GridCardProps } from './GridCard'

export type ExpandingRef = React.RefObject<HTMLDivElement> | undefined

export type GridCardsContextValue = {
  openIds: Set<string>
  allIds: Set<string>
  allowMultipleOpen: boolean
  registerCard: (id: string, opts: Pick<GridCardProps, 'initiallyOpen'>) => void
  toggleCard: (id: string) => void
  checkIsOpen: (
    id: string,
    opts: Pick<GridCardProps, 'initiallyOpen'>,
  ) => boolean
  expandingRef: ExpandingRef
  setExpandingRef: (ref: ExpandingRef) => void
}

const GridCardsContext = createContext<GridCardsContextValue | null>(null)

export function useGridCards() {
  const ctx = useContext(GridCardsContext)
  if (!ctx)
    throw new Error('useGridCards must be used within GridCardsProvider')
  return ctx
}

interface GridCardsWrapperProps {
  children: React.ReactNode
  noneExpandedInfo?: React.ReactNode
}

const GridCardsWrapper = ({
  children,
  noneExpandedInfo,
}: GridCardsWrapperProps) => {
  const { openIds, allIds, expandingRef } = useGridCards()
  const [spacerHeight, setSpacerHeight] = useState<number | undefined>()
  const noneExpanded = openIds.size === 0 && allIds.size > 0

  useLayoutEffect(() => {
    const el = expandingRef?.current
    if (!el) return

    const update = () => {
      const maxHeight = Number.parseInt(
        window.getComputedStyle(el).maxHeight || '0',
      )
      setSpacerHeight(maxHeight - el.offsetHeight)
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => ro.disconnect()
  }, [expandingRef])

  return (
    <>
      {noneExpandedInfo && (
        <div className={`none-expanded-info ${noneExpanded ? 'visible' : ''}`}>
          {noneExpandedInfo}
        </div>
      )}
      <Masonry
        breakpointCols={{
          default: 5,
          2250: 4,
          1800: 3,
          1350: 2,
          900: 1,
        }}
        columnClassName="masonry-grid-column"
        className="main-masonry-grid"
      >
        {children}
      </Masonry>
      {
        // create a div at the bottom when expanding so can scroll title to the top
        expandingRef?.current &&
          openIds.size === 0 &&
          spacerHeight !== undefined && (
            <div style={{ height: spacerHeight }} aria-hidden />
          )
      }
    </>
  )
}

export function GridCardsProvider({
  children,
  allowMultipleOpen,
  noneExpandedInfo,
}: React.PropsWithChildren<{ allowMultipleOpen: boolean }> &
  Pick<GridCardsWrapperProps, 'noneExpandedInfo'>) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [allIds, setAllIds] = useState<Set<string>>(new Set())
  const [expandingRef, setExpandingRef] = useState<ExpandingRef>(undefined)

  const registerCard = useCallback(
    (id: string, { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>) => {
      if (!allIds.has(id)) {
        setAllIds((prev) => prev.add(id))
      }
      if (initiallyOpen && !openIds.has(id)) {
        setOpenIds((prev) => prev.add(id))
      }
    },
    [allIds, openIds],
  )

  const toggleCard = useCallback(
    (id: string) =>
      setOpenIds((prev) => {
        if (allowMultipleOpen) {
          const next = new Set(prev)

          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }

          return next
        } else {
          if (prev.has(id)) return new Set()
          return new Set([id])
        }
      }),
    [allowMultipleOpen],
  )

  const checkIsOpen = (
    id: string,
    { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>,
  ) => openIds.has(id) || (!allIds.has(id) && initiallyOpen)

  return (
    <GridCardsContext.Provider
      value={{
        openIds,
        allIds,
        allowMultipleOpen,
        registerCard,
        toggleCard,
        checkIsOpen,
        expandingRef,
        setExpandingRef,
      }}
    >
      <GridCardsWrapper noneExpandedInfo={noneExpandedInfo}>
        {children}
      </GridCardsWrapper>
    </GridCardsContext.Provider>
  )
}
