import {
  faSoundcloud,
  type IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
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
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { TrackInfo } from 'soundcloud-widget'
import SoundcloudWidget from 'soundcloud-widget'
import { setSearchParams } from '../utils/api-utils'
import {
  getElementProps,
  htmlToElement,
  triggerClick,
} from '../utils/html-utils'

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

const PlayPauseButton = ({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean
  onClick: React.MouseEventHandler<HTMLSpanElement>
}) => (
  // biome-ignore lint/a11y/useSemanticElements: TODO: change to button, fix css for it
  <span
    data-testid="soundcloud-player-play-pause-button"
    className="absolute top-1 left-0 z-1 cursor-pointer hover:saturate-160"
    role="button"
    aria-label={isPlaying ? 'Pause' : 'Play'}
    tabIndex={0}
    onClick={onClick}
    onKeyDown={triggerClick}
  >
    <Icon
      className="absolute text-soundcloud bg-none text-4xl"
      icon={isPlaying ? faPauseCircle : faPlayCircle}
    />
    <Icon
      className="absolute top-1 left-1 -z-1 text-white bg-none text-3xl"
      icon={faCircle}
    />
  </span>
)

const StatsAndLink = ({
  url,
  trackInfo,
}: {
  url: string
  trackInfo: TrackInfo
}) => (
  <span className="absolute top-2 right-1 z-1 inline-flex items-center gap-1 pointer-events-none">
    <span
      data-testid="soundcloud-player-stats"
      className={classNames(
        'px-1 py-0.5 inline-flex mb-1 gap-2', // position/layout
        'text-sm text-gray-400 rounded bg-black/60', // appearance
      )}
    >
      {(
        [
          { icon: faPlay, key: 'playback_count' },
          { icon: faHeart, key: 'likes_count' },
          { icon: faComment, key: 'comment_count' },
        ] as const satisfies {
          icon: IconDefinition
          key: keyof TrackInfo
        }[]
      ).map(({ icon, key }) => (
        <span className="flex items-center gap-1" key={key}>
          <Icon icon={icon} size="xs" />
          {trackInfo[key].toLocaleString()}
        </span>
      ))}
    </span>
    <a
      data-testid="soundcloud-player-sc-link"
      className={classNames(
        'px-1 py-0.5 inline-flex gap-1', // position/layout
        'text-soundcloud! font-bold text-base rounded outline-1 outline-soundcloud pointer-events-auto bg-black/55 brightness-85 saturate-95 hover:filter-none', // appearance
      )}
      href={url}
      target="_blank"
      title={EXTERNAL_LINK_LABEL}
      aria-label={EXTERNAL_LINK_LABEL}
    >
      <Icon icon={faSoundcloud} />
      <Icon icon={faExternalLink} />
    </a>
  </span>
)

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
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [trackInfo, setTrackInfo] = useState<TrackInfo>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [iframeProps, iframeUrl] = useMemo(() => {
    // Parse the embed HTML to extract all iframe attributes
    const iframeElTemp = htmlToElement(html) as HTMLIFrameElement
    const iframeProps_ = getElementProps(iframeElTemp)
    const iframeUrl_ = new URL(iframeElTemp.src)
    setSearchParams(iframeUrl_, {
      auto_play: false,
      hide_related: true,
      show_comments: true,
      show_user: false,
      show_reposts: true,
      show_teaser: false,
      visual: false, // true = artwork behind waveform, false = artwork to left
      show_artwork: false,
    })
    return [iframeProps_, iframeUrl_]
  }, [html])

  useEffect(() => {
    if (!iframeRef.current || trackInfo) return
    const widget = new SoundcloudWidget(id)
    widget.on(SoundcloudWidget.events.READY, () => {
      widget.getCurrentSound().then((sound) => setTrackInfo(sound))
    })
    widget.on(SoundcloudWidget.events.PLAY, () => setIsPlaying(true))
    widget.on(SoundcloudWidget.events.PAUSE, () => setIsPlaying(false))
    widget.on(SoundcloudWidget.events.FINISH, () => setIsPlaying(false))
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
    <div data-testid="soundcloud-player" className="flex gap-2">
      {showAlbumArt && trackInfo?.artwork_url && (
        <img
          src={trackInfo.artwork_url}
          className="mb-1 rounded-xl h-20"
          alt="album art"
        />
      )}
      {/** biome-ignore lint/a11y/useSemanticElements: is fine as Div */}
      <div
        className="relative flex items-center w-full"
        role="group"
        aria-label="soundcloud player"
      >
        {trackInfo && (
          <>
            <PlayPauseButton
              isPlaying={isPlaying}
              onClick={() => {
                const widget = new SoundcloudWidget(id)
                widget.toggle()
              }}
            />
            <StatsAndLink url={url} trackInfo={trackInfo} />
          </>
        )}
        <div
          className={classNames(
            'relative w-full rounded-2xl',
            'h-20 overflow-hidden', // Hide bottom of iframe , hide excess iframe
            className,
            // NOTE: increase h on hover or playing to slide up if can't see comments
          )}
        >
          <iframe
            {...iframeProps}
            ref={iframeRef}
            id={id}
            title={title}
            src={iframeUrl.href}
            allow="autoplay"
            className={classNames(
              'relative -top-[60px] -left-px w-[calc(100%+2px)]', // hide top of iframe, hide 1 px left because is not black, hide eight px because is not black
              'invert hue-rotate-180', // invert colors to be white-on-black
              className,
            )}
          />
        </div>
      </div>
    </div>
  )
}
