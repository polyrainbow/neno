import assert from 'node:assert';
import test from 'node:test';
import {
  parseQueryString,
  getRawTokensFromQueryString,
} from './search.js';


test("search", async (t) => {
  await t.test(
    "should correctly parse all search tokens",
    async () => {
      // eslint-disable-next-line max-len
      const input = '   has:code has-media:image first-token "one token" ft:"full : text : tokens"    -check-again: -check-again:2023-01-01 :another-token     ';
      const expectedOutput = [
        "has:code",
        "has-media:image",
        "first-token",
        "\"one token\"",
        "ft:\"full : text : tokens\"",
        "-check-again:",
        "-check-again:2023-01-01",
        ":another-token",
      ];
      assert.deepEqual(getRawTokensFromQueryString(input), expectedOutput);
    },
  );

  await t.test(
    "should correctly parse all query string",
    async () => {
      // eslint-disable-next-line max-len
      const input = '   has:code has-media:image first-token "one token" ft:"full : text : tokens"    -check-again: -check-again:2023-01-01 :another-token     ';
      const expectedOutput = [
        ["has", "code"],
        ["has-media", "image"],
        ["", "first-token"],
        ["", "one token"],
        ["ft", "full : text : tokens"],
        ["-check-again", ""],
        ["-check-again", "2023-01-01"],
        ["", "another-token"],
      ];
      assert.deepEqual(parseQueryString(input), expectedOutput);


      const input2 = 'token1 token2';
      const expectedOutput2 = [
        ["", "token1"],
        ["", "token2"],
      ];
      assert.deepEqual(parseQueryString(input2), expectedOutput2);
    },
  );

  await t.test(
    "should correctly parse tokens with colons in quotation marks",
    async () => {
      // eslint-disable-next-line max-len
      const input = '"has:code"';
      const expectedOutput = [
        ["", "has:code"],
      ];
      assert.deepEqual(parseQueryString(input), expectedOutput);
    },
  );
});
