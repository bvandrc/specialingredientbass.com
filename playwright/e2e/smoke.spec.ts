import { expect, test } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Special Ingredient Bass Mixes')
  await expect(
    page.getByRole('img', { name: 'Special Ingredient Bass Mixes' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Wave / Downtempo / Psydub' }),
  ).toBeVisible()

  // SoundCloud players load in the mix grid
  const players = page.getByTestId('soundcloud-player')
  await expect(players.first()).toBeVisible({ timeout: 15_000 })

  await expect(
    page.getByTestId('soundcloud-player-play-pause-button').first(),
  ).toBeAttached({
    timeout: 15_000,
  })
})
