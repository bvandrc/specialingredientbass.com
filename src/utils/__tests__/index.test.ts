import { cn } from '../index'

// Only the custom class groups are covered: the rest of `cn` is clsx and
// tailwind-merge with nothing of ours in between.
describe('cn', () => {
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
