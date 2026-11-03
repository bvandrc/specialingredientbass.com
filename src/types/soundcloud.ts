// The one place src/ reaches into build/ (see the `noRestrictedImports`
// override in biome.jsonc). Type-only re-exports, so no build code is bundled.
export type { SoundcloudTrackData } from '../../build/soundcloud-data'
