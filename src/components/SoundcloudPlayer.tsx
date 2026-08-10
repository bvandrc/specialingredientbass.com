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
import { SC_PLAYER_HEIGHT } from '../api/soundcloud'
import { setSearchParams } from '../utils/api-utils'

export interface SoundcloudPlayerProps {
  url: string
  iframeSrc: string
  title: string
  className?: string
  onPlayToggle?: (isPlaying: boolean) => void
  /** Renders artwork beside the player when set. */
  albumArtUrl?: string
}

const EXTERNAL_LINK_LABEL = 'This track on SoundCloud.com (new tab)'

// Tuned against the crop below — the widget's own layout has to match what the
// container reveals, so these belong to the player rather than to its callers.
const WIDGET_PARAMS = {
  auto_play: false,
  hide_related: true,
  show_comments: true,
  show_user: false,
  show_reposts: true,
  show_teaser: false,
  visual: false, // true = artwork behind waveform, false = artwork to left
  show_artwork: false,
} as const

const PlayPauseButton = ({
  isPlaying,
  onClick,
}: {
  isPlaying: boolean
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) => (
  <button
    type="button"
    data-testid="soundcloud-player-play-pause-button"
    className="absolute top-1 left-0 z-1 cursor-pointer hover:saturate-160"
    aria-label={isPlaying ? 'Pause' : 'Play'}
    onClick={onClick}
  >
    <Icon
      className="absolute text-soundcloud bg-none text-4xl"
      icon={isPlaying ? faPauseCircle : faPlayCircle}
    />
    <Icon
      className="absolute top-1 left-1 -z-1 text-white bg-none text-3xl"
      icon={faCircle}
    />
  </button>
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
      rel="noopener"
    >
      <Icon icon={faSoundcloud} />
      <Icon icon={faExternalLink} />
    </a>
  </span>
)

export const SoundcloudPlayer = ({
  url,
  iframeSrc,
  title,
  className,
  onPlayToggle,
  albumArtUrl,
}: SoundcloudPlayerProps) => {
  const id = useId()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<SoundcloudWidget | null>(null)
  const [trackInfo, setTrackInfo] = useState<TrackInfo>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const iframeUrl = useMemo(() => {
    const iframeUrl_ = new URL(iframeSrc)
    setSearchParams(iframeUrl_, WIDGET_PARAMS)
    return iframeUrl_
  }, [iframeSrc])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const widget = new SoundcloudWidget(iframe)
    widgetRef.current = widget
    widget.on(SoundcloudWidget.events.READY, () => {
      widget.getCurrentSound().then((sound) => setTrackInfo(sound))
    })
    widget.on(SoundcloudWidget.events.PLAY, () => setIsPlaying(true))
    widget.on(SoundcloudWidget.events.PAUSE, () => setIsPlaying(false))
    widget.on(SoundcloudWidget.events.FINISH, () => setIsPlaying(false))

    // No unbind on cleanup: the widget talks to the iframe's contentWindow,
    // which is gone by then (it throws). The listeners die with the iframe.
    return () => {
      widgetRef.current = null
    }
  }, [])

  useEffect(() => {
    onPlayToggle?.(isPlaying)
  }, [isPlaying, onPlayToggle])

  return (
    <div
      data-testid="soundcloud-player"
      className="flex gap-2"
      data-loaded={!!trackInfo}
    >
      {albumArtUrl && (
        <img
          src={albumArtUrl}
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
              onClick={() => widgetRef.current?.toggle()}
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
            ref={iframeRef}
            id={id}
            title={title}
            src={iframeUrl.href}
            height={SC_PLAYER_HEIGHT}
            scrolling="no"
            allow="autoplay; encrypted-media"
            className={classNames(
              'relative -top-15 -left-px w-[calc(100%+2px)]', // hide top of iframe, hide 1 px left because is not black, hide eight px because is not black
              'invert hue-rotate-180', // invert colors to be white-on-black
              className,
            )}
          />
        </div>
      </div>
    </div>
  )
}
