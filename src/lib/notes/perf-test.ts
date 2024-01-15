/* eslint-disable max-len */
/* eslint-disable no-console */
import NotesProvider from "./index";
import { NoteSaveRequest } from "./types/NoteSaveRequest";
import MockStorageProvider from "./test/MockStorageProvider";

const tests = [
  {
    name: "simple stats",
    task: async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "another-existing-note",
        aliases: new Set(),
      };
      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note with a link to [[another existing note]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(),
      };
      await notesProvider.put(noteSaveRequest2);

      await notesProvider.getStats({
        includeMetadata: false,
        includeAnalysis: false,
      });
    },
  },
];


const round = (num: number): number => {
  return Math.round(num * 100) / 100;
};


for (let t = 0; t<tests.length; t++) {
  const test = tests[t];
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    await test.task();
  }
  const end = performance.now();
  const durationMs = end - start;
  const durationSeconds = durationMs / 1000;
  console.log(`"${test.name}" took ${round(durationSeconds)}s`);
}

// run via
// node --loader ts-node/esm --experimental-specifier-resolution=node perf-test.ts
