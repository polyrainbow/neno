import { describe, expect, it } from "vitest";
import DatabaseIO from "./DatabaseIO";

describe("DatabaseIO: parsePinsFile", () => {
  it("should return empty array if file is empty", async () => {
    expect(DatabaseIO.parsePinsFile("")).toHaveLength(0);
  });
});

describe("DatabaseIO: getArbitraryGraphFilepath", () => {
  it("should return correct filepath in nested structure", async () => {
    expect(
      DatabaseIO.getArbitraryGraphFilepath("a/b/c/d", "filename.txt"),
    ).toBe("a/b/c/filename.txt");
  });
});
