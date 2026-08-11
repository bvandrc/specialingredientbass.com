// Relative, not the `@/` alias: vite.config.ts imports this module at
// config-load time, where esbuild bundles it before Vite's resolver runs.
import { makeRequest } from '../utils/api-utils'

const SC_CLIENT_ID = 'DgFeY88vapbGCcK7RrT2E33nmNQVWX82'

/** Height the embed is requested at — the iframe must be sized to match, or the widget lays itself out for a different viewport. */
export const SC_PLAYER_HEIGHT = 166

export interface OEmbed {
  title: string
  thumbnail_url: string
  html: string
  description: string
  author_name: string
  author_url: string
}

/**
 * Pulls the player URL out of an oEmbed `html` snippet, so the browser never
 * has to parse HTML. Throws rather than returning a half-built URL.
 */
export function getIframeSrc(html: string) {
  const src = html.match(/<iframe[^>]*\ssrc="([^"]*)"/)?.[1]
  if (!src) throw new Error(`no iframe src in oEmbed html: ${html}`)
  // `&` is the only entity that can legally appear in a quoted attribute URL
  return src.replaceAll('&amp;', '&')
}

export function getOEmbed(params: {
  url: string
  /** @default 100% */
  maxwidth?: number
  /** @default 166 for tracks, 450 for sets */
  maxheight?: number
  color?: string
  /** @default false */
  auto_play?: boolean
  /** @default true */
  show_comments?: boolean
}) {
  return makeRequest('GET', 'https://soundcloud.com/oembed', {
    client_id: SC_CLIENT_ID,
    ...params,
  }).then((res) => res.json() as Promise<OEmbed>)
}
