import fs from "fs";
import * as url from "url";
import * as path from "path";
import {
  parseSerializedExistingNote,
  serializeNote,
} from "../../dist/lib/notes/noteUtils.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const graphFile = process.argv[2];

if (!graphFile) {
  console.error("Please provide a valid graph file.");
  process.exit(1);
}

console.log("Original graph file: " + graphFile);

const randomTitles = fs.readFileSync(
  path.join(__dirname, "random-article-names.txt"),
  "utf8",
)
  .replace(/\r/g, "")
  .split("\n")
  .map((t) => t.trim());

let noteTitleIndex = 0;
const getRandomNoteTitle = () => {
  const title = randomTitles[noteTitleIndex % randomTitles.length];
  noteTitleIndex++;
  return title;
};

// eslint-disable-next-line
const LOREM_IMPSUM_TEXT = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const graph = JSON.parse(
  fs.readFileSync(graphFile, "utf8"),
);

const NEW_CREATED_AT = 1584709669753;
const NEW_UPDATED_AT = 1584709669753;

graph.notes = graph.notes.map((originalNoteSerialized) => {
  const originalNote = parseSerializedExistingNote(originalNoteSerialized);

  const newNote = serializeNote({
    content: LOREM_IMPSUM_TEXT,
    meta: {
      id: originalNote.meta.id,
      title: getRandomNoteTitle(),
      createdAt: NEW_CREATED_AT,
      updatedAt: NEW_UPDATED_AT,
      position: originalNote.meta.position,
      flags: [],
      custom: {},
    },
  });

  return newNote;
});

graph.files = [];

const outputPath = path.join(__dirname, "graph.obfuscated.json");

fs.writeFileSync(
  outputPath,
  JSON.stringify(graph),
);

console.log("Obfuscated graph file saved at " + outputPath);
console.log("Done.");
