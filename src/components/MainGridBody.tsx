import { GRID_CARD_DATA } from '../constants/grid-card-data'
import { useIsMobile } from '../hooks/useMobile'
import { GridBody as GridBodyPrimitive } from './primitives/grid/GridBody'
import { GridCard } from './primitives/grid/GridCard'
import { SoundcloudTrack, type SoundcloudTrackProps } from './SoundcloudTrack'

export type GridCardsCriteria = {
  title: string
  children: SoundcloudTrackProps[]
}[]

export const MainGridBody = () => {
  const isMobile = useIsMobile()

  return (
    <GridBodyPrimitive
      noneExpandedInfo={
        <span id="click-below">
          Click for SoundCloud mixes! <span className="fa fa-arrow-down" />
        </span>
      }
      aria-label="DJ Mixes"
    >
      {GRID_CARD_DATA.map(({ title, children }) => (
        <GridCard key={title} title={title} initiallyOpen={!isMobile}>
          {children.map((track) => (
            <SoundcloudTrack key={track.url} {...track} />
          ))}
        </GridCard>
      ))}
    </GridBodyPrimitive>
  )
}
