declare module 'soundcloud-widget' {
  export type ScWidgetEventKeys =
    | 'LOAD_PROGRESS'
    | 'PLAY_PROGRESS'
    | 'PLAY'
    | 'PAUSE'
    | 'FINISH'
    | 'SEEK'
    | 'READY'
    | 'CLICK_DOWNLOAD'
    | 'CLICK_BUY'
    | 'OPEN_SHARE_PANEL'
    | 'ERROR'

  export interface TrackInfo extends Record<string, unknown> {
    artwork_url: string
    caption: string
    comment_count: number
    description: string
    likes_count: number
    permalink_url: string
    playback_count: number
    reposts_count: number
    waveform_url: string
  }

  export interface WidgetInstance {
    play(): void
    pause(): void
    toggle(): void
    on(eventName: string, listener: () => void): void
    bind(eventName: string, listener: () => void): void
    removeListener(eventName: string): void
    unbind(eventName: string): void
    load(url: string, options?: Record<string, unknown>): Promise<void>
    getCurrentSound(): Promise<TrackInfo>
    getPosition(): Promise<number>
    getVolume(): Promise<number>
  }

  class SoundcloudWidget {
    constructor(el: HTMLIFrameElement | string)
    play(): void
    pause(): void
    toggle(): void
    on(eventName: string, listener: () => void): void
    bind(eventName: string, listener: () => void): void
    removeListener(eventName: string): void
    unbind(eventName: string): void
    load(url: string, options?: Record<string, unknown>): Promise<void>
    getCurrentSound(): Promise<TrackInfo>
    getPosition(): Promise<number>
    getVolume(): Promise<number>
    static events: Record<ScWidgetEventKeys, string>
  }

  export = SoundcloudWidget
}
