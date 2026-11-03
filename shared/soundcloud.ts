// Shared by src/ and build/: a value here may reach the bundle, so it holds
// nothing build-only.

/** Height the embed is requested at — the iframe must be sized to match, or the widget lays itself out for a different viewport. */
export const SC_PLAYER_HEIGHT = 166

/** A track as `soundcloud-data.json` holds it, which the site renders from. */
export interface SoundcloudTrackData {
  /** The track's page, as `grid-card-data.tsx` spells it: what the site looks a track up by. */
  originalUrl: string
  iframeSrc: string
  title: string
  description: string
  thumbnail_url: string
}
