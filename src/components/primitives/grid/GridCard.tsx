import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { getIsMobile } from '../../../utils/html-utils'
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
  const contentRef = useRef<HTMLDivElement>(null)

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

  const [height, setHeight] = useState<number>(0)

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      const targetTopItem = getIsMobile() ? titleRef : cardRef
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
        contentRef={contentRef}
        isOpen={isOpen}
        expandingRef={expandingRef}
        setExpandingRef={setExpandingRef}
        scrollToTop={scrollToTop}
        height={height}
      >
        {children}
      </GridCardBody>
    </section>
  )
}
