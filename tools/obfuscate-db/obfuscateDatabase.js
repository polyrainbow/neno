import fs from "fs";
import * as url from "url";
import * as path from "path";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const dbFolder = process.argv[2];

console.log("DB folder: " + dbFolder);

const randomTitles = fs.readFileSync(
  path.join(__dirname, "random-article-names.txt"),
  "utf8",
)
  .replace(/\r/g, "")
  .split("\n")
  .map((t) => t.trim());

let noteTitleIndex = 0;
const getNoteTitle = () => {
  const title = randomTitles[noteTitleIndex % randomTitles.length];
  noteTitleIndex++;
  return title;
};

// eslint-disable-next-line
const LOREM_IMPSUM_TEXT = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const mainDB = JSON.parse(
  fs.readFileSync(path.join(dbFolder, "main.db.json"), "utf8"),
);

mainDB.id = "demo";

mainDB.notes.forEach((note) => {
  note.creationTime = 1584709669753;
  note.updateTime = 1584709669753;

  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    return ["header", "paragraph", "linkTool"].includes(block.type);
  });

  note.editorData.blocks.forEach((block) => {
    if (block.type === "paragraph") {
      block.data.text = LOREM_IMPSUM_TEXT;
    }

    if (block.type === "linkTool") {
      block.data = {
        link: "https://www.youtube.com/watch?v=Vw4KVoEVcr0",
        meta: {
          description: "This is really cool cat content!",
          image: {
            url: "https://i.ytimg.com/vi/Vw4KVoEVcr0/hqdefault.jpg",
          },
          title: "Cat mom hugs baby kitten",
        },
      };
    }

    if (block.type === "header") {
      block.data.text = getNoteTitle();
    }
  });
});

fs.writeFileSync(path.join(__dirname, "main.db.json"), JSON.stringify(mainDB));

console.log("Done.");
