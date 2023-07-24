import {
  parseQueryString,
  getRawTokensFromQueryString,
} from "./search.js";


describe("search", () => {
  it(
    "should correctly parse all search tokens",
    async () => {
      // eslint-disable-next-line max-len
      const input = "   has:code has-media:image first-token \"one token\" ft:\"full : text : tokens\"    -check-again: -check-again:2023-01-01 :another-token     ";
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
      expect(getRawTokensFromQueryString(input)).toStrictEqual(expectedOutput);
    },
  );

  it(
    "should correctly parse all query string",
    async () => {
      // eslint-disable-next-line max-len
      const input = "   has:code has-media:image first-token \"one token\" ft:\"full : text : tokens\"    -check-again: -check-again:2023-01-01 :another-token     ";
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
      expect(parseQueryString(input)).toStrictEqual(expectedOutput);


      const input2 = "token1 token2";
      const expectedOutput2 = [
        ["", "token1"],
        ["", "token2"],
      ];
      expect(parseQueryString(input2)).toStrictEqual(expectedOutput2);
    },
  );

  it(
    "should correctly parse tokens with colons in quotation marks",
    async () => {
      const input = "\"has:code\"";
      const expectedOutput = [
        ["", "has:code"],
      ];
      expect(parseQueryString(input)).toStrictEqual(expectedOutput);
    },
  );
});
