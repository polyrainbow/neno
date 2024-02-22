// @vitest-environment jsdom

import { exportedForTesting } from "./Transclusion";
const { getSummary } = exportedForTesting;
import { describe, it, expect } from "vitest";

describe("getSummary", () => {
  it("should ignore first line when identical with note title", async () => {
    expect(getSummary("Title\nhey", "Title")).toBe("hey");
  });

  it("should ignore first line when it is used for note title", async () => {
    expect(getSummary("# Title\nhey", "Title")).toBe("hey");
    expect(getSummary("> Title\nhey", "Title")).toBe("hey");
    expect(getSummary("> [[Title]] of note\nhey", "Title of note")).toBe("hey");
  });

  it("should ignore empty lines", async () => {
    expect(getSummary("# Title\n\n\n\nfoo\n\nbar", "Title")).toBe("foo\nbar");
  });

  it("should contain first line when not matching title", async () => {
    expect(
      getSummary("Some note\nSecond line", "Title"),
    ).toBe("Some note\nSecond line");
  });
});
