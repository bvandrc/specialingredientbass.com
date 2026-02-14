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
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import type { TrackInfo } from '../api/soundcloudWidget'
import { setSearchParams } from '../utils/api-utils'
import { htmlToElement, triggerClick } from '../utils/html-utils'

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

  useEffect(() => {
    const iframeEl = wrapperRef.current?.firstElementChild
    if (!iframeEl || trackInfo) return
    const widget = window.SC.Widget(id)
    widget.bind(window.SC.Widget.Events.READY, () => {
      widget.getCurrentSound((sound) => setTrackInfo(sound))
    })
    widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
    widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))
    widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false))
  }, [id, trackInfo])

  useEffect(() => {
    onPlayToggle?.(isPlaying)
  }, [isPlaying, onPlayToggle])

  useEffect(() => {
    if (trackInfo?.artwork_url) {
      setAlbumArtUrl?.(trackInfo.artwork_url)
    }
  }, [trackInfo?.artwork_url, setAlbumArtUrl])

  return (
    <div className="sc-player">
      {showAlbumArt && trackInfo?.artwork_url && (
        <img
          src={trackInfo.artwork_url}
          className="album-art"
          alt="album art"
        />
      )}
      {/** biome-ignore lint/a11y/useSemanticElements: is fine as Div */}
      <div
        className="sc-player-waveform"
        role="group"
        aria-label="soundcloud player"
      >
        {trackInfo && (
          <>
            {/** biome-ignore lint/a11y/useSemanticElements: TODO: change to button, fix css for it */}
            <span
              className="absolute top-1 left-0 z-1 cursor-pointer hover:saturate-[160%]"
              role="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              tabIndex={0}
              onClick={() => {
                const widget = window.SC.Widget(id)
                widget.toggle()
              }}
              onKeyDown={triggerClick}
            >
              <Icon
                className="absolute text-[var(--soundcloud)] bg-none text-4xl"
                icon={isPlaying ? faPauseCircle : faPlayCircle}
              />
              <Icon
                className="absolute top-1 left-1 -z-1 text-white bg-none text-3xl"
                icon={faCircle}
              />
            </span>
            <span className="absolute top-3 right-1 z-1 inline-flex items-center gap-1 pointer-events-none">
              <span className="px-1 mb-1 py-0.5 inline-flex gap-2 text-sm text-gray-400 rounded bg-black/60">
                {[
                  { icon: faPlay, count: trackInfo.playback_count },
                  { icon: faHeart, count: trackInfo.likes_count },
                  { icon: faComment, count: trackInfo.comment_count },
                ].map(({ icon, count }) => (
                  <span className="flex items-center gap-1">
                    <Icon icon={icon} size="xs" />
                    {count.toLocaleString()}
                  </span>
                ))}
              </span>
              <a
                className="px-1 py-0.5 inline-flex gap-1 text-[var(--soundcloud)]! font-bold text-base rounded  outline-1 outline-[var(--soundcloud)] pointer-events-auto bg-black/55 brightness-75 saturate-90 hover:filter-none"
                href={url}
                target="_blank"
                title={EXTERNAL_LINK_LABEL}
                aria-label={EXTERNAL_LINK_LABEL}
              >
                <Icon icon={faSoundcloud} />
                <Icon icon={faExternalLink} />
              </a>
            </span>
          </>
        )}
        <div
          className={classNames('sc-iframe-wrapper', className, {
            playing: isPlaying,
          })}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: just do it to set HTML from soundcoud iframe api
          dangerouslySetInnerHTML={{ __html: dummyElement.outerHTML }}
          ref={wrapperRef}
        />
      </div>
    </div>
  )
}
