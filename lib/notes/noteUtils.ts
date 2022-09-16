import Graph from "./interfaces/Graph.js";
import { FileId } from "./interfaces/FileId.js";
import GraphNodePositionUpdate from "./interfaces/NodePositionUpdate.js";
import { Link } from "./interfaces/Link.js";
import LinkedNote from "./interfaces/LinkedNote.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import { NoteId } from "./interfaces/NoteId.js";
import NoteListItem from "./interfaces/NoteListItem.js";
import NoteListItemFeatures from "./interfaces/NoteListItemFeatures.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import UserNoteChange from "./interfaces/UserNoteChange.js";
import { UserNoteChangeType } from "./interfaces/UserNoteChangeType.js";
import { MediaType } from "./interfaces/MediaType.js";
import { NoteContent } from "./interfaces/NoteContent.js";
import { FileInfo } from "./interfaces/FileInfo.js";
import subwaytext from "../subwaytext/index.js";
import {
  Block,
  BlockSlashlink,
  BlockType,
} from "../subwaytext/interfaces/Block.js";
import { Note } from "./interfaces/Note.js";
import { ExistingNoteMetadata } from "./interfaces/NoteMetadata.js";
import { CanonicalNoteHeader } from "./interfaces/CanonicalNoteHeader.js";


const getExtensionFromFilename = (filename: string): string | null => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return null;
  }

  const extension = filename.substring(posOfDot + 1);
  if (extension.length === 0) {
    return null;
  }

  return extension;
};


const getMediaTypeFromFilename = (
  filename: string,
): MediaType => {
  const map = new Map<string, MediaType>(Object.entries({
    "png": MediaType.IMAGE,
    "jpg": MediaType.IMAGE,
    "webp": MediaType.IMAGE,
    "gif": MediaType.IMAGE,
    "svg": MediaType.IMAGE,
    "pdf": MediaType.PDF,
    "mp3": MediaType.AUDIO,
    "flac": MediaType.AUDIO,
    "mp4": MediaType.VIDEO,
    "webm": MediaType.VIDEO,
    "js": MediaType.TEXT,
    "json": MediaType.TEXT,
    "txt": MediaType.TEXT,
  }));

  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return MediaType.OTHER;
  }

  return map.has(extension) ? map.get(extension) as MediaType : MediaType.OTHER;
};


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const getNoteTitlePreview = (note: Note, maxLength = 800): string => {
  const titleTrimmed = note.meta.title.trim();
  const titleShortened = shortenText(titleTrimmed, maxLength);
  return titleShortened;
};


const normalizeNoteTitle = (title: string): string => {
  return title
    .replaceAll(/[\r\n]/g, " ")
    .trim();
};


const noteWithSameTitleExists = (
  userNote: Note,
  graph: Graph,
): boolean => {
  return graph.notes.some((noteFromDB: ExistingNote): boolean => {
    return (
      (noteFromDB.meta.title === userNote.meta.title)
      && (
        (
          "id" in userNote.meta
          && (noteFromDB.meta.id !== userNote.meta.id)
        )
        || (
          !("id" in userNote.meta)
        )
      )
    );
  });
};

/*
  This function performs a binary search in an array of notes that are
  sorted by id.
*/
const findNote = (
  graph: Graph,
  noteId: NoteId,
): ExistingNote | null => {
  const notesSorted = graph.notes;
  let start = 0;
  let end = notesSorted.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);
    const note = notesSorted[mid];

    // If element is present at mid, return it
    if (note.meta.id === noteId) {
      return note;
    // Else look in left or right half accordingly
    } else if (note.meta.id < noteId) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return null;
};


const findNoteIndex = (
  graph: Graph,
  noteId: NoteId,
): number => {
  const notesSorted = graph.notes;
  let start = 0;
  let end = notesSorted.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);
    const note = notesSorted[mid];

    // If element is present at mid, return index
    if (note.meta.id === noteId) {
      return mid;
    // Else look in left or right half accordingly
    } else if (note.meta.id < noteId) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return -1;
};


const getNewNoteId = (graph: Graph): NoteId => {
  graph.idCounter = graph.idCounter + 1;
  return graph.idCounter;
};


const updateNotePosition = (
  graph: Graph,
  nodePositionUpdate: GraphNodePositionUpdate,
): boolean => {
  const note: ExistingNote | null = findNote(graph, nodePositionUpdate.id);
  if (note === null) {
    return false;
  }
  note.meta.position = nodePositionUpdate.position;
  return true;
};


const getLinksOfNote = (graph: Graph, noteId: NoteId): Link[] => {
  const linksOfThisNote: Link[] = graph.links
    .filter((link: Link): boolean => {
      return (link[0] === noteId) || (link[1] === noteId);
    });

  return linksOfThisNote;
};


const getLinkedNotes = (graph: Graph, noteId: NoteId): LinkedNote[] => {
  const notes: ExistingNote[] = getLinksOfNote(graph, noteId)
    .map((link: Link): ExistingNote => {
      const linkedNoteId = (link[0] === noteId) ? link[1] : link[0];
      // we are sure that the notes we are retrieving from noteIds in links
      // really exist. that's why we cast the result of findNote as
      // ExistingNote
      return findNote(graph, linkedNoteId) as ExistingNote;
    });

  const linkedNotes: LinkedNote[] = notes
    .map((note: ExistingNote) => {
      const linkedNote: LinkedNote = {
        id: note.meta.id,
        title: getNoteTitlePreview(note),
        createdAt: note.meta.createdAt,
        updatedAt: note.meta.updatedAt,
      };
      return linkedNote;
    });

  return linkedNotes;
};


const getNumberOfLinkedNotes = (graph: Graph, noteId: NoteId): number => {
  const linksOfThisNote: Link[] = getLinksOfNote(graph, noteId);
  const numberOfLinkedNotes = linksOfThisNote.length;
  return numberOfLinkedNotes;
};


const getNumberOfLinkedNotesForSeveralNotes = (
  graph: Graph,
  noteIds: NoteId[],
): Map<NoteId, number> => {

  const map = new Map<NoteId, number>();
  noteIds.forEach((noteId) => {
    map.set(noteId, 0);
  });

  graph.links.forEach((link) => {
    if (map.has(link[0])){
      const newLinkNumber = map.get(link[0]) as number + 1;
      map.set(link[0], newLinkNumber);
    }

    if (map.has(link[1])){
      const newLinkNumber = map.get(link[1]) as number + 1;
      map.set(link[1], newLinkNumber);
    }
  });

  return map;
};


const getNumberOfUnlinkedNotes = (graph: Graph): number => {
  /*
  We could do it like this but then the links array is traversed as many times
  as there are notes. So we don't do it like this. We do it faster.

  const numberOfUnlinkedNotes = graph.notes.filter((note) => {
    return getNumberOfLinkedNotes(graph, note.id) === 0;
  }).length;
  */

  const linkedNotes = new Set();

  graph.links.forEach((link) => {
    linkedNotes.add(link[0]);
    linkedNotes.add(link[1]);
  });

  const numberOfAllNotes = graph.notes.length;
  const numberOfLinkedNotes = Array.from(linkedNotes).length;
  const numberOfUnlinkedNotes = numberOfAllNotes - numberOfLinkedNotes;

  return numberOfUnlinkedNotes;
};


const removeLinksOfNote = (graph: Graph, noteId: NoteId): void => {
  graph.links = graph.links.filter((link) => {
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
};


const parseFileIds = (noteContent: NoteContent): FileId[] => {
  // eslint-disable-next-line max-len
  const regex = /\/file:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  return [...noteContent.matchAll(regex)].map((match) => match[1]);
};


const getFileId = (input: string): FileId | null => {
  // eslint-disable-next-line max-len
  const regex = /file:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  const results = [...input.matchAll(regex)].map((match) => match[1]);
  if (results.length > 0) {
    return results[0];
  } else {
    return null;
  }
};


const getFileInfos = (
  graph: Graph,
  noteContent: NoteContent,
): FileInfo[] => {
  const fileIds = parseFileIds(noteContent);
  const files = graph.files
    .filter((file: FileInfo) => fileIds.includes(file.fileId));
  return files;
};


const incorporateUserChangesIntoNote = (
  changes: UserNoteChange[] | undefined,
  note: ExistingNote,
  graph: Graph,
): void => {
  if (Array.isArray(changes)) {
    changes.forEach((change) => {
      if (change.type === UserNoteChangeType.LINKED_NOTE_ADDED) {
        const link: Link = [note.meta.id, change.noteId];
        graph.links.push(link);
      }

      if (change.type === UserNoteChangeType.LINKED_NOTE_DELETED) {
        graph.links = graph.links.filter((link) => {
          return !(
            link.includes(note.meta.id) && link.includes(change.noteId)
          );
        });
      }
    });
  }
};


const createNoteToTransmit = async (
  databaseNote: ExistingNote,
  graph: Graph,
): Promise<NoteToTransmit> => {
  const noteToTransmit: NoteToTransmit = {
    content: databaseNote.content,
    meta: databaseNote.meta,
    linkedNotes: getLinkedNotes(graph, databaseNote.meta.id),
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    files: getFileInfos(graph, databaseNote.content),
  };

  return noteToTransmit;
};


const createNoteListItem = (
  databaseNote: ExistingNote,
  graph: Graph,
  // for performance reasons, numberOfLinkedNotes can be given as argument,
  // so that this function does not have to find it out by itself for each
  // NoteListItem to be created
  numberOfLinkedNotes?: number,
): NoteListItem => {
  const blocks = subwaytext(databaseNote.content);

  const noteListItem: NoteListItem = {
    id: databaseNote.meta.id,
    title: getNoteTitlePreview(databaseNote),
    createdAt: databaseNote.meta.createdAt,
    updatedAt: databaseNote.meta.updatedAt,
    features: getNoteFeatures(blocks),
    numberOfLinkedNotes: typeof numberOfLinkedNotes === "number"
      ? numberOfLinkedNotes
      : getNumberOfLinkedNotes(graph, databaseNote.meta.id),
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    numberOfFiles: getNumberOfFiles(blocks),
  };

  return noteListItem;
};


const createNoteListItems = (
  databaseNotes: ExistingNote[],
  graph: Graph,
): NoteListItem[] => {
  /*
    Before we transform every ExistingNote to a NoteListItem, we get the
    number of linked notes for every note in one batch. This is more performant
    than traversing all links again and again for every single note.
  */
  const noteIds = databaseNotes.map((note) => note.meta.id);
  const numbersOfLinkedNotes
    = getNumberOfLinkedNotesForSeveralNotes(graph, noteIds);

  const noteListItems = databaseNotes.map((databaseNote) => {
    return createNoteListItem(
      databaseNote,
      graph,
      numbersOfLinkedNotes.get(databaseNote.meta.id),
    );
  });

  return noteListItems;
};


const getNoteFeatures = (
  blocks: Block[],
): NoteListItemFeatures => {
  let containsText = false;
  let containsWeblink = false;
  let containsCode = false;
  let containsImages = false;
  let containsDocuments = false;
  let containsAudio = false;
  let containsVideo = false;

  blocks.forEach((block) => {
    if (
      (
        (block.type === BlockType.PARAGRAPH)
        && block.data.text.length > 0
      )
      || (
        (block.type === BlockType.HEADING)
        && block.data.text.trim().length > 0
      )
      || (
        (block.type === BlockType.LIST)
        && block.data.items.length > 0
        && block.data.items[0].length > 0
      )
    ) {
      containsText = true;
    }
    if (block.type === BlockType.URL) {
      containsWeblink = true;
    }
    if (block.type === BlockType.CODE) {
      containsCode = true;
    }
    if (block.type === BlockType.SLASHLINK) {
      const fileId = getFileId(block.data.link);
      if (fileId) {
        const mediaType = getMediaTypeFromFilename(fileId);
        if (mediaType === MediaType.IMAGE) {
          containsImages = true;
        } else if (mediaType === MediaType.PDF) {
          containsDocuments = true;
        } else if (mediaType === MediaType.AUDIO) {
          containsAudio = true;
        } else if (mediaType === MediaType.VIDEO) {
          containsVideo = true;
        }
      }
    }
  });

  const features: NoteListItemFeatures = {
    containsText,
    containsWeblink,
    containsCode,
    containsImages,
    containsDocuments,
    containsAudio,
    containsVideo,
  };

  return features;
};


const getSortKeyForTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/(["'.“”„‘’—\-»#*[\]/])/g, "")
    .trim();
};


/**
 * Checks if the block contains a valid file.
 * @param block
 * @returns {boolean} true or false
 */
const blockHasLoadedFile = (
  block: Block,
): block is BlockSlashlink => {
  if (
    block.type !== BlockType.SLASHLINK
  ) return false;

  return !!getFileId(block.data.link);
};


const getNumberOfFiles = (blocks: Block[]): number => {
  return blocks.filter(blockHasLoadedFile).length;
};


const getSortFunction = (
  sortMode: NoteListSortMode,
):((a: NoteListItem, b: NoteListItem) => number) => {
  const sortFunctions = {
    [NoteListSortMode.CREATION_DATE_ASCENDING]: (a, b) => {
      return a.createdAt - b.createdAt;
    },
    [NoteListSortMode.CREATION_DATE_DESCENDING]: (a, b) => {
      return b.createdAt - a.createdAt;
    },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]: (a, b) => {
      return a.updatedAt - b.updatedAt;
    },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]: (a, b) => {
      return b.updatedAt - a.updatedAt;
    },
    [NoteListSortMode.TITLE_ASCENDING]: (a, b) => {
      const aNormalized = getSortKeyForTitle(a.title);
      const bNormalized = getSortKeyForTitle(b.title);

      return aNormalized.localeCompare(bNormalized);
    },
    [NoteListSortMode.TITLE_DESCENDING]: (a, b) => {
      const aNormalized = getSortKeyForTitle(a.title);
      const bNormalized = getSortKeyForTitle(b.title);

      return bNormalized.localeCompare(aNormalized);
    },
    [NoteListSortMode.NUMBER_OF_LINKS_ASCENDING]: (a, b) => {
      return a.numberOfLinkedNotes - b.numberOfLinkedNotes;
    },
    [NoteListSortMode.NUMBER_OF_LINKS_DESCENDING]: (a, b) => {
      return b.numberOfLinkedNotes - a.numberOfLinkedNotes;
    },
    [NoteListSortMode.NUMBER_OF_FILES_ASCENDING]: (a, b) => {
      return a.numberOfFiles - b.numberOfFiles;
    },
    [NoteListSortMode.NUMBER_OF_FILES_DESCENDING]: (a, b) => {
      return b.numberOfFiles - a.numberOfFiles;
    },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING]: (a, b) => {
      return a.numberOfCharacters - b.numberOfCharacters;
    },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING]: (a, b) => {
      return b.numberOfCharacters - a.numberOfCharacters;
    },
  };

  return sortFunctions[sortMode] ?? sortFunctions.UPDATE_DATE_ASCENDING;
};


const getNumberOfCharacters = (note: ExistingNote): number => {
  return note.content.length;
};


const getURLsOfNote = (noteContent: NoteContent): string[] => {
  // eslint-disable-next-line max-len
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  return [...noteContent.matchAll(regex)].map((match) => match[0]);
};


// https://en.wikipedia.org/wiki/Breadth-first_search
const breadthFirstSearch = (
  nodes: ExistingNote[],
  links,
  root: ExistingNote
): ExistingNote[] => {
  const queue: ExistingNote[] = [];
  const discovered: ExistingNote[] = [];
  discovered.push(root);
  queue.push(root);

  while (queue.length > 0) {
    const v = queue.shift() as ExistingNote;
    const connectedNodes = links
      .filter((link: Link): boolean => {
        return (link[0] === v.meta.id) || (link[1] === v.meta.id);
      })
      .map((link: Link): ExistingNote => {
        const linkedNoteId = (link[0] === v.meta.id) ? link[1] : link[0];
        // we are sure that the notes we are retrieving from noteIds in links
        // really exist. that's why we cast the result of findNote as
        // ExistingNote
        return nodes.find((n) => (n.meta.id === linkedNoteId)) as ExistingNote;
      });
    for (let i = 0; i < connectedNodes.length; i++){
      const w = connectedNodes[i];
      if (!discovered.includes(w)){
        discovered.push(w);
        queue.push(w);
      }
    }
  }

  return discovered;
};


// https://en.wikipedia.org/wiki/Component_(graph_theory)#Algorithms
const getNumberOfComponents = (
  nodes: ExistingNote[],
  links: Link[],
): number => {
  let totallyDiscovered: ExistingNote[] = [];
  let numberOfComponents = 0;

  let i = 0;

  while (totallyDiscovered.length < nodes.length)  {
    let root = nodes[i];
    while (totallyDiscovered.includes(root)) {
      i++;
      root = nodes[i];
    }
    const inComponent = breadthFirstSearch(nodes, links, root);
    totallyDiscovered = [
      ...totallyDiscovered,
      ...inComponent,
    ] as ExistingNote[];
    numberOfComponents++;
    i++;
  }

  return numberOfComponents;
};


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
    const noteTitle = note.meta.title;

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
    const title = note.meta.title;

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
    return note.content.includes(url);
  });
};


const getNotesWithFile = (
  notes: ExistingNote[],
  fileId: FileId,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    return subwaytext(note.content)
      .filter(blockHasLoadedFile)
      .some((block) => getFileId(block.data.link) === fileId);
  });
};


const getNotesWithTitleContainingTokens = (
  notes: ExistingNote[],
  query: string,
  caseSensitive: boolean
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    if (query.length === 0) {
      return true;
    }

    if (query.length > 0 && query.length < 3) {
      return false;
    }

    const queryTokens = query.split(" ");

    if (caseSensitive) {
      return queryTokens.every((queryToken) => {
        return note.meta.title.includes(queryToken);
      });
    } else {
      return queryTokens.every((queryToken) => {
        return note.meta.title.toLowerCase().includes(queryToken.toLowerCase());
      });
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
  types: BlockType[],
  notesMustContainAllBlockTypes: boolean,
): ExistingNote[] => {
  return notesMustContainAllBlockTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: ExistingNote): boolean => {
        return types.every((type) => {
          return subwaytext(note.content).some((block) => block.type === type);
        });
      })
    // every note must contain one block with only one type of types:
    : notes
      .filter((note: ExistingNote): boolean => {
        return subwaytext(note.content)
          .some((block) => types.includes(block.type));
      });
};


const getNotesWithMediaTypes = (
  notes: ExistingNote[],
  types: MediaType[],
  notesMustContainAllMediaTypes: boolean,
): ExistingNote[] => {
  return notesMustContainAllMediaTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: ExistingNote): boolean => {
        return types.every((type) => {
          return subwaytext(note.content).some((block) => {
            if (block.type !== BlockType.SLASHLINK) return false;
            const fileId = getFileId(block.data.link);
            if (!fileId) return false;
            return getMediaTypeFromFilename(fileId) === type;
          });
        });
      })
    // every note must contain one block with only one type of types:
    : notes
      .filter((note: ExistingNote): boolean => {
        return subwaytext(note.content)
          .some((block) => {
            if (block.type !== BlockType.SLASHLINK) return false;
            const fileId = getFileId(block.data.link);
            if (!fileId) return false;
            return types.includes(getMediaTypeFromFilename(fileId));
          });
      });
};


type NoteHeaders = Map<CanonicalNoteHeader | string, string>;
type MetaModifier = (meta: Partial<ExistingNoteMetadata>, val: string) => void;

const parseNoteHeaders = (note: string): NoteHeaders => {
  const headerSection = note.substring(0, note.indexOf("\n\n"));
  const regex = /^:([^:]*):(.*)$/gm;
  const headers = new Map<string, string>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_match, key, value] of headerSection.matchAll(regex)) {
    headers.set(key, value);
  }
  return headers;
};


const serializeNoteHeaders = (headers: NoteHeaders): string => {
  return Array.from(headers.entries()).map(([key, value]) => {
    return ":" + key + ":" + value;
  }).join("\n");
};


const parseSerializedNote = (serializedNote: string): ExistingNote => {
  const canonicalHeaderKeys
    = new Map<CanonicalNoteHeader, MetaModifier>([
      [
        CanonicalNoteHeader.ID,
        (meta, val) => meta.id = parseInt(val)],
      [
        CanonicalNoteHeader.GRAPH_POSITION,
        (meta, val) => {
          const [x, y] = val.split(",").map((string) => parseFloat(string));
          meta.position = {
            x,
            y,
          };
        },
      ],
      [
        CanonicalNoteHeader.TITLE,
        (meta, val) => meta.title = val,
      ],
      [
        CanonicalNoteHeader.CREATED_AT,
        (meta, val) => meta.createdAt = parseInt(val),
      ],
      [
        CanonicalNoteHeader.UPDATED_AT,
        (meta, val) => meta.updatedAt = parseInt(val),
      ],
      [
        CanonicalNoteHeader.FLAGS,
        (meta, val) => {
          meta.flags = val.trim().length > 0
            ? val.trim().split(",")
            : [];
        },
      ],
      [
        CanonicalNoteHeader.CONTENT_TYPE,
        (meta, val) => {
          meta.contentType = val.trim();
        },
      ],
    ]);

  const headers = parseNoteHeaders(serializedNote);
  const partialMeta: Partial<ExistingNoteMetadata> = {};
  const custom = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key as CanonicalNoteHeader)) {
      (canonicalHeaderKeys.get(key as CanonicalNoteHeader) as MetaModifier)(
        partialMeta,
        value,
      );
    } else {
      custom[key] = value;
    }
  }

  partialMeta.custom = custom;

  const requiredFields = [
    "title",
    "id",
    "position",
    "createdAt",
    "updatedAt",
    "contentType",
    "custom",
  ];

  for (const requiredField of requiredFields) {
    if (!(requiredField in partialMeta)) {
      throw new Error(
        "Could not parse note. Missing canonical header: "
        + requiredField,
      );
    }
  }

  // https://stackoverflow.com/a/58986422/3890888
  const meta = partialMeta as ExistingNoteMetadata;

  const note: ExistingNote = {
    content: serializedNote.substring(serializedNote.indexOf("\n\n") + 2),
    meta,
  };
  return note;
};


const serializeNote = (note: ExistingNote): string => {
  const headers: NoteHeaders = new Map([
    [
      CanonicalNoteHeader.ID,
      note.meta.id.toString(),
    ],
    [
      CanonicalNoteHeader.TITLE,
      note.meta.title,
    ],
    [
      CanonicalNoteHeader.CREATED_AT,
      note.meta.createdAt.toString(),
    ],
    [
      CanonicalNoteHeader.UPDATED_AT,
      note.meta.updatedAt.toString(),
    ],
    [
      CanonicalNoteHeader.GRAPH_POSITION,
      Object.values(note.meta.position).join(","),
    ],
    [
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(","),
    ],
    [
      CanonicalNoteHeader.CONTENT_TYPE,
      note.meta.contentType,
    ],
  ]);

  for (const key in note.meta.custom) {
    headers.set(key, note.meta.custom[key]);
  }

  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};


export {
  getExtensionFromFilename,
  getNoteTitlePreview,
  normalizeNoteTitle,
  noteWithSameTitleExists,
  findNote,
  getNewNoteId,
  updateNotePosition,
  getLinkedNotes,
  getNumberOfLinkedNotes,
  removeLinksOfNote,
  parseFileIds,
  incorporateUserChangesIntoNote,
  createNoteToTransmit,
  getNoteFeatures,
  getSortFunction,
  getNumberOfCharacters,
  getURLsOfNote,
  createNoteListItem,
  createNoteListItems,
  getNumberOfComponents,
  getNumberOfUnlinkedNotes,
  getNotesWithDuplicateUrls,
  getNotesWithDuplicateTitles,
  getNotesByTitle,
  getNotesWithUrl,
  getNotesWithFile,
  blockHasLoadedFile,
  getNotesWithTitleContainingTokens,
  getNotesThatContainTokens,
  getNotesWithBlocksOfTypes,
  getNotesWithMediaTypes,
  parseNoteHeaders,
  serializeNoteHeaders,
  parseSerializedNote,
  serializeNote,
  findNoteIndex,
};
