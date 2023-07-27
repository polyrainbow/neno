import Graph from "./interfaces/Graph.js";
import { FileId } from "./interfaces/FileId.js";
import GraphNodePositionUpdate from "./interfaces/NodePositionUpdate.js";
import { Link } from "./interfaces/Link.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import NoteListItem from "./interfaces/NoteListItem.js";
import NoteListItemFeatures from "./interfaces/NoteListItemFeatures.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import { MediaType } from "./interfaces/MediaType.js";
import { NoteContent } from "./interfaces/NoteContent.js";
import { FileInfo } from "./interfaces/FileInfo.js";
import subwaytext from "../subwaytext/index.js";
import {
  Block,
  BlockSlashlink,
  BlockType,
} from "../subwaytext/interfaces/Block.js";
import {
  ExistingNoteMetadata,
  NewNoteMetadata,
  NoteMetadata,
} from "./interfaces/NoteMetadata.js";
import { CanonicalNoteHeader } from "./interfaces/CanonicalNoteHeader.js";
import NewNote from "./interfaces/NewNote.js";
import { Slug } from "./interfaces/Slug.js";
import SparseNoteInfo from "./interfaces/SparseNoteInfo.js";
import LinkCount from "./interfaces/LinkCount.js";
import NotePreview from "./interfaces/NotePreview.js";


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


const canonicalHeaderKeys = new Map<CanonicalNoteHeader, MetaModifier>([
  [
    CanonicalNoteHeader.SLUG,
    (meta, val) => {
      meta.slug = val;
    }],
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
    CanonicalNoteHeader.CREATED_AT,
    (meta, val) => {
      meta.createdAt = parseInt(val);
    },
  ],
  [
    CanonicalNoteHeader.UPDATED_AT,
    (meta, val) => {
      meta.updatedAt = parseInt(val);
    },
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


const parseSerializedExistingNote = (serializedNote: string): ExistingNote => {
  const headers = parseNoteHeaders(serializedNote);
  const partialMeta: Partial<ExistingNoteMetadata> = {};
  const custom: Record<string, string> = {};
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
    "slug",
    "position",
    "createdAt",
    "updatedAt",
    "contentType",
    "custom",
    "flags",
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


const parseSerializedNewNote = (serializedNote: string): NewNote => {
  const headers = parseNoteHeaders(serializedNote);
  const partialMeta: Partial<NewNoteMetadata> = {};
  const custom: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    // we don't want to keep the old id for new notes
    if (key === CanonicalNoteHeader.SLUG) continue;

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
  const meta = partialMeta as NewNoteMetadata;

  const note: NewNote = {
    content: serializedNote.substring(serializedNote.indexOf("\n\n") + 2),
    meta,
  };
  return note;
};


const serializeNote = (note: ExistingNote): string => {
  const headers: NoteHeaders = new Map([
    [
      CanonicalNoteHeader.SLUG,
      note.meta.slug.toString(),
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
    if (Object.hasOwn(note.meta.custom, key)) {
      headers.set(key, note.meta.custom[key]);
    }
  }

  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};


const serializeNewNote = (note: NewNote): string => {
  const headers: NoteHeaders = new Map([
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
    if (Object.hasOwn(note.meta.custom, key)) {
      headers.set(key, note.meta.custom[key]);
    }
  }

  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};


const getNumberOfCharacters = (note: ExistingNote): number => {
  return note.content.length;
};


const removeCustomMetadataWithEmptyKeys = (
  meta: NoteMetadata["custom"],
): NoteMetadata["custom"] => {
  return Object.fromEntries(
    Object.entries(meta)
      .filter((entry) => {
        return entry[0].trim().length > 0;
      }),
  );
};


const getFileId = (input: string): FileId | null => {
  // eslint-disable-next-line max-len
  const regex = /files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  const results = [...input.matchAll(regex)].map((match) => match[1]);
  if (results.length > 0) {
    return results[0];
  } else {
    return null;
  }
};


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


const getExtensionFromFilename = (filename: string): string | null => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return null;
  }

  const extension = filename.substring(posOfDot + 1).toLowerCase();
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

    "wav": MediaType.AUDIO,
    "mp3": MediaType.AUDIO,
    "ogg": MediaType.AUDIO,
    "flac": MediaType.AUDIO,

    "mp4": MediaType.VIDEO,
    "webm": MediaType.VIDEO,

    "html": MediaType.TEXT,
    "css": MediaType.TEXT,
    "js": MediaType.TEXT,
    "json": MediaType.TEXT,
    "c": MediaType.TEXT,
    "cpp": MediaType.TEXT,
    "rs": MediaType.TEXT,
    "txt": MediaType.TEXT,
    "md": MediaType.TEXT,
    "xq": MediaType.TEXT,
    "xql": MediaType.TEXT,
    "xqm": MediaType.TEXT,
    "opml": MediaType.TEXT,
  }));

  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return MediaType.TEXT;
  }

  return map.has(extension)
    ? map.get(extension) as MediaType
    : MediaType.OTHER;
};


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const inferNoteTitle = (noteContent: string, maxLength = 800): string => {
  const lines = noteContent.split("\n");
  const firstContentLine = lines.find((line) => line.trim().length > 0);
  if (!firstContentLine) {
    return "";
  }
  const titleShortened = shortenText(firstContentLine, maxLength)
    .trim()
    // remove wikilink punctuation
    .replace(/(\[\[)|(]])/g, "");
  return titleShortened;
};


const getNoteTitle = (note: ExistingNote): string => {
  if (note.meta.custom.title) {
    return note.meta.custom.title;
  } else {
    return inferNoteTitle(note.content);
  }
};


const updateNotePosition = (
  graph: Graph,
  nodePositionUpdate: GraphNodePositionUpdate,
): boolean => {
  if (!graph.notes.has(nodePositionUpdate.slug)) {
    return false;
  }
  const note: ExistingNote
    = graph.notes.get(nodePositionUpdate.slug) as ExistingNote;

  note.meta.position = nodePositionUpdate.position;
  return true;
};


const getOutgoingLinks = (graph: Graph, slug: Slug): Set<Slug> => {
  if (!graph.indexes.outgoingLinks.has(slug)) {
    throw new Error("Could not determine outgoing links of " + slug);
  }

  return graph.indexes.outgoingLinks.get(slug) as Set<Slug>;
};


const getNotePreview = (graph: Graph, slug: Slug): NotePreview => {
  if (!graph.notes.has(slug)) {
    throw new Error("Could not generate note preview of " + slug);
  }

  const note = graph.notes.get(slug) as ExistingNote;

  return {
    content: note.content,
    slug,
    title: getNoteTitle(note),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt,
  };
};


const getBacklinks = (graph: Graph, slug: Slug): SparseNoteInfo[] => {
  const backlinkSlugs = graph.indexes.backlinks.get(slug);

  if (!backlinkSlugs) {
    throw new Error("Could not determine backlinks for slug " + slug);
  }

  const notes: ExistingNote[] = Array.from(backlinkSlugs)
    .map((slug: Slug): ExistingNote => {
      // we are sure that the notes we are retrieving from slugs in links
      // really exist. that's why we cast the result of findNote as
      // ExistingNote
      return graph.notes.get(slug) as ExistingNote;
    });

  const backlinks: SparseNoteInfo[] = notes
    .map((note: ExistingNote) => {
      const backlink: SparseNoteInfo = {
        slug: note.meta.slug,
        title: getNoteTitle(note),
        createdAt: note.meta.createdAt,
        updatedAt: note.meta.updatedAt,
      };
      return backlink;
    });

  return backlinks;
};


const getNumberOfLinkedNotes = (graph: Graph, slug: Slug): LinkCount => {
  const outgoingLinks = getOutgoingLinks(graph, slug);
  const backlinks = getBacklinks(graph, slug);
  return {
    outgoing: outgoingLinks.size,
    back: backlinks.length,
    sum: outgoingLinks.size + backlinks.length,
  };
};


const getNumberOfUnlinkedNotes = (graph: Graph): number => {
  return Array.from(graph.notes.keys())
    .filter((slug: string): boolean => {
      return getNumberOfLinkedNotes(graph, slug).sum === 0;
    }).length;
};


const parseFileIds = (noteContent: NoteContent): FileId[] => {
  // eslint-disable-next-line max-len
  const regex = /\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  return [...noteContent.matchAll(regex)].map((match) => match[1]);
};


const getFileInfos = (
  graph: Graph,
  noteContent: NoteContent,
): FileInfo[] => {
  const fileIds = parseFileIds(noteContent);
  const files = graph.metadata.files
    .filter((file: FileInfo) => fileIds.includes(file.fileId));
  return files;
};


const createNoteToTransmit = async (
  databaseNote: ExistingNote,
  graph: Graph,
): Promise<NoteToTransmit> => {
  const noteToTransmit: NoteToTransmit = {
    content: databaseNote.content,
    meta: databaseNote.meta,
    outgoingLinks: Array.from(getOutgoingLinks(graph, databaseNote.meta.slug))
      .filter((slug: Slug) => graph.notes.has(slug))
      .map((slug: Slug) => {
        const notePreview = getNotePreview(graph, slug);
        return notePreview;
      }),
    backlinks: getBacklinks(graph, databaseNote.meta.slug),
    numberOfCharacters: getNumberOfCharacters(databaseNote),
    files: getFileInfos(graph, databaseNote.content),
  };

  return noteToTransmit;
};


const getBlocks = (
  note: ExistingNote,
  blockIndex: Map<string, Block[]>,
): Block[] => {
  const slug = note.meta.slug;
  let parsedContent = blockIndex.get(slug);
  if (!parsedContent) {
    parsedContent = subwaytext(note.content);
    blockIndex.set(slug, parsedContent);
  }

  return parsedContent;
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


const createNoteListItem = (
  note: ExistingNote,
  graph: Graph,
): NoteListItem => {
  const blocks = getBlocks(note, graph.indexes.blocks);

  const noteListItem: NoteListItem = {
    slug: note.meta.slug,
    title: getNoteTitle(note),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt,
    features: getNoteFeatures(blocks),
    linkCount: getNumberOfLinkedNotes(graph, note.meta.slug),
    numberOfCharacters: getNumberOfCharacters(note),
    numberOfFiles: getNumberOfFiles(blocks),
  };

  return noteListItem;
};


const createNoteListItems = (
  databaseNotes: ExistingNote[],
  graph: Graph,
): NoteListItem[] => {
  const noteListItems = databaseNotes.map((databaseNote) => {
    return createNoteListItem(
      databaseNote,
      graph,
    );
  });

  return noteListItems;
};


const getSortKeyForTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/(["'.“”„‘’—\-»#*[\]/])/g, "")
    .trim();
};


const getSortFunction = (
  sortMode: NoteListSortMode,
):((a: NoteListItem, b: NoteListItem) => number) => {
  const sortFunctions = {
    [NoteListSortMode.CREATION_DATE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.createdAt - b.createdAt;
      },
    [NoteListSortMode.CREATION_DATE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.createdAt - a.createdAt;
      },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.updatedAt - b.updatedAt;
      },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.updatedAt - a.updatedAt;
      },
    [NoteListSortMode.TITLE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        const aNormalized = getSortKeyForTitle(a.title);
        const bNormalized = getSortKeyForTitle(b.title);

        return aNormalized.localeCompare(bNormalized);
      },
    [NoteListSortMode.TITLE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        const aNormalized = getSortKeyForTitle(a.title);
        const bNormalized = getSortKeyForTitle(b.title);

        return bNormalized.localeCompare(aNormalized);
      },
    [NoteListSortMode.NUMBER_OF_LINKS_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.linkCount.sum - b.linkCount.sum;
      },
    [NoteListSortMode.NUMBER_OF_LINKS_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.linkCount.sum - a.linkCount.sum;
      },
    [NoteListSortMode.NUMBER_OF_FILES_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.numberOfFiles - b.numberOfFiles;
      },
    [NoteListSortMode.NUMBER_OF_FILES_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.numberOfFiles - a.numberOfFiles;
      },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return a.numberOfCharacters - b.numberOfCharacters;
      },
    [NoteListSortMode.NUMBER_OF_CHARACTERS_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return b.numberOfCharacters - a.numberOfCharacters;
      },
  };

  return sortFunctions[sortMode] ?? sortFunctions.UPDATE_DATE_ASCENDING;
};


const getURLsOfNote = (noteContent: NoteContent): string[] => {
  /*
    We use a simple regex for this as we don't want to implement a full
    URL parser as described in
    https://url.spec.whatwg.org/#concept-basic-url-parser
    The regex is from https://stackoverflow.com/a/3809435/3890888
    However it does not seem to cover all cases.
    I've added some valid URL code points to the query string which are
    listed in https://url.spec.whatwg.org/#url-code-points
    - comma (,)
    There might be more to come.
  */
  // eslint-disable-next-line max-len
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=,]*)/g;
  return [...noteContent.matchAll(regex)].map((match) => match[0]);
};


// https://en.wikipedia.org/wiki/Breadth-first_search
const breadthFirstSearch = (
  nodes: ExistingNote[],
  links: Link[],
  root: ExistingNote,
): ExistingNote[] => {
  const queue: ExistingNote[] = [];
  const discovered: ExistingNote[] = [];
  discovered.push(root);
  queue.push(root);

  while (queue.length > 0) {
    const v = queue.shift() as ExistingNote;
    const connectedNodes = links
      .filter((link: Link): boolean => {
        return (link[0] === v.meta.slug) || (link[1] === v.meta.slug);
      })
      .map((link: Link): ExistingNote | undefined => {
        const linkedNoteId = (link[0] === v.meta.slug) ? link[1] : link[0];
        return nodes.find(
          (n) => (n.meta.slug === linkedNoteId),
        );
      })
      .filter((n): n is ExistingNote => {
        return n !== undefined;
      });
    for (let i = 0; i < connectedNodes.length; i++) {
      const w = connectedNodes[i];
      if (!discovered.includes(w)) {
        discovered.push(w);
        queue.push(w);
      }
    }
  }

  return discovered;
};


const getGraphLinks = (graph: Graph): Link[] => {
  return Array.from(graph.notes.keys())
    .reduce(
      (links: Link[], slug: Slug): Link[] => {
        if (!graph.indexes.outgoingLinks.has(slug)) {
          throw new Error(
            "Could not determine outgoing links for " + slug,
          );
        }
        const targets = graph.indexes.outgoingLinks.get(slug) as Set<Slug>;

        targets.forEach((slugB) => {
          links.push([slug, slugB]);
        });

        return links;
      },
      [] as Link[],
    );
};


// https://en.wikipedia.org/wiki/Component_(graph_theory)#Algorithms
const getNumberOfComponents = (
  graph: Graph,
): number => {
  const nodes = Array.from(graph.notes.values());
  const links = getGraphLinks(graph);
  let totallyDiscovered: ExistingNote[] = [];
  let numberOfComponents = 0;

  let i = 0;

  while (totallyDiscovered.length < nodes.length) {
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


const getNotesWithCustomMetadata = (
  notes: ExistingNote[],
) => {
  return notes.filter((note: ExistingNote) => {
    return Object.entries(note.meta.custom).length > 0;
  });
};


const getNotesWithFile = (
  notes: ExistingNote[],
  graph: Graph,
  fileId: FileId,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    return getBlocks(note, graph.indexes.blocks)
      .filter(blockHasLoadedFile)
      .some((block) => getFileId(block.data.link) === fileId);
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


const getNotesWithTitleContainingToken = (
  notes: ExistingNote[],
  token: string,
  caseSensitive: boolean,
): ExistingNote[] => {
  return notes.filter((note: ExistingNote) => {
    if (token.length === 0) {
      return true;
    }

    if (caseSensitive) {
      return getNoteTitle(note).includes(token);
    } else {
      return getNoteTitle(note).toLowerCase().includes(token.toLowerCase());
    }
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

const trimSlug = (slug: string): string => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};


const sluggifyNoteText = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // Replace all invalid chars, and also slashes. Slashes are valid slug
    // chars, but we want to replace them with dashes as they are reserved for
    // special slugs like files, that point into different folders.
    .replace(/[^\p{L}\d\-._]/gu, "-")
    // Replace runs of one or more dashes with a single dash
    .replace(/-+/g, "-")
    // Truncate to avoid file name length limit issues.
    // Windows systems can handle up to 255, but we truncate at 200 to leave
    // a bit of room for things like version numbers.
    .substring(0, 200)
    .toLowerCase();

  return trimSlug(slug);
};


/*
  sluggifyLink is used to turn a linking entity like a Wikilink into a slug.
  Here we do not want to replace slashes with dashes, as slashes are valid
  slug chars for links.

  sluggifyNoteText replaces slashes with dashes, as slashes are reserved for
  special slugs like files, that point into different folders. We do not want
  to have slashes when creating a simple slug for a normal note.
*/


const sluggifyLink = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // Replace all invalid chars.
    .replace(/[^\p{L}\d\-._/]/gu, "-")
    // Replace runs of one or more dashes with a single dash
    .replace(/-+/g, "-")
    // Truncate to avoid file name length limit issues.
    // Windows systems can handle up to 255, but we truncate at 200 to leave
    // a bit of room for things like version numbers.
    .substring(0, 200)
    .toLowerCase();

  return trimSlug(slug);
};


const isValidSlug = (slug: Slug): boolean => {
  return (
    typeof slug === "string"
    && slug.length > 0
    && slug.length <= 200
    && slug.match(/^[\p{L}\d_][\p{L}\d\-/._]*$/u) !== null
  );
};


const createSlug = (noteContent: string, existingSlugs: Slug[]): Slug => {
  const title = inferNoteTitle(noteContent);
  let slugStem = sluggifyNoteText(title);

  let n = 1;

  if (!slugStem) {
    slugStem = "new";
  }

  while (true) {
    // We don't want to use just "new" as a slug, because that would conflict
    // with the "new" keyword in the URL schema. So let's use "new-1" instead.
    // If that's taken, we'll try "new-2", etc.
    // With other slugs, we only want to append a number if there's a conflict,
    // starting with "2".
    const showIntegerSuffix = slugStem === "new" || n > 1;
    const slug = showIntegerSuffix ? `${slugStem}-${n}` : slugStem;
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
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
  types: MediaType[],
  notesMustContainAllMediaTypes: boolean,
): ExistingNote[] => {
  return notesMustContainAllMediaTypes
    ? notes
      // every single note must contain blocks from all the types
      .filter((note: ExistingNote): boolean => {
        return types.every((type) => {
          return getBlocks(note, graph.indexes.blocks).some((block) => {
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
        return getBlocks(note, graph.indexes.blocks)
          .some((block) => {
            if (block.type !== BlockType.SLASHLINK) return false;
            const fileId = getFileId(block.data.link);
            if (!fileId) return false;
            return types.includes(getMediaTypeFromFilename(fileId));
          });
      });
};


// returns random key from Set or Map
const getRandomKey = <K>(collection: Map<K, unknown>): K | null => {
  const index = Math.floor(Math.random() * collection.size);
  let cntr = 0;
  for (const key of collection.keys()) {
    if (cntr++ === index) {
      return key;
    }
  }
  return null;
};


export {
  getExtensionFromFilename,
  getMediaTypeFromFilename,
  inferNoteTitle,
  updateNotePosition,
  getNumberOfLinkedNotes,
  parseFileIds,
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
  getNotesWithTitleContainingToken,
  getNotesWithTitleOrSlugContainingToken,
  getNotesThatContainTokens,
  getNotesWithBlocksOfTypes,
  getNotesWithMediaTypes,
  getNotesWithKeyValue,
  parseNoteHeaders,
  serializeNoteHeaders,
  parseSerializedExistingNote,
  parseSerializedNewNote,
  serializeNote,
  serializeNewNote,
  getNotesWithCustomMetadata,
  removeCustomMetadataWithEmptyKeys,
  getNotesWithFlag,
  getBacklinks,
  getGraphLinks,
  sluggifyLink,
  sluggifyNoteText,
  isValidSlug,
  createSlug,
  getNoteTitle,
  getRandomKey,
};
