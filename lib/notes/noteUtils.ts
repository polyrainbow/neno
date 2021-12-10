import DatabaseMainData from "./interfaces/DatabaseMainData.js";
import DatabaseNote from "./interfaces/DatabaseNote.js";
import { FileId } from "./interfaces/FileId.js";
import GraphNodePositionUpdate from "./interfaces/GraphNodePositionUpdate.js";
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
    return text.trim().substr(0, maxLength) + "…";
  } else {
    return text;
  }
};


const getNoteTitle = (note:Note, maxLength = 800):string => {
  if (
    note.blocks.length > 0
    && [
      NoteContentBlockType.PARAGRAPH,
      NoteContentBlockType.HEADING,
    ].includes(note.blocks[0].type)
  ) {
    const block
      = note.blocks[0] as NoteContentBlockParagraph | NoteContentBlockHeading;
    const title
      = Utils.unescapeHTML(block.data.text).trim();

    const titleShortened = shortenText(title, maxLength);

    if (titleShortened.length === 0) {
      return NOTE_TITLE_PLACEHOLDER;
    }

    return titleShortened;
  } else {
    return NOTE_TITLE_PLACEHOLDER;
  }
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
  note:NoteFromUser,
  db:DatabaseMainData,
):boolean => {
  const noteTitle = getNoteTitle(note);

  return db.notes.some((noteFromDB:DatabaseNote):boolean => {
    const noteFromDBTitle = getNoteTitle(noteFromDB);
    return (
      (noteFromDBTitle === noteTitle)
      && (note.id !== noteFromDB.id)
    );
  });
};


const findNote = (db:DatabaseMainData, noteId:NoteId):DatabaseNote | null => {
  return Utils.binaryArrayFind(db.notes, "id", noteId);
};


const getNewNoteId = (db:DatabaseMainData):NoteId => {
  db.idCounter = db.idCounter + 1;
  return db.idCounter;
};


const updateNotePosition = (
  db:DatabaseMainData,
  nodePositionUpdate: GraphNodePositionUpdate,
): boolean => {
  const note:DatabaseNote | null = findNote(db, nodePositionUpdate.id);
  if (note === null) {
    return false;
  }
  note.position = nodePositionUpdate.position;
  return true;
};


const getLinksOfNote = (db:DatabaseMainData, noteId:NoteId):Link[] => {
  const linksOfThisNote:Link[] = db.links
    .filter((link:Link):boolean => {
      return (link[0] === noteId) || (link[1] === noteId);
    });

  return linksOfThisNote;
}


const getLinkedNotes = (db:DatabaseMainData, noteId:NoteId):LinkedNote[] => {
  const notes:DatabaseNote[] = getLinksOfNote(db, noteId)
    .map((link:Link):DatabaseNote => {
      const linkedNoteId = (link[0] === noteId) ? link[1] : link[0];
      // we are sure that the notes we are retrieving from noteIds in links
      // really exist. that's why we cast the result of findNote as
      // DatabaseNote
      return findNote(db, linkedNoteId) as DatabaseNote;
    });

  const linkedNotes:LinkedNote[] = notes
    .map((note:DatabaseNote) => {
      const linkedNote:LinkedNote = {
        id: note.id,
        title: getNoteTitle(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
      }
      return linkedNote;
    });

  return linkedNotes;
};


const getNumberOfLinkedNotes = (db:DatabaseMainData, noteId:NoteId):number => {
  const linksOfThisNote:Link[] = getLinksOfNote(db, noteId);
  const numberOfLinkedNotes = linksOfThisNote.length;
  return numberOfLinkedNotes;
}


const getNumberOfLinkedNotesForSeveralNotes = (
  db:DatabaseMainData,
  noteIds:NoteId[],
):any => {

  const numbersOfLinkedNotes = {};
  noteIds.forEach((noteId) => {
    numbersOfLinkedNotes[noteId] = 0;
  });

  db.links.forEach((link) => {
    if (typeof numbersOfLinkedNotes[link[0]] === "number"){
      numbersOfLinkedNotes[link[0]]++;
    }

    if (typeof numbersOfLinkedNotes[link[1]] === "number"){
      numbersOfLinkedNotes[link[1]]++;
    }
  });

  return numbersOfLinkedNotes;
}


const getNumberOfUnlinkedNotes = (db:DatabaseMainData):number => {
  /*
  We could do it like this but then the links array is traversed as many times
  as there are notes. So we don't do it like this. We do it faster.

  const numberOfUnlinkedNotes = db.notes.filter((note) => {
    return getNumberOfLinkedNotes(db, note.id) === 0;
  }).length;
  */

  const linkedNotes = new Set();

  db.links.forEach((link) => {
    linkedNotes.add(link[0]);
    linkedNotes.add(link[1]);
  });

  const numberOfAllNotes = db.notes.length;
  const numberOfLinkedNotes = Array.from(linkedNotes).length;
  const numberOfUnlinkedNotes = numberOfAllNotes - numberOfLinkedNotes;

  return numberOfUnlinkedNotes;
};


const removeLinksOfNote = (db: DatabaseMainData, noteId: NoteId):true => {
  db.links = db.links.filter((link) => {
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
  return true;
};


const getFilesOfNote = (note:DatabaseNote):FileId[] => {
  return note.blocks
    .filter(blockHasFile)
    .map((block: NoteContentBlockWithFile):FileId => {
      return block.data.file.fileId;
    });
};


const incorporateUserChangesIntoNote = (
  changes:UserNoteChange[] | undefined,
  note:DatabaseNote,
  db:DatabaseMainData,
):void => {
  if (Array.isArray(changes)) {
    changes.forEach((change) => {
      if (change.type === UserNoteChangeType.LINKED_NOTE_ADDED) {
        const link:Link = [note.id, change.noteId];
        db.links.push(link);
      }

      if (change.type === UserNoteChangeType.LINKED_NOTE_DELETED) {
        db.links = db.links.filter((link) => {
          return !(
            link.includes(note.id) && link.includes(change.noteId)
          );
        });
      }
    });
  }
};


const createNoteToTransmit = (
  databaseNote:NonNullable<DatabaseNote>,
  db: NonNullable<DatabaseMainData>,
):NoteToTransmit => {
  const noteToTransmit:NoteToTransmit = {
    id: databaseNote.id,
    blocks: databaseNote.blocks,
    title: getNoteTitle(databaseNote),
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    linkedNotes: getLinkedNotes(db, databaseNote.id),
    position: databaseNote.position,
    numberOfCharacters: getNumberOfCharacters(databaseNote),
  };

  return noteToTransmit;
}


const createNoteListItem = (
  databaseNote:NonNullable<DatabaseNote>,
  db: NonNullable<DatabaseMainData>,
  // for performance reasons, numberOfLinkedNotes can be given as argument,
  // so that this function does not have to find it out by itself for each
  // NoteListItem to be created
  numberOfLinkedNotes?:number,
):NoteListItem => {
  const noteListItem:NoteListItem = {
    id: databaseNote.id,
    title: getNoteTitle(databaseNote),
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    features: getNoteFeatures(databaseNote),
    numberOfLinkedNotes: typeof numberOfLinkedNotes === "number"
      ? numberOfLinkedNotes
      : getNumberOfLinkedNotes(db, databaseNote.id),
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    numberOfFiles: getNumberOfFiles(databaseNote),
  };

  return noteListItem;
};


const createNoteListItems = (
  databaseNotes:DatabaseNote[],
  db: DatabaseMainData,
):NoteListItem[] => {
  /*
    Before we transform every DatabaseNote to a NoteListItem, we get the
    number of linked notes for every note in one batch. This is more performant
    than traversing all links again and again for every single note.
  */
  const noteIds = databaseNotes.map((note) => note.id);
  const numbersOfLinkedNotes
    = getNumberOfLinkedNotesForSeveralNotes(db, noteIds);

  const noteListItems = databaseNotes.map((databaseNote) => {
    return createNoteListItem(
      databaseNote,
      db,
      numbersOfLinkedNotes[databaseNote.id],
    );
  })

  return noteListItems;
};


const getNoteFeatures = (note:DatabaseNote):NoteListItemFeatures => {
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
}


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


const getNumberOfFiles = (note:DatabaseNote) => {
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


const getNumberOfCharacters = (note:DatabaseNote):number => {
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


const getURLsOfNote = (note:DatabaseNote):string[] => {
  return note.blocks
    .filter((block):block is NoteContentBlockLink => {
      return block.type === NoteContentBlockType.LINK;
    })
    .map((block) => {
      return block.data.link;
    });
}


// https://en.wikipedia.org/wiki/Breadth-first_search
const breadthFirstSearch = (nodes, links, root: DatabaseNote):DatabaseNote[] => {
  const queue:DatabaseNote[] = [];
  const discovered:DatabaseNote[] = [];
  discovered.push(root);
  queue.push(root);

  while (queue.length > 0) {
    const v = queue.shift() as DatabaseNote;
    const connectedNodes = links
      .filter((link:Link):boolean => {
        return (link[0] === v.id) || (link[1] === v.id);
      })
      .map((link:Link):DatabaseNote => {
        const linkedNoteId = (link[0] === v.id) ? link[1] : link[0];
        // we are sure that the notes we are retrieving from noteIds in links
        // really exist. that's why we cast the result of findNote as
        // DatabaseNote
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
}


// https://en.wikipedia.org/wiki/Component_(graph_theory)#Algorithms
const getNumberOfComponents = (nodes:DatabaseNote[], links:Link[]):number => {
  let totallyDiscovered:DatabaseNote[] = [];
  let numberOfComponents = 0;

  let i = 0;

  while (totallyDiscovered.length < nodes.length)  {
    let root = nodes[i];
    while (totallyDiscovered.includes(root)) {
      i++;
      root = nodes[i];
    }
    const inComponent = breadthFirstSearch(nodes, links, root);
    totallyDiscovered = [...totallyDiscovered, ...inComponent] as DatabaseNote[];
    numberOfComponents++;
    i++;
  }

  return numberOfComponents;
}


// this returns all notes that contain a url that is used in another note too
const getNotesWithDuplicateUrls = (notes:DatabaseNote[]):DatabaseNote[] => {
  const urlIndex = new Map<string, Set<DatabaseNote>>();

  notes.forEach((note:DatabaseNote):void => {
    const urls = getURLsOfNote(note);

    urls.forEach((url) => {
      if (urlIndex.has(url)) {
        (urlIndex.get(url) as Set<DatabaseNote>).add(note);
      } else {
        urlIndex.set(url, new Set([note]));
      }
    });
  });

  const duplicates:Set<DatabaseNote> = new Set();

  for (const notesWithUrl of urlIndex.values()) {
    if (notesWithUrl.size > 1) {
      notesWithUrl.forEach((note) => {
        duplicates.add(note);
      });
    }
  }

  return Array.from(duplicates);
};


const getNotesWithDuplicateTitles = (notes:DatabaseNote[]):DatabaseNote[] => {
  const titleIndex = new Map<string, Set<DatabaseNote>>();

  notes.forEach((note:DatabaseNote):void => {
    const noteTitle = getNoteTitle(note);

    if (titleIndex.has(noteTitle)) {
      (titleIndex.get(noteTitle) as Set<DatabaseNote>).add(note);
    } else {
      titleIndex.set(noteTitle, new Set([note]));
    }
  });

  const duplicates:Set<DatabaseNote> = new Set();

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
  notes:DatabaseNote[],
  query: string,
  caseSensitive: boolean,
):DatabaseNote[] => {
  return notes.filter((note:DatabaseNote) => {
    const title = getNoteTitle(note);

    return caseSensitive
      ? title === query
      : title.toLowerCase() === query.toLowerCase();
  });
}


const getNotesWithUrl = (
  notes:DatabaseNote[],
  url: string,
):DatabaseNote[] => {
  return notes.filter((note:DatabaseNote) => {
    return note.blocks
      .filter((block):block is NoteContentBlockLink => {
        return block.type === NoteContentBlockType.LINK;
      })
      .some((linkBlock) => linkBlock.data.link === url);
  });
}


const getConcatenatedTextOfNote = (note:DatabaseNote):string => {
  return note.blocks.reduce((accumulator, block) => {
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
};


const getNotesWithTitleContainingTokens = (
  notes: DatabaseNote[],
  query: string,
  caseSensitive: boolean
):DatabaseNote[] => {
  return notes.filter((note:DatabaseNote) => {
    if (query.length === 0) {
      return true;
    }

    if (query.length > 0 && query.length < 3) {
      return false;
    }

    const title = getNoteTitle(note);
    const queryTokens = query.split(" ");

    if (caseSensitive) {
      return queryTokens.every((queryToken) => {
        return title.includes(queryToken);
      });
    } else {
      return queryTokens.every((queryToken) => {
        return title.toLowerCase().includes(queryToken.toLowerCase());
      });
    }
  });
}


const getNotesThatContainTokens = (
  notes:DatabaseNote[],
  query: string,
  caseSensitive: boolean,
):DatabaseNote[] => {
  const queryTokens = query.split(" ");

  return notes
    .filter((note:DatabaseNote) => {
      const noteText = getConcatenatedTextOfNote(note);

      // the note text must include every query token to be a positive
      return queryTokens.every((queryToken) => {
        return caseSensitive
          ? noteText.includes(queryToken)
          : noteText.toLowerCase().includes(queryToken.toLowerCase());
      });
    });
}


const getNotesWithBlocksOfTypes = (
  notes:DatabaseNote[],
  types: NoteContentBlockType[],
  notesMustContainAllBlockTypes:boolean,
):DatabaseNote[] => {
  return notesMustContainAllBlockTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note:DatabaseNote):boolean => {
        return types.every((type) => {
          return note.blocks.some((block) => block.type === type);
        });
      })
    // every note must contain one block with only one type of types:
    : notes
      .filter((note:DatabaseNote):boolean => {
        return note.blocks.some((block) => types.includes(block.type));
      });
}


export {
  getNoteTitle,
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
  getConcatenatedTextOfNote,
  blockHasFile,
  getNotesWithTitleContainingTokens,
  getNotesThatContainTokens,
  getNotesWithBlocksOfTypes,
};
