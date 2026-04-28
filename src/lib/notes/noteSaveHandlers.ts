import {
  Block,
  Span,
} from "../subwaytext/types/Block.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import { Slug } from "./types/Slug.js";
import ExistingNote from "./types/ExistingNote.js";
import NoteToTransmit from "./types/NoteToTransmit.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import {
  ExistingNoteSaveRequest,
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "./types/NoteSaveRequest.js";
import serialize from "../subwaytext/serialize.js";
import { removeSlugFromIndexes, updateIndexes } from "./indexUtils.js";
import DatabaseIO from "./DatabaseIO.js";
import { getCurrentISODateTime } from "./utils.js";
import {
  createSlug,
  isValidNoteSlug,
  sluggifyNoteText,
  sluggifyWikilinkText,
} from "./slugUtils.js";
import {
  createNoteToTransmit,
  getNoteTitle,
  mapInlineSpans,
} from "./noteUtils.js";


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


const handleExistingNoteUpdate = async (
  noteSaveRequest: ExistingNoteSaveRequest,
  io: DatabaseIO,
): Promise<NoteToTransmit> => {
  const graph = await io.getGraph();
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
  const graph = await io.getGraph();
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
  changeSlugReferencesInNote,
  handleExistingNoteUpdate,
  isExistingNoteSaveRequest,
  handleNewNoteSaveRequest,
};
