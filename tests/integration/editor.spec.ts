/* eslint-disable @stylistic/max-len */
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
  await page.waitForSelector("#memory-storage-load-button");
  await page.click("#memory-storage-load-button");
  await page.getByText("No notes found").waitFor();
  await page.getByAltText("No notes found").waitFor();
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
    const editorParagraphs = await page.$$(
      "div[data-lexical-editor] .editor-paragraph",
    );
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
    const editorParagraphs = await page.$$(
      "div[data-lexical-editor] .editor-paragraph",
    );
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
    "slashlink with combining diacritic mark should be correctly linked",
    async ({ page }) => {
      await page.keyboard.type("/ö.txt"); // ö with combining diacritic mark
      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      const nodeNames = await Promise.all(
        paragraphChildren.map((p) => p.evaluate((node) => node.nodeName)),
      );

      expect(nodeNames[0]).toBe("A");
      expect(await paragraphChildren[0].innerText()).toBe("/ö.txt");
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

      const paragraph = (
        await page.$("div[data-lexical-editor] .editor-paragraph")
      ) as ElementHandle<HTMLElement>;
      const nodeName = await paragraph.evaluate((node) => node.nodeName);

      expect(await paragraph.innerText()).toBe("test # heading");
      expect(nodeName).toBe("P");
      expect(await paragraph.getAttribute("class"))
        .toBe("editor-paragraph ltr");
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
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });

      // select "bar"
      await page.keyboard.press("Shift+ArrowLeft", { delay: 20 });
      await page.keyboard.press("Shift+ArrowLeft", { delay: 20 });
      await page.keyboard.press("Shift+ArrowLeft", { delay: 20 });

      await page.click(".note-list-item-linked-notes-indicator");

      const paragraph = page.locator(
        "div[data-lexical-editor] .editor-paragraph",
        {
          hasText: "Foo [[Note 1]] baz",
        },
      );

      await paragraph.waitFor();

      expect(await paragraph.innerText()).toBe("Foo [[Note 1]] baz");
      expect(await paragraph.getAttribute("class"))
        .toBe("editor-paragraph ltr");

      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(await paragraphChildren[0].innerText()).toBe("Foo ");
      expect(await paragraphChildren[1].innerText()).toBe("[[");
      expect(await paragraphChildren[1].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[2].innerText()).toBe("Note 1");
      expect(await paragraphChildren[2].getAttribute("class"))
        .toBe("wikilink-content available");
      expect(await paragraphChildren[3].innerText()).toBe("]]");
      expect(await paragraphChildren[3].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[4].innerText()).toBe(" baz");
    },
  );

  test(
    "recognize wikilinks next to each other without space in between",
    async ({ page }) => {
      await page.keyboard.type("[[Link 1]][[Link 2]][[Link 3]]");

      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(await paragraphChildren[0].innerText()).toBe("[[");
      expect(await paragraphChildren[0].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[1].innerText()).toBe("Link 1");
      expect(await paragraphChildren[1].getAttribute("class"))
        .toBe("wikilink-content unavailable");
      expect(await paragraphChildren[2].innerText()).toBe("]]");
      expect(await paragraphChildren[2].getAttribute("class"))
        .toBe("wikilink-punctuation");

      expect(await paragraphChildren[3].innerText()).toBe("[[");
      expect(await paragraphChildren[3].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[4].innerText()).toBe("Link 2");
      expect(await paragraphChildren[4].getAttribute("class"))
        .toBe("wikilink-content unavailable");
      expect(await paragraphChildren[5].innerText()).toBe("]]");
      expect(await paragraphChildren[5].getAttribute("class"))
        .toBe("wikilink-punctuation");

      expect(await paragraphChildren[6].innerText()).toBe("[[");
      expect(await paragraphChildren[6].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[7].innerText()).toBe("Link 3");
      expect(await paragraphChildren[7].getAttribute("class"))
        .toBe("wikilink-content unavailable");
      expect(await paragraphChildren[8].innerText()).toBe("]]");
      expect(await paragraphChildren[8].getAttribute("class"))
        .toBe("wikilink-punctuation");
    },
  );

  test(
    "wikilinks should be restored after note navigation",
    async ({ page }) => {
      await page.keyboard.type("[[Link 1]][[Link 2]][[Link 3]]");

      await page.click("#button_upload");
      await page.click("#button_new");
      await page.click(".note-list .note-list-item");

      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      expect(await paragraphChildren[0].innerText()).toBe("[[");
      expect(await paragraphChildren[0].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[1].innerText()).toBe("Link 1");
      expect(await paragraphChildren[1].getAttribute("class"))
        .toBe("wikilink-content unavailable");
      expect(await paragraphChildren[2].innerText()).toBe("]]");
      expect(await paragraphChildren[2].getAttribute("class"))
        .toBe("wikilink-punctuation");

      expect(await paragraphChildren[3].innerText()).toBe("[[");
      expect(await paragraphChildren[3].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[4].innerText()).toBe("Link 2");
      expect(await paragraphChildren[4].getAttribute("class"))
        .toBe("wikilink-content unavailable");
      expect(await paragraphChildren[5].innerText()).toBe("]]");
      expect(await paragraphChildren[5].getAttribute("class"))
        .toBe("wikilink-punctuation");

      expect(await paragraphChildren[6].innerText()).toBe("[[");
      expect(await paragraphChildren[6].getAttribute("class"))
        .toBe("wikilink-punctuation");
      expect(await paragraphChildren[7].innerText()).toBe("Link 3");
      expect(await paragraphChildren[7].getAttribute("class"))
        .toBe("wikilink-content unavailable");
      expect(await paragraphChildren[8].innerText()).toBe("]]");
      expect(await paragraphChildren[8].getAttribute("class"))
        .toBe("wikilink-punctuation");
    },
  );

  test(
    "transclusion should appear/disappear after adding/removing slashlink inside text block",
    async ({ page }) => {
      await page.keyboard.type("test /link");


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
    "transclusions should be refreshed after removing space between two slashlinks",
    async ({ page }) => {
      await page.keyboard.type("/1 /2");

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Backspace");

      const paragraphChildren = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph > *",
      ))!;

      // make sure "/1/2" is one slashlink node
      expect(await paragraphChildren[0].innerText()).toBe("/1/2");

      const transclusionSlug = (await page.$(
        "div[data-lexical-editor] .transclusion .slug",
      ))!;

      expect(await transclusionSlug.innerText()).toBe("/1/2");
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


  test(
    "enable localhost URLs in the editor",
    async ({ page }) => {
      await page.keyboard.type("http://localhost:8080/page");

      const link = (
        await page.$("div[data-lexical-editor] .editor-paragraph a")
      ) as ElementHandle<HTMLElement>;

      expect(await link.getAttribute("href")).toBe(
        "http://localhost:8080/page",
      );
    },
  );


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

  test(
    "enable complex URLs with apostrophes in the editor",
    async ({ page }) => {
      const URL = "https://example.com/#:~:text=But%20as%20Hannah%20Arendt%20observes,nature'%E2%80%9D%20(469).";
      await page.keyboard.type(URL);

      const link = (
        await page.$("div[data-lexical-editor] .editor-paragraph a")
      ) as ElementHandle<HTMLElement>;

      expect(await link.getAttribute("href")).toBe(URL);
    },
  );

  test(
    "select all command works with URL",
    async ({ page }) => {
      const isMac = process.platform === "darwin";

      await page.keyboard.type("http://example.com");
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

      const paragraphChildren = await page.locator(
        "div[data-lexical-editor] .editor-paragraph > *",
      ).all();

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
        { delay: 20 },
      );
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 20 },
      );
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 20 },
      );
      await page.keyboard.press(
        "Shift+ArrowLeft",
        { delay: 20 },
      );
      await page.keyboard.press("Backspace", { delay: 20 });

      const paragraphChildren = await page.locator(
        "div[data-lexical-editor] .editor-paragraph > *",
      ).all();

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

  test(
    "newline should be correctly created after URL in list item",
    async ({ page }) => {
      await page.keyboard.type("- http://example.com");
      await page.keyboard.press("Enter");

      const paragraphs = (
        await page.$$("div[data-lexical-editor] .editor-paragraph")
      ) as ElementHandle<HTMLElement>[];

      expect(paragraphs.length).toBe(2);
      expect((await paragraphs[0].innerText()).trim())
        .toBe("- http://example.com");
      expect((await paragraphs[1].innerText()).trim()).toBe("");
    },
  );

  /*
  Fails. https://github.com/facebook/lexical/issues/5882

  test(
    "newline should be correctly created when pressing enter within URL",
    async ({ page }) => {
      await page.keyboard.type("http://example.com");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Enter");

      const paragraphs = (
        await page.$$("div[data-lexical-editor] .editor-paragraph")
      ) as ElementHandle<HTMLElement>[];

      expect(paragraphs.length).toBe(2);
      expect((await paragraphs[0].innerText()).trim())
        .toBe("http://example.co");
      expect((await paragraphs[1].innerText()).trim()).toBe("m");
    },
  );
  */


  test(
    "Click on red wikilink should create new note with content of wikilink",
    async ({ page }) => {
      await page.keyboard.type("A note with a [[Link to a non-existing note]]");
      await page.click("#button_upload");
      await page.locator("span")
        .filter({ hasText: "Link to a non-existing note" })
        .click();

      const slugElement = await page.$(".slug-line .note-slug");
      const slug = await slugElement?.inputValue();
      expect(slug).toBe("link-to-a-non-existing-note");

      const paragraphs = (
        await page.$$("div[data-lexical-editor] .editor-paragraph")
      ) as ElementHandle<HTMLElement>[];

      expect(paragraphs.length).toBe(1);
      expect((await paragraphs[0].innerText()).trim()).toBe(
        "Link to a non-existing note",
      );
    },
  );


  test(
    "Cancel discarding changes should not overwrite current location",
    async ({ page }) => {
      await page.keyboard.type("A note");
      await page.click("#button_upload");
      await page.getByRole("textbox").nth(1).focus();
      await page.keyboard.type(" edited");
      await page.click("#button_new");
      await page.getByRole("button", { name: "Cancel" }).click();
      expect(page.url().endsWith("a-note")).toBe(true);
    },
  );


  test(
    "Dragging & dropping pin to editor should insert Wikilink with note title",
    async ({ page }) => {
      await page.keyboard.type("A note");
      await page.click("#button_upload");
      await page.click("#button_pin");
      await page.click("#button_new");
      await page.locator(".pinned-note").hover();
      await page.mouse.down();
      const editor = page.getByRole("textbox").nth(1);
      await editor.hover();
      await page.mouse.up();
      expect(await editor.textContent()).toBe("[[A note]]");
    },
  );


  test(
    "Wikilink availability should update on linktext change",
    async ({ page }) => {
      await page.keyboard.type("A note");
      await page.click("#button_upload");
      await page.click("#button_new");

      await page.keyboard.type("[[A not]]");

      const wikilinkContentNode = await page.locator(
        "div[data-lexical-editor] .editor-paragraph > *",
      ).nth(1);

      expect(await wikilinkContentNode.getAttribute("class")).toBe(
        "wikilink-content unavailable",
      );

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.type("e");
      expect(await wikilinkContentNode.getAttribute("class")).toBe(
        "wikilink-content available",
      );

      await page.keyboard.press("Backspace");
      expect(await wikilinkContentNode.getAttribute("class")).toBe(
        "wikilink-content unavailable",
      );
    },
  );


  test(
    "Note Search Result Selection: Pressing arrow up should select last note",
    async ({ page }) => {
      await page.keyboard.type("foo1");
      await page.click("#button_upload");
      await page.click("#button_new");

      await page.keyboard.type("foo2");
      await page.click("#button_upload");
      await page.click("#button_new");

      await page.keyboard.type("foo3");
      await page.click("#button_upload");
      await page.click("#button_new");

      await page.keyboard.type("foo4");
      await page.click("#button_upload");
      await page.click("#button_new");

      await page.locator("#search-input").focus();
      await page.keyboard.type("foo");

      await page.keyboard.press("ArrowUp");

      expect(
        await page.locator(".note-list-item").nth(3).getAttribute("class"),
      ).toBe(
        "note-list-item selected linkable",
      );
    },
  );


  /*
    Test disabled because dead keys are not testable:
    https://github.com/microsoft/playwright/issues/7396#issuecomment-2098305274
  test(
    "Pressing dead key and letter to create umlaut should work inside Wikilink",
    async ({ page }) => {
      await page.keyboard.type("[[Wikilink]]", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("ArrowLeft", { delay: 20 });
      await page.keyboard.press("Alt+u", { delay: 20 });
      await page.keyboard.press("u", { delay: 20 });

      const editor = page.getByRole("textbox").nth(1);
      expect(await editor.textContent()).toBe("[[Wikiülink]]");
    },
  );
  */

  /*
    Test disabled because dead keys are not testable:
    https://github.com/microsoft/playwright/issues/7396#issuecomment-2098305274
  test(
    "Pressing dead key and letter to create umlaut should work inside Wikilink",
    async ({ page }) => {
      await page.keyboard.type("[[Wikilink]]", { delay: 20 });
      await page.keyboard.press("Alt+u", { delay: 20 });
      await page.keyboard.press("u", { delay: 20 });

      const editor = page.getByRole("textbox").nth(1);
      expect(await editor.textContent()).toBe("[[Wikilink]]ü");
    },
  );
  */

  /*
  The following test fails in headless mode but succeeds in headful mode.
  Likely reason: Playwright does not have clipboard isolation.
  See also:
  https://github.com/microsoft/playwright/issues/11654
  https://github.com/microsoft/playwright/issues/13097

  test(
    "copying and pasting multiline text should work",
    async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      const isMac = process.platform === "darwin";

      await page.keyboard.type("1", { delay: 20 });
      await page.keyboard.press("Enter", { delay: 20 });
      await page.keyboard.type("2", { delay: 20 });
      await page.keyboard.press("Enter", { delay: 20 });
      await page.keyboard.type("3", { delay: 20 });
      await page.keyboard.press("Enter", { delay: 20 });
      await page.keyboard.type("4", { delay: 20 });

      // select 3 and 4
      await page.keyboard.press("Shift+ArrowLeft", { delay: 20 });
      await page.keyboard.press("Shift+ArrowUp", { delay: 20 });

      // copy
      await page.keyboard.press(
        isMac ? "Meta+KeyC" : "Control+KeyC", { delay: 20 }
      );

      const clipboardText1 = await page.evaluate(
        "navigator.clipboard.readText()"
      );
      expect(clipboardText1).toBe("3\n4");

      // move cursor to end of line 2
      await page.keyboard.press("ArrowUp", { delay: 20 });
      await page.keyboard.press("ArrowRight", { delay: 20 });

      // select 1 and 2
      await page.keyboard.press("Shift+ArrowLeft", { delay: 20 });
      await page.keyboard.press("Shift+ArrowUp", { delay: 20 });

      // paste
      await page.keyboard.press(
        isMac ? "Meta+KeyV" : "Control+KeyV", { delay: 20 }
      );

      await page.waitForTimeout(100);

      const paragraphs = (await page.$$(
        "div[data-lexical-editor] .editor-paragraph",
      ))!;

      expect((await paragraphs[0].innerText()).trim()).toBe("3");
      expect((await paragraphs[1].innerText()).trim()).toBe("4");
    },
  );
  */

  test(
    "wikilink should not be created inside code block node",
    async ({ page }) => {
      await page.keyboard.type("```");
      await page.keyboard.press("Enter", { delay: 20 });
      await page.keyboard.type("[[link]]", { delay: 20 });

      const codeBlock = await page.locator(
        "div[data-lexical-editor] .editor-paragraph:nth-child(2) > *",
      ).all();

      // expect node to be a text node
      expect(await codeBlock[0].getAttribute("class")).toBe(null);
      expect(await codeBlock[0].textContent()).toBe("[[link]]");

      await page.keyboard.press("ArrowUp", { delay: 20 });
      await page.keyboard.press("Backspace", { delay: 20 });

      // now wikilink should have been created, because code block has been removed

      expect(await codeBlock[0].getAttribute("class")).toBe("wikilink-punctuation");
      expect(await codeBlock[0].textContent()).toBe("[[");

      // re-create code block
      await page.keyboard.type("`");

      // expect node to be a simple text node again
      expect(await codeBlock[0].getAttribute("class")).toBe(null);
      expect(await codeBlock[0].textContent()).toBe("[[link]]");
    },
  );
});
