import classNames from 'classnames'
import { GRID_CARD_DATA } from '../constants/grid-card-data'
import { useIsMobile } from '../hooks/useMobile'
import { GridBody } from './primitives/grid/GridBody'
import { GridCard } from './primitives/grid/GridCard'
import { SoundcloudTrack, type SoundcloudTrackProps } from './SoundcloudTrack'

export type GridCardsCriteria = {
  title: string
  children: SoundcloudTrackProps[]
}[]

export const MainGridBody = () => {
  const isMobile = useIsMobile()

  return (
    <GridBody
      data-testid="main-grid-body"
      noneExpandedInfo={
        <span
          className={classNames(
            'block text-center mx-auto pt-2', // position / layout
            'text-orange-400 text-2xl text-glow-heavy-[darkslateblue] font-bold font-[Roboto_Condensed]', // appearance
          )}
        >
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
    </GridBody>
  )
}
