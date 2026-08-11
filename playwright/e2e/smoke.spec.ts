import { expect, test } from '@playwright/test'
import { SELECTORS } from '../support/constants/selectors'

test('home page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Special Ingredient Bass Mixes')
  await expect(
    page.getByRole('img', { name: 'Special Ingredient Bass Mixes' })
  ).toBeVisible()
  await expect(
    page.locator(SELECTORS.GRID.CARD.TITLE.SELF).first()
  ).toBeVisible()

  // SoundCloud players load in the mix grid
  const players = page.locator(SELECTORS.SOUNDCLOUD.PLAYER.SELF)
  await expect(players.first()).toBeVisible({ timeout: 15_000 })

  await expect(
    page.locator(SELECTORS.SOUNDCLOUD.PLAYER.PLAY_PAUSE_BUTTON).first()
  ).toBeAttached({ timeout: 15_000 })
})
