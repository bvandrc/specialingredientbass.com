## Project

React site for DJ Special Ingredient, deployed to GitHub Pages by
`.github/workflows/deploy.yml`.

- **Stack**: React 18 + Vite + TypeScript, Tailwind v4, Biome, Playwright for
  e2e/a11y/Lighthouse. FontAwesome for icons, `soundcloud-widget` for the
  embedded players, `react-ga4` for analytics.
- **Layout**: `src/` is the app; `playwright/` is all tests, with shared
  helpers and selectors under `playwright/support/`; `spotify-tools/` is a
  separate one-off Vite app, not part of the site build.
- **Base path**: the site is served from the domain root (`CNAME`), so
  `base` is `'/'` and asset paths need no prefix. There is no `site.config.ts`
  indirection here — don't add one unless the site moves to a subpath.
- **Generated data**: `soundcloud-data.json` is rewritten on every Vite start
  and build by `vite.config.ts`, which pulls the SoundCloud URLs out of
  `src/data/grid-card-data.tsx` and calls the oEmbed API.
  `spotify-playlists.json` comes from `pnpm generate-playlist-json`. Don't
  hand-edit either — add the track URL to `grid-card-data.tsx` instead.

## Code conventions

Conventions live outside this file, synced from
https://github.com/bvandrc/bvandrc-conventions — follow all of them:

@conventions/typescript.md — language-level TypeScript/JavaScript rules
@conventions/react.md — component, JSX, and accessibility rules
@conventions/playwright.md — test layout, test IDs, and accessibility scans
@conventions/git.md — branch naming and PR review practice

## Commands

- `pnpm dev` — dev server on port 5000. `pnpm build`, `pnpm preview`. Both dev
  and build call the SoundCloud oEmbed API while loading the Vite config, so
  they need network access.
- `pnpm format` — Biome check/fix. `pnpm check` — the full gate: format plus
  `tsc` for the app and for `playwright/tsconfig.json`. Run before every
  commit; it's what CI runs.
- `pnpm preview:ci` — build and serve on port 4173, which is what the
  Playwright suites expect.
- `pnpm test:e2e`, `pnpm test:a11y`, `pnpm test:lighthouse` — the three
  Playwright projects, all against a running preview server. `pnpm pw:open`
  for the UI runner.
- `pnpm generate-playlist-json` — regenerates `spotify-playlists.json` from the
  Spotify API.

## Conventions

- **Package manager**: pnpm. `npm install` writes a competing `package-lock.json` that CI ignores.
- **Conditional classes**: `cn` from `src/utils/cn.ts` (clsx +
  tailwind-merge). Don't import `clsx` or `classnames` directly.
- **Icons**: FontAwesome — don't swap it for Lucide, Heroicons, or another
  stroke-based set. Three things here depend on it: `free-brands-svg-icons`
  supplies the social row in `Header.tsx` and the SoundCloud link in
  `SoundcloudPlayer.tsx`, and Lucide ships no brand logos at all; the
  play/pause overlay stacks a *filled* `faPlayCircle` over a white `faCircle`
  to punch through the transparent center, which outline icons can't
  reproduce; and icons are sized with `text-4xl`/`text-sm` because FA's SVGs
  are `1em` wide, where Lucide takes a fixed pixel `size` prop. Bundle size
  isn't the trade — the Lighthouse `performance` threshold sits at 62 because
  the SoundCloud widget dominates Total Blocking Time.
- **Theme and custom utilities**: Tailwind v4 with no `tailwind.config.js` —
  the brand colors (`--color-soundcloud`, `--color-instagram`, …) and the
  custom utilities (`text-glow-heavy-*`, `text-glow-med-*`, `custom-shadow-*`)
  live in `src/styles/index.css`. Reuse those rather than writing a one-off
  `text-shadow` or `box-shadow`, and add new tokens to the same file.
- **Security headers**: The `preview.headers` block in `vite.config.ts` is what
  keeps CI's ZAP baseline scan green — GitHub Pages can't set response headers,
  so it has no production effect, but don't drop it.
- **Convention files**: `conventions/` is synced from
  https://github.com/bvandrc/bvandrc-conventions and overwritten on every
  sync. Edit a rule upstream, never in that directory.
