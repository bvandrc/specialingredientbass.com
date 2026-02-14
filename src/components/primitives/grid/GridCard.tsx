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
  const id = useId()
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)

  const { toggleCard, registerCard, checkIsOpen } = useGridCards()

  useEffect(() => {
    registerCard(id, { initiallyOpen })
  }, [])

  const isOpen = checkIsOpen(id, { initiallyOpen })
  const prevIsOpen = useRef<boolean>(isOpen)
  const isExpandingRef = useRef(false)

  const scrollToTop = () =>
    requestAnimationFrame(() => {
      // TODO: scroll to a higher point (title? offset by px?) for mobile
      cardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

  const handleTitleClick = useCallback(() => {
    if (!isOpen) scrollToTop()
    toggleCard(id)
  }, [isOpen, scrollToTop, toggleCard, id])

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      isExpandingRef.current = true
    } else if (!isOpen) {
      isExpandingRef.current = false
    }
    prevIsOpen.current = isOpen
  }, [isOpen])

  return (
    <section className="grid-card" aria-labelledby={titleId} ref={cardRef}>
      <GridCardTitle
        title={title}
        isOpen={isOpen}
        onClick={handleTitleClick}
        id={titleId}
      />
      <GridCardBody
        isOpen={isOpen}
        isExpandingRef={isExpandingRef}
        scrollToTop={scrollToTop}
      >
        {children}
      </GridCardBody>
    </section>
  )
}
