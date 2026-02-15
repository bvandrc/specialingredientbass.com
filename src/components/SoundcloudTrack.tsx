import classNames from 'classnames'
import { keyBy } from 'es-toolkit'
import { useState } from 'react'
import data from '../../soundcloud-data.json' with { type: 'json' }
import { SoundcloudPlayer } from './SoundcloudPlayer'

const dataByUrl = keyBy(data, (d) => d.originalLink)

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
  if (!info) throw new Error(`no info found from url ${url}`)

  const [isPlaying, onPlayToggle] = useState(false)
  const [albumArtUrl, setAlbumArtUrl] = useState<string>()

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
      {!albumArtToSide && albumArtUrl && (
        <img
          src={albumArtUrl}
          className={classNames(
            'float-left mr-2 h-20 rounded-2xl max-md:h-18',
            addlInfo && '-mb-1',
          )}
          alt="album art"
        />
      )}
      <div
        className={classNames('pb-0.5', {
          'text-glow-med-[cyan]': isPlaying,
        })}
      >
        <h4 data-testid="soundcloud-track-title" className="text-xl text-white">
          {title}
        </h4>
        {subTitle && (
          <p
            data-testid="soundcloud-track-subtitle"
            className="text-lg text-orange-200"
          >
            {subTitle}
          </p>
        )}
      </div>
      {addlInfo && (
        <p
          data-testid="soundcloud-track-additional-info"
          className="text-base text-justify hyphens-auto text-pretty -tracking-wide leading-tight text-slate-400 font-[Barlow]"
        >
          {addlInfo}
        </p>
      )}
      <div className="clear-left">
        <SoundcloudPlayer
          url={url}
          html={info.html}
          title={title}
          setAlbumArtUrl={setAlbumArtUrl}
          onPlayToggle={onPlayToggle}
          showAlbumArt={albumArtToSide}
        />
      </div>
    </div>
  )
}
