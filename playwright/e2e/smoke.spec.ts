import { expect, test } from '@playwright/test'
import { SELECTORS } from '../support/constants'

test('home page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Special Ingredient Bass Mixes')
  await expect(
    page.getByRole('img', { name: 'Special Ingredient Bass Mixes' }),
  ).toBeVisible()
  await expect(
    page.getByTestId(SELECTORS.FIRST_GRID_CARD_TITLE).first(),
  ).toBeVisible()

  // SoundCloud players load in the mix grid
  const players = page.getByTestId(SELECTORS.SOUNDCLOUD_PLAYER)
  await expect(players.first()).toBeVisible({ timeout: 15_000 })

  await expect(
    page.getByTestId(SELECTORS.SOUNDCLOUD_PLAYER_PLAY_PAUSE_BUTTON).first(),
  ).toBeAttached({
    timeout: 15_000,
  })
})
