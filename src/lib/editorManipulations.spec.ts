import { InsertItem } from "../types/InsertItem";
import { describe, it, expect } from "vitest";
import { concatenateInsertItems } from "./editorManipulations";

describe("concatenateInsertItems", () => {
  it(
    "should work correctly",
    async () => {
      const items: InsertItem[] = [
        {
          type: "file-slug",
          value: "/1",
        },
        {
          type: "file-slug",
          value: "/2",
        },
        {
          type: "string",
          value: " test1 ",
        },
        {
          type: "string",
          value: " test2",
        },
        {
          type: "file-slug",
          value: "/3",
        },
      ];

      const expectedOutput = "/1 /2 test1  test2 /3";
      const actualOutput = concatenateInsertItems(items);

      expect(actualOutput).toStrictEqual(expectedOutput);
    },
  );
});
