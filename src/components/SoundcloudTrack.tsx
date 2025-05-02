import classNames from 'classnames'
import { useState } from 'react'
import data from '../../soundcloud-data.json'
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

  const addlInfo = _additionalInfo === 'GET_FROM_SC' ? info.description : _additionalInfo

  return (
    <div className="track">
      <div className="top-row">
        {!albumArtToSide && albumArtUrl && (
          <img src={albumArtUrl} className="album-art" alt="album art" />
        )}
        <span className="track-title-wrapper" role="heading" aria-level={3}>
          <p className={classNames('track-title', { 'shadow-cyan': isPlaying })}>{title}</p>
          {subTitle && <p className="track-subtitle">{subTitle}</p>}
        </span>
      </div>
      {addlInfo && <p className="addl-info-row">{addlInfo}</p>}
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
