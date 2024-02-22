import {
  getExtensionFromFilename,
  removeExtensionFromFilename,
} from "./utils.js";
import { expect, it, describe } from "vitest";

describe("getExtensionFromFilename", () => {
  it(
    "should correctly normalize filenames",
    async () => {
      expect(getExtensionFromFilename("AUDIO.mp3")).toBe("mp3");
      expect(getExtensionFromFilename("AUDIO.MP3")).toBe("mp3");
      expect(getExtensionFromFilename("AUDIO. MP3")).toBe(" mp3");
      expect(getExtensionFromFilename("AUDIO.mp3  ")).toBe("mp3  ");
    },
  );
});

describe("removeExtensionFromFilename", () => {
  it(
    "should correctly normalize filenames",
    async () => {
      expect(removeExtensionFromFilename("AUDIO.mp3")).toBe("AUDIO");
      expect(removeExtensionFromFilename("audio 1.MP3")).toBe("audio 1");
      expect(removeExtensionFromFilename(".graph.json")).toBe(".graph");
      expect(removeExtensionFromFilename(".htaccess")).toBe("");
    },
  );
});
