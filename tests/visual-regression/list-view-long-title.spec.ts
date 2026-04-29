import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

// A title long enough to exceed --max-content-width (75rem = 1200px) so the
// regression (long titles squeezing the indicator) is reliably triggered.
const TITLE_FRAGMENT
  = "ThisIsAVeryLongUnbreakableNoteTitle"
  + "ThatShouldNotPushTheLinkedNotesIndicator"
  + "FurtherToTheRightOrShrinkIt"
  + "InAnyWayBecauseTheIndicatorMustAlwaysHaveConstantWidth";
const LONG_TITLE = TITLE_FRAGMENT + TITLE_FRAGMENT;

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page);
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#browser-storage-load-button");
  await page.click("#browser-storage-load-button");
  const editor = page.locator("div[data-lexical-editor]");
  await expect(editor).toBeFocused();
  await editor.fill(LONG_TITLE);
  await page.click("#button_save");
  await page.getByLabel("No unsaved changes").waitFor();
  await page.locator(".note-list-item").first().waitFor();
  await page.locator(".note-list-item-linked-notes-indicator-content img")
    .first()
    .waitFor();
});

test.describe("List view with long note title", () => {
  test(
    "linked notes indicator keeps constant width - light",
    async ({ page }) => {
      await expect(page).toHaveScreenshot("list-view-long-title-light.png");
    },
  );

  test(
    "linked notes indicator keeps constant width - structural",
    async ({ page }) => {
      const indicator = page.locator(".note-list-item-linked-notes-indicator")
        .first();
      const indicatorBox = await indicator.boundingBox();
      expect(indicatorBox).not.toBeNull();
      // 1.875rem content + 2 * 0.313rem padding = 2.501rem ≈ 40px at 16px root
      expect(indicatorBox!.width).toBeGreaterThanOrEqual(39);
      expect(indicatorBox!.width).toBeLessThanOrEqual(41);

      const item = page.locator(".note-list-item").first();
      const itemBox = await item.boundingBox();
      expect(itemBox).not.toBeNull();
      // Indicator must sit flush against the right edge of the item.
      expect(indicatorBox!.x + indicatorBox!.width)
        .toBeCloseTo(itemBox!.x + itemBox!.width, 0);
    },
  );
});
