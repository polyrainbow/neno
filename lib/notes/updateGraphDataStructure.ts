
/*
  This module is to modify the data structure/the database schema from
  legacy schemas. As those do not match our types, it does not really make
  sense to type-check this file.
*/

import { FileInfo } from "./interfaces/FileInfo";

// What to do with formatted text and inline links (<i>, <b>, <a>)?
// I thought a lot about this, and the best answer I could come up with:
// Nothing. HTML-like syntax is not part of the new schema and transformations
// would either result in data loss or ugly structure.

const transformBlocksToSubwaytext = (blocks) => {
  return blocks.reduce((content, block) => {
    if (block.type === "paragraph") {
      content += block.data.text
        .replaceAll("<br>", "\n")
        .replaceAll("&nbsp;", "\u0020")
        .replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
        
    } else if (block.type === "link") {
      content += block.data.link + " " + block.data.meta.title;
    } else if (block.type === "list") {
      if (block.data.type === "unordered") {
        content += "- "
          + block.data.items
            .map((item) => {
              return item.replaceAll("<br>", "\n");
            })
            .split("\n- ");
      } else {
        block.data.items.forEach((item, i, items) => {
          const newItemValue = (item.endsWith("<br>") ? item.substring(0, item.length - 4) : item)
            .replaceAll("<br>", "\n");
          content += (i + 1).toString() + ". " + newItemValue;
          if (i < items.length - 1) {
            content += "\n";
          }
        });
      }
    } else if (block.type === "code") {
      content += "<>\n" + block.data.code + "\n<>";
    } else if (block.type === "header") {
      content += "# " + block.data.text;
    } else if (
      [
        "audio", "video", "image", "document",
      ].includes(block.type)
    ) {
      content += "/file:" + block.data.file?.fileId;
      if (block.data.caption) {
        content += " " + block.data.caption;
      }
    } else {
      throw new Error("Unknown block type: " + block.type);
    }

    content += "\n\n";
    return content;
  }, "");
}


const getFilesFromBlocks = (note, getFileSize):Promise<FileInfo[]> => {
  return Promise.all(
    note.blocks
      .filter((block) => {
        return (
          [
            "audio", "video", "image", "document",
          ].includes(block.type)
          && block.data.file
          && typeof block.data.file.fileId === "string"
        );
      })
      .map(async (block):Promise<FileInfo> => {
        let size;
        try {
          size = await getFileSize(block.data.file.fileId)
        } catch (e) {
          size = -1;
        }

        return {
          fileId: block.data.file.fileId,
          name: block.data.file.name || block.data.file.fileId,
          size,
          creationTime: note.creationTime,
        }
      }),
  );
}


const updateNote = async (note, getFileSize, graph) => {
  if (!note.content) note.content = "";

  if (note.blocks) {
    note.content = transformBlocksToSubwaytext(note.blocks);
    const filesOfNote = await getFilesFromBlocks(note, getFileSize);
    graph.files = [...graph.files, ...filesOfNote];
    delete note.blocks;
  }
};


const updateNotes = async (notes, getFileSize, graph) => {
  await Promise.all(
    notes.map((note) => updateNote(note, getFileSize, graph)),
  );
};


// this function must be indempotent, so that it always results in one
// canonical data structure
const updateGraphDataStructure = async (graph, getFileSize) => {
  if (!graph.files) graph.files = [];
  await updateNotes(graph.notes, getFileSize, graph);
};


export default updateGraphDataStructure;
