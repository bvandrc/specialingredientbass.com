import { faSoundcloud } from '@fortawesome/free-brands-svg-icons'
import {
  faCircle,
  faComment,
  faExternalLink,
  faHeart,
  faPauseCircle,
  faPlay,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import type { TrackInfo } from '../api/soundcloudWidget'
import { setSearchParams } from '../utils/api-utils'
import { htmlToElement } from '../utils/html-utils'

export interface SoundcloudPlayerProps {
  url: string
  html: string
  title: string
  className?: string
  setAlbumArtUrl?: (url: string) => void
  onPlayToggle?: (isPlaying: boolean) => void
  showAlbumArt?: boolean
}

const EXTERNAL_LINK_LABEL = 'This track on SoundCloud.com (new tab)'

export const SoundcloudPlayer = ({
  url,
  html,
  title,
  className,
  setAlbumArtUrl,
  onPlayToggle,
  showAlbumArt = false,
}: SoundcloudPlayerProps) => {
  const id = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [trackInfo, setTrackInfo] = useState<TrackInfo>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const dummyElement = htmlToElement(html) as HTMLIFrameElement
  dummyElement.title = title
  const iframeUrl = new URL(dummyElement.src)
  setSearchParams(iframeUrl, {
    auto_play: false,
    hide_related: true,
    show_comments: true,
    show_user: false,
    show_reposts: true,
    show_teaser: false,
    visual: false, // true =  artwork behind waveform, false = artwork to left
    show_artwork: false,
  })
  dummyElement.src = iframeUrl.href
  dummyElement.id = id
  dummyElement.allow = 'autoplay'

  const iFrameElement = wrapperRef.current?.firstElementChild

  useEffect(() => {
    if (iFrameElement && !trackInfo) {
      const widget = window.SC.Widget(id)
      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.getCurrentSound((sound) => setTrackInfo(sound))
      })
      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false))
    }
  }, [iFrameElement])

  useEffect(() => {
    onPlayToggle?.(isPlaying)
  }, [isPlaying])

  useEffect(() => {
    if (trackInfo?.artwork_url) {
      setAlbumArtUrl?.(trackInfo.artwork_url)
    }
  }, [trackInfo?.artwork_url])

  return (
    <div className="sc-player">
      {showAlbumArt && trackInfo?.artwork_url && (
        <img src={trackInfo.artwork_url} className="album-art" alt="album art" />
      )}
      <div className="sc-player-waveform" role="group" aria-label="soundcloud player">
        {trackInfo && (
          <>
            <span
              className="play-button"
              role="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={() => {
                const widget = window.SC.Widget(id)
                widget.toggle()
              }}
            >
              <FontAwesomeIcon
                className="play-button-icon"
                icon={isPlaying ? faPauseCircle : faPlayCircle}
              />
              <FontAwesomeIcon className="play-button-background" icon={faCircle} />
            </span>
            <span className="sc-stats">
              <span className="sc-stat play-count">
                <FontAwesomeIcon icon={faPlay} size="xs" />
                {trackInfo.playback_count.toLocaleString()}
              </span>
              <span className="sc-stat likes-count">
                <FontAwesomeIcon icon={faHeart} size="xs" />
                {trackInfo.likes_count.toLocaleString()}
              </span>{' '}
              <span className="sc-stat comment-count">
                <FontAwesomeIcon icon={faComment} size="xs" />
                {trackInfo.comment_count.toLocaleString()}
              </span>
            </span>
            <a
              className="sc-external-link"
              href={url}
              target="_blank"
              title={EXTERNAL_LINK_LABEL}
              aria-label={EXTERNAL_LINK_LABEL}
            >
              <FontAwesomeIcon icon={faSoundcloud} />
              <FontAwesomeIcon icon={faExternalLink} />
            </a>
          </>
        )}
        <div
          className={classNames('sc-iframe-wrapper', className, { playing: isPlaying })}
          dangerouslySetInnerHTML={{ __html: dummyElement.outerHTML }}
          ref={wrapperRef}
        />
      </div>
    </div>
  )
}
