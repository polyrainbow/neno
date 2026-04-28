import ExistingNote from "./types/ExistingNote.js";
import NewNote from "./types/NewNote.js";
import {
  ExistingNoteMetadata,
  NewNoteMetadata,
} from "./types/NoteMetadata.js";
import { CanonicalNoteHeader } from "./types/CanonicalNoteHeader.js";
import { Slug } from "./types/Slug.js";

type NoteHeaders = Map<CanonicalNoteHeader | string, string>;
type MetaModifier = (meta: Partial<ExistingNoteMetadata>, val: string) => void;


const cleanSerializedNote = (serializedNote: string): string => {
  return serializedNote.replace(/\r/g, "");
};


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


const splitHeadersAndContent = (
  serializedNote: string,
): {
  canonicalMeta: Partial<ExistingNoteMetadata>,
  additionalHeaders: Record<string, string>,
  content: string,
} => {
  const cleaned = cleanSerializedNote(serializedNote);
  const headers = parseGraphFileHeaders(cleaned);
  const canonicalMeta: Partial<ExistingNoteMetadata> = {};
  const additionalHeaders: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    const modifier = canonicalHeaderKeys.get(key as CanonicalNoteHeader);
    if (modifier) {
      modifier(canonicalMeta, value);
    } else {
      additionalHeaders[key] = value;
    }
  }
  const content = headers.size > 0
    ? cleaned.substring(cleaned.indexOf("\n\n") + 2)
    : cleaned;
  return { canonicalMeta, additionalHeaders, content };
};


const parseSerializedExistingGraphFile = (
  serializedNote: string,
  slug: Slug,
): ExistingNote => {
  const { canonicalMeta, additionalHeaders, content }
    = splitHeadersAndContent(serializedNote);
  return {
    content,
    meta: {
      slug,
      createdAt: canonicalMeta.createdAt,
      updatedAt: canonicalMeta.updatedAt,
      flags: canonicalMeta.flags ?? [],
      additionalHeaders,
    },
  };
};


const parseSerializedNewNote = (serializedNote: string): NewNote => {
  const { canonicalMeta, additionalHeaders, content }
    = splitHeadersAndContent(serializedNote);
  const meta: NewNoteMetadata = {
    flags: canonicalMeta.flags ?? [],
    additionalHeaders,
  };
  return { content, meta };
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


export {
  cleanSerializedNote,
  parseGraphFileHeaders,
  serializeNoteHeaders,
  parseSerializedExistingGraphFile,
  parseSerializedNewNote,
  serializeNote,
  serializeNewNote,
};
