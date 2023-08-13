import { changeSlugReferencesInNote } from "./notes/noteUtils";
import subwaytext from "./subwaytext";
import serialize from "./subwaytext/serialize";

jest.mock("../constants", () => {
  return {
    BASE_URL: "/",
  };
});

describe("changing slug references in a note", () => {
  it(
    "should work correctly",
    async () => {
      const input = `This is a note with some references
# to [[Note 1]], [[Note   1]] and a [[note-2]]
- to [[Note-1]] and a /note-1`;

      const expectedOutput = `This is a note with some references
# to [[Note 1a]], [[Note 1a]] and a [[note-2]]
- to [[Note 1a]] and a /note-1a`;

      const inputParsed = subwaytext(input);
      const inputTransformed = changeSlugReferencesInNote(
        inputParsed,
        "note-1",
        "note-1a",
        "Note 1a",
      );
      const actualOutput = serialize(inputTransformed);

      expect(actualOutput).toStrictEqual(expectedOutput);
    },
  );
});
