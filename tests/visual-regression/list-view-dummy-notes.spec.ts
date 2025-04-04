import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 500, height: 1000 });
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#browser-storage-dummy-notes-load-button");
  await page.click("#browser-storage-dummy-notes-load-button");
  await page.click("#button_list");
  await page.getByText("Test note 999").nth(0).waitFor();
  // The svg img might take a moment to load so let's wait for it too.
  await page.locator(".note-list-item-linked-notes-indicator-content img")
    .nth(0)
    .waitFor();
});

test.describe("Editor", () => {
  test("should look fine - light", async ({ page }) => {
    expect(await page.screenshot())
      .toMatchSnapshot(
        "list-view-light.png",
      );
  });

  test("should look fine - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    expect(await page.screenshot())
      .toMatchSnapshot("list-view-dark.png");
  });

  test("FAB should not scroll with list", async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.scrollTop = 1000;
    });
    expect(await page.screenshot())
      .toMatchSnapshot(
        "list-view-scrolled-light.png",
      );
  });
});
