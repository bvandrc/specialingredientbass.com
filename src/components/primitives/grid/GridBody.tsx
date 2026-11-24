import { useIsMobile } from '@bvandrc/react-toolkit'

import { GridCardsProvider } from './GridCardsProvider'

export const GridBody = ({
  noneExpandedInfo,
  'aria-label': ariaLabel,
  children,
}: {
  noneExpandedInfo?: React.ReactNode
  'aria-label': string
  children: React.ReactNode
}) => {
  const isMobile = useIsMobile()
  return (
    <main
      data-testid="grid-body"
      className="mx-auto w-full"
      aria-label={ariaLabel}>
      <GridCardsProvider
        allowMultipleOpen={!isMobile}
        noneExpandedInfo={noneExpandedInfo}>
        {children}
      </GridCardsProvider>
    </main>
  )
}
