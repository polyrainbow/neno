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
import NoteContentBlock, {
  NoteContentBlockHeading,
  NoteContentBlockLink,
  NoteContentBlockParagraph,
  NoteContentBlockType,
  NoteContentBlockWithFile,
} from "./interfaces/NoteContentBlock.js";
import { NOTE_TITLE_PLACEHOLDER } from "./config.js";


const shortenText = (text:string, maxLength:number):string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const getNoteTitlePreview = (note:Note, maxLength = 800):string => {
  if (note.title.length === 0) {
    return NOTE_TITLE_PLACEHOLDER;
  }

  const titleTrimmed = note.title.trim();

  const titleShortened = shortenText(titleTrimmed, maxLength);

  if (titleShortened.length === 0) {
    return NOTE_TITLE_PLACEHOLDER;
  }

  return titleShortened;
};


const normalizeNoteTitle = (title:string) => {
  return title
    .replaceAll(/[\r\n]/g, " ")
    .trim();
};


const removeDefaultTextParagraphs = (note:Note):void => {
  note.blocks = note.blocks.filter((block) => {
    const isDefaultTextParagraph = (
      block.type === "paragraph"
      && block.data.text === "Note text"
    );

    return !isDefaultTextParagraph;
  });
};

const removeEmptyLinkBlocks = (note:Note):void => {
  note.blocks = note.blocks.filter((block) => {
    const isEmptyLinkBlock = (
      block.type === "link"
      && block.data.link === ""
    );

    return !isEmptyLinkBlock;
  });
};


const noteWithSameTitleExists = (
  userNote:NoteFromUser,
  graph:Graph,
):boolean => {
  return graph.notes.some((noteFromDB:SavedNote):boolean => {
    return (
      (noteFromDB.title === userNote.title)
      && (noteFromDB.id !== userNote.id)
    );
  });
};


const findNote = (graph:Graph, noteId:NoteId):SavedNote | null => {
  return Utils.binaryArrayFind(graph.notes, "id", noteId);
};


const getNewNoteId = (graph:Graph):NoteId => {
  graph.idCounter = graph.idCounter + 1;
  return graph.idCounter;
};


const updateNotePosition = (
  graph:Graph,
  nodePositionUpdate: GraphNodePositionUpdate,
): boolean => {
  const note:SavedNote | null = findNote(graph, nodePositionUpdate.id);
  if (note === null) {
    return false;
  }
  note.position = nodePositionUpdate.position;
  return true;
};


const getLinksOfNote = (graph:Graph, noteId:NoteId):Link[] => {
  const linksOfThisNote:Link[] = graph.links
    .filter((link:Link):boolean => {
      return (link[0] === noteId) || (link[1] === noteId);
    });

  return linksOfThisNote;
};


const getLinkedNotes = (graph:Graph, noteId:NoteId):LinkedNote[] => {
  const notes:SavedNote[] = getLinksOfNote(graph, noteId)
    .map((link:Link):SavedNote => {
      const linkedNoteId = (link[0] === noteId) ? link[1] : link[0];
      // we are sure that the notes we are retrieving from noteIds in links
      // really exist. that's why we cast the result of findNote as
      // SavedNote
      return findNote(graph, linkedNoteId) as SavedNote;
    });

  const linkedNotes:LinkedNote[] = notes
    .map((note:SavedNote) => {
      const linkedNote:LinkedNote = {
        id: note.id,
        title: getNoteTitlePreview(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
      };
      return linkedNote;
    });

  return linkedNotes;
};


const getNumberOfLinkedNotes = (graph:Graph, noteId:NoteId):number => {
  const linksOfThisNote:Link[] = getLinksOfNote(graph, noteId);
  const numberOfLinkedNotes = linksOfThisNote.length;
  return numberOfLinkedNotes;
};


const getNumberOfLinkedNotesForSeveralNotes = (
  graph:Graph,
  noteIds:NoteId[],
):Map<NoteId, number> => {

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


const getNumberOfUnlinkedNotes = (graph:Graph):number => {
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


const removeLinksOfNote = (graph: Graph, noteId: NoteId):true => {
  graph.links = graph.links.filter((link) => {
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
  return true;
};


const getFilesOfNote = (note:SavedNote):FileId[] => {
  return note.blocks
    .filter(blockHasFile)
    .map((block: NoteContentBlockWithFile):FileId => {
      return block.data.file.fileId;
    });
};


const incorporateUserChangesIntoNote = (
  changes:UserNoteChange[] | undefined,
  note:SavedNote,
  graph:Graph,
):void => {
  if (Array.isArray(changes)) {
    changes.forEach((change) => {
      if (change.type === UserNoteChangeType.LINKED_NOTE_ADDED) {
        const link:Link = [note.id, change.noteId];
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


const createNoteToTransmit = (
  databaseNote:NonNullable<SavedNote>,
  graph: NonNullable<Graph>,
):NoteToTransmit => {
  const noteToTransmit:NoteToTransmit = {
    id: databaseNote.id,
    blocks: databaseNote.blocks,
    title: databaseNote.title,
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    linkedNotes: getLinkedNotes(graph, databaseNote.id),
    position: databaseNote.position,
    numberOfCharacters: getNumberOfCharacters(databaseNote),
  };

  return noteToTransmit;
};


const createNoteListItem = (
  databaseNote:SavedNote,
  graph: Graph,
  // for performance reasons, numberOfLinkedNotes can be given as argument,
  // so that this function does not have to find it out by itself for each
  // NoteListItem to be created
  numberOfLinkedNotes?:number,
):NoteListItem => {
  const noteListItem:NoteListItem = {
    id: databaseNote.id,
    title: getNoteTitlePreview(databaseNote),
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    features: getNoteFeatures(databaseNote),
    numberOfLinkedNotes: typeof numberOfLinkedNotes === "number"
      ? numberOfLinkedNotes
      : getNumberOfLinkedNotes(graph, databaseNote.id),
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    numberOfFiles: getNumberOfFiles(databaseNote),
  };

  return noteListItem;
};


const createNoteListItems = (
  databaseNotes:SavedNote[],
  graph: Graph,
):NoteListItem[] => {
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


const getNoteFeatures = (note:SavedNote):NoteListItemFeatures => {
  let containsText = false;
  let containsWeblink = false;
  let containsCode = false;
  let containsImages = false;
  let containsDocuments = false;
  let containsAudio = false;
  let containsVideo = false;

  note.blocks.forEach((block) => {
    if (block.type === NoteContentBlockType.PARAGRAPH) {
      containsText = true;
    }
    if (block.type === NoteContentBlockType.LINK) {
      containsWeblink = true;
    }
    if (block.type === NoteContentBlockType.CODE) {
      containsCode = true;
    }
    if (block.type === NoteContentBlockType.IMAGE) {
      containsImages = true;
    }
    if (block.type === NoteContentBlockType.DOCUMENT) {
      containsDocuments = true;
    }
    if (block.type === NoteContentBlockType.AUDIO) {
      containsAudio = true;
    }
    if (block.type === NoteContentBlockType.VIDEO) {
      containsVideo = true;
    }
  });

  const features:NoteListItemFeatures = {
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


const getSortKeyForTitle = (title) => {
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
const blockHasFile = (
  block:NoteContentBlock,
):block is NoteContentBlockWithFile => {
  return (
    [
      NoteContentBlockType.IMAGE,
      NoteContentBlockType.DOCUMENT,
      NoteContentBlockType.AUDIO,
      NoteContentBlockType.VIDEO,
    ].includes(block.type)
    && (typeof (block as NoteContentBlockWithFile).data.file.fileId === "string")
  );
};


const getNumberOfFiles = (note:SavedNote) => {
  return note.blocks.filter(blockHasFile).length;
};

const getSortFunction = (
  sortMode:NoteListSortMode,
):((a:NoteListItem, b:NoteListItem) => number) => {
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


const getNumberOfCharacters = (note:SavedNote):number => {
  return note.blocks.reduce((accumulator, block) => {
    if ([
      NoteContentBlockType.PARAGRAPH,
      NoteContentBlockType.HEADING,
    ].includes(block.type)) {
      return accumulator
        + (block as NoteContentBlockParagraph | NoteContentBlockHeading)
          .data.text.length;
    } else {
      return accumulator;
    }
  }, 0);
};


const getURLsOfNote = (note:SavedNote):string[] => {
  return note.blocks
    .filter((block):block is NoteContentBlockLink => {
      return block.type === NoteContentBlockType.LINK;
    })
    .map((block) => {
      return block.data.link;
    });
};


// https://en.wikipedia.org/wiki/Breadth-first_search
const breadthFirstSearch = (nodes, links, root: SavedNote):SavedNote[] => {
  const queue:SavedNote[] = [];
  const discovered:SavedNote[] = [];
  discovered.push(root);
  queue.push(root);

  while (queue.length > 0) {
    const v = queue.shift() as SavedNote;
    const connectedNodes = links
      .filter((link:Link):boolean => {
        return (link[0] === v.id) || (link[1] === v.id);
      })
      .map((link:Link):SavedNote => {
        const linkedNoteId = (link[0] === v.id) ? link[1] : link[0];
        // we are sure that the notes we are retrieving from noteIds in links
        // really exist. that's why we cast the result of findNote as
        // SavedNote
        return nodes.find((n) => (n.id === linkedNoteId));
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
const getNumberOfComponents = (nodes:SavedNote[], links:Link[]):number => {
  let totallyDiscovered:SavedNote[] = [];
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
const getNotesWithDuplicateUrls = (notes:SavedNote[]):SavedNote[] => {
  const urlIndex = new Map<string, Set<SavedNote>>();

  notes.forEach((note:SavedNote):void => {
    const urls = getURLsOfNote(note);

    urls.forEach((url) => {
      if (urlIndex.has(url)) {
        (urlIndex.get(url) as Set<SavedNote>).add(note);
      } else {
        urlIndex.set(url, new Set([note]));
      }
    });
  });

  const duplicates:Set<SavedNote> = new Set();

  for (const notesWithUrl of urlIndex.values()) {
    if (notesWithUrl.size > 1) {
      notesWithUrl.forEach((note) => {
        duplicates.add(note);
      });
    }
  }

  return Array.from(duplicates);
};


const getNotesWithDuplicateTitles = (notes:SavedNote[]):SavedNote[] => {
  const titleIndex = new Map<string, Set<SavedNote>>();

  notes.forEach((note:SavedNote):void => {
    const noteTitle = note.title;

    if (titleIndex.has(noteTitle)) {
      (titleIndex.get(noteTitle) as Set<SavedNote>).add(note);
    } else {
      titleIndex.set(noteTitle, new Set([note]));
    }
  });

  const duplicates:Set<SavedNote> = new Set();

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
  notes:SavedNote[],
  query: string,
  caseSensitive: boolean,
):SavedNote[] => {
  return notes.filter((note:SavedNote) => {
    const title = note.title;

    return caseSensitive
      ? title === query
      : title.toLowerCase() === query.toLowerCase();
  });
};


const getNotesWithUrl = (
  notes:SavedNote[],
  url: string,
):SavedNote[] => {
  return notes.filter((note:SavedNote) => {
    return note.blocks
      .filter((block):block is NoteContentBlockLink => {
        return block.type === NoteContentBlockType.LINK;
      })
      .some((linkBlock) => linkBlock.data.link === url);
  });
};


const getNotesWithFile = (
  notes: SavedNote[],
  file: FileId,
):SavedNote[] => {
  return notes.filter((note:SavedNote) => {
    return note.blocks
      .filter(blockHasFile)
      .some((block) => block.data.file.fileId === file);
  });
};


const getConcatenatedTextOfNote = (note:SavedNote):string => {
  const blockText = note.blocks.reduce((accumulator, block) => {
    if (block.type === NoteContentBlockType.PARAGRAPH) {
      return accumulator + " " + block.data.text;
    } else if (block.type === NoteContentBlockType.HEADING) {
      return accumulator + " " + block.data.text;
    } else if (block.type === NoteContentBlockType.CODE) {
      return accumulator + " " + block.data.code;
    } else if (block.type === NoteContentBlockType.LIST) {
      const itemsConcatenated = block.data.items.join(" ");
      return accumulator + " " + itemsConcatenated;
    } else if (block.type === NoteContentBlockType.IMAGE) {
      return accumulator + " " + block.data.caption;
    } else {
      return accumulator;
    }
  }, "");

  return note.title + " " + blockText;
};


const getNotesWithTitleContainingTokens = (
  notes: SavedNote[],
  query: string,
  caseSensitive: boolean
):SavedNote[] => {
  return notes.filter((note:SavedNote) => {
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
  notes:SavedNote[],
  query: string,
  caseSensitive: boolean,
):SavedNote[] => {
  const queryTokens = query.split(" ");

  return notes
    .filter((note:SavedNote) => {
      const noteText = getConcatenatedTextOfNote(note);

      // the note text must include every query token to be a positive
      return queryTokens.every((queryToken) => {
        return caseSensitive
          ? noteText.includes(queryToken)
          : noteText.toLowerCase().includes(queryToken.toLowerCase());
      });
    });
};


const getNotesWithBlocksOfTypes = (
  notes:SavedNote[],
  types: NoteContentBlockType[],
  notesMustContainAllBlockTypes:boolean,
):SavedNote[] => {
  return notesMustContainAllBlockTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note:SavedNote):boolean => {
        return types.every((type) => {
          return note.blocks.some((block) => block.type === type);
        });
      })
    // every note must contain one block with only one type of types:
    : notes
      .filter((note:SavedNote):boolean => {
        return note.blocks.some((block) => types.includes(block.type));
      });
};


export {
  getNoteTitlePreview,
  normalizeNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinkBlocks,
  noteWithSameTitleExists,
  findNote,
  getNewNoteId,
  updateNotePosition,
  getLinkedNotes,
  getNumberOfLinkedNotes,
  removeLinksOfNote,
  getFilesOfNote,
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
  getConcatenatedTextOfNote,
  blockHasFile,
  getNotesWithTitleContainingTokens,
  getNotesThatContainTokens,
  getNotesWithBlocksOfTypes,
};
