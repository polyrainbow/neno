/* eslint-disable max-len */
import { test, expect, Page } from "@playwright/test";

// Set default date for all tests.
// See https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
const setDefaultDate = async (page: Page): Promise<void> => {
  // Pick the new/fake "now" for you test pages.
  const fakeNow = new Date("January 02 2030 14:00:00").valueOf();

  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
    // Extend Date constructor to default to fakeNow
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(${fakeNow});
        } else {
          super(...args);
        }
      }
    }
    // Override Date.now() to start from fakeNow
    const __DateNowOffset = ${fakeNow} - Date.now();
    const __DateNow = Date.now;
    Date.now = () => __DateNow() + __DateNowOffset;
  }`);
};

const DEMO_NOTE = `# Welcome to NENO
Paragraph block

> Quote block.
- List item
1. Numbered list item
\`\`\`
code block

\`\`\``;

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("button.memory-storage");
  await page.click("button.memory-storage");
});

test.describe("Editor", () => {
  test("should look fine empty - light", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot("editor-light.png");
  });

  test("should look fine empty - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    expect(await page.screenshot()).toMatchSnapshot("editor-dark.png");
  });

  test("existing notes - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    await page.click("#button_new");
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    expect(await page.screenshot()).toMatchSnapshot("editor-existing-notes-light.png");
  });

  test("existing notes - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    await page.click("#button_new");
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    expect(await page.screenshot()).toMatchSnapshot("editor-existing-notes-dark.png");
  });

  test("search presets - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    await page.click("#button_show-search-presets");
    expect(await page.screenshot()).toMatchSnapshot("search-presets-light.png");
  });

  test("search presets - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.click("#button_show-search-presets");
    expect(await page.screenshot()).toMatchSnapshot("search-presets-dark.png");
  });
});
