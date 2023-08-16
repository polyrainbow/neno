import Graph from "./interfaces/Graph.js";
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
  BlockType,
  InlineText,
  Span,
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
import { DEFAULT_CONTENT_TYPE } from "../../config.js";
import { SpanType } from "../subwaytext/interfaces/SpanType.js";
import { FILE_SLUG_PREFIX } from "./config.js";

const isFileSlug = (slug: Slug): boolean => {
  return slug.startsWith(FILE_SLUG_PREFIX);
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

  if (!partialMeta.slug) {
    throw new Error(
      "Could not parse note. Missing canonical header: slug",
    );
  }

  const meta: ExistingNoteMetadata = {
    slug: partialMeta.slug,
    createdAt: partialMeta.createdAt,
    updatedAt: partialMeta.updatedAt,
    position: partialMeta.position ?? { x: 0, y: 0 },
    flags: partialMeta.flags ?? [],
    contentType: partialMeta.contentType ?? DEFAULT_CONTENT_TYPE,
    custom,
  };

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

  const meta: NewNoteMetadata = {
    flags: partialMeta.flags ?? [],
    contentType: partialMeta.contentType ?? DEFAULT_CONTENT_TYPE,
    custom,
  };

  const note: NewNote = {
    content: headers.size > 0
      ? serializedNote.substring(serializedNote.indexOf("\n\n") + 2)
      : serializedNote,
    meta,
  };
  return note;
};


const serializeNote = (note: ExistingNote): string => {
  const headersToSerialize: NoteHeaders = new Map([
    [
      CanonicalNoteHeader.SLUG,
      note.meta.slug.toString(),
    ],
  ]);

  if (note.meta.createdAt) {
    headersToSerialize.set(
      CanonicalNoteHeader.CREATED_AT,
      note.meta.createdAt.toString(),
    );
  }

  if (note.meta.updatedAt) {
    headersToSerialize.set(
      CanonicalNoteHeader.UPDATED_AT,
      note.meta.updatedAt.toString(),
    );
  }

  headersToSerialize.set(
    CanonicalNoteHeader.GRAPH_POSITION,
    Object.values(note.meta.position).join(","),
  );

  headersToSerialize.set(
    CanonicalNoteHeader.FLAGS,
    note.meta.flags.join(","),
  );

  headersToSerialize.set(
    CanonicalNoteHeader.CONTENT_TYPE,
    note.meta.contentType,
  );

  for (const key in note.meta.custom) {
    if (Object.hasOwn(note.meta.custom, key)) {
      headersToSerialize.set(key, note.meta.custom[key]);
    }
  }

  return serializeNoteHeaders(headersToSerialize) + "\n\n" + note.content;
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


const removeExtensionFromFilename = (filename: string): string => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return filename;
  }

  return filename.substring(0, posOfDot);
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


const removeWikilinkPunctuation = (text: string): string => {
  return text.replace(/(\[\[)|(]])/g, "");
};

const removeHeadingSigil = (text: string): string => {
  return text.replace(/^#+\s*/, "");
};


const removeQuoteBlockSigil = (text: string): string => {
  return text.replace(/^>\s*/, "");
};


const inferNoteTitle = (noteContent: string, maxLength = 800): string => {
  const lines = noteContent.split("\n");
  const firstContentLine = lines.find((line) => line.trim().length > 0);
  if (!firstContentLine) {
    return "";
  }

  const textNormalized = removeWikilinkPunctuation(
    removeHeadingSigil(removeQuoteBlockSigil(firstContentLine)),
  );

  const titleShortened = shortenText(textNormalized, maxLength).trim();
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


const getOutgoingLinksToOtherNotes = (
  graph: Graph,
  slug: Slug,
): Set<Slug> => {
  if (!graph.indexes.outgoingLinks.has(slug)) {
    throw new Error("Could not determine outgoing links of " + slug);
  }

  const slugs = graph.indexes.outgoingLinks.get(slug) as Set<Slug>;

  const validNoteSlugs = Array.from(slugs)
    .filter((theirSlug: Slug) => {
      return graph.notes.has(theirSlug) && theirSlug !== slug;
    });

  return new Set<Slug>(validNoteSlugs);
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
  const outgoingLinks = getOutgoingLinksToOtherNotes(graph, slug);
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


const getAllInlineSpans = (blocks: Block[]): Span[] => {
  const spans: Span[] = [];
  blocks.forEach((block) => {
    if (block.type === BlockType.PARAGRAPH) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.HEADING) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.QUOTE) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.ORDERED_LIST_ITEM) {
      spans.push(...block.data.text);
    } else if (block.type === BlockType.UNORDERED_LIST_ITEM) {
      spans.push(...block.data.text);
    }
  });
  return spans;
};


const trimSlug = (slug: string): string => {
  return slug.replace(/^-+/, "").replace(/-+$/, "");
};


/*
  Turns note text into a slug, without truncating.
  For example, it can be used to obtain a slug from a Wikilink.
  We will replace slashes and dots with dashes, as we do not allow
  these chars in note slugs (even though they are generally allowed
  in slugs, see TODO below).
*/
const sluggify = (text: string): string => {
  const slug = text
    // Trim leading/trailing whitespace
    .trim()
    // remove invalid chars
    .replace(/['’]+/g, "")
    // Replace invalid chars with dashes.
    .replace(/[^\p{L}\d\-_]+/gu, "-")
    // Replace runs of one or more dashes with a single dash
    .replace(/-+/g, "-")
    .toLowerCase();

  return trimSlug(slug);
};


/*
  Transforms note text like into a slug and truncates it.
  We will replace slashes and dots with dashes, as these are not allowed for
  note slugs (only allowed for general slugs). We do not want
  to have these chars when creating a simple slug for a normal note.
*/
const sluggifyNoteText = (text: string): string => {
  return sluggify(text)
    // Truncate to avoid file name length limit issues.
    // Windows systems can handle up to 255, but we truncate at 200 to leave
    // a bit of room for things like version numbers.
    .substring(0, 200);
};


/*
  TODO: Create new file id syntax, so that we can remove slashes and dots
  from valid slug chars.
*/
const isValidSlug = (slug: Slug): boolean => {
  return (
    typeof slug === "string"
    && slug.length > 0
    && slug.length <= 200
    && slug.match(/^[\p{L}\d_][\p{L}\d\-/._]*$/u) !== null
  );
};


const getSlugsFromInlineText = (text: InlineText): Slug[] => {
  return text.filter(
    (span: Span): boolean => {
      return span.type === SpanType.SLASHLINK
        || span.type === SpanType.WIKILINK;
    },
  ).map((span: Span): Slug => {
    if (span.type === SpanType.SLASHLINK) {
      return span.text.substring(1);
    } else {
      return sluggify(span.text.substring(2, span.text.length - 2));
    }
  });
};


const getFileSlugsInNote = (graph: Graph, noteSlug: Slug): Slug[] => {
  const blocks: Block[]
    = graph.indexes.blocks.get(noteSlug) as Block[];
  const allInlineSpans = getAllInlineSpans(blocks);
  const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
  return allUsedSlugs.filter(isFileSlug);
};


const getFileInfos = (
  graph: Graph,
  slug: Slug,
): FileInfo[] => {
  const fileSlugs = getFileSlugsInNote(graph, slug);
  const files = graph.metadata.files
    .filter((file: FileInfo) => fileSlugs.includes(file.slug));
  return files;
};


const createNoteToTransmit = async (
  existingNote: ExistingNote,
  graph: Graph,
): Promise<NoteToTransmit> => {
  const noteToTransmit: NoteToTransmit = {
    content: existingNote.content,
    meta: existingNote.meta,
    outgoingLinks: Array.from(
      getOutgoingLinksToOtherNotes(graph, existingNote.meta.slug),
    )
      .map((slug: Slug) => {
        const notePreview = getNotePreview(graph, slug);
        return notePreview;
      }),
    backlinks: getBacklinks(graph, existingNote.meta.slug),
    numberOfCharacters: getNumberOfCharacters(existingNote),
    files: getFileInfos(graph, existingNote.meta.slug),
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


const mapInlineSpans = (
  blocks: Block[],
  mapper: (span: Span) => Span,
): Block[] => {
  return blocks.map((block: Block): Block => {
    if (block.type === BlockType.PARAGRAPH) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.HEADING) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.QUOTE) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.ORDERED_LIST_ITEM) {
      block.data.text = block.data.text.map(mapper);
    } else if (block.type === BlockType.UNORDERED_LIST_ITEM) {
      block.data.text = block.data.text.map(mapper);
    }
    return block;
  });
};


const getNoteFeatures = (
  note: ExistingNote,
  graph: Graph,
): NoteListItemFeatures => {
  const blocks = graph.indexes.blocks.get(note.meta.slug) as Block[];
  const spans = getAllInlineSpans(blocks);

  const containsText = spans.length > 0;
  const containsWeblink
    = spans.some((span) => span.type === SpanType.HYPERLINK);
  const containsCode = blocks.some((block) => block.type === BlockType.CODE);
  let containsImages = false;
  let containsDocuments = false;
  let containsAudio = false;
  let containsVideo = false;

  const fileSlugs = getFileSlugsInNote(graph, note.meta.slug);
  fileSlugs.forEach((fileSlug: Slug) => {
    const mediaType = getMediaTypeFromFilename(fileSlug);
    if (mediaType === MediaType.IMAGE) {
      containsImages = true;
    } else if (mediaType === MediaType.PDF) {
      containsDocuments = true;
    } else if (mediaType === MediaType.AUDIO) {
      containsAudio = true;
    } else if (mediaType === MediaType.VIDEO) {
      containsVideo = true;
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


const getNumberOfFiles = (graph: Graph, noteSlug: Slug): number => {
  return getFileSlugsInNote(graph, noteSlug).length;
};


const createNoteListItem = (
  note: ExistingNote,
  graph: Graph,
): NoteListItem => {
  const noteListItem: NoteListItem = {
    slug: note.meta.slug,
    title: getNoteTitle(note),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt,
    features: getNoteFeatures(note, graph),
    linkCount: getNumberOfLinkedNotes(graph, note.meta.slug),
    numberOfCharacters: getNumberOfCharacters(note),
    numberOfFiles: getNumberOfFiles(graph, note.meta.slug),
  };

  return noteListItem;
};


const createNoteListItems = (
  existingNotes: ExistingNote[],
  graph: Graph,
): NoteListItem[] => {
  const noteListItems = existingNotes.map((existingNote) => {
    return createNoteListItem(
      existingNote,
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
        return (a.createdAt ?? 0) - (b.createdAt ?? 0);
      },
    [NoteListSortMode.CREATION_DATE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      },
    [NoteListSortMode.UPDATE_DATE_ASCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
      },
    [NoteListSortMode.UPDATE_DATE_DESCENDING]:
      (a: NoteListItem, b: NoteListItem) => {
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
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


const createSlug = (
  noteContent: string,
  existingSlugs: Slug[],
): Slug => {
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

const setsAreEqual = <T>(a: Set<T>, b: Set<T>) => {
  return a.size === b.size
    && [...a].every((x) => b.has(x));
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


const changeSlugReferencesInNote = (
  content: Block[],
  oldSlug: Slug,
  newSlug: Slug,
  newSluggifiableTitle?: string,
): Block[] => {
  return mapInlineSpans(content, (span: Span): Span => {
    if (
      span.type === SpanType.SLASHLINK
      && span.text.substring(1) === oldSlug
    ) {
      span.text = "/" + newSlug;
    } else if (
      span.type === SpanType.WIKILINK
      && sluggify(span.text.substring(2, span.text.length - 2)) === oldSlug
    ) {
      span.text = "[[" + (newSluggifiableTitle ?? newSlug) + "]]";
    }
    return span;
  });
};


const getSlugFromFilename = (
  filename: string,
  existingFiles: FileInfo[],
): Slug => {
  const existingFileSlugs = existingFiles.map((file) => file.slug);
  const extension = getExtensionFromFilename(filename);
  const filenameWithoutExtension = removeExtensionFromFilename(filename);
  const sluggifiedFileStem = sluggify(filenameWithoutExtension);

  let n = 1;

  while (true) {
    // We don't want to use just "new" as a slug, because that would conflict
    // with the "new" keyword in the URL schema. So let's use "new-1" instead.
    // If that's taken, we'll try "new-2", etc.
    // With other slugs, we only want to append a number if there's a conflict,
    // starting with "2".
    const showIntegerSuffix = n > 1;
    const stemWithOptionalIntegerSuffix = showIntegerSuffix
      ? `${sluggifiedFileStem}-${n}`
      : sluggifiedFileStem;

    const slug: Slug = FILE_SLUG_PREFIX
      + stemWithOptionalIntegerSuffix
      + (
        extension
          ? (
            stemWithOptionalIntegerSuffix
              ? "."
              : ""
          ) + extension.trim().toLowerCase()
          : ""
      );

    if (!existingFileSlugs.includes(slug)) {
      return slug;
    }
    n++;
  }
};


const getFilenameFromFileSlug = (
  fileSlug: Slug,
) => {
  if (!isFileSlug(fileSlug)) {
    throw new Error("Not a file slug: " + fileSlug);
  }
  return fileSlug.substring(FILE_SLUG_PREFIX.length);
};


export {
  getExtensionFromFilename,
  getMediaTypeFromFilename,
  inferNoteTitle,
  updateNotePosition,
  getNumberOfLinkedNotes,
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
  sluggify,
  sluggifyNoteText,
  isValidSlug,
  createSlug,
  getNoteTitle,
  getRandomKey,
  removeWikilinkPunctuation,
  getAllInlineSpans,
  getSlugsFromInlineText,
  changeSlugReferencesInNote,
  removeExtensionFromFilename,
  isFileSlug,
  mapInlineSpans,
  getSlugFromFilename,
  getFilenameFromFileSlug,
};
