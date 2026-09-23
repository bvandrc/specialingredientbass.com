import { act, render, waitFor } from '@testing-library/react'

import { useSoundcloudPlayer } from '../useSoundcloudPlayer'

/** Hoisted with the mock factory, which runs before the module body. */
const { EVENTS, handlers, widget } = vi.hoisted(() => ({
  EVENTS: { READY: 'ready', PLAY: 'play', PAUSE: 'pause', FINISH: 'finish' },
  /** The handlers the hook bound, so a case can fire the widget's events. */
  handlers: new Map<string, () => void>(),
  widget: { currentSound: {} as { artwork_url?: string }, toggle: vi.fn() },
}))

vi.mock('soundcloud-widget', () => {
  class SoundcloudWidget {
    static events = EVENTS
    on(event: string, handler: () => void) {
      handlers.set(event, handler)
    }
    getCurrentSound() {
      return Promise.resolve(widget.currentSound)
    }
    toggle = widget.toggle
  }
  return { default: SoundcloudWidget }
})

/**
 * Renders the hook with its ref on a real iframe.
 *
 * Through a component rather than `renderHook`, because the widget is created
 * in an effect that reads the ref — which is only attached by a render.
 */
let player: ReturnType<typeof useSoundcloudPlayer>

const Player = ({ artworkUrl }: { artworkUrl: string }) => {
  player = useSoundcloudPlayer({ artworkUrl })
  return <iframe title="SoundCloud" ref={player.iframeRef} />
}

const renderPlayer = (artworkUrl: string) =>
  render(<Player artworkUrl={artworkUrl} />)

/** Fires the widget's ready event and lets its `getCurrentSound` settle. */
const ready = async () => {
  await act(async () => {
    handlers.get(EVENTS.READY)?.()
    await Promise.resolve()
  })
}

const BAKED_ARTWORK = 'https://i1.sndcdn.com/artworks-abc123-0-t500x500.jpg'

describe('useSoundcloudPlayer', () => {
  beforeEach(() => {
    handlers.clear()
    widget.currentSound = {}
  })

  it('starts paused, before the widget has said anything', () => {
    renderPlayer(BAKED_ARTWORK)

    expect(player.isPlaying).toBe(false)
  })

  it('follows the widget in and out of playback', () => {
    renderPlayer(BAKED_ARTWORK)

    for (const [event, playing] of [
      [EVENTS.PLAY, true],
      [EVENTS.PAUSE, false],
      [EVENTS.PLAY, true],
      // A finished track leaves the button showing play again.
      [EVENTS.FINISH, false],
    ] as const) {
      act(() => {
        handlers.get(event)?.()
      })

      expect(player.isPlaying, event).toBe(playing)
    }
  })

  it('keeps the baked URL when it is the same image at another crop', async () => {
    // oEmbed and the widget hand back different crops of one artwork; swapping
    // to the widget's would reload an image the browser already has.
    widget.currentSound = {
      artwork_url: 'https://i1.sndcdn.com/artworks-abc123-0-t67x67.jpg',
    }
    renderPlayer(BAKED_ARTWORK)

    await ready()

    expect(player.artworkUrlResolved).toBe(BAKED_ARTWORK)
  })

  it("prefers the widget's artwork once it is a different image", async () => {
    // The baked URL goes stale when the track's art changes after a build.
    const fresh = 'https://i1.sndcdn.com/artworks-zzz999-0-t500x500.jpg'
    widget.currentSound = { artwork_url: fresh }
    renderPlayer(BAKED_ARTWORK)

    await ready()

    await waitFor(() => expect(player.artworkUrlResolved).toBe(fresh))
  })

  it('takes an avatar over the baked artwork, which a track without art gets', async () => {
    const avatar = 'https://i1.sndcdn.com/avatars-abc123-0-t500x500.jpg'
    widget.currentSound = { artwork_url: avatar }
    renderPlayer(BAKED_ARTWORK)

    await ready()

    await waitFor(() => expect(player.artworkUrlResolved).toBe(avatar))
  })

  it('keeps the baked URL when the widget offers none', async () => {
    renderPlayer(BAKED_ARTWORK)

    await ready()

    expect(player.artworkUrlResolved).toBe(BAKED_ARTWORK)
  })

  it('reports the track the widget is on', async () => {
    widget.currentSound = { artwork_url: BAKED_ARTWORK }
    renderPlayer(BAKED_ARTWORK)

    await ready()

    await waitFor(() =>
      expect(player.trackInfo).toEqual({ artwork_url: BAKED_ARTWORK })
    )
  })

  it('toggles through the widget rather than tracking play state itself', () => {
    renderPlayer(BAKED_ARTWORK)

    player.togglePlayPause()

    expect(widget.toggle).toHaveBeenCalledOnce()
  })
})
