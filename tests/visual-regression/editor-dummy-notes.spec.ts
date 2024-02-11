/* eslint-disable max-len */
import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#memory-storage-dummy-notes-load-button");
  await page.click("#memory-storage-dummy-notes-load-button");
  await page.getByText("Test note 1").nth(0).waitFor();
});

test.describe("Editor", () => {
  test("should look fine empty - light", async ({ page }) => {
    await page.locator("#search-input").click();
    await page.keyboard.type("1", { delay: 20 });
    expect(await page.screenshot()).toMatchSnapshot("editor-dummy-notes-pagination-search-results-light.png");
  });

  test("should look fine empty - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.locator("#search-input").click();
    await page.keyboard.type("1", { delay: 20 });
    expect(await page.screenshot()).toMatchSnapshot("editor-dummy-notes-pagination-search-results-dark.png");
  });
});
