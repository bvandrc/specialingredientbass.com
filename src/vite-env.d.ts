/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `'true'` only in the deploy workflow's build; gates Google Analytics. */
  readonly VITE_ENABLE_ANALYTICS?: string
}

// @fontsource packages resolve to bare CSS files with no type declarations
declare module '@fontsource/*'
