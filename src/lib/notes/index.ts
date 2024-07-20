import DatabaseIO from "./DatabaseIO.js";
import {
  createNoteToTransmit,
  getNumberOfUnlinkedNotes,
  parseSerializedNewNote,
  serializeNewNote,
  getSlugsFromInlineText,
  getAllInlineSpans,
  handleExistingNoteUpdate,
  isExistingNoteSaveRequest,
  handleNewNoteSaveRequest,
  changeSlugReferencesInNote,
  getNoteTitle,
} from "./noteUtils.js";
import {
  getNumberOfComponents,
  getGraphLinks,
  getGraphUpdateTimestamp,
  getGraphCreationTimestamp,
} from "./graphUtils.js";
import NoteToTransmit from "./types/NoteToTransmit.js";
import GraphStats from "./types/GraphStats.js";
import GraphObject from "./types/Graph.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import GraphStatsRetrievalOptions
  from "./types/GraphStatsRetrievalOptions.js";
import StorageProvider from "./types/StorageProvider.js";
import { FileInfo } from "./types/FileInfo.js";
import ExistingNote from "./types/ExistingNote.js";
import {
  NoteSaveRequest,
} from "./types/NoteSaveRequest.js";
import { search } from "./search.js";
import DatabaseQuery from "./types/DatabaseQuery.js";
import NoteListPage from "./types/NoteListPage.js";
import ByteRange from "./types/ByteRange.js";
import { Slug } from "./types/Slug.js";
import { Block } from "../subwaytext/types/Block.js";
import WriteGraphMetadataAction from "./types/FlushGraphMetadataAction.js";
import {
  getCurrentISODateTime,
  getExtensionFromFilename,
  getRandomKey,
} from "./utils.js";
import {
  getSlugFromFilename,
  isValidSlug,
  isValidSlugOrEmpty,
  isValidFileSlug,
  isValidNoteSlugOrEmpty,
} from "./slugUtils.js";
import { removeSlugFromIndexes, updateIndexes } from "./indexUtils.js";
import serialize from "../subwaytext/serialize.js";


export default class NotesProvider {
  /* STATIC */

  static getExtensionFromFilename = getExtensionFromFilename;
  static parseSerializedNewNote = parseSerializedNewNote;
  static serializeNewNote = serializeNewNote;
  static isValidSlug = isValidSlug;
  static isValidSlugOrEmpty = isValidSlugOrEmpty;
  static isValidNoteSlugOrEmpty = isValidNoteSlugOrEmpty;

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
          total: await this.#io.getTotalStorageSize(),
          notes: await this.#io.getSizeOfNotes(),
          files: graph.metadata.files.reduce((a, b) => {
            return a + b.size;
          }, 0),
        },
        version: graph.metadata.version,
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

    if (isExistingNoteSaveRequest(noteSaveRequest)) {
      return handleExistingNoteUpdate(
        noteSaveRequest,
        this.#io,
      );
    } else {
      return handleNewNoteSaveRequest(
        noteSaveRequest,
        this.#io,
      );
    }
  }


  async remove(
    slug: Slug,
  ): Promise<void> {
    const graph = await this.#io.getGraph();
    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    graph.notes.delete(slug);
    const aliasesToRemove: Set<Slug> = new Set();
    for (const [alias, canonicalSlug] of graph.aliases.entries()) {
      if (canonicalSlug === slug) {
        graph.aliases.delete(alias);
        aliasesToRemove.add(alias);
      }
    }

    let flushMetadata = WriteGraphMetadataAction.NONE;
    graph.metadata.pinnedNotes
      = graph.metadata.pinnedNotes.filter((s) => {
        if (s === slug) {
          flushMetadata = WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE;
        }
        return s !== slug;
      });

    removeSlugFromIndexes(graph, slug);

    await this.#io.flushChanges(
      graph,
      flushMetadata,
      new Set([slug]),
      aliasesToRemove,
    );
  }


  async addFile(
    readable: ReadableStream,
    folder: string,
    filename: string,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const slug = getSlugFromFilename(folder, filename, graph.metadata.files);
    const size = await this.#io.addFile(slug, readable);

    const fileInfo: FileInfo = {
      slug,
      size,
      createdAt: getCurrentISODateTime(),
    };
    graph.metadata.files.push(fileInfo);
    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      new Set(),
      new Set(),
    );

    return fileInfo;
  }


  async updateFile(
    readable: ReadableStream,
    slug: Slug,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find((file: FileInfo) => {
      return file.slug === slug;
    });

    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }

    const size = await this.#io.addFile(slug, readable);
    fileInfo.size = size;

    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      new Set(),
      new Set(),
    );

    return fileInfo;
  }


  async renameFile(
    oldSlug: Slug,
    newSlug: Slug,
    updateReferences: boolean,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.metadata.files.find((file: FileInfo) => {
      return file.slug === oldSlug;
    });

    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }

    if (!isValidFileSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    if (
      graph.notes.has(newSlug)
      || graph.aliases.has(newSlug)
      || graph.metadata.files.find((f) => f.slug === newSlug)
    ) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }

    await this.#io.renameFile(
      oldSlug,
      newSlug,
    );

    fileInfo.slug = newSlug;

    const notesThatNeedUpdate = new Set<Slug>;

    if (updateReferences) {
      for (const [noteSlug, outgoingLinks] of graph.indexes.outgoingLinks) {
        if (outgoingLinks.has(oldSlug)) {
          notesThatNeedUpdate.add(noteSlug);
          const note = graph.notes.get(noteSlug);

          if (!note) {
            throw new Error(
              "Note from index is undefined. This should not happen.",
            );
          }

          const blocks = graph.indexes.blocks.get(
            noteSlug,
          ) as Block[];

          const newBlocks = changeSlugReferencesInNote(
            blocks,
            oldSlug,
            newSlug,
            newSlug,
          );

          note.content = serialize(newBlocks);
          graph.indexes.blocks.set(note.meta.slug, newBlocks);
          updateIndexes(graph, note);
        }
      }
    }

    await this.#io.flushChanges(
      graph,
      WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE,
      notesThatNeedUpdate,
      new Set(),
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
      new Set(),
      new Set(),
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
    const allUsedFileSlugs = allUsedSlugs.filter(isValidFileSlug);
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
    const stream = await this.#io.getReadableStream(slug, range);
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
    await this.#io.flushChanges(graph, updateMetadata, new Set(), new Set());

    return this.getPins();
  }


  async movePinPosition(
    slug: Slug,
    offset: number,
  ): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    const oldPins = graph.metadata.pinnedNotes;

    if (!oldPins.includes(slug)) {
      throw new Error(ErrorMessage.PINNED_NOTE_NOT_FOUND);
    }

    const oldIndex = oldPins.indexOf(slug);
    const newIndex = oldIndex + offset;

    const newPins: Slug[] = oldPins
      .toSpliced(oldIndex, 1)
      .toSpliced(newIndex, 0, slug);

    graph.metadata.pinnedNotes = newPins;

    const updateMetadata = offset !== 0
      ? WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE
      : WriteGraphMetadataAction.NONE;
    await this.#io.flushChanges(graph, updateMetadata, new Set(), new Set());

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

    await this.#io.flushChanges(graph, updateMetadata, new Set(), new Set());

    return this.getPins();
  }

  async getGraph(): Promise<GraphObject> {
    const graph = await this.#io.getGraph();
    return graph;
  }

  async graphExistsInStorage(): Promise<boolean> {
    return this.#io.graphExistsInStorage();
  }
}

// exporting utils to be used in custom scripts
export {
  createNoteToTransmit,
  getNumberOfUnlinkedNotes,
  parseSerializedNewNote,
  serializeNewNote,
  getSlugsFromInlineText,
  getAllInlineSpans,
  handleExistingNoteUpdate,
  isExistingNoteSaveRequest,
  handleNewNoteSaveRequest,
  changeSlugReferencesInNote,
  getNoteTitle,
};
