import { useMemo } from 'react'
import Masonry from 'react-masonry-css'
import { getIsMobile } from '../../../utils/html-utils'
import { GridCardsProvider, useGridCards } from './GridCard'

const GridCardsWrapper = ({
  children,
  noneExpandedInfo,
}: {
  children: React.ReactNode
  noneExpandedInfo?: React.ReactNode
}) => {
  const { openIds, allIds, expandingRef } = useGridCards()

  const spacerHeight = useMemo(() => {
    if (!expandingRef?.current) return
    return (
      Number.parseInt(window.getComputedStyle(expandingRef.current).maxHeight) -
      expandingRef.current.offsetHeight
    )
  }, [expandingRef?.current])

  return (
    <>
      {openIds.length === 0 && allIds.length > 0 && noneExpandedInfo}
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
          openIds.length === 0 &&
          spacerHeight !== undefined && (
            <div style={{ height: spacerHeight }} aria-hidden />
          )
      }
    </>
  )
}

export const GridBody = ({
  children,
  noneExpandedInfo,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode
  noneExpandedInfo?: React.ReactNode
  'aria-label': string
}) => (
  <main id="main-body" aria-label={ariaLabel}>
    <GridCardsProvider allowMultipleOpen={!getIsMobile()}>
      <GridCardsWrapper noneExpandedInfo={noneExpandedInfo}>
        {children}
      </GridCardsWrapper>
    </GridCardsProvider>
  </main>
)
