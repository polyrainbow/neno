/* eslint-disable max-len */
import { test, expect, ElementHandle } from "@playwright/test";

const DEMO_NOTE = `# Welcome to NENO
Paragraph block

> Quote block.
- List item
1. Numbered list item
\`\`\`
code block

\`\`\``;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("button.memory-storage");
  await page.click("button.memory-storage");
});

test.describe("Editor view", () => {
  test("should show note list item", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    const noteListItems = await page.$$(".sidebar .note-list .note-list-item");

    expect(noteListItems.length).toBe(1);
    const titleElement = await noteListItems[0].$(".title");
    const title = await titleElement?.innerText();
    expect(title).toBe("Welcome to NENO");
  });

  test("should have correct number of editor paragraphs", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    const editorParagraphs = await page.$$("div[data-lexical-editor] .editor-paragraph");
    expect(editorParagraphs.length).toBe(10);
  });

  test("slug bar should show correct value", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    const slugElement = await page.$(".slug-line .note-slug");
    const slug = await slugElement?.inputValue();
    expect(slug).toBe("welcome-to-neno");
  });

  test("editor paragraphs should have correct types", async ({ page }) => {
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    const editorParagraphs = await page.$$("div[data-lexical-editor] .editor-paragraph");
    const classes = await Promise.all(
      editorParagraphs.map((p) => p.getAttribute("class")),
    );
    expect(classes[0]).toBe("editor-paragraph s-heading ltr");
    expect(classes[1]).toBe("editor-paragraph ltr");
    expect(classes[2]).toBe("editor-paragraph");
    expect(classes[3]).toBe("editor-paragraph quote-block ltr");
    expect(classes[4]).toBe("editor-paragraph list-item ltr");
    expect(classes[5]).toBe("editor-paragraph ltr");
    expect(classes[6]).toBe("editor-paragraph code-block");
    expect(classes[7]).toBe("editor-paragraph code-block ltr");
    expect(classes[8]).toBe("editor-paragraph code-block");
    expect(classes[9]).toBe("editor-paragraph code-block");
  });

  test(
    "two slashlinks in one paragraph should be correctly linked",
    async ({ page }) => {
      await page.keyboard.type("Two /link-1 and /link-2");
      await page.click("#button_upload");
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      const nodeNames = await Promise.all(
        paragraphChildren.map((p) => p.evaluate((node) => node.nodeName)),
      );

      expect(nodeNames[0]).toBe("SPAN");
      expect(nodeNames[1]).toBe("A");
      expect(await paragraphChildren[1].innerText()).toBe("/link-1");
      expect(nodeNames[2]).toBe("SPAN");
      expect(nodeNames[3]).toBe("A");
      expect(await paragraphChildren[3].innerText()).toBe("/link-2");
    },
  );

  test(
    "backspace at the beginning of a heading should remove heading block",
    async ({ page }) => {
      const isMac = process.platform === "darwin";

      await page.keyboard.type("test\n# heading");
      await page.keyboard.press(isMac ? "Meta+ArrowLeft" : "Home");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Space");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraph = (
        await page.$("div[data-lexical-editor] .editor-paragraph")
      ) as ElementHandle<HTMLElement>;
      const nodeName = await paragraph.evaluate((node) => node.nodeName);

      expect(await paragraph.innerText()).toBe("test # heading");
      expect(nodeName).toBe("P");
      expect(await paragraph.getAttribute("class")).toBe("editor-paragraph ltr");
    },
  );

  test(
    "clicking on note list item link indicator should insert wikilink to this note at current editor selection",
    async ({ page }) => {
      await page.keyboard.type("Note 1");
      await page.click("#button_upload");
      await page.click("#button_new");

      await page.keyboard.type("Foo bar baz");

      /*
        When pressing the same key (combination) multiple times, we should
        add a delay, so the browser will recognize all of them as a separate
        key press events.
        See also
        https://stackoverflow.com/questions/75284988/how-to-avoid-that-playwright-ignore-multiple-key-press
      */

      // move cursor to "Foo bar| baz"
      await page.keyboard.press("ArrowLeft", { delay: 10 });
      await page.keyboard.press("ArrowLeft", { delay: 10 });
      await page.keyboard.press("ArrowLeft", { delay: 10 });
      await page.keyboard.press("ArrowLeft", { delay: 10 });

      // select "bar"
      await page.keyboard.press("Shift+ArrowLeft", { delay: 10 });
      await page.keyboard.press("Shift+ArrowLeft", { delay: 10 });
      await page.keyboard.press("Shift+ArrowLeft", { delay: 10 });

      await page.click(".note-list-item-linked-notes-indicator");

      const paragraph = page.locator("div[data-lexical-editor] .editor-paragraph", {
        hasText: "Foo [[Note 1]] baz",
      });

      await paragraph.waitFor();

      expect(await paragraph.innerText()).toBe("Foo [[Note 1]] baz");
      expect(await paragraph.getAttribute("class")).toBe("editor-paragraph ltr");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(await paragraphChildren[0].innerText()).toBe("Foo ");
      expect(await paragraphChildren[1].innerText()).toBe("[[");
      expect(await paragraphChildren[1].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[2].innerText()).toBe("Note 1");
      expect(await paragraphChildren[2].getAttribute("class")).toBe("wikilink-content available");
      expect(await paragraphChildren[3].innerText()).toBe("]]");
      expect(await paragraphChildren[3].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[4].innerText()).toBe(" baz");
    },
  );

  test(
    "recognize wikilinks next to each other without space in between",
    async ({ page }) => {
      await page.keyboard.type("[[Link 1]][[Link 2]][[Link 3]]");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(await paragraphChildren[0].innerText()).toBe("[[");
      expect(await paragraphChildren[0].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[1].innerText()).toBe("Link 1");
      expect(await paragraphChildren[1].getAttribute("class")).toBe("wikilink-content unavailable");
      expect(await paragraphChildren[2].innerText()).toBe("]]");
      expect(await paragraphChildren[2].getAttribute("class")).toBe("wikilink-punctuation");

      expect(await paragraphChildren[3].innerText()).toBe("[[");
      expect(await paragraphChildren[3].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[4].innerText()).toBe("Link 2");
      expect(await paragraphChildren[4].getAttribute("class")).toBe("wikilink-content unavailable");
      expect(await paragraphChildren[5].innerText()).toBe("]]");
      expect(await paragraphChildren[5].getAttribute("class")).toBe("wikilink-punctuation");

      expect(await paragraphChildren[6].innerText()).toBe("[[");
      expect(await paragraphChildren[6].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[7].innerText()).toBe("Link 3");
      expect(await paragraphChildren[7].getAttribute("class")).toBe("wikilink-content unavailable");
      expect(await paragraphChildren[8].innerText()).toBe("]]");
      expect(await paragraphChildren[8].getAttribute("class")).toBe("wikilink-punctuation");
    },
  );

  test(
    "wikilinks should be restored after note navigation",
    async ({ page }) => {
      await page.keyboard.type("[[Link 1]][[Link 2]][[Link 3]]");

      await page.click("#button_upload");
      await page.click("#button_new");
      await page.click(".note-list .note-list-item");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(await paragraphChildren[0].innerText()).toBe("[[");
      expect(await paragraphChildren[0].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[1].innerText()).toBe("Link 1");
      expect(await paragraphChildren[1].getAttribute("class")).toBe("wikilink-content unavailable");
      expect(await paragraphChildren[2].innerText()).toBe("]]");
      expect(await paragraphChildren[2].getAttribute("class")).toBe("wikilink-punctuation");

      expect(await paragraphChildren[3].innerText()).toBe("[[");
      expect(await paragraphChildren[3].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[4].innerText()).toBe("Link 2");
      expect(await paragraphChildren[4].getAttribute("class")).toBe("wikilink-content unavailable");
      expect(await paragraphChildren[5].innerText()).toBe("]]");
      expect(await paragraphChildren[5].getAttribute("class")).toBe("wikilink-punctuation");

      expect(await paragraphChildren[6].innerText()).toBe("[[");
      expect(await paragraphChildren[6].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await paragraphChildren[7].innerText()).toBe("Link 3");
      expect(await paragraphChildren[7].getAttribute("class")).toBe("wikilink-content unavailable");
      expect(await paragraphChildren[8].innerText()).toBe("]]");
      expect(await paragraphChildren[8].getAttribute("class")).toBe("wikilink-punctuation");
    },
  );

  test(
    "transclusion should appear/disappear after adding/removing slashlink inside text block",
    async ({ page }) => {
      await page.keyboard.type("test /link");


      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const transclusionSlug = (await page.$(
        "div[data-lexical-editor] .transclusion .slug",
      ))!;

      expect(await transclusionSlug.innerText()).toBe("/link");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");

      const transclusionElement = (await page.$(
        "div[data-lexical-editor] .transclusion",
      ));

      expect(transclusionElement).toBeNull();
    },
  );

  test(
    "transclusion should appear/disappear after adding/removing slashlink inside unordered list item",
    async ({ page }) => {
      await page.keyboard.type("- test /link");


      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const transclusionSlug = (await page.$(
        "div[data-lexical-editor] .transclusion .slug",
      ))!;

      expect(await transclusionSlug.innerText()).toBe("/link");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");

      const transclusionElement = (await page.$(
        "div[data-lexical-editor] .transclusion",
      ));

      expect(transclusionElement).toBeNull();
    },
  );

  test(
    "transclusion should appear/disappear after adding/removing slashlink inside heading block",
    async ({ page }) => {
      await page.keyboard.type("# test /link");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const transclusionSlug = (await page.$(
        "div[data-lexical-editor] .transclusion .slug",
      ))!;

      expect(await transclusionSlug.innerText()).toBe("/link");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");

      const transclusionElement = (await page.$(
        "div[data-lexical-editor] .transclusion",
      ));

      expect(transclusionElement).toBeNull();
    },
  );

  test(
    "selecting already active note should not trigger confirm discarding changes dialog",
    async ({ page }) => {
      await page.keyboard.type("note");
      await page.click("#button_upload");
      await page.click("div[data-lexical-editor]");
      await page.keyboard.type("more text");
      await page.click(".note-list .note-list-item");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dialog = await page.$("dialog");
      expect(dialog).toBeNull();
    },
  );

  test(
    "selecting already active pin should not trigger confirm discarding changes dialog",
    async ({ page }) => {
      await page.keyboard.type("note");
      await page.click("#button_upload");
      await page.click("#button_pin");
      await page.click("div[data-lexical-editor]");
      await page.keyboard.type("more text");
      await page.click(".pinned-note");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dialog = await page.$("dialog");
      expect(dialog).toBeNull();
    },
  );

  test(
    "clicking on a backlink's 'Link to this' should add a wikilink to the editor",
    async ({ page }) => {
      await page.keyboard.type("Note 1\nwith link to [[Note 2]]");
      await page.click("#button_upload"); // save as "note-1"
      await page.click("#button_new");
      await page.keyboard.type("Note 2\nwith link to ");
      await page.click("#button_upload"); // save as "note-2"

      await page.click(".note-backlinks .note-list-item-linked-notes-indicator");

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraph = (
        await page.$("div[data-lexical-editor] .editor-paragraph:nth-child(2)")
      ) as ElementHandle<HTMLElement>;

      expect(await paragraph.innerText()).toBe("with link to [[Note 1]]");
    },
  );

  test(
    "enable URLs with hashbangs in the editor",
    async ({ page }) => {
      await page.keyboard.type("http://example.com/page#!hashbang");

      const link = (
        await page.$("div[data-lexical-editor] .editor-paragraph a")
      ) as ElementHandle<HTMLElement>;

      expect(await link.getAttribute("href")).toBe(
        "http://example.com/page#!hashbang",
      );
    },
  );

  // unfortunately, this test fails due to https://github.com/facebook/lexical/issues/3546
  /*
  test(
    "enable URLs with semicolons in the editor",
    async ({ page }) => {
      await page.keyboard.type("http://example.com/page;1");

      const link = (
        await page.$("div[data-lexical-editor] .editor-paragraph a")
      ) as ElementHandle<HTMLElement>;

      expect(await link.getAttribute("href")).toBe(
        "http://example.com/page;1",
      );
    },
  );
  */

  test(
    "select all command works",
    async ({ page }) => {
      const isMac = process.platform === "darwin";
      await page.keyboard.type("# block 1\n- block 2\nblock 3");
      await page.keyboard.press(isMac ? "Meta+A" : "Control+A");
      await page.keyboard.press("Backspace");

      const paragraphs = (
        await page.$$("div[data-lexical-editor] .editor-paragraph")
      ) as ElementHandle<HTMLElement>[];

      expect(paragraphs.length).toBe(1);
      expect((await paragraphs[0].innerText()).trim()).toBe("");
    },
  );

  test(
    "remove wikilink opening punctuation at once should remove the whole wikilink",
    async ({ page }) => {
      const isMac = process.platform === "darwin";
      await page.keyboard.type("[[link]]");
      await page.keyboard.press(
        isMac ? "Meta+ArrowLeft" : "Control+ArrowLeft",
        { delay: 20 },
      );
      await page.keyboard.press("Shift+ArrowRight", { delay: 20 });
      await page.keyboard.press("Shift+ArrowRight", { delay: 20 });
      await page.keyboard.press("Backspace", { delay: 20 });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(paragraphChildren.length).toBe(1);
      expect(await paragraphChildren[0].innerText()).toBe("link]]");
      // expect node to be a text node
      expect(await paragraphChildren[0].getAttribute("class")).toBe(null);
    },
  );

  test(
    "remove wikilink closing punctuation with some content should remove the whole wikilink",
    async ({ page }) => {
      await page.keyboard.type("[[link]]");
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 10 },
      );
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 10 },
      );
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 10 },
      );
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 10 },
      );
      await page.keyboard.press("Backspace", { delay: 10 });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(paragraphChildren.length).toBe(1);
      expect(await paragraphChildren[0].innerText()).toBe("[[li");
      // expect node to be a text node
      expect(await paragraphChildren[0].getAttribute("class")).toBe(null);
    },
  );

  test("should delete notes", async ({ page }) => {
    await page.keyboard.type(DEMO_NOTE);
    await page.click("#button_upload");
    const noteListItems1 = await page.$$(".sidebar .note-list .note-list-item");
    expect(noteListItems1.length).toBe(1);
    const titleElement = await noteListItems1[0].$(".title");
    const title = await titleElement?.innerText();
    expect(title).toBe("Welcome to NENO");
    await page.click("#button_remove");
    const removeNoteButton = page.getByRole("dialog").getByText("Remove note");
    await removeNoteButton.click();
    const noteListItems2 = await page.$$(".sidebar .note-list .note-list-item");
    expect(noteListItems2.length).toBe(0);
  });
});
