import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/", { "waitUntil": "networkidle" });
  await page.waitForSelector("img[alt='NENO logo']");
  await page.getByLabel("Settings", { exact: true }).click();
});

test.describe("Settings view", () => {
  test("should change display language", async ({ page }) => {
    const headerEnglish = page.getByText("Display Language");
    const headerGerman = page.getByText("Anzeigesprache");

    // Make sure, default is English
    await expect(headerEnglish).toBeAttached();
    await expect(headerGerman).not.toBeAttached();

    const select = page.getByRole("combobox");
    await select.selectOption("de-DE");
    await page.getByText("Change").click();

    await expect(headerEnglish).not.toBeAttached();
    await expect(headerGerman).toBeAttached();
  });
});
