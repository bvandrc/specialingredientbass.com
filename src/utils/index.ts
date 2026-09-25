import { type ClassValue, clsx } from 'clsx'
import { isFunction } from 'es-toolkit'
import { extendTailwindMerge, validators } from 'tailwind-merge'
import type { Entries, Primitive } from 'type-fest'

/**
 * `Object.keys`, typed as the keys of what was passed.
 *
 * Narrower than the runtime guarantees: a value can carry keys beyond the ones
 * its type names, which is the cast being made on purpose.
 *
 * Restricted to plain records: an array's `keyof` names its string methods, not
 * the numeric-as-string indices `Object.keys` actually returns, so an array
 * argument is refused rather than mistyped.
 */
export const typedKeys = <T extends Record<PropertyKey, unknown>>(o: T) =>
  Object.keys(o) as (keyof T & string)[]

/**
 * `Object.entries`, typed as the entries of what was passed.
 *
 * Carries the key-to-value correlation that `Object.entries` drops, so
 * destructuring an entry of a union-valued object narrows. Refuses an array
 * argument for the same reason as `typedKeys`.
 */
export const typedEntries = <T extends Record<PropertyKey, unknown>>(o: T) =>
  Object.entries(o) as Entries<T>

/**
 * `Object.fromEntries`, typed as the object those entries build.
 *
 * Only as precise as the entries it is handed, so a `.map` that wants each key
 * paired with its own value type annotates the callback's return as a tuple.
 */
export const typedFromEntries = <
  const EntryList extends readonly (readonly [PropertyKey, unknown])[],
>(
  entries: EntryList
) =>
  Object.fromEntries(entries) as {
    [Entry in EntryList[number] as Entry[0]]: Entry[1]
  }

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
  return typedFromEntries(
    // Annotated as a tuple so the entries carry the key type: without it the
    // literal widens to an array and every key comes back as `string`.
    keys.map((key): [Keys[number], Value] => [
      key,
      isFunction(valueOrGenValue) ? valueOrGenValue(key) : valueOrGenValue,
    ])
  )
}

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

const twMerge = extendTailwindMerge<(typeof CUSTOM_UTILITIES)[number]>({
  extend: {
    classGroups: createObject(CUSTOM_UTILITIES, (name) => [
      { [name]: [validators.isArbitraryValue] },
    ]),
  },
})

/** Joins conditional classes, with later Tailwind utilities winning conflicts. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
