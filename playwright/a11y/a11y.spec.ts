import { expect, test } from '@playwright/test'
import { SELECTORS } from '../support/constants/selectors'
import { checkA11y } from './accessibility'

// One "workflow" test: the page as loaded (cards open on desktop, collapsed
// on mobile), then with the first grid card toggled — scanned once each.
test('Home page', async ({ page }) => {
  await page.goto('/')

  const firstCardTitle = page.getByRole('button', {
    name: 'Wave / Downtempo / Psydub',
  })

  // initial check
  await checkA11y(page)

  // SoundCloud players render in the mix grid
  await expect(
    page.locator(SELECTORS.SOUNDCLOUD.PLAYER.SELF).first(),
  ).toBeVisible({ timeout: 15_000 })
  await checkA11y(page)

  await expect(
    page.locator(SELECTORS.SOUNDCLOUD.PLAYER.PLAY_PAUSE_BUTTON).first(),
  ).toBeAttached({ timeout: 15_000 })
  await checkA11y(page)

  await test.step('Toggled grid card', async () => {
    const wasExpanded = await firstCardTitle.getAttribute('aria-expanded')
    await firstCardTitle.click()
    await expect(firstCardTitle).toHaveAttribute(
      'aria-expanded',
      wasExpanded === 'true' ? 'false' : 'true',
    )
    // TODO: wait for toggled
    await checkA11y(page)
  })
})
