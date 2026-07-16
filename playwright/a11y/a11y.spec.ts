import { expect, test } from '@playwright/test'
import { checkA11y } from '../support/accessibility'

// One "workflow" test: the page as loaded (cards open on desktop, collapsed
// on mobile), then with the first grid card toggled — scanned once each.
test('Home page', async ({ page }) => {
  await page.goto('/')

  const firstCardTitle = page.getByRole('button', {
    name: 'Wave / Downtempo / Psydub',
  })

  await test.step('Page', async () => {
    // SoundCloud players render in the mix grid
    await expect(page.getByTestId('soundcloud-player').first()).toBeAttached({
      timeout: 15_000,
    })
    await checkA11y(page)
  })

  await test.step('Toggled grid card', async () => {
    const wasExpanded = await firstCardTitle.getAttribute('aria-expanded')
    await firstCardTitle.click()
    await expect(firstCardTitle).toHaveAttribute(
      'aria-expanded',
      wasExpanded === 'true' ? 'false' : 'true',
    )
    await checkA11y(page)
  })
})
