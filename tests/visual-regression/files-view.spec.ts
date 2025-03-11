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

  await page.locator("#button_save").click();
  await page.getByLabel("Files", { exact: true }).click();
});

test.describe("Files view", () => {
  test("Script files should look fine", async ({ page }) => {
    // go to scripts view, create script and come back to files view
    await page.getByLabel("Scripting", { exact: true }).click();
    await page.locator("input[type=\"text\"]").focus();
    await page.keyboard.type("s1");
    await page.getByRole("button", { name: "Create" }).click();
    await page.getByLabel("Files", { exact: true }).click();
    await page.getByAltText("Open in script editor").nth(0).waitFor();
    expect(await page.screenshot()).toMatchSnapshot("script-files-light.png");
  });
});
