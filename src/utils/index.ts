import { type ClassValue, clsx } from 'clsx'
import { isFunction } from 'es-toolkit'
import { extendTailwindMerge, validators } from 'tailwind-merge'
import { objectFromEntries } from 'ts-extras'
import type { Primitive } from 'type-fest'

/**
 * Creates a Record mapping each key to the same value.
 *
 * `value` may be a plain primitive, shared safely since primitives have no
 * reference identity. For an object or array value, pass a callback instead
 * — one that builds a fresh value per key — so entries don't all share the
 * same reference; add `as const` to get readonly inference too.
 */
export function createObject<
  const Keys extends readonly string[],
  Value extends Primitive,
>(keys: Keys, value: Value): Record<Keys[number], Value>
export function createObject<const Keys extends readonly string[], Value>(
  keys: Keys,
  genValue: (key: Keys[number]) => Value
): Record<Keys[number], Value>
export function createObject<const Keys extends readonly string[], Value>(
  keys: Keys,
  valueOrGenValue: Value | ((key: Keys[number]) => Value)
) {
  return objectFromEntries(
    // Annotated as a tuple so the entries carry the key type: without it the
    // literal widens to an array and every key comes back as `string`.
    keys.map((key): [Keys[number], Value] => [
      key,
      isFunction(valueOrGenValue) ? valueOrGenValue(key) : valueOrGenValue,
    ])
  )
}

/**
 * The custom utilities from `src/styles/index.css`, each given its own class group.
 *
 * Without one, tailwind-merge reads `text-glow-*` as a text color and
 * `custom-shadow-*` as a box shadow, and silently drops the real
 * `text-<color>`/`shadow-*` class sitting next to it.
 */
const CUSTOM_UTILITIES = [
  'text-glow-heavy',
  'text-glow-med',
  'icon-glow-heavy',
  'custom-shadow',
] as const

const twMerge = extendTailwindMerge<(typeof CUSTOM_UTILITIES)[number]>({
  extend: {
    classGroups: createObject(CUSTOM_UTILITIES, (name) => [
      { [name]: [validators.isArbitraryValue] },
    ]),
  },
})

/** Joins conditional classes, with later Tailwind utilities winning conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
