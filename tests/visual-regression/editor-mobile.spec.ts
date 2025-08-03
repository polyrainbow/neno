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
  await page.goto("/", { "waitUntil": "networkidle" });
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#browser-storage-load-button");
  await page.click("#browser-storage-load-button");

  // wait for editor to be ready
  await page.getByRole("textbox").nth(1).waitFor();
});

test.describe("Editor", () => {
  test("should look fine empty", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 914 });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill(TEST_NOTE);
    expect(await page.screenshot())
      .toMatchSnapshot("editor.png");
  });
});
