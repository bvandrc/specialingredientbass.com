import { devices, expect, type Locator, test } from '@playwright/test'
import { SELECTORS } from '../support/constants/selectors'

// `defaultBrowserType` is worker-scoped, so Playwright rejects it inside a
// `describe`. The rest of the device profile (viewport, isMobile, …) is fine.
const { defaultBrowserType: _, ...PIXEL_7 } = devices['Pixel 7']

/** Asserts each card's open/closed state, positionally. */
const expectExpandedStates = async (titles: Locator, states: boolean[]) => {
  await expect(titles).toHaveCount(states.length)
  await Promise.all(
    states.map((isOpen, i) =>
      expect(titles.nth(i)).toHaveAttribute('aria-expanded', String(isOpen))
    )
  )
}

const CARD_TITLE = SELECTORS.GRID.CARD.TITLE.SELF
const MIXES_PROMPT = SELECTORS.GRID.SOUNDCLOUD_MIXES_PROMPT

test.describe('grid cards', () => {
  let cardCount: number

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await expect(page.locator(CARD_TITLE).first()).toBeVisible()
    cardCount = await page.locator(CARD_TITLE).count()
    expect(cardCount).toBeGreaterThan(1)
  })

  test.describe('desktop', () => {
    test('cards start expanded and toggle independently', async ({ page }) => {
      await expectExpandedStates(
        page.locator(CARD_TITLE),
        Array(cardCount).fill(true)
      )
      await expect(page.locator(MIXES_PROMPT)).toBeHidden()

      await test.step('closing one card leaves the others open', async () => {
        await page.locator(CARD_TITLE).first().click()
        await expectExpandedStates(page.locator(CARD_TITLE), [
          false,
          ...Array(cardCount - 1).fill(true),
        ])
        await expect(page.locator(MIXES_PROMPT)).toBeHidden()
      })

      await test.step('closing all cards reveals the SoundCloud prompt', async () => {
        for (let i = 1; i < cardCount; i++) {
          await page.locator(CARD_TITLE).nth(i).click()
        }
        await expectExpandedStates(
          page.locator(CARD_TITLE),
          Array(cardCount).fill(false)
        )
        await expect(page.locator(MIXES_PROMPT)).toBeVisible()
      })
    })
  })

  test.describe('mobile', () => {
    test.use(PIXEL_7)

    test('cards start collapsed and only one opens at a time', async ({
      page,
    }) => {
      await expectExpandedStates(
        page.locator(CARD_TITLE),
        Array(cardCount).fill(false)
      )
      await expect(page.locator(MIXES_PROMPT)).toBeVisible()

      await test.step('expanding a card hides the SoundCloud prompt', async () => {
        await page.locator(CARD_TITLE).first().click()
        await expectExpandedStates(page.locator(CARD_TITLE), [
          true,
          ...Array(cardCount - 1).fill(false),
        ])
        await expect(page.locator(MIXES_PROMPT)).toBeHidden()
      })

      await test.step('opening another card closes the rest', async () => {
        await page.locator(CARD_TITLE).nth(1).click()
        await expectExpandedStates(page.locator(CARD_TITLE), [
          false,
          true,
          ...Array(cardCount - 2).fill(false),
        ])
      })
    })
  })
})
