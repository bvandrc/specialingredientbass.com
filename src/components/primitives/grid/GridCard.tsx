import { useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react'
import { useScrollIntoView } from '@bvandrc/react-toolkit'

import { cn } from '@/utils'
import { GridCardBody } from './GridCardBody'
import { useGridCards } from './GridCardsProvider'
import { GridCardTitle } from './GridCardTitle'

export type GridCardProps = {
  title: string
  initiallyOpen: boolean
  children: React.ReactNode
}

export const GridCard = ({ title, initiallyOpen, children }: GridCardProps) => {
  const id = title
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollIntoView } = useScrollIntoView()

  const {
    toggleCard,
    registerCard,
    checkIsOpen,
    expandingRef,
    setExpandingRef,
  } = useGridCards()

  // biome-ignore lint/correctness/useExhaustiveDependencies: this should only run once. Adding deps makes it mess up. TODO: figure out how to remove.
  useLayoutEffect(() => {
    registerCard(id, { initiallyOpen })
  }, [])

  const isOpen = checkIsOpen(id, { initiallyOpen })
  const prevIsOpen = useRef<boolean>(isOpen)

  const handleTitleClick = useCallback(() => toggleCard(id), [id, toggleCard])

  // Bring the card's top into view once it has finished expanding, when its final size and position are known
  const handleExpandEnd = useCallback(() => {
    if (cardRef.current) {
      scrollIntoView(cardRef.current, 'start', { behavior: 'smooth' })
    }
  }, [scrollIntoView])

  useEffect(() => {
    // only set expanding ref when transitioning from closed → open (so scroll/arrows run after transition)
    if (isOpen && !prevIsOpen.current) setExpandingRef(cardRef)
    prevIsOpen.current = isOpen
  }, [isOpen, setExpandingRef])

  return (
    <section
      data-testid="grid-card"
      className={cn(
        'flex flex-col relative max-h-[calc(100dvh-10em)] mb-4 overflow-hidden', // layout
        'rounded-2xl border-solid border-1 border-[darkslateblue] inset-ring-1 inset-ring-[darkslateblue]', // appearance
        'max-md:max-h-[calc(100dvh-4em)] max-md:border-0 max-md:inset-ring-0 max-md:my-3 max-md:mx-1.5' // mobile
      )}
      aria-labelledby={titleId}
      ref={cardRef}>
      <GridCardTitle
        title={title}
        isOpen={isOpen}
        onClick={handleTitleClick}
        id={titleId}
      />
      <GridCardBody
        isOpen={isOpen}
        expandingRef={expandingRef}
        setExpandingRef={setExpandingRef}
        onExpandEnd={handleExpandEnd}>
        {children}
      </GridCardBody>
    </section>
  )
}
