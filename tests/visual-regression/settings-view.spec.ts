import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/", { "waitUntil": "networkidle" });
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#browser-storage-load-button");
  await page.click("#browser-storage-load-button");
  await page.getByText("No notes found").waitFor();
  await page.getByAltText("No notes found").waitFor();

  await page.getByTitle("Menu").click();
  await page.getByText("Settings").click();
});

test.describe("Settings view", () => {
  test("should look fine - light", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot("settings-view-light.png", {
      maxDiffPixels: 200,
    });
  });
});
