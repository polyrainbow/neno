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
import { Slug } from "./types/Slug.js";
import SparseNoteInfo from "./types/SparseNoteInfo.js";
import LinkCount from "./types/LinkCount.js";
import NotePreview from "./types/NotePreview.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import {
  getMediaTypeFromFilename,
  shortenText,
} from "./utils.js";
import {
  getSlugsFromInlineText,
} from "./slugUtils.js";
import { serializeInlineText } from "../subwaytext/serialize.js";
import GraphObject from "./types/Graph.js";


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


// Returns the inline-span array of a block, or null if the block has no
// inline content (e.g. CODE, EMPTY). Returned array is a live reference;
// mutate via `setInlineSpans`, not by reassigning into the result.
const getInlineSpans = (block: Block): Span[] | null => {
  switch (block.type) {
  case BlockType.PARAGRAPH:
  case BlockType.HEADING:
  case BlockType.QUOTE:
  case BlockType.ORDERED_LIST_ITEM:
  case BlockType.UNORDERED_LIST_ITEM:
    return block.data.text;
  case BlockType.KEY_VALUE_PAIR:
    return block.data.value;
  default:
    return null;
  }
};


const setInlineSpans = (block: Block, spans: Span[]): void => {
  switch (block.type) {
  case BlockType.PARAGRAPH:
  case BlockType.HEADING:
  case BlockType.QUOTE:
  case BlockType.ORDERED_LIST_ITEM:
  case BlockType.UNORDERED_LIST_ITEM:
    block.data.text = spans;
    return;
  case BlockType.KEY_VALUE_PAIR:
    block.data.value = spans;
    return;
  }
};


const getAllInlineSpans = (blocks: Block[]): Span[] => {
  const spans: Span[] = [];
  for (const block of blocks) {
    const blockSpans = getInlineSpans(block);
    if (blockSpans) spans.push(...blockSpans);
  }
  return spans;
};


const getFileSlugsReferencedInNote = (
  graph: Graph,
  noteSlug: Slug,
): Set<Slug> => {
  // Read from the precomputed outgoing-links index instead of re-parsing
  // blocks. The index is populated in updateOutgoingLinksIndex with exactly
  // the same slug set this function used to derive on every call.
  const outgoingLinks = graph.indexes.outgoingLinks.get(noteSlug)
    ?? new Set<Slug>();
  const fileSlugs = new Set<Slug>();
  for (const slug of outgoingLinks) {
    if (graph.files.has(slug)) {
      fileSlugs.add(slug);
    }
  }
  return fileSlugs;
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


const getKeyValuesFromBlocks = (blocks: Block[]): Map<string, string> => {
  const keyValues = new Map<string, string>();
  for (const block of blocks) {
    if (block.type === BlockType.KEY_VALUE_PAIR) {
      keyValues.set(block.data.key, serializeInlineText(block.data.value));
    }
  }
  return keyValues;
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
    keyValues: getKeyValuesFromBlocks(blocks),
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
    const spans = getInlineSpans(block);
    if (spans) setInlineSpans(block, spans.map(mapper));
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


// getSlugsFromParsedNote returns all slugs that are referenced in the note.
const getSlugsFromParsedNote = (note: Block[]): Slug[] => {
  const inlineSpans = getAllInlineSpans(note);
  const slugs = getSlugsFromInlineText(inlineSpans);
  return slugs;
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
  getBacklinks,
  getNoteTitle,
  removeWikilinkPunctuation,
  getAllInlineSpans,
  getSlugsFromInlineText,
  mapInlineSpans,
  getBlocks,
  getFileSlugsReferencedInNote,
  getSlugsFromParsedNote,
  getAliasesOfSlug,
  getFileInfosForFilesLinkedInNote,
  getKeyValuesFromBlocks,
};
