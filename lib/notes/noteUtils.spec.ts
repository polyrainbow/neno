import assert from 'node:assert';
import it, { describe } from 'node:test';
import {
  getExtensionFromFilename,
} from './noteUtils.js';


describe("getExtensionFromFilename", () => {
  it(
    "should correctly normalize filenames",
    async () => {
      assert.strictEqual(getExtensionFromFilename("AUDIO.mp3"), "mp3");
      assert.strictEqual(getExtensionFromFilename("AUDIO.MP3"), "mp3");
      assert.strictEqual(getExtensionFromFilename("AUDIO. MP3"), " mp3");
      assert.strictEqual(getExtensionFromFilename("AUDIO.mp3  "), "mp3  ");
    },
  );
});