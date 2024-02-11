/* eslint-disable max-len */
import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

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
  await page.waitForSelector("#memory-storage-load-button");
  await page.click("#memory-storage-load-button");
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

  test("search results disclaimer - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    await page.keyboard.type("1");
    await page.click("#button_upload");
    await page.click("#button_new");
    await page.keyboard.type("2");
    await page.click("#button_upload");
    await page.locator("#search-input").click();
    await page.keyboard.type("1", { delay: 20 });
    expect(await page.screenshot()).toMatchSnapshot("editor-search-results-disclaimer-light.png");
  });

  test("search results disclaimer - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type("1");
    await page.click("#button_upload");
    await page.click("#button_new");
    await page.keyboard.type("2");
    await page.click("#button_upload");
    await page.locator("#search-input").click();
    await page.keyboard.type("1", { delay: 20 });
    expect(await page.screenshot()).toMatchSnapshot("editor-search-results-disclaimer-dark.png");
  });
});
