import classNames from 'classnames'
import { union, without } from 'es-toolkit'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import Masonry from 'react-masonry-css'
import type { GridCardProps } from './GridCard'

export type ExpandingRef = React.RefObject<HTMLDivElement> | undefined

export type GridCardsContextValue = {
  openIds: string[]
  allIds: string[]
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
  const { openIds, allIds } = useGridCards()
  const noneExpanded = openIds.length === 0 && allIds.length > 0

  return (
    <>
      {noneExpandedInfo && (
        <div
          className={classNames(
            'max-h-0 overflow-hidden transition-[max-height] duration-400 ease-in-out',
            noneExpanded && 'max-h-30 overflow-visible',
          )}
        >
          {noneExpandedInfo}
        </div>
      )}
      <Masonry
        breakpointCols={{
          default: 5,
          2250: 4,
          1800: 3,
          1350: 2,
          768: 1, // md: https://tailwindcss.com/docs/responsive-design#overview
        }}
        columnClassName="p-2 max-md:p-0" // md is when border goes away, so remove padding
        className="flex mt-2 w-auto max-lg:mt-1" //lg is when header goes to center instead of right
      >
        {children}
      </Masonry>
    </>
  )
}

export function GridCardsProvider({
  children,
  allowMultipleOpen,
  noneExpandedInfo,
}: React.PropsWithChildren<{ allowMultipleOpen: boolean }> &
  Pick<GridCardsWrapperProps, 'noneExpandedInfo'>) {
  const [openIds, setOpenIds] = useState<string[]>([])
  const [allIds, setAllIds] = useState<string[]>([])
  const [expandingRef, setExpandingRef] = useState<ExpandingRef>(undefined)

  const registerCard = useCallback(
    (id: string, { initiallyOpen }: Pick<GridCardProps, 'initiallyOpen'>) => {
      setAllIds((prev) => union(prev, [id]))
      if (initiallyOpen) {
        setOpenIds((prev) => union(prev, [id]))
      }
    },
    [],
  )

  const toggleCard = useCallback(
    (id: string) =>
      setOpenIds((prev) => {
        if (allowMultipleOpen) {
          return prev.includes(id) ? without(prev, id) : union(prev, [id])
        }
        return prev.includes(id) ? [] : [id]
      }),
    [allowMultipleOpen],
  )

  useEffect(() => {
    if (!allowMultipleOpen) {
      setOpenIds((prev) => (prev.length > 1 ? [prev[0]] : prev))
    }
  }, [allowMultipleOpen])

  const checkIsOpen = (
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
