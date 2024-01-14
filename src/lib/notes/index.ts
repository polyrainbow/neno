import DatabaseIO from "./DatabaseIO.js";
import {
  createNoteToTransmit,
  getSortFunction,
  createNoteListItems,
  getNumberOfComponents,
  getNumberOfUnlinkedNotes,
  getExtensionFromFilename,
  parseSerializedNewNote,
  serializeNewNote,
  removeCustomMetadataWithEmptyKeys,
  getGraphLinks,
  isValidSlug,
  createSlug,
  getNoteTitle,
  getRandomKey,
  changeSlugReferencesInNote,
  sluggify,
  getSlugsFromInlineText,
  getAllInlineSpans,
  isFileSlug,
  getSlugFromFilename,
  getGraphUpdateTimestamp,
  getGraphCreationTimestamp,
} from "./noteUtils.js";
import NoteToTransmit from "./types/NoteToTransmit.js";
import GraphStats from "./types/GraphStats.js";
import { NoteListSortMode } from "./types/NoteListSortMode.js";
import GraphObject from "./types/Graph.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import GraphStatsRetrievalOptions
  from "./types/GraphStatsRetrievalOptions.js";
import StorageProvider from "./types/StorageProvider.js";
import { FileInfo } from "./types/FileInfo.js";
import ExistingNote from "./types/ExistingNote.js";
import { NoteSaveRequest } from "./types/NoteSaveRequest.js";
import subwaytext from "../subwaytext/index.js";
import { search } from "./search.js";
import DatabaseQuery from "./types/DatabaseQuery.js";
import NoteListPage from "./types/NoteListPage.js";
import ByteRange from "./types/ByteRange.js";
import { Slug } from "./types/Slug.js";
import { Block } from "../subwaytext/types/Block.js";
import serialize from "../subwaytext/serialize.js";
import WriteGraphMetadataAction from "./types/FlushGraphMetadataAction.js";


export default class NotesProvider {
  /* STATIC */

  static getExtensionFromFilename = getExtensionFromFilename;
  static parseSerializedNewNote = parseSerializedNewNote;
  static serializeNewNote = serializeNewNote;
  static isValidSlug = isValidSlug;

  static removeSlugFromIndexes(
    graph: GraphObject,
    slug: Slug,
  ): void {
    graph.indexes.blocks.delete(slug);
    graph.indexes.outgoingLinks.delete(slug);
    graph.indexes.backlinks.delete(slug);

    /*
      We will not remove occurences of this slug in other notes
      (outgoing links), because that index is keeping all slugs, even with
      non-existing targets.
      This is because we do not want to re-index all notes when a note is
      created/updated/deleted.
    */

    graph.indexes.backlinks.forEach((backlinks: Set<Slug>) => {
      backlinks.delete(slug);
    });
  }

  static updateIndexes = (
    graph: GraphObject,
    existingNote: ExistingNote,
  ): void => {
    // Block index
    const blocks = subwaytext(existingNote.content);

    graph.indexes.blocks.set(
      existingNote.meta.slug,
      blocks,
    );

    const ourSlug = existingNote.meta.slug;
    graph.indexes.blocks.set(ourSlug, blocks);

    // Outgoing links index
    const ourOutgoingLinks = DatabaseIO.getSlugsFromParsedNote(blocks);
    graph.indexes.outgoingLinks.set(ourSlug, new Set(ourOutgoingLinks));

    // Backlinks index: Let's first check if we need to create one
    let ourBacklinks: Set<Slug> | null = null;
    if (!graph.indexes.backlinks.has(ourSlug)) {
      ourBacklinks = new Set<Slug>();
      graph.indexes.backlinks.set(ourSlug, ourBacklinks);
    }

    for (const someExistingSlug of graph.notes.keys()) {
      if (someExistingSlug === ourSlug) {
        continue;
      }

      if (ourOutgoingLinks.includes(someExistingSlug)) {
        (graph.indexes.backlinks.get(someExistingSlug) as Set<Slug>)
          .add(ourSlug);
      } else {
        (graph.indexes.backlinks.get(someExistingSlug) as Set<Slug>)
          .delete(ourSlug);
      }

      // we only need to create a new backlink index if we created the Set
      // `ourBacklinks` earlier
      if (ourBacklinks) {
        const theirOutgoingLinks = graph.indexes.outgoingLinks.get(
          someExistingSlug,
        ) as Set<Slug>;

        if (theirOutgoingLinks.has(ourSlug)) {
          ourBacklinks.add(someExistingSlug);
        }
      }
    }
  };

  #io: DatabaseIO;

  constructor(
    storageProvider: StorageProvider,
  ) {
    this.#io = new DatabaseIO({ storageProvider });
  }


  async get(
    slug: Slug,
  ): Promise<NoteToTransmit> {
    const graph = await this.#io.getGraph();

    const canonicalSlug = graph.aliases.get(slug) || slug;

    if (!graph.notes.has(canonicalSlug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    const noteFromDB = graph.notes.get(canonicalSlug) as ExistingNote;

    const noteToTransmit: NoteToTransmit
      = await createNoteToTransmit(noteFromDB, graph);
    return noteToTransmit;
  }


  async getRandom(): Promise<NoteToTransmit> {
    const graph = await this.#io.getGraph();

    const noteFromDB: ExistingNote | null = graph.notes.size > 0
      ? graph.notes.get(getRandomKey(graph.notes) as Slug) as ExistingNote
      : null;

    if (!noteFromDB) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    const noteToTransmit: NoteToTransmit
      = await createNoteToTransmit(noteFromDB, graph);
    return noteToTransmit;
  }


  async getRawNote(
    slug: Slug,
  ): Promise<string> {
    const graph = await this.#io.getGraph();
    const canonicalSlug = graph.aliases.get(slug) || slug;
    return this.#io.getRawNote(canonicalSlug);
  }


  async getNotesList(
    query: DatabaseQuery,
  ): Promise<NoteListPage> {
    const graph: GraphObject = await this.#io.getGraph();
    return search(graph, query);
  }


  async getStats(
    options: GraphStatsRetrievalOptions,
  ): Promise<GraphStats> {
    const graph: GraphObject = await this.#io.getGraph();

    const numberOfUnlinkedNotes = getNumberOfUnlinkedNotes(graph);

    const stats: GraphStats = {
      numberOfAllNotes: graph.notes.size,
      numberOfLinks: getGraphLinks(graph).length,
      numberOfFiles: graph.metadata.files.length,
      numberOfPins: graph.metadata.pinnedNotes.length,
      numberOfAliases: graph.aliases.size,
      numberOfUnlinkedNotes,
    };

    if (options.includeMetadata) {
      stats.metadata = {
        createdAt: getGraphCreationTimestamp(graph),
        updatedAt: getGraphUpdateTimestamp(graph),
        size: {
          graph: await this.#io.getSizeOfGraph(),
          files: await this.#io.getSizeOfGraphFiles(),
        },
      };
    }

    /*
      including a graph analysis is quite CPU-heavy, that's why we include it
      only if explicitly asked for
    */
    if (options.includeAnalysis) {
      const numberOfComponents = getNumberOfComponents(graph);

      stats.analysis = {
        numberOfComponents,
        numberOfComponentsWithMoreThanOneNode:
          numberOfComponents - numberOfUnlinkedNotes,
        nodesWithHighestNumberOfLinks: createNoteListItems(
          Array.from(graph.notes.values()),
          graph,
        )
          .sort(getSortFunction(NoteListSortMode.NUMBER_OF_LINKS_DESCENDING))
          .slice(0, 3),
      };
    }

    return stats;
  }


  async put(
    noteSaveRequest: NoteSaveRequest,
  ): Promise<NoteToTransmit> {
    const noteFromUser = noteSaveRequest.note;

    if (
      (!noteFromUser)
      || (typeof noteFromUser.content !== "string")
    ) {
      throw new Error(ErrorMessage.INVALID_NOTE_STRUCTURE);
    }

    const graph: GraphObject = await this.#io.getGraph();

    if ("slug" in noteFromUser.meta) {
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

      graph.aliases.forEach((alias, canonicalSlug) => {
        if (canonicalSlug === existingNote.meta.slug) {
          graph.aliases.delete(alias);
        }
      });

      noteSaveRequest.aliases.forEach((alias) => {
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
        NotesProvider.removeSlugFromIndexes(graph, oldSlug);

        let flushMetadata = WriteGraphMetadataAction.NONE;

        for (let i = 0; i < graph.metadata.pinnedNotes.length; i++) {
          if (graph.metadata.pinnedNotes[i] === oldSlug) {
            graph.metadata.pinnedNotes[i] = newSlug;
            flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
          }
        }

        await this.#io.flushChanges(graph, flushMetadata, [oldSlug]);

        existingNote.meta.slug = newSlug;
        graph.notes.set(newSlug, existingNote);

        if (
          "updateReferences" in noteSaveRequest
          && noteSaveRequest.updateReferences
        ) {
          NotesProvider.updateIndexes(graph, existingNote);
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
            NotesProvider.updateIndexes(graph, thatNote);
            await this.#io.flushChanges(
              graph,
              WriteGraphMetadataAction.NONE,
              [thatNote.meta.slug],
            );
          }
        }
      } else {
        graph.notes.set(existingNote.meta.slug, existingNote);
      }

      NotesProvider.updateIndexes(graph, existingNote);
      await this.#io.flushChanges(
        graph,
        WriteGraphMetadataAction.NONE,
        [existingNote.meta.slug],
      );

      const noteToTransmit: NoteToTransmit
        = await createNoteToTransmit(existingNote, graph);
      return noteToTransmit;
    }

    /* create new note */
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

    noteSaveRequest.aliases.forEach((alias) => {
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
    NotesProvider.updateIndexes(graph, newNote);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.NONE,
      [newNote.meta.slug],
    );

    const noteToTransmit: NoteToTransmit
      = await createNoteToTransmit(newNote, graph);
    return noteToTransmit;
  }


  putRawNote(
    rawNote: string,
  ): Promise<NoteToTransmit> {
    const note = parseSerializedNewNote(rawNote);

    const noteSaveRequest: NoteSaveRequest = {
      note,
      aliases: new Set(),
      ignoreDuplicateTitles: true,
    };

    return this.put(noteSaveRequest);
  }


  async remove(
    slug: Slug,
  ): Promise<void> {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    graph.notes.delete(slug);

    graph.aliases.forEach((alias, canonicalSlug) => {
      if (canonicalSlug === slug) {
        graph.aliases.delete(alias);
      }
    });

    let flushMetadata = WriteGraphMetadataAction.NONE;
    graph.metadata.pinnedNotes
      = graph.metadata.pinnedNotes.filter((s) => {
        if (s === slug) {
          flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
        }
        return s !== slug;
      });

    NotesProvider.removeSlugFromIndexes(graph, slug);

    await this.#io.flushChanges(graph, flushMetadata, [slug]);
  }


  async addFile(
    readable: ReadableStream,
    filename: string,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const slug = getSlugFromFilename(filename, graph.metadata.files);
    const size = await this.#io.addFile(slug, readable);

    const fileInfo: FileInfo = {
      slug,
      size,
      createdAt: Date.now(),
    };
    graph.metadata.files.push(fileInfo);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      [],
    );

    return fileInfo;
  }


  async deleteFile(
    slug: Slug,
  ): Promise<void> {
    await this.#io.deleteFile(slug);

    const graph = await this.#io.getGraph();
    graph.metadata.files
      = graph.metadata.files.filter((file) => file.slug !== slug);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      [],
    );
  }


  async getFiles(): Promise<FileInfo[]> {
    const graph = await this.#io.getGraph();
    return graph.metadata.files;
  }

  // get files not used in any note
  async getDanglingFiles(): Promise<FileInfo[]> {
    const graph = await this.#io.getGraph();
    const allBlocks: Block[]
      = Array.from(graph.indexes.blocks.values()).flat();
    const allInlineSpans = getAllInlineSpans(allBlocks);
    const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
    const allUsedFileSlugs = allUsedSlugs.filter(isFileSlug);
    const danglingFiles = graph.metadata.files.filter((file) => {
      return !allUsedFileSlugs.includes(file.slug);
    });
    return danglingFiles;
  }


  async getReadableFileStream(
    slug: Slug,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    const graph = await this.#io.getGraph();
    if (!graph.metadata.files.map((file) => file.slug).includes(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    const stream = await this.#io.getReadableFileStream(slug, range);
    return stream;
  }


  async getFileInfo(
    slug: Slug,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find(
      (file) => file.slug === slug,
    );
    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }
    return fileInfo;
  }


  async getPins(): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    // Now that we enable editing the graph from external sources, we should be
    // more liberal with the pinned notes. If a slug is pinned but not in the
    // graph, we should just silently ignore it.
    const pinnedNotes: NoteToTransmit[] = (await Promise.allSettled(
      graph.metadata.pinnedNotes
        .map((slug) => {
          return this.get(slug);
        }),
    ))
      .filter((result): result is PromiseFulfilledResult<NoteToTransmit> => {
        return result.status === "fulfilled";
      })
      .map((result) => result.value);

    return pinnedNotes;
  }


  async pin(
    slug: Slug,
  ): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    const oldLength = graph.metadata.pinnedNotes.length;

    graph.metadata.pinnedNotes = Array.from(
      new Set([...graph.metadata.pinnedNotes, slug]),
    );

    const newLength = graph.metadata.pinnedNotes.length;

    const updateMetadata = oldLength !== newLength
      ? WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE
      : WriteGraphMetadataAction.NONE;
    await this.#io.flushChanges(graph, updateMetadata, []);

    return this.getPins();
  }


  async unpin(
    slugToRemove: Slug,
  ): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    let updateMetadata = WriteGraphMetadataAction.NONE;

    graph.metadata.pinnedNotes
      = graph.metadata.pinnedNotes.filter((s) => {
        if (s === slugToRemove) {
          updateMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
        }
        return s !== slugToRemove;
      });

    await this.#io.flushChanges(graph, updateMetadata, []);

    return this.getPins();
  }
}
