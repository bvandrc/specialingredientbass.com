import classNames from 'classnames'
import { useState } from 'react'
import data from '../../soundcloud-data.json' with { type: 'json' }
import { SoundcloudPlayer } from './SoundcloudPlayer'

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
  const info = data.find((d) => d.originalLink === url)
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
    <div className="relative mx-2.5 my-1 font-[Outfit,sans-serif]!">
      <div className="flex items-start gap-2.5">
        {!albumArtToSide && albumArtUrl && (
          <img
            src={albumArtUrl}
            className="align-middle self-center h-20 rounded-xl max-sm:h-[4.7em]"
            alt="album art"
          />
        )}
        <span
          className={classNames(
            'flex flex-col leading-tight font-normal gap-0.5',
            { 'text-glow-[cyan]': isPlaying },
          )}
        >
          <h4 className="text-xl text-white">{title}</h4>
          {subTitle && <p className="text-lg text-orange-200">{subTitle}</p>}
        </span>
      </div>
      {addlInfo && (
        <p className="mt-1 text-base font-[Barlow] text-justify text-slate-400 leading-tight">
          {addlInfo}
        </p>
      )}
      <SoundcloudPlayer
        url={url}
        html={info.html}
        title={title}
        setAlbumArtUrl={setAlbumArtUrl}
        onPlayToggle={onPlayToggle}
        showAlbumArt={albumArtToSide}
      />
    </div>
  )
}
