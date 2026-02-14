import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react'
import { useIsMobile } from '../../../hooks/useMobile'
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
  const titleRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()

  const {
    toggleCard,
    registerCard,
    checkIsOpen,
    expandingRef,
    setExpandingRef,
  } = useGridCards()

  useEffect(() => {
    registerCard(id, { initiallyOpen })
  }, [])

  const isOpen = checkIsOpen(id, { initiallyOpen })
  const prevIsOpen = useRef<boolean>(isOpen)

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      const targetTopItem = isMobile ? titleRef : cardRef
      targetTopItem.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const handleTitleClick = useCallback(() => {
    // scroll immediately if we can
    if (!isOpen) scrollToTop()
    toggleCard(id)
  }, [isOpen])

  useEffect(() => {
    // only set expanding ref when transitioning from closed → open (so scroll/arrows run after transition)
    if (isOpen && !prevIsOpen.current) setExpandingRef(cardRef)
    prevIsOpen.current = isOpen
  }, [isOpen, setExpandingRef])

  return (
    <section className="grid-card" aria-labelledby={titleId} ref={cardRef}>
      <GridCardTitle
        title={title}
        isOpen={isOpen}
        onClick={handleTitleClick}
        ref={titleRef}
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
