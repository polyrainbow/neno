import { BlockType } from "../subwaytext/types/Block";
import {
  getBlocks,
  getFileSlugsInNote,
  getMediaTypeFromFilename,
  getNoteTitle,
  getURLsOfNote,
} from "./noteUtils";
import ExistingNote from "./types/ExistingNote.js";
import Graph from "./types/Graph.js";
import { MediaType } from "./types/MediaType";
import { Slug } from "./types/Slug.js";
import { setsAreEqual } from "./utils";

// this returns all notes that contain a url that is used in another note too
const getNotesWithDuplicateUrls = (notes: ExistingNote[]): ExistingNote[] => {
  const urlIndex = new Map<string, Set<ExistingNote>>();

  notes.forEach((note: ExistingNote): void => {
    const urls = getURLsOfNote(note.content);

    urls.forEach((url) => {
      if (urlIndex.has(url)) {
        (urlIndex.get(url) as Set<ExistingNote>).add(note);
      } else {
        urlIndex.set(url, new Set([note]));
      }
    });
  });

  const duplicates: Set<ExistingNote> = new Set();

  for (const notesWithUrl of urlIndex.values()) {
    if (notesWithUrl.size > 1) {
      notesWithUrl.forEach((note) => {
        duplicates.add(note);
      });
    }
  }

  return Array.from(duplicates);
};


const getNotesWithDuplicateTitles = (notes: ExistingNote[]): ExistingNote[] => {
  const titleIndex = new Map<string, Set<ExistingNote>>();

  notes.forEach((note: ExistingNote): void => {
    const noteTitle = getNoteTitle(note);

    if (titleIndex.has(noteTitle)) {
      (titleIndex.get(noteTitle) as Set<ExistingNote>).add(note);
    } else {
      titleIndex.set(noteTitle, new Set([note]));
    }
  });

  const duplicates: Set<ExistingNote> = new Set();

  for (const notesWithOneTitle of titleIndex.values()) {
    if (notesWithOneTitle.size > 1) {
      notesWithOneTitle.forEach((note) => {
        duplicates.add(note);
      });
    }
  }

  return Array.from(duplicates);
};


const getNotesByTitle = (
  notes: ExistingNote[],
  query: string,
  caseSensitive: boolean,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    const title = getNoteTitle(note);

    return caseSensitive
      ? title === query
      : title.toLowerCase() === query.toLowerCase();
  });
};


const getNotesWithUrl = (
  notes: ExistingNote[],
  url: string,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    return note.content.includes(url)
      // there should be no char after url string or it should be a
      // whitespace char
      && !(note.content[note.content.indexOf(url) + url.length]?.trim());
  });
};


const getNotesWithKeyValue = (
  notes: ExistingNote[],
  key: string,
  value: string,
) => {
  return notes.filter((note: ExistingNote) => {
    return (
      key in note.meta.custom
      && (
        value.length === 0
        || note.meta.custom[key].includes(value)
      )
    );
  });
};

const getNotesWithFile = (
  notes: ExistingNote[],
  graph: Graph,
  fileSlug: Slug,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
    return fileSlugs.includes(fileSlug);
  });
};


const getNotesWithFlag = (
  notes: ExistingNote[],
  flag: string,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    return note.meta.flags.includes(flag);
  });
};


const getNotesWithTitleOrSlugContainingToken = (
  notes: ExistingNote[],
  token: string,
  caseSensitive: boolean,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    if (token.length === 0) {
      return true;
    }

    if (caseSensitive) {
      return getNoteTitle(note).includes(token)
       || note.meta.slug.includes(token);
    } else {
      return getNoteTitle(note).toLowerCase().includes(token.toLowerCase())
        || note.meta.slug.toLowerCase().includes(token.toLowerCase());
    }
  });
};


const getNotesThatContainTokens = (
  notes: ExistingNote[],
  query: string,
  caseSensitive: boolean,
): ExistingNote[] => {
  const queryTokens = query.split(" ");

  return notes
    .filter((note: ExistingNote) => {
      const noteContent = note.content;

      // the note text must include every query token to be a positive
      return queryTokens.every((queryToken) => {
        return caseSensitive
          ? noteContent.includes(queryToken)
          : noteContent.toLowerCase().includes(queryToken.toLowerCase());
      });
    });
};


const getNotesWithBlocksOfTypes = (
  notes: ExistingNote[],
  graph: Graph,
  types: BlockType[],
  notesMustContainAllBlockTypes: boolean,
): ExistingNote[] => {
  return notesMustContainAllBlockTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: ExistingNote): boolean => {
        return types.every((type) => {
          return getBlocks(note, graph.indexes.blocks)
            .some((block) => block.type === type);
        });
      })
    // every note must contain one block with only one type of types:
    : notes
      .filter((note: ExistingNote): boolean => {
        return getBlocks(note, graph.indexes.blocks)
          .some((block) => types.includes(block.type));
      });
};

const getNotesWithMediaTypes = (
  notes: ExistingNote[],
  graph: Graph,
  requiredMediaTypes: Set<MediaType>,
  everyNoteMustContainAllMediaTypes: boolean,
): ExistingNote[] => {
  return everyNoteMustContainAllMediaTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: ExistingNote): boolean => {
        const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
        const includedMediaTypes = new Set(
          fileSlugs
            .map((fileSlug) => getMediaTypeFromFilename(fileSlug)),
        );

        return setsAreEqual(requiredMediaTypes, includedMediaTypes);
      })
    // every note must contain at least one of requiredMediaTypes:
    : notes
      .filter((note: ExistingNote): boolean => {
        const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
        const includedMediaTypes = new Set(
          fileSlugs
            .map((fileSlug) => getMediaTypeFromFilename(fileSlug)),
        );

        return Array.from(requiredMediaTypes)
          .some((requiredMediaType: MediaType): boolean => {
            return includedMediaTypes.has(requiredMediaType);
          });
      });
};


const getNotesWithCustomMetadata = (
  notes: ExistingNote[],
) => {
  return notes.filter((note: ExistingNote) => {
    return Object.entries(note.meta.custom).length > 0;
  });
};


export {
  getNotesWithDuplicateUrls,
  getNotesThatContainTokens,
  getNotesByTitle,
  getNotesWithUrl,
  getNotesWithFile,
  getNotesWithTitleOrSlugContainingToken,
  getNotesWithBlocksOfTypes,
  getNotesWithDuplicateTitles,
  getNotesWithMediaTypes,
  getNotesWithKeyValue,
  getNotesWithCustomMetadata,
  getNotesWithFlag,
};
