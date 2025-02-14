import { test, expect } from "@playwright/test";
import { setDefaultDate } from "../utils";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
  await page.locator("#button_save").click();
  await page.getByLabel("Files", { exact: true }).click();
  await page.getByText("beach.jpg").click();
  await page.locator(".file-container img").waitFor();
});

test.describe("File view mobile", () => {
  test("should look fine - light", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 914 });
    expect(await page.screenshot())
      .toMatchSnapshot("file-view-mobile-light.png");
  });
});
