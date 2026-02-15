import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import type { GridCardsCriteria } from '../components/MainGridBody'

const InlineLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <a href={href} target="__blank" className="inline-flex items-center text-sky-700!">
    {children}
    <Icon icon={faExternalLink} size="2xs" className="ml-1" />
  </a>
)

export const GRID_CARD_DATA: GridCardsCriteria = [
  {
    title: 'Wave / Downtempo / Psydub',
    children: [
      {
        url: 'https://soundcloud.com/special-ingredient/plant-life-vol-1?in=special-ingredient/sets/trippy-melty-wavy-bass',
        title: 'Plant Life Vol. 1',
        subTitle: 'Psydub & Downtempo Bass Journey',
      },
      {
        url: 'https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-1-back-2-camp?in=special-ingredient/sets/trippy-melty-wavy-bass',
        title: 'Late Night Set @ Bass Canyon Pt. 1',
        subTitle: 'Trippy Genre Journey - Wave, Psydub, Downtempo, etc',
      },
      {
        url: 'https://soundcloud.com/special-ingredient/bass-canyon-late-night-trippy-set-pt-2?in=special-ingredient/sets/trippy-melty-wavy-bass',
        title: 'Late Night Set @ Bass Canyon Pt. 2',
        subTitle: 'Trippy Genre Journey - Wave, Psydub, Downtempo, etc',
      },
      {
        url: 'https://soundcloud.com/special-ingredient/plant-life-vol-2?in=special-ingredient/sets/trippy-melty-wavy-bass',
        title: 'Plant Life Vol. 2',
        subTitle: 'Halftime Psy-Hop & Uptempo Tribal Bass',
      },
    ],
  },
  {
    title: 'Wompy Dubstep',
    children: [
      {
        url: 'https://soundcloud.com/special-ingredient/subwoofer-sauce-vol-1?in=special-ingredient/sets/heavier-dubstep',
        title: 'Subwoofer Sauce Vol. 1',
        subTitle: 'OG Late Night Wonky Riddim',
        additionalInfo:
          "True riddim. That deep & wonky. If you're not a fan of riddim yet, try this one out. Headphones recommended, Lotta wild sounds bouncing around the 3D space in this one.",
      },
      {
        url: 'https://soundcloud.com/special-ingredient/aged-cheddar-mix-vol-1?in=special-ingredient/sets/heavier-dubstep',
        title: 'Aged Cheddar Vol. 1',
        subTitle: 'Early 2010s Wompy Dubstep— Liquid Stranger, Bar9, etc',
      },
    ],
  },
  {
    title: 'Hype Dubstep',
    children: [
      {
        url: 'https://soundcloud.com/special-ingredient/live-set-dft-yellow-brick-road-tour?in=special-ingredient/sets/heavier-dubstep',
        title: 'Live Set @ DFT Yellow Brick Road Tour',
        subTitle: 'Hype Dubstep Journey',
        additionalInfo:
          "Threw down more of a hype set for Dancefestopia's Yellow Brick Road tour, while still tryna keep it a genre journey. Lotta bangers but we still get swampy and wavey :)",
      },
      {
        url: 'https://soundcloud.com/special-ingredient/special-ingredient-b2b-saumii-larimer-lounge-1-26-2023?in=special-ingredient/sets/heavier-dubstep',
        title: 'Special Ingredient B2B Saumii @ Larimer Lounge',
        subTitle: 'Hype Dubstep Journey',
        additionalInfo: (
          <>
            Cooked up an extra special bass journey set with{' '}
            <InlineLink href="https://soundcloud.com/saumiimusic">
              Saumii
            </InlineLink>{' '}
            for a sold out crowd at Larimer Lounge, rinsing some of our favorite
            tracks we've shared over the years of DJing together.
          </>
        ),
      },
      {
        url: 'https://soundcloud.com/special-ingredient/bass-kitchen-mix-rage-dubstep-mix-briddim-riddim?in=special-ingredient/sets/heavier-dubstep',
        title: 'Bass Kitchen Vol. 1',
        subTitle: 'Briddim, Riddim, Heavy Dubstep',
      },
    ],
  },
  {
    title: 'Mashups / Flips',
    children: [
      {
        url: 'https://soundcloud.com/special-ingredient/meduso-a-moment-vip-x-baby-bash-cyclone?in=special-ingredient/sets/mashups-flips',
        albumArtToSide: true,
      },
      {
        url: 'https://soundcloud.com/special-ingredient/skeler-x-jojo-x-blackstreet-no-diggity-mashup?in=special-ingredient/sets/mashups-flips',
        albumArtToSide: true,
      },
      {
        url: 'https://soundcloud.com/special-ingredient/akon-love-right-now-na-na-na-x-nit-grit-mashup?in=special-ingredient/sets/mashups-flips',
        albumArtToSide: true,
      },
      {
        url: 'https://soundcloud.com/special-ingredient/ian-snow-revelation-x-travis-scott-kid-cudi-through-the-late-night?in=special-ingredient/sets/mashups-flips',
        albumArtToSide: true,
      },
    ],
  },
]
