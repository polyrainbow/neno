import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
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
  await page.getByText("No notes found").waitFor();
  await page.getByAltText("No notes found").waitFor();

  // wait for header stats images to load
  await page.getByLabel("Number of notes").locator("img").waitFor();
  await page.getByLabel("Number of links").locator("img").waitFor();
  await page.getByLabel("Unlinked notes").locator("img").waitFor();
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
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill("Note 1");
    await page.click("#button_save");
    await page.click("#button_new");
    await expect(editor).toBeFocused();
    await editor.fill("Note 2");
    await page.click("#button_save");
    const noteListItems = page.locator(".note-list-item");
    await expect(noteListItems).toHaveCount(2);
    expect(await page.screenshot())
      .toMatchSnapshot("editor-existing-notes-light.png");
  });

  test("existing notes - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill("Note 1");
    await page.click("#button_save");
    await page.click("#button_new");
    await expect(editor).toBeFocused();
    await editor.fill("Note 2");
    await page.click("#button_save");
    const noteListItems = page.locator(".note-list-item");
    await expect(noteListItems).toHaveCount(2);
    expect(await page.screenshot())
      .toMatchSnapshot("editor-existing-notes-dark.png");
  });

  test("test note - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill(TEST_NOTE);
    expect(await page.screenshot())
      .toMatchSnapshot("editor-test-note-light.png");
  });

  test("test note - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill(TEST_NOTE);
    expect(await page.screenshot())
      .toMatchSnapshot("editor-test-note-dark.png");
  });

  test("test note - print", async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await page.emulateMedia({ media: "print" });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill(TEST_NOTE);
    expect(await page.screenshot())
      .toMatchSnapshot("editor-test-note-print.png");
  });

  test("search presets - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    await page.click("#button_show-search-presets");
    await page.waitForFunction(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot("search-presets-light.png");
  });

  test("search presets - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.click("#button_show-search-presets");
    await page.waitForFunction(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot("search-presets-dark.png");
  });

  test("search results disclaimer - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill("1");
    await page.click("#button_save");
    await page.click("#button_new");
    await expect(editor).toBeFocused();
    await editor.fill("2");
    await page.click("#button_save");
    const searchInput = page.locator("#search-input");
    await searchInput.click();
    await searchInput.fill("1");
    expect(await page.screenshot())
      .toMatchSnapshot("editor-search-results-disclaimer-light.png");
  });

  test("search results disclaimer - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    const editor = page.locator("div[data-lexical-editor]");
    await expect(editor).toBeFocused();
    await editor.fill("1");
    await page.click("#button_save");
    await page.click("#button_new");
    await expect(editor).toBeFocused();
    await editor.fill("2");
    await page.click("#button_save");
    const searchInput = page.locator("#search-input");
    await searchInput.click();
    await searchInput.fill("1");
    expect(await page.screenshot())
      .toMatchSnapshot("editor-search-results-disclaimer-dark.png");
  });

  test("note with image - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });

    const buffer = await readFile(
      join(import.meta.dirname, "..", "resources", "beach.jpg"),
    );

    const dataTransfer = await page.evaluateHandle((dataBase64) => {
      // @ts-ignore string is ArrayLike<string>
      const data = Uint8Array.from(
        atob(dataBase64),
        (m) => m.codePointAt(0),
      );
      const dt = new DataTransfer();
      const file = new File([data], "beach.jpg", { type: "image/jpg" });
      dt.items.add(file);
      return dt;
    }, buffer.toString("base64"));

    await page.dispatchEvent("section.note", "drop", { dataTransfer });
    await page.click("#button_save");
    await page.locator(".preview-block-image-wrapper img").waitFor();
    expect(await page.locator(".note").screenshot())
      .toMatchSnapshot("editor-note-with-image-light.png");
  });

  test("note with image - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });

    const buffer = await readFile(
      join(import.meta.dirname, "..", "resources", "beach.jpg"),
    );

    const dataTransfer = await page.evaluateHandle((dataBase64) => {
      // https://stackoverflow.com/a/77532367/3890888
      // @ts-ignore string is ArrayLike<string>
      const data = Uint8Array.from(
        atob(dataBase64),
        (m) => m.codePointAt(0),
      );
      const dt = new DataTransfer();
      const file = new File([data], "beach.jpg", { type: "image/jpg" });
      dt.items.add(file);
      return dt;
    }, buffer.toString("base64"));

    await page.dispatchEvent("section.note", "drop", { dataTransfer });
    await page.click("#button_save");
    await page.locator(".preview-block-image-wrapper img").waitFor();
    expect(await page.locator(".note").screenshot())
      .toMatchSnapshot("editor-note-with-image-dark.png");
  });

  test("note with plain text file - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });

    const buffer = await readFile(
      join(import.meta.dirname, "..", "resources", "beach.jpg"),
    );

    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      const file = new File(
        ["This is the content\nof the plain text file."],
        "test.txt",
        { type: "text/plain" },
      );
      dt.items.add(file);
      return dt;
    }, buffer);

    await page.dispatchEvent("section.note", "drop", { dataTransfer });
    await page.click("#button_save");
    expect(await page.locator(".note").screenshot())
      .toMatchSnapshot("editor-note-with-plain-text-file-light.png");
  });

  test("note with plain text file - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });

    const buffer = await readFile(
      join(import.meta.dirname, "..", "resources", "beach.jpg"),
    );

    const dataTransfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      const file = new File(
        ["This is the content\nof the plain text file."],
        "test.txt",
        { type: "text/plain" },
      );
      dt.items.add(file);
      return dt;
    }, buffer);

    await page.dispatchEvent("section.note", "drop", { dataTransfer });
    await page.click("#button_save");
    expect(await page.locator(".note").screenshot())
      .toMatchSnapshot("editor-note-with-plain-text-file-dark.png");
  });

  test("note stats with files - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });

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
        ["This is the content\nof the plain text file."],
        "test.txt",
        { type: "text/plain" },
      );
      dt.items.add(file);
      return dt;
    });

    await page.dispatchEvent("section.note", "drop", {
      dataTransfer: dataTransfer2,
    });

    await page.click("#button_save");

    await page.getByRole("link", { name: "/files/test.txt" })
      .locator("span")
      .waitFor();

    await page.evaluate(() => {
      const note = document.querySelector(".note")!;
      note.scrollTo(0, note.scrollHeight);
    });
    expect(await page.locator(".note").screenshot())
      .toMatchSnapshot("editor-note-stats-with-files-light.png");
  });

  test("modal - light", async ({ page }) => {
    page.emulateMedia({ colorScheme: "light" });

    page.keyboard.type(" ");
    await page.click("#button_new");

    expect(await page.screenshot())
      .toMatchSnapshot("editor-modal-light.png");
  });

  test("modal - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });

    page.keyboard.type(" ");
    await page.click("#button_new");

    expect(await page.screenshot())
      .toMatchSnapshot("editor-modal-dark.png");
  });
});
