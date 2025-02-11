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

  await page.locator("#button_upload").click();
  await page.getByTitle("Menu").click();
  await page.getByAltText("Files", { exact: true }).click();
  await page.getByText("test.txt").click();
});

test.describe("File view", () => {
  test("should look fine - light", async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot("file-view-light.png");
  });

  test("should look fine - dark", async ({ page }) => {
    page.emulateMedia({ colorScheme: "dark" });
    expect(await page.screenshot()).toMatchSnapshot("file-view-dark.png");
  });

  test("should look fine with image - light", async ({ page }) => {
    await page.getByText("Show all files", { exact: true }).click();
    await page.getByText("beach.jpg").click();
    await page.locator(".file-container img").waitFor();
    expect(await page.screenshot())
      .toMatchSnapshot("file-view-image-light.png");
  });
});
