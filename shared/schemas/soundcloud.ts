import { z } from 'zod'

// Only the fields the build reads, so a change to one it ignores can't fail the
// build. The description is optional text on the page, so it may be absent.
export const oEmbedSchema = z.object({
  title: z.string(),
  thumbnail_url: z.url(),
  html: z.string(),
  description: z.string().nullish(),
})

/** A track as the build writes it to `soundcloud-data.json`, which the site renders from. */
export const soundcloudTrackDataSchema = oEmbedSchema
  .pick({ title: true, thumbnail_url: true, description: true })
  .extend({
    /** The track's page, as `grid-card-data.tsx` spells it: what the site looks a track up by. */
    originalUrl: z.url(),
    iframeSrc: z.url(),
  })

export type SoundcloudTrackData = z.infer<typeof soundcloudTrackDataSchema>
