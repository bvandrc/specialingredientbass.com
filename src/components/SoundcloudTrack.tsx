import classNames from 'classnames'
import { keyBy } from 'es-toolkit'
import { useState } from 'react'
import data from '../../soundcloud-data.json' with { type: 'json' }
import { SoundcloudPlayer } from './SoundcloudPlayer'

const dataByUrl = keyBy(data, (d) => d.originalUrl)

/**
 * oEmbed hands back the 500px crop for an 80px slot. `large` is 100px — the
 * smallest of SoundCloud's fixed variants that still covers it.
 */
const transformAlbumArtUrl = (thumbnailUrl: string) =>
  thumbnailUrl.replace('-t500x500.', '-large.')

const AlbumArt = ({ className, url }: { className?: string; url: string }) => (
  <div
    className={classNames(
      'float-left mr-2 size-20 rounded-2xl overflow-hidden max-md:size-18', // position/layout
      'bg-gray-900/80', // backs the artwork while it loads
      className,
    )}
  >
    <img
      src={url}
      className="w-full h-full"
      alt="album art"
      width={80}
      height={80}
    />
  </div>
)

export interface SoundcloudTrackProps {
  url: string
  title?: string
  subTitle?: string
  additionalInfo?: string | React.ReactNode
  albumArtToSide?: boolean
}

export const SoundcloudTrack = ({
  url,
  title: _title,
  subTitle,
  additionalInfo: _additionalInfo,
  albumArtToSide = false,
}: SoundcloudTrackProps) => {
  const info = dataByUrl[url]

  const [isPlaying, onPlayToggle] = useState(false)

  if (!info) {
    console.error(`No SoundCloud data found for ${url}`)
    return null
  }

  const title =
    _title ??
    info.title
      .replaceAll(' by Special Ingredient', '')
      .replaceAll('[w TRACKLIST]', '')
      .replaceAll('[MASHUP]', '')

  const addlInfo =
    _additionalInfo === 'GET_FROM_SC' ? info.description : _additionalInfo

  return (
    <div
      className={classNames(
        'relative mx-3 my-1 rounded-xl font-[Outfit]',
        isPlaying && 'custom-shadow-[cyan]',
      )}
      data-testid="soundcloud-track"
    >
      {!albumArtToSide && (
        <AlbumArt url={transformAlbumArtUrl(info.thumbnail_url)} />
      )}
      <div
        className={classNames('pb-0.5', {
          'text-glow-med-[cyan]': isPlaying,
        })}
      >
        <h3
          data-testid="soundcloud-track-title"
          className="text-lg text-gray-200 leading-none mb-1"
        >
          {title}
        </h3>
        {subTitle && (
          <p
            data-testid="soundcloud-track-subtitle"
            className="text-lg text-orange-300/90 leading-[1.1] my-1"
          >
            {subTitle}
          </p>
        )}
      </div>
      {addlInfo && (
        <p
          data-testid="soundcloud-track-additional-info"
          className="text-base text-sm text-justify text-pretty -tracking-wide leading-tight text-slate-400 font-[Barlow]" // hyphens-auto
        >
          {addlInfo}
        </p>
      )}
      <div className="clear-left">
        <SoundcloudPlayer
          url={url}
          iframeSrc={info.iframeSrc}
          title={title}
          onPlayToggle={onPlayToggle}
          albumArtUrl={transformAlbumArtUrl(info.thumbnail_url)}
          showAlbumArt={albumArtToSide}
        />
      </div>
    </div>
  )
}
