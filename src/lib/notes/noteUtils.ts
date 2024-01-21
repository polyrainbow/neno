import Graph from "./types/Graph.js";
import ExistingNote from "./types/ExistingNote.js";
import NoteListItem from "./types/NoteListItem.js";
import NoteListItemFeatures from "./types/NoteListItemFeatures.js";
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
import {
  createSlug,
  getSlugsFromInlineText,
  isFileSlug,
  isValidSlug,
  sluggify,
} from "./slugUtils.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import {
  ExistingNoteSaveRequest,
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "./types/NoteSaveRequest.js";
import WriteGraphMetadataAction from "./types/FlushGraphMetadataAction.js";
import serialize from "../subwaytext/serialize.js";
import { removeSlugFromIndexes, updateIndexes } from "./indexUtils.js";
import DatabaseIO from "./DatabaseIO.js";
import GraphObject from "./types/Graph.js";

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


const getAliasesOfSlug = (
  graph: GraphObject,
  slug: Slug,
): Set<Slug> => {
  return new Set(
    Array.from(graph.aliases.entries())
      .filter((entry) => {
        return entry[1] === slug;
      })
      .map((entry) => {
        return entry[0];
      }),
  );
};


const getNotePreview = (graph: Graph, slug: Slug): NotePreview => {
  if (!graph.notes.has(slug)) {
    throw new Error("Could not generate note preview of " + slug);
  }

  const note = graph.notes.get(slug) as ExistingNote;

  return {
    content: note.content,
    slug,
    aliases: getAliasesOfSlug(graph, slug),
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
        aliases: getAliasesOfSlug(graph, note.meta.slug),
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
    aliases: getAliasesOfSlug(graph, existingNote.meta.slug),
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
    aliases: getAliasesOfSlug(graph, note.meta.slug),
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


// getSlugsFromParsedNote returns all slugs that are referenced in the note.
const getSlugsFromParsedNote = (note: Block[]): Slug[] => {
  const inlineSpans = getAllInlineSpans(note);
  const slugs = getSlugsFromInlineText(inlineSpans);
  return slugs;
};


const handleExistingNoteUpdate = async (
  noteSaveRequest: ExistingNoteSaveRequest,
  io: DatabaseIO,
): Promise<NoteToTransmit> => {
  const graph: GraphObject = await io.getGraph();
  const noteFromUser = noteSaveRequest.note;
  const existingNote = graph.notes.get(noteFromUser.meta.slug) || null;

  if (existingNote === null) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  existingNote.content = noteFromUser.content;
  existingNote.meta.updatedAt = Date.now();
  existingNote.meta.flags = noteFromUser.meta.flags;
  existingNote.meta.contentType = noteFromUser.meta.contentType;
  existingNote.meta.custom = removeCustomMetadataWithEmptyKeys(
    noteFromUser.meta.custom,
  );

  const aliasesToUpdate: Slug[] = [];

  for (const [alias, canonicalSlug] of graph.aliases.entries()) {
    if (canonicalSlug === existingNote.meta.slug) {
      graph.aliases.delete(alias);
      aliasesToUpdate.push(alias);
    }
  }

  noteSaveRequest.aliases.forEach((alias) => {
    if (!(isValidSlug(alias) && alias.length > 0)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (alias === existingNote.meta.slug) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (
      graph.aliases.has(alias)
      && graph.aliases.get(alias) !== existingNote.meta.slug
    ) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }
    graph.aliases.set(alias, existingNote.meta.slug);
    aliasesToUpdate.push(alias);
  });

  if (
    "changeSlugTo" in noteSaveRequest
    && typeof noteSaveRequest.changeSlugTo === "string"
  ) {
    if (!isValidSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }
    if (graph.aliases.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    const oldSlug = existingNote.meta.slug;
    const newSlug = noteSaveRequest.changeSlugTo;

    const notesReferencingOurNoteBeforeChange
      = Array.from((graph.indexes.backlinks.get(oldSlug) as Set<Slug>))
        .map((slug) => {
          return graph.notes.get(slug) as ExistingNote;
        });

    graph.notes.delete(oldSlug);
    removeSlugFromIndexes(graph, oldSlug);

    let flushMetadata = WriteGraphMetadataAction.NONE;

    for (let i = 0; i < graph.metadata.pinnedNotes.length; i++) {
      if (graph.metadata.pinnedNotes[i] === oldSlug) {
        graph.metadata.pinnedNotes[i] = newSlug;
        flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
      }
    }

    const aliasesToUpdate: Slug[] = [];
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === oldSlug) {
        graph.aliases.delete(alias);
        graph.aliases.set(alias, newSlug);
        aliasesToUpdate.push(alias);
      }
    }

    await io.flushChanges(
      graph, flushMetadata, [oldSlug], aliasesToUpdate,
    );

    existingNote.meta.slug = newSlug;
    graph.notes.set(newSlug, existingNote);

    if (
      "updateReferences" in noteSaveRequest
      && noteSaveRequest.updateReferences
    ) {
      updateIndexes(graph, existingNote);
      for (const thatNote of notesReferencingOurNoteBeforeChange) {
        const blocks = graph.indexes.blocks.get(
          thatNote.meta.slug,
        ) as Block[];

        const noteTitle = getNoteTitle(existingNote);
        const newSluggifiableTitle = sluggify(noteTitle) === newSlug
          ? noteTitle
          : newSlug;

        const newBlocks = changeSlugReferencesInNote(
          blocks,
          oldSlug,
          newSlug,
          newSluggifiableTitle,
        );

        thatNote.content = serialize(newBlocks);
        graph.indexes.blocks.set(thatNote.meta.slug, newBlocks);
        updateIndexes(graph, thatNote);
        await io.flushChanges(
          graph,
          WriteGraphMetadataAction.NONE,
          [thatNote.meta.slug],
          [],
        );
      }
    }
  } else {
    graph.notes.set(existingNote.meta.slug, existingNote);
  }

  updateIndexes(graph, existingNote);
  await io.flushChanges(
    graph,
    WriteGraphMetadataAction.NONE,
    [existingNote.meta.slug],
    aliasesToUpdate,
  );

  const noteToTransmit: NoteToTransmit
    = await createNoteToTransmit(existingNote, graph);
  return noteToTransmit;
};


const isExistingNoteSaveRequest = (
  noteSaveRequest: NoteSaveRequest,
): noteSaveRequest is ExistingNoteSaveRequest => {
  return "slug" in noteSaveRequest.note.meta;
};


const handleNewNoteSaveRequest = async (
  noteSaveRequest: NewNoteSaveRequest,
  io: DatabaseIO,
): Promise<NoteToTransmit> => {
  const graph: GraphObject = await io.getGraph();
  const noteFromUser = noteSaveRequest.note;
  const existingSlugs = [
    ...Array.from(graph.notes.keys()),
    ...Array.from(graph.aliases.keys()),
  ];
  let slug: Slug;

  if (
    "changeSlugTo" in noteSaveRequest
    && typeof noteSaveRequest.changeSlugTo === "string"
  ) {
    if (!isValidSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (
      graph.notes.has(noteSaveRequest.changeSlugTo)
      || graph.aliases.has(noteSaveRequest.changeSlugTo)
    ) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }

    slug = noteSaveRequest.changeSlugTo;
  } else {
    slug = createSlug(
      noteFromUser.content,
      existingSlugs,
    );
  }

  const aliasesToUpdate: Slug[] = [];
  noteSaveRequest.aliases.forEach((alias) => {
    if (!(isValidSlug(alias) && alias.length > 0)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (
      graph.aliases.has(alias)
      && graph.aliases.get(alias) !== slug
    ) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.NOTE_WITH_SAME_SLUG_EXISTS);
    }
    graph.aliases.set(alias, slug);
    aliasesToUpdate.push(alias);
  });

  // the new note becomes an existing note, that's why the funny typing here
  const newNote: ExistingNote = {
    meta: {
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      custom: removeCustomMetadataWithEmptyKeys(
        noteFromUser.meta.custom,
      ),
      flags: noteFromUser.meta.flags,
      contentType: noteFromUser.meta.contentType,
    },
    content: noteFromUser.content,
  };

  graph.notes.set(slug, newNote);
  updateIndexes(graph, newNote);
  await io.flushChanges(
    graph,
    WriteGraphMetadataAction.NONE,
    [newNote.meta.slug],
    aliasesToUpdate,
  );

  const noteToTransmit: NoteToTransmit
    = await createNoteToTransmit(newNote, graph);
  return noteToTransmit;
};


export {
  inferNoteTitle,
  getNumberOfLinkedNotes,
  createNoteToTransmit,
  getNoteFeatures,
  getNumberOfCharacters,
  getURLsOfNote,
  createNoteListItem,
  createNoteListItems,
  getNumberOfUnlinkedNotes,
  parseNoteHeaders,
  serializeNoteHeaders,
  parseSerializedExistingNote,
  parseSerializedNewNote,
  serializeNote,
  serializeNewNote,
  removeCustomMetadataWithEmptyKeys,
  getBacklinks,
  getNoteTitle,
  removeWikilinkPunctuation,
  getAllInlineSpans,
  getSlugsFromInlineText,
  changeSlugReferencesInNote,
  mapInlineSpans,
  getBlocks,
  getFileSlugsInNote,
  handleExistingNoteUpdate,
  getSlugsFromParsedNote,
  isExistingNoteSaveRequest,
  handleNewNoteSaveRequest,
  getAliasesOfSlug,
};
