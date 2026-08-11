import { useIsMobile } from '../../../hooks/useMobile'
import { GridCardsProvider } from './GridCardsProvider'

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
