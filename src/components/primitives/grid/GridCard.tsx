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
  } = useGridCards()

  useEffect(() => {
    registerCard(id, { initiallyOpen })
  }, [])

  const isOpen = checkIsOpen(id, { initiallyOpen })
  const prevIsOpen = useRef<boolean>(isOpen)
  const isExpandingRef = useRef(false)

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      const targetTopItem = isMobile ? titleRef : cardRef
      targetTopItem.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [isMobile])

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
        ref={titleRef}
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
