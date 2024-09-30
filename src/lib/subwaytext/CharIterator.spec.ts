import { describe, it, expect } from "vitest";
import CharIterator from "./CharIterator";

describe("CharIterator", () => {
  it("should correctly show chars until delimiter", () => {
    const input = "A nice /link with words after.";

    const iterator = new CharIterator(input);
    iterator.next(); // A
    iterator.next(); //
    iterator.next(); // n
    iterator.next(); // i
    iterator.next(); // c
    iterator.next(); // e
    iterator.next(); //
    iterator.next(); // /

    const charsUntilSpace = iterator.charsUntil(" ");

    expect(charsUntilSpace).toStrictEqual("/link");
  });
});
