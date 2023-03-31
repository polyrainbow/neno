import assert from 'node:assert';
import test from 'node:test';
import { getDocumentTitleFromHtml } from './getDocumentTitle.js';

test("getDocumentTitleFromHtml", async (t) => {
  await t.test("should correctly parse title elements with attributes", async () => {
    const input = `<html lang="en">
    <head>
      <title data-attribute="something">Title</title>
    </head>
    <body>
    </body>
  </html>`;

    assert.strictEqual(getDocumentTitleFromHtml(input), "Title");
  });

  await t.test("should correctly parse title element with line breaks", async () => {
    const input = `<html lang="en">
    <head>
      <title data-attribute="something">
        Title
      </title>
    </head>
    <body>
    </body>
  </html>`;

    assert.strictEqual(getDocumentTitleFromHtml(input), "Title");
  });


  await t.test(
    "should parse the first title element when there are several",
    async () => {
      const input = `
      <!DOCTYPE html>
      <html lang="en">
          
              <title some-attribute>The real title</title>
      <body><svg>
      <title>The wrong title</title>
      </svg></body></html>`;

      assert.strictEqual(getDocumentTitleFromHtml(input), "The real title");
    },
  );
});
