import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 500, height: 1000 });
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#memory-storage-dummy-notes-load-button");
  await page.click("#memory-storage-dummy-notes-load-button");
  await page.click("#button_list");
  await page.getByText("Test note 1").nth(0).waitFor();
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
