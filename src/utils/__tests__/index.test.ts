import { cn, createObject } from '../index'

describe('createObject', () => {
  it('maps each key through the generator', () => {
    expect(createObject(['a', 'b'], (key) => key.toUpperCase())).toEqual({
      a: 'A',
      b: 'B',
    })
  })

  it('gives each key its own value rather than one shared object', () => {
    // The reason the doc comment asks for `as const`: a shared object would
    // make a write through one key visible through every other.
    const built = createObject(['a', 'b'], () => ({ hits: 0 }))
    built.a.hits = 1

    expect(built.b.hits).toBe(0)
  })

  it('builds nothing from no keys', () => {
    expect(createObject([], () => 1)).toEqual({})
  })
})

describe('cn', () => {
  it('joins the classes it is given', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('drops the falsy ones a conditional leaves behind', () => {
    // What an unmet `cond && 'class'` and an unset prop each leave behind.
    expect(cn('flex', false, undefined, 'items-center')).toBe(
      'flex items-center'
    )
  })

  it('lets the later of two conflicting utilities win', () => {
    expect(cn('text-2xl', 'text-3xl')).toBe('text-3xl')
  })

  it('keeps a text color beside a text-glow, which is not a color', () => {
    // Without its own class group, tailwind-merge reads `text-glow-*` as a
    // text color and silently drops whichever of the two came first.
    for (const glow of ['text-glow-heavy-[#fff]', 'text-glow-med-[#fff]']) {
      expect(cn('text-white', glow), glow).toBe(`text-white ${glow}`)
    }
  })

  it('keeps a shadow beside a custom-shadow, which is not one', () => {
    expect(cn('shadow-lg', 'custom-shadow-[#fff]')).toBe(
      'shadow-lg custom-shadow-[#fff]'
    )
  })

  it('still lets one custom utility replace another of its own kind', () => {
    expect(cn('text-glow-heavy-[#000]', 'text-glow-heavy-[#fff]')).toBe(
      'text-glow-heavy-[#fff]'
    )
  })

  it('treats the glow weights as separate groups, so both can apply', () => {
    expect(cn('text-glow-heavy-[#000]', 'text-glow-med-[#fff]')).toBe(
      'text-glow-heavy-[#000] text-glow-med-[#fff]'
    )
  })
})
