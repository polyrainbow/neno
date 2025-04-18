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
} from "./types/NoteMetadata.js";
import { CanonicalNoteHeader } from "./types/CanonicalNoteHeader.js";
import NewNote from "./types/NewNote.js";
import { Slug } from "./types/Slug.js";
import SparseNoteInfo from "./types/SparseNoteInfo.js";
import LinkCount from "./types/LinkCount.js";
import NotePreview from "./types/NotePreview.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import {
  getCurrentISODateTime,
  getMediaTypeFromFilename,
  shortenText,
} from "./utils.js";
import {
  createSlug,
  getSlugsFromInlineText,
  isValidNoteSlug,
  sluggifyNoteText,
  sluggifyWikilinkText,
} from "./slugUtils.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import {
  ExistingNoteSaveRequest,
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "./types/NoteSaveRequest.js";
import serialize from "../subwaytext/serialize.js";
import { removeSlugFromIndexes, updateIndexes } from "./indexUtils.js";
import DatabaseIO from "./DatabaseIO.js";
import GraphObject from "./types/Graph.js";

type NoteHeaders = Map<CanonicalNoteHeader | string, string>;
type MetaModifier = (meta: Partial<ExistingNoteMetadata>, val: string) => void;

const parseGraphFileHeaders = (note: string): NoteHeaders => {
  const headerContentDelimiter = "\n\n";
  const headerContentDelimiterPos = note.indexOf(headerContentDelimiter);

  const headerSection = headerContentDelimiterPos > -1
    ? note.substring(0, headerContentDelimiterPos)
    : note;

  const regex = /^:([^:]*):(.*)$/gm;
  const headers = new Map<string, string>();
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
      meta.createdAt = val;
    },
  ],
  [
    CanonicalNoteHeader.UPDATED_AT,
    (meta, val) => {
      meta.updatedAt = val;
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
]);


const cleanSerializedNote = (serializedNote: string): string => {
  return serializedNote.replace(/\r/g, "");
};


const parseSerializedExistingGraphFile = (
  serializedNote: string,
  slug: Slug,
): ExistingNote => {
  const serializedNoteCleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(serializedNoteCleaned);
  const partialMeta: Partial<ExistingNoteMetadata> = {};
  const additionalHeaders: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key as CanonicalNoteHeader)) {
      (canonicalHeaderKeys.get(key as CanonicalNoteHeader) as MetaModifier)(
        partialMeta,
        value,
      );
    } else {
      additionalHeaders[key] = value;
    }
  }

  const meta: ExistingNoteMetadata = {
    slug,
    createdAt: partialMeta.createdAt,
    updatedAt: partialMeta.updatedAt,
    flags: partialMeta.flags ?? [],
    additionalHeaders,
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
  const headers = parseGraphFileHeaders(serializedNoteCleaned);
  const partialMeta: Partial<NewNoteMetadata> = {};
  const additionalHeaders: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    if (canonicalHeaderKeys.has(key as CanonicalNoteHeader)) {
      (canonicalHeaderKeys.get(key as CanonicalNoteHeader) as MetaModifier)(
        partialMeta,
        value,
      );
    } else {
      additionalHeaders[key] = value;
    }
  }

  const meta: NewNoteMetadata = {
    flags: partialMeta.flags ?? [],
    additionalHeaders,
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

  if (note.meta.flags.length > 0) {
    headersToSerialize.set(
      CanonicalNoteHeader.FLAGS,
      note.meta.flags.join(","),
    );
  }

  for (const key in note.meta.additionalHeaders) {
    if (Object.hasOwn(note.meta.additionalHeaders, key)) {
      headersToSerialize.set(key, note.meta.additionalHeaders[key]);
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
  ]);

  return serializeNoteHeaders(headers) + "\n\n" + note.content;
};


const getNumberOfCharacters = (note: ExistingNote): number => {
  return note.content.length;
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


const getNoteTitle = (noteContent: string, maxLength = 800): string => {
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
    title: getNoteTitle(note.content),
    createdAt: note.meta.createdAt,
    updatedAt: note.meta.updatedAt,
  };
};


const getBacklinks = (graph: Graph, slug: Slug): SparseNoteInfo[] => {
  const backlinkSlugs = graph.indexes.backlinks.get(slug);

  if (!backlinkSlugs) {
    throw new Error("Could not determine backlinks for slug " + slug);
  }

  return Array.from(backlinkSlugs)
    .map((slug: Slug): SparseNoteInfo => {
      // we are sure that the notes we are retrieving from slugs in links
      // really exist. that's why we cast the result as ExistingNote
      const note = graph.notes.get(slug) as ExistingNote;

      const backlink: SparseNoteInfo = {
        slug: note.meta.slug,
        aliases: getAliasesOfSlug(graph, note.meta.slug),
        title: getNoteTitle(note.content),
        createdAt: note.meta.createdAt,
        updatedAt: note.meta.updatedAt,
      };
      return backlink;
    });
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
    } else if (block.type === BlockType.KEY_VALUE_PAIR) {
      spans.push(...block.data.value);
    }
  });
  return spans;
};


const getFileSlugsReferencedInNote = (
  graph: Graph,
  noteSlug: Slug,
): Set<Slug> => {
  const blocks: Block[]
    = graph.indexes.blocks.get(noteSlug) as Block[];
  const allInlineSpans = getAllInlineSpans(blocks);
  const allReferencedSlugs = getSlugsFromInlineText(allInlineSpans);
  return new Set(allReferencedSlugs.filter(s => graph.files.has(s)));
};


const getFileInfosForFilesLinkedInNote = (
  graph: Graph,
  slugOfNote: Slug,
): Set<FileInfo> => {
  const fileSlugs = getFileSlugsReferencedInNote(graph, slugOfNote);
  // we can make a non-null assertion because getFileSlugsInNote
  // only returns file slugs in use
  return new Set(
    fileSlugs.values().map((fileSlug: Slug) => graph.files.get(fileSlug)!),
  );
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


const createNoteToTransmit = async (
  existingNote: ExistingNote,
  graph: Graph,
  includeParsedContent?: boolean,
): Promise<NoteToTransmit> => {
  const blocks = getBlocks(existingNote, graph.indexes.blocks);

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
    numberOfBlocks: blocks.length,
    files: getFileInfosForFilesLinkedInNote(graph, existingNote.meta.slug),
    aliases: getAliasesOfSlug(graph, existingNote.meta.slug),
  };

  if (includeParsedContent) {
    noteToTransmit.parsedContent = blocks;
  }

  return noteToTransmit;
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
    } else if (block.type === BlockType.KEY_VALUE_PAIR) {
      block.data.value = block.data.value.map(mapper);
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

  const fileInfos = getFileInfosForFilesLinkedInNote(graph, note.meta.slug);
  fileInfos.forEach((fileInfo: FileInfo) => {
    const mediaType = getMediaTypeFromFilename(fileInfo.filename);
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
  return getFileSlugsReferencedInNote(graph, noteSlug).size;
};


const createNoteListItem = (
  note: ExistingNote,
  graph: Graph,
): NoteListItem => {
  const noteListItem: NoteListItem = {
    slug: note.meta.slug,
    aliases: getAliasesOfSlug(graph, note.meta.slug),
    title: getNoteTitle(note.content),
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
  // eslint-disable-next-line @stylistic/max-len
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
      && sluggifyWikilinkText(
        span.text.substring(2, span.text.length - 2),
      ) === oldSlug
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
  existingNote.meta.updatedAt = noteSaveRequest.disableTimestampUpdate
    ? noteFromUser.meta.updatedAt
    : getCurrentISODateTime();
  existingNote.meta.flags = noteFromUser.meta.flags;
  existingNote.meta.additionalHeaders = noteFromUser.meta.additionalHeaders;

  const canonicalSlugShouldChange = "changeSlugTo" in noteSaveRequest
    && typeof noteSaveRequest.changeSlugTo === "string";

  const aliasesToUpdate: Set<Slug> = new Set();

  if (noteSaveRequest.aliases) {
    // delete aliases that are not in the new list
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (
        canonicalSlug === existingNote.meta.slug
        && !noteSaveRequest.aliases.has(alias)
      ) {
        graph.aliases.delete(alias);

        /*
          In the special case that a slug that was an alias is now the
          canonical slug, we need to exclude it from the aliasesToUpdate set,
          because otherwise the updating function would just delete the
          alias file, as that alias does not exist anymore.
          But it should only write the new complete note to the alias file.
        */
        const updateAliasOnDisk = !(
          "changeSlugTo" in noteSaveRequest
          && typeof noteSaveRequest.changeSlugTo === "string"
          && noteSaveRequest.changeSlugTo === alias
        );

        if (updateAliasOnDisk) {
          aliasesToUpdate.add(alias);
        }
      }
    }

    noteSaveRequest.aliases.forEach((alias) => {
      if (!isValidNoteSlug(alias)) {
        throw new Error(ErrorMessage.INVALID_ALIAS);
      }
      if (alias === existingNote.meta.slug) {
        /*
          We allow assigning the canonical slug as an alias here only if
          the canonical slug is also about to change to something else.
          If the canonical slug should not change, this is an invalid operation.
        */
        if (!canonicalSlugShouldChange) {
          throw new Error(ErrorMessage.ALIAS_EXISTS);
        }
      } else if (graph.notes.has(alias)) {
        throw new Error(ErrorMessage.SLUG_EXISTS);
      }
      if (
        graph.aliases.has(alias)
        && graph.aliases.get(alias) !== existingNote.meta.slug
      ) {
        throw new Error(ErrorMessage.ALIAS_EXISTS);
      }
      if (
        graph.aliases.has(alias)
        && graph.aliases.get(alias) === existingNote.meta.slug
      ) {
        // No need to update
        return;
      }
      graph.aliases.set(alias, existingNote.meta.slug);
      aliasesToUpdate.add(alias);
    });
  }

  if (
    "changeSlugTo" in noteSaveRequest
    && typeof noteSaveRequest.changeSlugTo === "string"
  ) {
    if (!isValidNoteSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (graph.notes.has(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (
      graph.files.has( noteSaveRequest.changeSlugTo)
    ) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
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

    let flushPins = false;

    for (let i = 0; i < graph.pinnedNotes.length; i++) {
      if (graph.pinnedNotes[i] === oldSlug) {
        graph.pinnedNotes[i] = newSlug;
        flushPins = true;
      }
    }

    const aliasesToUpdate: Set<Slug> = new Set();
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === oldSlug) {
        graph.aliases.delete(alias);
        graph.aliases.set(alias, newSlug);
        aliasesToUpdate.add(alias);
      }
    }

    await io.flushChanges(
      graph,
      flushPins,
      new Set([oldSlug]),
      aliasesToUpdate,
      new Set(),
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

        const noteTitle = getNoteTitle(existingNote.content);
        const newSluggifiableTitle = sluggifyNoteText(noteTitle) === newSlug
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
          flushPins,
          new Set([thatNote.meta.slug]),
          new Set(),
          new Set(),
        );
      }
    }
  } else {
    graph.notes.set(existingNote.meta.slug, existingNote);
  }

  updateIndexes(graph, existingNote);
  await io.flushChanges(
    graph,
    false,
    new Set([existingNote.meta.slug]),
    aliasesToUpdate,
    new Set(),
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
    if (!isValidNoteSlug(noteSaveRequest.changeSlugTo)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }
    if (
      graph.notes.has(noteSaveRequest.changeSlugTo)
      || graph.aliases.has(noteSaveRequest.changeSlugTo)
    ) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    if (
      graph.files.has(noteSaveRequest.changeSlugTo)
    ) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }

    slug = noteSaveRequest.changeSlugTo;
  } else {
    slug = createSlug(
      noteFromUser.content,
      existingSlugs,
    );
  }

  const aliasesToUpdate: Set<Slug> = new Set();
  noteSaveRequest.aliases?.forEach((alias) => {
    if (!isValidNoteSlug(alias)) {
      throw new Error(ErrorMessage.INVALID_ALIAS);
    }
    if (
      graph.aliases.has(alias)
      && graph.aliases.get(alias) !== slug
    ) {
      throw new Error(ErrorMessage.ALIAS_EXISTS);
    }
    if (graph.notes.has(alias)) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }
    graph.aliases.set(alias, slug);
    aliasesToUpdate.add(alias);
  });

  // the new note becomes an existing note, that's why the funny typing here
  const newNote: ExistingNote = {
    meta: {
      slug,
      createdAt: getCurrentISODateTime(),
      updatedAt: getCurrentISODateTime(),
      additionalHeaders: {},
      flags: noteFromUser.meta.flags,
    },
    content: noteFromUser.content,
  };

  graph.notes.set(slug, newNote);
  updateIndexes(graph, newNote);
  await io.flushChanges(
    graph,
    false,
    new Set([newNote.meta.slug]),
    aliasesToUpdate,
    new Set(),
  );

  const noteToTransmit: NoteToTransmit
    = await createNoteToTransmit(newNote, graph);
  return noteToTransmit;
};


export {
  getNumberOfLinkedNotes,
  createNoteToTransmit,
  getNoteFeatures,
  getNumberOfCharacters,
  getURLsOfNote,
  createNoteListItem,
  createNoteListItems,
  getNumberOfUnlinkedNotes,
  parseGraphFileHeaders,
  serializeNoteHeaders,
  parseSerializedExistingGraphFile,
  parseSerializedNewNote,
  serializeNote,
  serializeNewNote,
  getBacklinks,
  getNoteTitle,
  removeWikilinkPunctuation,
  getAllInlineSpans,
  getSlugsFromInlineText,
  changeSlugReferencesInNote,
  mapInlineSpans,
  getBlocks,
  getFileSlugsReferencedInNote,
  handleExistingNoteUpdate,
  getSlugsFromParsedNote,
  isExistingNoteSaveRequest,
  handleNewNoteSaveRequest,
  getAliasesOfSlug,
  cleanSerializedNote,
  getFileInfosForFilesLinkedInNote,
};
