import Graph from "./interfaces/Graph.js";
import SavedNote from "./interfaces/SavedNote.js";
import { FileId } from "./interfaces/FileId.js";
import GraphNodePositionUpdate from "./interfaces/NodePositionUpdate.js";
import { Link } from "./interfaces/Link.js";
import LinkedNote from "./interfaces/LinkedNote.js";
import Note from "./interfaces/Note.js";
import NoteFromUser from "./interfaces/NoteFromUser.js";
import { NoteId } from "./interfaces/NoteId.js";
import NoteListItem from "./interfaces/NoteListItem.js";
import NoteListItemFeatures from "./interfaces/NoteListItemFeatures.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import UserNoteChange from "./interfaces/UserNoteChange.js";
import { UserNoteChangeType } from "./interfaces/UserNoteChangeType.js";
import * as Utils from "../utils.js";
import { MediaType } from "./interfaces/MediaType.js";
import { NoteContent } from "./interfaces/NoteContent.js";
import { FileInfo } from "./interfaces/FileInfo.js";
import subwaytext from "../subwaytext/index.js";
import {
  Block,
  BlockSlashlink,
  BlockType,
} from "../subwaytext/interfaces/Block.js";


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
  const titleTrimmed = note.title.trim();
  const titleShortened = shortenText(titleTrimmed, maxLength);
  return titleShortened;
};


const normalizeNoteTitle = (title: string): string => {
  return title
    .replaceAll(/[\r\n]/g, " ")
    .trim();
};


const noteWithSameTitleExists = (
  userNote: NoteFromUser,
  graph: Graph,
): boolean => {
  return graph.notes.some((noteFromDB: SavedNote): boolean => {
    return (
      (noteFromDB.title === userNote.title)
      && (noteFromDB.id !== userNote.id)
    );
  });
};


const findNote = (graph: Graph, noteId: NoteId): SavedNote | null => {
  return Utils.binaryArrayFind(graph.notes, "id", noteId);
};


const getNewNoteId = (graph: Graph): NoteId => {
  graph.idCounter = graph.idCounter + 1;
  return graph.idCounter;
};


const updateNotePosition = (
  graph: Graph,
  nodePositionUpdate: GraphNodePositionUpdate,
): boolean => {
  const note: SavedNote | null = findNote(graph, nodePositionUpdate.id);
  if (note === null) {
    return false;
  }
  note.position = nodePositionUpdate.position;
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
  const notes: SavedNote[] = getLinksOfNote(graph, noteId)
    .map((link: Link): SavedNote => {
      const linkedNoteId = (link[0] === noteId) ? link[1] : link[0];
      // we are sure that the notes we are retrieving from noteIds in links
      // really exist. that's why we cast the result of findNote as
      // SavedNote
      return findNote(graph, linkedNoteId) as SavedNote;
    });

  const linkedNotes: LinkedNote[] = notes
    .map((note: SavedNote) => {
      const linkedNote: LinkedNote = {
        id: note.id,
        title: getNoteTitlePreview(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
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
  const regex = /\/file:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{3,4})/g;
  return [...noteContent.matchAll(regex)].map((match) => match[1]);
};


const getFileId = (input: string): FileId | null => {
  // eslint-disable-next-line max-len
  const regex = /file:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{3,4})/g;
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
  note: SavedNote,
  graph: Graph,
): void => {
  if (Array.isArray(changes)) {
    changes.forEach((change) => {
      if (change.type === UserNoteChangeType.LINKED_NOTE_ADDED) {
        const link: Link = [note.id, change.noteId];
        graph.links.push(link);
      }

      if (change.type === UserNoteChangeType.LINKED_NOTE_DELETED) {
        graph.links = graph.links.filter((link) => {
          return !(
            link.includes(note.id) && link.includes(change.noteId)
          );
        });
      }
    });
  }
};


const createNoteToTransmit = async (
  databaseNote: SavedNote,
  graph: Graph,
): Promise<NoteToTransmit> => {
  const noteToTransmit: NoteToTransmit = {
    id: databaseNote.id,
    content: databaseNote.content,
    title: databaseNote.title,
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    linkedNotes: getLinkedNotes(graph, databaseNote.id),
    position: databaseNote.position,
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    files: getFileInfos(graph, databaseNote.content),
  };

  return noteToTransmit;
};


const createNoteListItem = (
  databaseNote: SavedNote,
  graph: Graph,
  // for performance reasons, numberOfLinkedNotes can be given as argument,
  // so that this function does not have to find it out by itself for each
  // NoteListItem to be created
  numberOfLinkedNotes?: number,
): NoteListItem => {
  const blocks = subwaytext(databaseNote.content);

  const noteListItem: NoteListItem = {
    id: databaseNote.id,
    title: getNoteTitlePreview(databaseNote),
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    features: getNoteFeatures(blocks),
    numberOfLinkedNotes: typeof numberOfLinkedNotes === "number"
      ? numberOfLinkedNotes
      : getNumberOfLinkedNotes(graph, databaseNote.id),
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    numberOfFiles: getNumberOfFiles(blocks),
  };

  return noteListItem;
};


const createNoteListItems = (
  databaseNotes: SavedNote[],
  graph: Graph,
): NoteListItem[] => {
  /*
    Before we transform every SavedNote to a NoteListItem, we get the
    number of linked notes for every note in one batch. This is more performant
    than traversing all links again and again for every single note.
  */
  const noteIds = databaseNotes.map((note) => note.id);
  const numbersOfLinkedNotes
    = getNumberOfLinkedNotesForSeveralNotes(graph, noteIds);

  const noteListItems = databaseNotes.map((databaseNote) => {
    return createNoteListItem(
      databaseNote,
      graph,
      numbersOfLinkedNotes.get(databaseNote.id),
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
      return a.creationTime - b.creationTime;
    },
    [NoteListSortMode.CREATION_DATE_DESCENDING]: (a, b) => {
      return b.creationTime - a.creationTime;
    },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]: (a, b) => {
      return a.updateTime - b.updateTime;
    },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]: (a, b) => {
      return b.updateTime - a.updateTime;
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


const getNumberOfCharacters = (note: SavedNote): number => {
  return note.content.length;
};


const getURLsOfNote = (noteContent: NoteContent): string[] => {
  // eslint-disable-next-line max-len
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  return [...noteContent.matchAll(regex)].map((match) => match[0]);
};


// https://en.wikipedia.org/wiki/Breadth-first_search
const breadthFirstSearch = (
  nodes: SavedNote[],
  links,
  root: SavedNote
): SavedNote[] => {
  const queue: SavedNote[] = [];
  const discovered: SavedNote[] = [];
  discovered.push(root);
  queue.push(root);

  while (queue.length > 0) {
    const v = queue.shift() as SavedNote;
    const connectedNodes = links
      .filter((link: Link): boolean => {
        return (link[0] === v.id) || (link[1] === v.id);
      })
      .map((link: Link): SavedNote => {
        const linkedNoteId = (link[0] === v.id) ? link[1] : link[0];
        // we are sure that the notes we are retrieving from noteIds in links
        // really exist. that's why we cast the result of findNote as
        // SavedNote
        return nodes.find((n) => (n.id === linkedNoteId)) as SavedNote;
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
const getNumberOfComponents = (nodes: SavedNote[], links: Link[]): number => {
  let totallyDiscovered: SavedNote[] = [];
  let numberOfComponents = 0;

  let i = 0;

  while (totallyDiscovered.length < nodes.length)  {
    let root = nodes[i];
    while (totallyDiscovered.includes(root)) {
      i++;
      root = nodes[i];
    }
    const inComponent = breadthFirstSearch(nodes, links, root);
    totallyDiscovered = [...totallyDiscovered, ...inComponent] as SavedNote[];
    numberOfComponents++;
    i++;
  }

  return numberOfComponents;
};


// this returns all notes that contain a url that is used in another note too
const getNotesWithDuplicateUrls = (notes: SavedNote[]): SavedNote[] => {
  const urlIndex = new Map<string, Set<SavedNote>>();

  notes.forEach((note: SavedNote): void => {
    const urls = getURLsOfNote(note.content);

    urls.forEach((url) => {
      if (urlIndex.has(url)) {
        (urlIndex.get(url) as Set<SavedNote>).add(note);
      } else {
        urlIndex.set(url, new Set([note]));
      }
    });
  });

  const duplicates: Set<SavedNote> = new Set();

  for (const notesWithUrl of urlIndex.values()) {
    if (notesWithUrl.size > 1) {
      notesWithUrl.forEach((note) => {
        duplicates.add(note);
      });
    }
  }

  return Array.from(duplicates);
};


const getNotesWithDuplicateTitles = (notes: SavedNote[]): SavedNote[] => {
  const titleIndex = new Map<string, Set<SavedNote>>();

  notes.forEach((note: SavedNote): void => {
    const noteTitle = note.title;

    if (titleIndex.has(noteTitle)) {
      (titleIndex.get(noteTitle) as Set<SavedNote>).add(note);
    } else {
      titleIndex.set(noteTitle, new Set([note]));
    }
  });

  const duplicates: Set<SavedNote> = new Set();

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
  notes: SavedNote[],
  query: string,
  caseSensitive: boolean,
): SavedNote[] => {
  return notes.filter((note: SavedNote) => {
    const title = note.title;

    return caseSensitive
      ? title === query
      : title.toLowerCase() === query.toLowerCase();
  });
};


const getNotesWithUrl = (
  notes: SavedNote[],
  url: string,
): SavedNote[] => {
  return notes.filter((note: SavedNote) => {
    return note.content.includes(url);
  });
};


const getNotesWithFile = (
  notes: SavedNote[],
  fileId: FileId,
): SavedNote[] => {
  return notes.filter((note: SavedNote) => {
    return subwaytext(note.content)
      .filter(blockHasLoadedFile)
      .some((block) => getFileId(block.data.link) === fileId);
  });
};


const getNotesWithTitleContainingTokens = (
  notes: SavedNote[],
  query: string,
  caseSensitive: boolean
): SavedNote[] => {
  return notes.filter((note: SavedNote) => {
    if (query.length === 0) {
      return true;
    }

    if (query.length > 0 && query.length < 3) {
      return false;
    }

    const queryTokens = query.split(" ");

    if (caseSensitive) {
      return queryTokens.every((queryToken) => {
        return note.title.includes(queryToken);
      });
    } else {
      return queryTokens.every((queryToken) => {
        return note.title.toLowerCase().includes(queryToken.toLowerCase());
      });
    }
  });
};


const getNotesThatContainTokens = (
  notes: SavedNote[],
  query: string,
  caseSensitive: boolean,
): SavedNote[] => {
  const queryTokens = query.split(" ");

  return notes
    .filter((note: SavedNote) => {
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
  notes: SavedNote[],
  types: BlockType[],
  notesMustContainAllBlockTypes: boolean,
): SavedNote[] => {
  return notesMustContainAllBlockTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: SavedNote): boolean => {
        return types.every((type) => {
          return subwaytext(note.content).some((block) => block.type === type);
        });
      })
    // every note must contain one block with only one type of types:
    : notes
      .filter((note: SavedNote): boolean => {
        return subwaytext(note.content)
          .some((block) => types.includes(block.type));
      });
};


const getNotesWithMediaTypes = (
  notes: SavedNote[],
  types: MediaType[],
  notesMustContainAllMediaTypes: boolean,
): SavedNote[] => {
  return notesMustContainAllMediaTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: SavedNote): boolean => {
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
      .filter((note: SavedNote): boolean => {
        return subwaytext(note.content)
          .some((block) => {
            if (block.type !== BlockType.SLASHLINK) return false;
            const fileId = getFileId(block.data.link);
            if (!fileId) return false;
            return types.includes(getMediaTypeFromFilename(fileId));
          });
      });
};


export {
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
};
