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

  const editor = page.locator("div[data-lexical-editor]");
  await editor.fill("Note with a file\n");

  const dataTransfer1 = await page.evaluateHandle(() => {
    const dt = new DataTransfer();
    const file = new File(
      ["This is the content\nof the plain text file."],
      "test.txt",
      { type: "text/plain" },
    );
    dt.items.add(file);
    return dt;
  });

  await page.dispatchEvent("section.note", "drop", {
    dataTransfer: dataTransfer1,
  });

  const dataTransfer2 = await page.evaluateHandle(() => {
    const dt = new DataTransfer();
    const file = new File(
      ["This is the content\nof the second plain text file."],
      "test-2.txt",
      { type: "text/plain" },
    );
    dt.items.add(file);
    return dt;
  });

  await page.dispatchEvent("section.note", "drop", {
    dataTransfer: dataTransfer2,
  });

  await page.locator("#button_save").click();
  await page.getByLabel("No unsaved changes").waitFor();
  await page.getByLabel("Files", { exact: true }).click();
  await page.locator(".files-view-preview-box").nth(0).waitFor();
  await page.getByText("files/test.txt").click();
  await page.locator("h1", { hasText: "files/test.txt" }).waitFor();
});

test.describe("File view", () => {
  test("should forward to 'used in' note", async ({ page }) => {
    await page.getByText("Note with a file").click();
    const firstParagraphInEditor = await page.locator(
      "div[data-lexical-editor] > .editor-paragraph",
    ).nth(0);
    await expect(firstParagraphInEditor).toHaveText("Note with a file");
  });

  test("should create new note with file as reference", async ({ page }) => {
    await page.getByText("Create note with file").click();
    const textInEditor
      = await page.locator("div[data-lexical-editor]").innerText();

    expect(textInEditor.startsWith("/files/test.txt"))
      .toBe(true);
  });

  test("should rename file correctly", async ({ page }) => {
    const textbox = page.getByRole("textbox");
    await textbox.click();
    await textbox.clear();
    await page.keyboard.type("new-name");
    const button = page.getByRole("button", { name: "Rename" });
    await button.click();
    // button is disabled again only after action is finished, so let's wait
    await expect(button).toBeDisabled();
    const newSlug = await page.locator("h1").innerText();
    expect(newSlug).toBe("new-name.txt");
  });

  test(
    "should show an error if file slug is renamed to existing",
    async ({ page }) => {
      const textbox = page.getByRole("textbox");
      await textbox.click();
      await textbox.clear();
      await page.keyboard.type("files/test-2");
      const button = page.getByRole("button", { name: "Rename" });
      await button.click();
      const errorLocator = await page.getByText(
        "This slug does already exist. Please choose another",
      );
      await expect(errorLocator).toBeAttached();

      await textbox.click();
      await textbox.clear();
      await expect(errorLocator).not.toBeAttached();
    },
  );

  test("should display text file preview", async ({ page }) => {
    const previewLocator = page.locator(".preview-block-file-text");
    await previewLocator.waitFor();
    const textInEditor
      = await previewLocator.innerText();

    expect(textInEditor)
      .toBe("This is the content\nof the plain text file.");
  });

  test("should have slug as document title", async ({ page }) => {
    await expect(page).toHaveTitle("files/test.txt");
  });
});
