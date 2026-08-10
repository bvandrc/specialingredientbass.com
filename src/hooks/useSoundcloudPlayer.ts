import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TrackInfo } from 'soundcloud-widget'
import SoundcloudWidget from 'soundcloud-widget'

/**
 * Artwork identity: the filename without its size suffix. oEmbed and the widget
 * hand back different crops of the same image, and a track with no art of its
 * own gets an `avatars-…` URL rather than `artworks-…`.
 */
const getArtworkId = (url: string) =>
  url
    .split('?')[0]
    ?.split('/')
    .pop()
    ?.replace(/-[^-]+\.\w+$/, '')

/**
 * Drives one embedded SoundCloud player. Attach `iframeRef` to the iframe;
 * everything the widget knows is returned rather than reported through
 * callbacks, so a parent can render off it directly.
 */
export const useSoundcloudPlayer = ({
  /** Artwork to show until the widget reports different artwork. */
  artworkUrl,
}: {
  artworkUrl: string
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<SoundcloudWidget | null>(null)
  const [trackInfo, setTrackInfo] = useState<TrackInfo>()
  const [isPlaying, setIsPlaying] = useState(false)

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

  // the passed URL is baked at build time and goes stale if the artwork changed
  // since; prefer the widget's, but only when it's actually a different image
  const artworkUrlResolved = useMemo(() => {
    const fromWidget = trackInfo?.artwork_url
    if (!fromWidget || getArtworkId(fromWidget) === getArtworkId(artworkUrl))
      return artworkUrl
    return fromWidget
  }, [artworkUrl, trackInfo?.artwork_url])

  const toggle = useCallback(() => widgetRef.current?.toggle(), [])

  return { iframeRef, trackInfo, isPlaying, artworkUrlResolved, toggle }
}
