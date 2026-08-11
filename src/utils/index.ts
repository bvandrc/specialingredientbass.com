import { type ClassValue, clsx } from 'clsx'
import { identity, keyBy, mapValues } from 'es-toolkit'
import { extendTailwindMerge, validators } from 'tailwind-merge'

/**
 * The custom utilities from `src/styles/index.css` need their own class groups:
 * otherwise tailwind-merge reads `text-glow-*` as a text color and
 * `custom-shadow-*` as a box shadow, and silently drops the real
 * `text-<color>`/`shadow-*` class sitting next to it.
 */
const CUSTOM_UTILITIES = [
  'text-glow-heavy',
  'text-glow-med',
  'icon-glow-heavy',
  'custom-shadow',
] as const

type CustomClassGroupId = (typeof CUSTOM_UTILITIES)[number]

const twMerge = extendTailwindMerge<CustomClassGroupId>({
  extend: {
    classGroups: mapValues(keyBy(CUSTOM_UTILITIES, identity), (name) => [
      { [name]: [validators.isArbitraryValue] },
    ]),
  },
})

/** Joins conditional classes, with later Tailwind utilities winning conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
