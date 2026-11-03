// The one module in build/ that src/ may import (see `noRestrictedImports` in
// biome.jsonc). It holds only types, so no build-time code reaches the bundle.
export type { SoundcloudTrackData } from './soundcloud-data'
