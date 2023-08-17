import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Login", () => {
  test("should look fine - light", async ({ page }) => {
    await page.waitForSelector("img[alt='NENO logo']");
    expect(await page.screenshot()).toMatchSnapshot("login-light.png", {
      maxDiffPixels: 200,
    });
  });

  test("should look fine - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.waitForSelector("img[alt='NENO logo']");
    expect(await page.screenshot()).toMatchSnapshot("login-dark.png", {
      maxDiffPixels: 200,
    });
  });
});
