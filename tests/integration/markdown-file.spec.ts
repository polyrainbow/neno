import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

const MARKDOWN_FILE_CONTENT = `# Heading

Some **bold** text and a [link](https://example.com).

- item one
- item two
`;

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/", { "waitUntil": "networkidle" });
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#browser-storage-load-button");
  await page.click("#browser-storage-load-button");
  await page.getByText("No notes found").waitFor();
  await page.getByAltText("No notes found").waitFor();

  const editor = page.locator("div[data-lexical-editor]");
  await editor.fill("Note with a markdown file\n");

  const dataTransfer = await page.evaluateHandle((content) => {
    const dt = new DataTransfer();
    const file = new File([content], "test.md", { type: "text/markdown" });
    dt.items.add(file);
    return dt;
  }, MARKDOWN_FILE_CONTENT);

  await page.dispatchEvent("section.note", "drop", { dataTransfer });

  // wait for transclusion to appear so we are sure that the import is finished
  await page.getByText("/files/test.md").nth(0).waitFor();
});

test.describe("Markdown file preview", () => {
  test("should render markdown in the note preview", async ({ page }) => {
    const previewLocator = page.locator(".markdown-preview");
    await previewLocator.waitFor();

    await expect(previewLocator.locator("h1")).toHaveText("Heading");
    await expect(previewLocator.locator("strong")).toHaveText("bold");
    await expect(previewLocator.locator("a")).toHaveAttribute(
      "href",
      "https://example.com",
    );
    await expect(previewLocator.locator("li")).toHaveCount(2);
    await expect(page.locator(".preview-block-file-text")).toHaveCount(0);
  });

  test("should render markdown in the file view", async ({ page }) => {
    await page.locator("#button_save").click();
    await page.getByLabel("No unsaved changes").waitFor();
    await page.getByLabel("Files", { exact: true }).click();
    await page.locator(".files-view-preview-box").nth(0).waitFor();
    await page.getByText("files/test.md").click();
    await page.locator("h1", { hasText: "files/test.md" }).waitFor();

    const previewLocator = page.locator(".file-container .markdown-preview");
    await previewLocator.waitFor();

    await expect(previewLocator.locator("h1")).toHaveText("Heading");
    await expect(previewLocator.locator("li")).toHaveCount(2);
  });
});
