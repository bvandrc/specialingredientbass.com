import { createContext, useCallback, useContext, useState } from 'react'
import Masonry from 'react-masonry-css'
import type { GridCardProps } from './GridCard'

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
}: {
  children: React.ReactNode
  noneExpandedInfo?: React.ReactNode
}) => {
  const { openIds, allIds } = useGridCards()
  const showInfo = openIds.length === 0 && allIds.length > 0

  return (
    <>
      {noneExpandedInfo && (
        <div className={`none-expanded-info ${showInfo ? 'visible' : ''}`}>
          {children}
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

  const toggleCard = useCallback(
    (id: string) => {
      if (allowMultipleOpen) {
        setOpenIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        )
      } else {
        setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
      }
    },
    [allowMultipleOpen],
  )

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
      }}
    >
      <GridCardsWrapper noneExpandedInfo={noneExpandedInfo}>
        {children}
      </GridCardsWrapper>
    </GridCardsContext.Provider>
  )
}
