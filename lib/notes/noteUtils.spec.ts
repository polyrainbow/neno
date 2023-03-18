import assert from 'node:assert';
import test from 'node:test';
import ExistingNote from './interfaces/ExistingNote.js';
import {
  getExtensionFromFilename,
  getNotesWithFlag,
  getNotesWithUrl,
} from './noteUtils.js';


test("getExtensionFromFilename", (t) => {
  t.test(
    "should correctly normalize filenames",
    async () => {
      assert.strictEqual(getExtensionFromFilename("AUDIO.mp3"), "mp3");
      assert.strictEqual(getExtensionFromFilename("AUDIO.MP3"), "mp3");
      assert.strictEqual(getExtensionFromFilename("AUDIO. MP3"), " mp3");
      assert.strictEqual(getExtensionFromFilename("AUDIO.mp3  "), "mp3  ");
    },
  );
});


test("getNotesWithUrl", (t) => {
  t.test(
    "should find correct notes",
    async () => {
      const notes: ExistingNote[] = [
        {
          content: "https://example.com/path",
          meta: {
            id: 0,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "https://example.com/path    This url should not match",
          meta: {
            id: 1,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "https://example.com/path\n    This url should not match",
          meta: {
            id: 2,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "   https://example.com\n    This url should match",
          meta: {
            id: 3,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "   https://example.com    This url should match",
          meta: {
            id: 4,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
      ];

      const queryUrl = "https://example.com";
      const result = getNotesWithUrl(notes, queryUrl);
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].meta.id, 3);
      assert.strictEqual(result[1].meta.id, 4);
    },
  );
});


test("getNotesWithFlag", (t) => {
  t.test(
    "should find notes with this flag",
    async () => {
      const notes: ExistingNote[] = [
        {
          content: "Bla",
          meta: {
            id: 0,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: ["CREATED_WITH_BROWSER_EXTENSION"],
            contentType: "",
          },
        },
        {
          content: "Bla",
          meta: {
            id: 1,
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            title: "0",
            custom: {},
            flags: ["DUPLICATE_OF(232)"],
            contentType: "",
          },
        },
      ];

      const result = getNotesWithFlag(notes, "DUPLICATE_OF(232)");
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].meta.id, 1);
    },
  );
});