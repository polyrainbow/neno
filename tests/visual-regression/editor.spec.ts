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

const TEST_NOTE = `# Heading
Paragraph block
> quote block
> another quote block
paragraph 1
paragraph 2 with \`inline code\`
# Heading 2
> another quote
paragraph
- list item 1 [[Non-existing wikilink]]
- list item 2 https://example.com
paragraph
\`\`\`
code line 1
code line 2
\`\`\`
paragraph`;

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("button.memory-storage");
  await page.click("button.memory-storage");
  await page.getByText("No notes found").waitFor();
});

test.describe("Editor", () => {
  test("should look fine empty - light", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot("editor-empty-light.png");
  });

  test("should look fine empty - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    expect(await page.screenshot()).toMatchSnapshot("editor-empty-dark.png");
  });

  test("existing notes - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    await page.keyboard.type("Note 1");
    await page.click("#button_upload");
    await page.click("#button_new");
    await page.keyboard.type("Note 2");
    await page.click("#button_upload");
    expect(await page.screenshot()).toMatchSnapshot("editor-existing-notes-light.png");
  });

  test("existing notes - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type("Note 1");
    await page.click("#button_upload");
    await page.click("#button_new");
    await page.keyboard.type("Note 2");
    await page.click("#button_upload");
    expect(await page.screenshot()).toMatchSnapshot("editor-existing-notes-dark.png");
  });

  test("test note - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    await page.keyboard.type(TEST_NOTE);
    expect(await page.screenshot()).toMatchSnapshot("editor-test-note-light.png");
  });

  test("test note - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type(TEST_NOTE);
    expect(await page.screenshot()).toMatchSnapshot("editor-test-note-dark.png");
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
