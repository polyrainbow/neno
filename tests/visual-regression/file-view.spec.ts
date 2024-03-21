import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";

test.beforeEach(async ({ page }) => {
  await setDefaultDate(page); // needs to be added before page.goto
  await page.goto("/", { "waitUntil": "networkidle" });
  await page.waitForSelector("img[alt='NENO logo']");
  await page.keyboard.press("Control+.");
  await page.waitForSelector("#memory-storage-load-button");
  await page.click("#memory-storage-load-button");
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
  await page.getByText("test.txt").click();
});

test.describe("Login", () => {
  test("should look fine - light", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot("file-view-light.png", {
      maxDiffPixels: 200,
    });
  });
});
