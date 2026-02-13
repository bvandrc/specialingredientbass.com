import { createContext, useCallback, useContext, useState } from 'react'
import { getIsMobile } from '../../../utils/html-utils'
import type { GridCardProps } from './GridCard'

type ExpandingRef = React.RefObject<HTMLDivElement> | undefined

type GridCardsContextValue = {
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

const GridCardsContext = createContext<GridCardsContextValue | null>({
  openIds: [],
  allIds: [],
  allowMultipleOpen: !getIsMobile(),
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is fine
  registerCard: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is fine
  toggleCard: () => {},
  checkIsOpen: () => false,
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
}: React.PropsWithChildren<{ allowMultipleOpen: boolean }>) {
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
      {children}
    </GridCardsContext.Provider>
  )
}
