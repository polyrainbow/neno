import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/", { "waitUntil": "networkidle" });
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#browser-storage-load-button");
  await page.click("#browser-storage-load-button");
  await page.getByText("No notes found").waitFor();
  await page.getByAltText("No notes found").waitFor();

  await page.keyboard.type("Note with a markdown file\n");

  const markdown = await readFile(
    join(import.meta.dirname, "..", "resources", "markdown-sample.md"),
    "utf8",
  );

  const dataTransfer = await page.evaluateHandle((content) => {
    const dt = new DataTransfer();
    const file = new File([content], "notes.md", { type: "text/markdown" });
    dt.items.add(file);
    return dt;
  }, markdown);

  await page.dispatchEvent("section.note", "drop", { dataTransfer });

  // wait for the rendered markdown to appear so we know the import is done
  await page.locator(".markdown-preview h1").waitFor();
});

test.describe("Markdown file preview", () => {
  test("note preview should look fine - light", async ({ page }) => {
    await expect(page).toHaveScreenshot("markdown-note-preview-light.png");
  });

  test("note preview should look fine - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await expect(page).toHaveScreenshot("markdown-note-preview-dark.png");
  });

  test.describe("file view", () => {
    test.beforeEach(async ({ page }) => {
      await page.locator("#button_save").click();
      await page.getByLabel("Files", { exact: true }).click();
      await page.getByText("notes.md").click();
      await page.locator(".file-container .markdown-preview h1").waitFor();

      // make sure all header icons are loaded for screenshots
      const headerButtonIcons = await page.locator(
        ".header-controls button img",
      ).all();

      for (const icon of headerButtonIcons) {
        await icon.waitFor();
      }
    });

    test("should look fine - light", async ({ page }) => {
      await expect(page).toHaveScreenshot("markdown-file-view-light.png");
    });

    test("should look fine - dark", async ({ page }) => {
      page.emulateMedia({ colorScheme: "dark" });
      await expect(page).toHaveScreenshot("markdown-file-view-dark.png");
    });
  });
});
