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
- **package.json**: Key order is enforced in CI by `bvandrc/lint-package-json`. Adding a field in the wrong place fails the lint job.
- **File naming**: kebab-case for utils (`auth-utils.ts`), PascalCase for component primitives (`DropdownMenu.tsx`), camelCase for hooks (`useSession.tsx`, `useSettings.ts`); use `.tsx` when the file exports JSX.
- **Components**: Arrow-function `const` with a named export; no default exports, unless something requires one (e.g. page components for lazy-loaded routes).
- **Prop types**: Compose from DOM prop types — extend them, or `Pick`/`Omit`
  the parts you need — rather than re-declaring `className`, `type`, `href`,
  etc. Spread the rest onto the element when there are many pass-through props
  (see `CircleLink.tsx`); for one or two, name them explicitly. Type-only
  imports use `import type` — Biome fixes this for you.
- **Variant styling**: Map variants to classes in a module-level constant (`satisfies Record<Variant, string>`) and index into it — not conditionals inside JSX.
- **Conditional classes**: `classNames` from `classnames`. There is no `cn`/`clsx` helper — don't add one.
- **Tailwind sizing**: Use `size-X` Tailwind class, not `w-X h-X`.
- **Theme and custom utilities**: Tailwind v4 with no `tailwind.config.js` —
  the brand colors (`--color-soundcloud`, `--color-instagram`, …) and the
  custom utilities (`text-glow-heavy-*`, `text-glow-med-*`, `custom-shadow-*`)
  live in `src/styles/index.css`. Reuse those rather than writing a one-off
  `text-shadow` or `box-shadow`, and add new tokens to the same file.
- **Constant objects**: UPPER_CASE for names, UPPER_CASE for keys that name entries (namespace/enum-style, e.g. `ROUTES.HOME`, `SELECTORS.TASK_FORM.SUBMIT_BTN`), camelCase for keys that are typed properties of an entry (e.g. `color`, `icon` in `FEATURES`) and for function-valued keys (e.g. `SELECTORS.TASK_CARD.rankFieldBadge(field)`).
- **Comments/JSDoc**: Describe *what* and *why* from the caller's perspective. Don't restate implementation. Keep to 1–2 lines. No hedge prefixes. Don't repeat what the type signature conveys.
- **es-toolkit**: Use `es-toolkit`functions when simpler than using builtin functions-- especially `omit`/`pick`.
- **usehooks-ts**: Keep in mind that we can use this package for hooks.
- **Linting and formatting**: Biome is the linter *and* formatter — no
  eslint/prettier here. Style is single quotes, no semicolons, 2-space indent,
  80 columns; run `pnpm format` after making edits instead of hand-formatting,
  and `pnpm check` (format + both type checks) before every commit — it's what
  CI runs. Notable rules that are errors: `noFloatingPromises`,
  `noImportCycles`, `noShadow`, `noUndeclaredDependencies`, `noTsIgnore` — fix
  the cause, don't suppress. Where a suppression is genuinely warranted,
  `biome-ignore <rule>: <reason>` requires the reason.
- **Test IDs**: Use `data-testid` as the HTML attribute and as the prop name in component interfaces (not `testId`). Define every value in `playwright/support/constants/selectors.ts` before using it in a test: nest by component, build strings with the `testId()` helper (never a hand-written `[data-testid="..."]`), and name a container's own testid `SELF`.
- **Accessible names**: If an `aria-label`'s value would just repeat text already visible in a nearby element (e.g. a row label, column header, or adjacent title), use `aria-labelledby` pointing at that existing element's `id` (add one via React's `useId` if it doesn't have one) instead of duplicating the string. Note: Don't introduce a new `sr-only` element just to make this work — if there's no existing visible text to point to, a plain `aria-label` is fine.
- **Accessibility tests**: axe runs at WCAG 2.1 AA plus best-practice on desktop and mobile, and violations fail CI. Cover each new meaningful UI state with a `checkA11y(page)` scan in `playwright/a11y/`.
- **Security headers**: The `preview.headers` block in `vite.config.ts` is what
  keeps CI's ZAP baseline scan green — GitHub Pages can't set response headers,
  so it has no production effect, but don't drop it.
- **Branch naming**: Name work branches `feat/<slug>`, `fix/<slug>`, or `chore/<slug>`, with a short kebab-case slug describing the change. Never use a `claude/` prefix or a random session suffix. This overrides the branch name a session is assigned by default — if you were given one, rename it before the first push.
- **PR review threads**: Always reply on the thread with what changed (or why it wasn't changed), then mark the thread resolved. Do this for every thread you act on, not just the ones that needed discussion.
