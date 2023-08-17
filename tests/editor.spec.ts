/* eslint-disable max-len */
import { test, expect } from "@playwright/test";

const DEMO_NOTE = `# Welcome to NENO
NENO is just another note-taking app that helps you create your personal knowledge graph. With NENO, you retain *full control* over your data because you decide where it is stored: On your device or on a cloud storage of your choice. You could also use Git for versioning.
To quote its creator:
> NENO helped me manage my knowledge like no other app before.
> You should give it a try.

You can link other notes with a Wikilink like so: [[I like pizza]]. If the target note does not exist yet, the Wikilink is red: [[Non-existing note]]. When clicking on it, you can create it.

Use slashlinks to create transclusions: /2023-07-27
Other file types are also shown as transclusions: /files/beach.jpg`;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("button.memory-storage");
  await page.click("button.memory-storage");
});

test.describe("Editor", () => {
  test("should look fine - light", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot("editor-light.png");
  });

  test("should look fine - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    expect(await page.screenshot()).toMatchSnapshot("editor-dark.png");
  });

  test("existing note - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    expect(await page.screenshot()).toMatchSnapshot("editor-dark-note.png");
  });
});
