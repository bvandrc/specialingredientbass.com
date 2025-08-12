import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'
import { getIsMobile } from '../utils/html-utils'
import { GridCard, GridCardsProvider, useGridCards } from './GridCard'
import { SoundcloudTrack } from './SoundcloudTrack'

const GridCards = () => {
  return (
    <>
      <GridCard title="Wave / Downtempo / Psydub">
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/plant-life-vol-1?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Plant Life Vol. 1"
          subTitle="Psydub & Downtempo Bass Journey"
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-1-back-2-camp?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Late Night Set @ Bass Canyon Pt. 1"
          subTitle="Trippy Genre Journey - Wave, Psydub, Downtempo, etc"
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-2?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Late Night Set @ Bass Canyon Pt. 2"
          subTitle="Trippy Genre Journey - Wave, Psydub, Downtempo, etc"
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/plant-life-vol-2?in=special-ingredient/sets/trippy-melty-wavy-bass"
          title="Plant Life Vol. 2"
          subTitle="Halftime Psy-Hop & Uptempo Tribal Bass"
        />
      </GridCard>
      <GridCard title="Wompy Dubstep">
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/subwoofer-sauce-vol-1?in=special-ingredient/sets/heavier-dubstep"
          title="Subwoofer Sauce Vol. 1"
          subTitle="OG Late Night Wonky Riddim"
          additionalInfo={
            <>
              <i>True</i> riddim, carefully picked. If you're not a fan of riddim yet, try this one
              out. Headphones recommended, Lotta wild sounds bouncing around the 3D space in this
              one.
            </>
          }
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/aged-cheddar-mix-vol-1?in=special-ingredient/sets/heavier-dubstep"
          title="Aged Cheddar Vol. 1"
          subTitle="Early 2010s Wompy Dubstep— Liquid Stranger, Bar9, etc"
        />
      </GridCard>
      <GridCard title="Hype Dubstep">
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/live-set-dft-yellow-brick-road-tour?in=special-ingredient/sets/heavier-dubstep"
          title="Live Set @ DFT Yellow Brick Road Tour"
          subTitle="Hype Dubstep Journey"
          additionalInfo={
            <>
              Threw down more of a hype set for Dancefestopia's Yellow Brick Road tour, while still
              tryna keep it a genre journey. Lotta bangers but we still get swampy and wavey :)
            </>
          }
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/special-ingredient-b2b-saumii-larimer-lounge-1-26-2023?in=special-ingredient/sets/heavier-dubstep"
          title="Special Ingredient B2B Saumii @ Larimer Lounge"
          subTitle="Hype Dubstep Journey"
          additionalInfo={
            <>
              Cooked up an extra special bass journey set with{' '}
              <a href="https://soundcloud.com/saumiimusic" target="__blank">
                Saumii <FontAwesomeIcon icon={faExternalLink} size="2xs" />
              </a>{' '}
              for a sold out crowd at Larimer Lounge, rinsing some of our favorite tracks we've
              shared over the years of DJing together.
            </>
          }
        />
        <SoundcloudTrack
          url="https://soundcloud.com/special-ingredient/bass-kitchen-mix-rage-dubstep-mix-briddim-riddim?in=special-ingredient/sets/heavier-dubstep"
          title="Bass Kitchen Vol. 1"
          subTitle="Briddim, Riddim, Heavy Dubstep"
        />
      </GridCard>
      <GridCard title="Mashups / Flips">
        {[
          'https://soundcloud.com/special-ingredient/meduso-a-moment-vip-x-baby-bash-cyclone?in=special-ingredient/sets/mashups-flips',
          'https://soundcloud.com/special-ingredient/skeler-x-jojo-x-blackstreet-no-diggity-mashup?in=special-ingredient/sets/mashups-flips',
          'https://soundcloud.com/special-ingredient/akon-love-right-now-na-na-na-x-nit-grit-mashup?in=special-ingredient/sets/mashups-flips',
          'https://soundcloud.com/special-ingredient/ian-snow-revelation-x-travis-scott-kid-cudi-through-the-late-night?in=special-ingredient/sets/mashups-flips',
        ].map((url, index) => (
          <SoundcloudTrack url={url} albumArtToSide key={`mashup-track-${index}`} />
        ))}
      </GridCard>
      {/* <GridCard title="Spotify Playlists">
<div className="collapse-content">
<div className="playlist-folder-tree"></div>
</div>
</GridCard>  */}
    </>
  )
}

const GridCardsWrapper = () => {
  const { openIds, expandingRef } = useGridCards()

  const spacerHeight = useMemo(() => {
    if (!expandingRef?.current) return
    return (
      parseInt(window.getComputedStyle(expandingRef.current).maxHeight) -
      expandingRef.current.offsetHeight
    )
  }, [expandingRef?.current])

  return (
    <>
      {openIds.length == 0 && (
        <span id="click-below">
          Click for SoundCloud mixes! <span className="fa fa-arrow-down" />
        </span>
      )}
      <div id="main-grid">
        <GridCards />
      </div>
      {
        // create a div at the bottom when expanding so can scroll title to the top
        expandingRef?.current && openIds.length === 0 && <div style={{ height: spacerHeight }} />
      }
    </>
  )
}

export const GridBody = () => {
  const isMobile = getIsMobile()
  return (
    <div id="main-body" role="main" aria-label="DJ Mixes">
      <GridCardsProvider
        initialOpen={isMobile ? 'none' : 'all'}
        allowMultipleOpen={!isMobile as true}
      >
        <GridCardsWrapper />
      </GridCardsProvider>
    </div>
  )
}
