import { devices, expect, type Locator, test } from '@playwright/test'

import { SELECTORS } from '~/pw/support/constants/selectors'

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
const SCROLL_REGION = SELECTORS.GRID.CARD.SCROLL_REGION

test.describe('grid cards', () => {
  let cardCount: number

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId(CARD_TITLE).first()).toBeVisible()
    cardCount = await page.getByTestId(CARD_TITLE).count()
    expect(cardCount).toBeGreaterThan(1)
  })

  test.describe('desktop', () => {
    test('cards start expanded and toggle independently', async ({ page }) => {
      await expectExpandedStates(
        page.getByTestId(CARD_TITLE),
        Array(cardCount).fill(true)
      )
      await expect(page.getByTestId(MIXES_PROMPT)).toBeHidden()

      await test.step('closing one card leaves the others open', async () => {
        await page.getByTestId(CARD_TITLE).first().click()
        await expectExpandedStates(page.getByTestId(CARD_TITLE), [
          false,
          ...Array(cardCount - 1).fill(true),
        ])
        await expect(page.getByTestId(MIXES_PROMPT)).toBeHidden()
      })

      await test.step('closing all cards reveals the SoundCloud prompt', async () => {
        for (let i = 1; i < cardCount; i++) {
          await page.getByTestId(CARD_TITLE).nth(i).click()
        }
        await expectExpandedStates(
          page.getByTestId(CARD_TITLE),
          Array(cardCount).fill(false)
        )
        await expect(page.getByTestId(MIXES_PROMPT)).toBeVisible()
      })
    })
  })

  test.describe('mobile', () => {
    test.use(PIXEL_7)

    test('cards start collapsed and only one opens at a time', async ({
      page,
    }) => {
      await expectExpandedStates(
        page.getByTestId(CARD_TITLE),
        Array(cardCount).fill(false)
      )
      await expect(page.getByTestId(MIXES_PROMPT)).toBeVisible()

      await test.step('expanding a card hides the SoundCloud prompt', async () => {
        await page.getByTestId(CARD_TITLE).first().click()
        await expectExpandedStates(page.getByTestId(CARD_TITLE), [
          true,
          ...Array(cardCount - 1).fill(false),
        ])
        await expect(page.getByTestId(MIXES_PROMPT)).toBeHidden()
      })

      await test.step('opening another card closes the rest', async () => {
        await page.getByTestId(CARD_TITLE).nth(1).click()
        await expectExpandedStates(page.getByTestId(CARD_TITLE), [
          false,
          true,
          ...Array(cardCount - 2).fill(false),
        ])
      })
    })

    // iOS Safari hands a drag to any `overflow: auto` box, and in an iframe
    // doesn't pass it on, so a card with nothing to scroll mustn't be one.
    test('an expanded card scrolls only while its tracks overflow it', async ({
      page,
    }) => {
      const scrollRegion = page.getByTestId(SCROLL_REGION).first()
      await page.getByTestId(CARD_TITLE).first().click()

      await test.step('a screen too short for the tracks scrolls them', async () => {
        await page.setViewportSize({
          width: PIXEL_7.viewport.width,
          height: 400,
        })
        await expect(scrollRegion).toHaveCSS('overflow-y', 'auto')
        await expect(scrollRegion).toHaveAttribute('tabindex', '0')
      })

      await test.step('a screen they fit on leaves them still', async () => {
        await page.setViewportSize({
          width: PIXEL_7.viewport.width,
          height: 2000,
        })
        await expect(scrollRegion).toHaveCSS('overflow-y', 'hidden')
        await expect(scrollRegion).toHaveAttribute('tabindex', '-1')
      })
    })
  })
})
