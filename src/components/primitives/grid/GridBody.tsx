import Masonry from 'react-masonry-css'
import { useIsMobile } from '../../../hooks/useMobile'
import { GridCardsProvider, useGridCards } from './GridCardsProvider'

const GridCardsWrapper = ({
  children,
  noneExpandedInfo,
}: {
  children: React.ReactNode
  noneExpandedInfo?: React.ReactNode
}) => {
  const { openIds, allIds } = useGridCards()

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
}) => {
  const isMobile = useIsMobile()
  return (
    <main id="main-body" aria-label={ariaLabel}>
      <GridCardsProvider allowMultipleOpen={!isMobile}>
        <GridCardsWrapper noneExpandedInfo={noneExpandedInfo}>
          {children}
        </GridCardsWrapper>
      </GridCardsProvider>
    </main>
  )
}
