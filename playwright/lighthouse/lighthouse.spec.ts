import { expect } from '@playwright/test'
import { lighthouseTest as test } from './fixtures'

test('Home page', async ({ page, runAudit }) => {
  await page.goto('/')

  await runAudit({ name: 'initial' })

  // SoundCloud players render in the mix grid
  await expect(page.getByTestId('soundcloud-player').first()).toBeAttached({
    timeout: 15_000,
  })

  await runAudit({ name: 'loaded' })
})
