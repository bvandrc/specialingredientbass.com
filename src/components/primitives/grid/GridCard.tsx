import classNames from 'classnames'
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react'
import { GridCardBody } from './GridCardBody'
import { useGridCards } from './GridCardsProvider'
import { GridCardTitle } from './GridCardTitle'

export type GridCardProps = PropsWithChildren<{
  title: string
  initiallyOpen: boolean
}>

export const GridCard = ({ title, initiallyOpen, children }: GridCardProps) => {
  const id = title
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)

  const {
    toggleCard,
    registerCard,
    checkIsOpen,
    expandingRef,
    setExpandingRef,
  } = useGridCards()

  // biome-ignore lint/correctness/useExhaustiveDependencies: this should only run once. Adding deps makes it mess up. TODO: figure out how to remove.
  useEffect(() => {
    registerCard(id, { initiallyOpen })
  }, [])

  const isOpen = checkIsOpen(id, { initiallyOpen })
  const prevIsOpen = useRef<boolean>(isOpen)

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      // TODO: scroll to a higher point (title? offset by px?) for mobile
      cardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [])

  const handleTitleClick = useCallback(() => {
    // scroll immediately if we can
    if (!isOpen) scrollToTop()
    toggleCard(id)
  }, [isOpen, id, toggleCard, scrollToTop])

  useEffect(() => {
    // only set expanding ref when transitioning from closed → open (so scroll/arrows run after transition)
    if (isOpen && !prevIsOpen.current) setExpandingRef(cardRef)
    prevIsOpen.current = isOpen
  }, [isOpen, setExpandingRef])

  return (
    <section
      className={classNames(
        'flex flex-col relative max-h-[calc(100dvh-4em)] mb-4', // layout
        'border-solid border-2 rounded-2xl border-[darkslateblue] shadow-[0_0_10px_2px_darkslateblue]', // appearance
        'max-md:border-0 max-md:shadow-none max-md:mb-0', // mobile
      )}
      aria-labelledby={titleId}
      ref={cardRef}
    >
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
        scrollToTop={scrollToTop}
      >
        {children}
      </GridCardBody>
    </section>
  )
}
