import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge, validators } from 'tailwind-merge'

/**
 * Creates a Record mapping each key to the same value.
 * Pass `as const` for object values to get readonly inference and
 * avoid accidental shared-mutation bugs.
 */
export const createObject = <const Keys extends readonly string[], Value>(
  keys: Keys,
  genValue: (key: Keys[number]) => Value
) =>
  Object.fromEntries(keys.map((key) => [key, genValue(key)])) as Record<
    Keys[number],
    Value
  >

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
    classGroups: createObject(CUSTOM_UTILITIES, (name) => [
      { [name]: [validators.isArbitraryValue] },
    ]),
  },
})

/** Joins conditional classes, with later Tailwind utilities winning conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
