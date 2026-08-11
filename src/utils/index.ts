import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge, validators } from 'tailwind-merge'

type CustomClassGroupId =
  | 'text-glow-heavy'
  | 'text-glow-med'
  | 'icon-glow-heavy'
  | 'custom-shadow'

/**
 * The custom utilities from `src/styles/index.css` need their own class groups:
 * otherwise tailwind-merge reads `text-glow-*` as a text color and
 * `custom-shadow-*` as a box shadow, and silently drops the real
 * `text-<color>`/`shadow-*` class sitting next to it.
 */
const twMerge = extendTailwindMerge<CustomClassGroupId>({
  extend: {
    classGroups: {
      'text-glow-heavy': [{ 'text-glow-heavy': [validators.isArbitraryValue] }],
      'text-glow-med': [{ 'text-glow-med': [validators.isArbitraryValue] }],
      'icon-glow-heavy': [{ 'icon-glow-heavy': [validators.isArbitraryValue] }],
      'custom-shadow': [{ 'custom-shadow': [validators.isArbitraryValue] }],
    },
  },
})

/** Joins conditional classes, with later Tailwind utilities winning conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
