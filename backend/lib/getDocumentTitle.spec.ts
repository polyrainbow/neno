import assert from 'node:assert';
import it, { describe } from 'node:test';
import { getDocumentTitleFromHtml } from './getDocumentTitle.js';

describe("getDocumentTitleFromHtml", () => {
  it("should correctly parse title elements with attributes", async () => {
    const input = `<html lang="en">
    <head>
      <title data-attribute="something">Title</title>
    </head>
    <body>
    </body>
  </html>`;

    assert.strictEqual(getDocumentTitleFromHtml(input), "Title");
  });

  it("should correctly parse title element with line breaks", async () => {
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
});