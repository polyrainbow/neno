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

  await page.keyboard.type("Note with a file\n");

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

  await page.locator("#button_upload").click();

  await page.getByAltText("Menu").click();
  await page.getByAltText("Files").click();
  await page.getByText("files/test.txt").click();
});

test.describe("File view", () => {
  test("should forward to 'used in' note", async ({ page }) => {
    await page.getByText("Note with a file").click();
    const textInEditor
      = await page.locator("div[data-lexical-editor]").innerText();

    expect(textInEditor.startsWith("Note with a file"))
      .toBe(true);
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

  test("should display text file preview", async ({ page }) => {
    const previewLocator = page.locator(".preview-block-file-text");
    await previewLocator.waitFor();
    const textInEditor
      = await previewLocator.innerText();

    expect(textInEditor)
      .toBe("This is the content\nof the plain text file.");
  });
});
