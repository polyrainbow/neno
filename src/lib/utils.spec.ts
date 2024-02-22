import { getWikilinkForNote } from "./utils";
import { describe, it, expect } from "vitest";

describe("getWikilinkForNote", () => {
  it("should use slug if title does not match slug", async () => {
    expect(getWikilinkForNote("slug", "title")).toBe("[[slug]]");
  });

  it("should use title if it matches slug", async () => {
    expect(getWikilinkForNote("note-title", "Note Title"))
      .toBe("[[Note Title]]");
  });
});
