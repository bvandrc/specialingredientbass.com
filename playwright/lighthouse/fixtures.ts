import { withLighthouse } from 'lighthouse-audit-utils/playwright'

const SKIPPED_AUDITS = [
  // the site's neon palette isn't tuned for WCAG contrast ratios (matches the axe setup)
  'color-contrast',
  // the rest fail only because of the SoundCloud widget iframe (deprecated
  // APIs, third-party cookies, its own 404s) — not ours to fix
  'deprecations',
  'third-party-cookies',
  'inspector-issues',
  'errors-in-console',
]

export const lighthouseTest = withLighthouse({
  basePort: 9222,
  lighthouseArgs: {
    flags: { disableStorageReset: true, output: ['html', 'json'] },
    config: {
      extends: 'lighthouse:default',
      settings: { skipAudits: SKIPPED_AUDITS },
    },
  },
  thresholds: {
    performance: 62, // The SoundCloud widget's scripting dominates Total Blocking Time-- not ours to fix.
    accessibility: 100,
    'best-practices': 100,
    seo: 100,
    'agentic-browsing': 90, // TODO: improve
  },
})
