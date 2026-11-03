import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // The app's own `@/*` and `~/shared/*` aliases, which vite.config.ts sets
    // for the build.
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '~/shared': resolve(import.meta.dirname, 'shared'),
    },
  },
  test: {
    // A spy declared once for a `describe` starts each case empty, so a
    // `toHaveBeenCalledWith` cannot pass on a call from the case before it.
    clearMocks: true,
    globals: true,
    watch: false,
    root: '.',
    include: ['./{src,build}/**/*.{test,spec}.*'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/playwright/**',
      '**/spotify-tools/**',
    ],
  },
})
