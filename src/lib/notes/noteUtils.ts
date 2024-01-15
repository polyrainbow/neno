import Graph from "./types/Graph.js";
import { Link } from "./types/Link.js";
import ExistingNote from "./types/ExistingNote.js";
import NoteListItem from "./types/NoteListItem.js";
import NoteListItemFeatures from "./types/NoteListItemFeatures.js";
import { NoteListSortMode } from "./types/NoteListSortMode.js";
import NoteToTransmit from "./types/NoteToTransmit.js";
import { MediaType } from "./types/MediaType.js";
import { NoteContent } from "./types/NoteContent.js";
import { FileInfo } from "./types/FileInfo.js";
import subwaytext from "../subwaytext/index.js";
import {
  Block,
  BlockType,
  Span,
} from "../subwaytext/types/Block.js";
import {
  ExistingNoteMetadata,
  NewNoteMetadata,
  NoteMetadata,
} from "./types/NoteMetadata.js";
import { CanonicalNoteHeader } from "./types/CanonicalNoteHeader.js";
import NewNote from "./types/NewNote.js";
import { Slug } from "./types/Slug.js";
import SparseNoteInfo from "./types/SparseNoteInfo.js";
import LinkCount from "./types/LinkCount.js";
import NotePreview from "./types/NotePreview.js";
import { DEFAULT_CONTENT_TYPE } from "../../config.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import { getMediaTypeFromFilename, shortenText } from "./utils.js";
import { getSlugsFromInlineText, isFileSlug, sluggify } from "./slugUtils.js";


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


const cleanSerializedNote = (serializedNote: string): string => {
  return serializedNote.replace(/\r/g, "");
};


const parseSerializedExistingNote = (
  serializedNote: string,
  slug: Slug,
): ExistingNote => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseNoteHeaders(serializedNoteCleaned);
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

  const meta: ExistingNoteMetadata = {
    slug,
    createdAt: partialMeta.createdAt,
    updatedAt: partialMeta.updatedAt,
    flags: partialMeta.flags ?? [],
    contentType: partialMeta.contentType ?? DEFAULT_CONTENT_TYPE,
    custom,
  };

  const note: ExistingNote = {
    content: headers.size > 0
      ? serializedNoteCleaned.substring(
        serializedNoteCleaned.indexOf("\n\n") + 2,
      )
      : serializedNoteCleaned,
    meta,
  };
  return note;
};


const parseSerializedNewNote = (serializedNote: string): NewNote => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseNoteHeaders(serializedNoteCleaned);
  const partialMeta: Partial<NewNoteMetadata> = {};
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

  const meta: NewNoteMetadata = {
    flags: partialMeta.flags ?? [],
    contentType: partialMeta.contentType ?? DEFAULT_CONTENT_TYPE,
    custom,
  };

  const note: NewNote = {
    content: headers.size > 0
      ? serializedNoteCleaned.substring(
        serializedNoteCleaned.indexOf("\n\n") + 2,
      )
      : serializedNoteCleaned,
    meta,
  };
  return note;
};


const serializeNote = (note: ExistingNote): string => {
  const headersToSerialize: NoteHeaders = new Map();

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


const getOutgoingLinksToOtherNotes = (
  graph: Graph,
  slug: Slug,
): Set<Slug> => {
  if (!graph.indexes.outgoingLinks.has(slug)) {
    throw new Error("Could not determine outgoing links of " + slug);
  }

  const slugs = graph.indexes.outgoingLinks.get(slug) as Set<Slug>;

  const validNoteSlugs = Array.from(slugs)
    .filter((outgoingSlug: Slug) => {
      return (
        (graph.notes.has(outgoingSlug) && outgoingSlug !== slug)
        || (
          graph.aliases.has(outgoingSlug)
          && graph.aliases.get(outgoingSlug) !== slug
        )
      );
    })
    .map((outgoingSlug: Slug) => {
      return graph.aliases.has(outgoingSlug)
        ? graph.aliases.get(outgoingSlug) as Slug
        : outgoingSlug;
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
    aliases: new Set(
      Array.from(graph.aliases.entries())
        .filter((entry) => entry[1] === slug)
        .map((entry) => entry[0]),
    ),
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
        aliases: new Set(
          Array.from(graph.aliases.entries())
            .filter((entry) => entry[1] === slug)
            .map((entry) => entry[0]),
        ),
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
    aliases: new Set(
      Array.from(graph.aliases.entries())
        .filter((entry) => entry[1] === existingNote.meta.slug)
        .map((entry) => entry[0]),
    ),
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
    aliases: new Set(
      Array.from(graph.aliases.entries())
        .filter((entry) => entry[1] === note.meta.slug)
        .map((entry) => entry[0]),
    ),
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
        const targets = Array.from(
          graph.indexes.outgoingLinks.get(slug) as Set<Slug>,
        )
          .filter((targetSlug: Slug): boolean => {
            return graph.notes.has(targetSlug);
          });

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


const getGraphCreationTimestamp = (graph: Graph): number => {
  return Math.min(
    ...Array.from(graph.notes.values())
      .map((note: ExistingNote) => note.meta.createdAt)
      .filter((createdAt: number | undefined): createdAt is number => {
        return createdAt !== undefined;
      }),
    graph.metadata.createdAt,
  );
};


const getGraphUpdateTimestamp = (graph: Graph): number => {
  return Math.max(
    ...Array.from(graph.notes.values())
      .map((note: ExistingNote) => note.meta.updatedAt)
      .filter((updatedAt: number | undefined): updatedAt is number => {
        return updatedAt !== undefined;
      }),
    graph.metadata.updatedAt,
  );
};


export {
  getMediaTypeFromFilename,
  inferNoteTitle,
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
  parseNoteHeaders,
  serializeNoteHeaders,
  parseSerializedExistingNote,
  parseSerializedNewNote,
  serializeNote,
  serializeNewNote,
  removeCustomMetadataWithEmptyKeys,
  getBacklinks,
  getGraphLinks,
  sluggify,
  getNoteTitle,
  removeWikilinkPunctuation,
  getAllInlineSpans,
  getSlugsFromInlineText,
  changeSlugReferencesInNote,
  isFileSlug,
  mapInlineSpans,
  getGraphCreationTimestamp,
  getGraphUpdateTimestamp,
  getBlocks,
  getFileSlugsInNote,
};
