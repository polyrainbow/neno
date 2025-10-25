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
import {
  getArbitraryFilePath,
  getCurrentISODateTime,
  getExtensionFromFilename,
  getRandomKey,
} from "./utils.js";
import {
  isValidSlug,
  isValidSlugOrEmpty,
  isValidNoteSlugOrEmpty,
  getAllUsedSlugsInGraph,
  getSlugAndNameForNewArbitraryFile,
  getLastSlugSegment,
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

  /*
    Forces re-indexing of the entire graph. This is useful when you suspect
    that the indexes are out of sync with the actual notes, e.g., after an
    external modification of the note files.
  */
  async reIndexGraph(): Promise<void> {
    await this.#io.getGraph(true);
  }


  async get(
    slug: Slug,
    options?: {
      includeParsedContent?: boolean,
    },
  ): Promise<NoteToTransmit> {
    const graph = await this.#io.getGraph();

    const canonicalSlug = graph.aliases.get(slug) || slug;

    if (!graph.notes.has(canonicalSlug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    const noteFromDB = graph.notes.get(canonicalSlug) as ExistingNote;

    const noteToTransmit: NoteToTransmit = await createNoteToTransmit(
      noteFromDB,
      graph,
      options?.includeParsedContent,
    );

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


  /*
    Returns the unparsed note as saved in the file system.
  */
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
      numberOfFiles: graph.files.size,
      numberOfPins: graph.pinnedNotes.length,
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
          files: Array.from(graph.files.values()).reduce((a, b) => {
            return a + b.size;
          }, 0),
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

    let flushPins = false;
    graph.pinnedNotes
      = graph.pinnedNotes.filter((s) => {
        if (s === slug) {
          flushPins = true;
        }
        return s !== slug;
      });

    removeSlugFromIndexes(graph, slug);

    await this.#io.flushChanges(
      graph,
      flushPins,
      new Set([slug]),
      aliasesToRemove,
      new Set(),
    );
  }

  #fileAdditionInProgress: Promise<void> | null = null;
  #finishedAddingFile: (() => void) = () => {};

  async addFile(
    readable: ReadableStream,
    namespace: string,
    originalFilename: string,
  ): Promise<FileInfo> {

    /*
      We need to add files one after another, so we need to wait for the
      previous file addition to finish.
      Reason: We need to make sure that the slug of the new file is unique.
    */
    if (this.#fileAdditionInProgress) {
      await this.#fileAdditionInProgress;
    }

    this.#fileAdditionInProgress = new Promise((resolve) => {
      this.#finishedAddingFile = () => {
        this.#fileAdditionInProgress = null;
        resolve();
      };
    });

    try {
      const graph = await this.#io.getGraph();
      const { slug, filename } = getSlugAndNameForNewArbitraryFile(
        namespace,
        originalFilename,
        getAllUsedSlugsInGraph(graph),
      );
      const size = await this.#io.addFile(slug, readable);

      const fileInfo: FileInfo = {
        slug,
        filename,
        size,
        createdAt: getCurrentISODateTime(),
        updatedAt: getCurrentISODateTime(),
      };
      graph.files.set(slug, fileInfo);
      await this.#io.flushChanges(
        graph,
        false,
        new Set(),
        new Set(),
        new Set([slug]),
      );

      return fileInfo;
    } finally {
      this.#finishedAddingFile();
    }
  }


  async updateFile(
    readable: ReadableStream,
    slug: Slug,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(slug);

    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }

    const size = await this.#io.addFile(slug, readable);
    fileInfo.size = size;

    await this.#io.flushChanges(
      graph,
      false,
      new Set(),
      new Set(),
      new Set([slug]),
    );

    return fileInfo;
  }


  async renameFileSlug(
    oldSlug: Slug,
    newSlug: Slug,
    updateReferences: boolean,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(oldSlug);

    if (!fileInfo) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }

    if (!isValidSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const extension = getExtensionFromFilename(fileInfo.filename);

    // Enforce that slug has correct filename extension
    if (typeof extension === "string" && !newSlug.endsWith(`.${extension}`)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    if (
      graph.notes.has(newSlug)
      || graph.aliases.has(newSlug)
      || graph.files.has(newSlug)
    ) {
      throw new Error(ErrorMessage.SLUG_EXISTS);
    }

    await this.#io.moveArbitraryGraphFile(
      oldSlug,
      newSlug,
    );

    fileInfo.updatedAt = getCurrentISODateTime();
    fileInfo.slug = newSlug;
    fileInfo.filename = getLastSlugSegment(newSlug);

    graph.files.delete(oldSlug);
    graph.files.set(newSlug, fileInfo);

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
      false,
      notesThatNeedUpdate,
      new Set(),
      new Set([oldSlug, newSlug]),
    );

    return fileInfo;
  }


  async deleteFile(
    slug: Slug,
  ): Promise<void> {
    const graph = await this.#io.getGraph();
    if (!graph.files.has(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }

    const fileInfo = graph.files.get(slug)!;
    const agfPath = getArbitraryFilePath(fileInfo);
    await this.#io.deleteArbitraryGraphFile(agfPath);

    graph.files.delete(slug);
    await this.#io.flushChanges(
      graph,
      false,
      new Set(),
      new Set(),
      new Set([slug]),
    );
  }


  async getFiles(): Promise<FileInfo[]> {
    const graph = await this.#io.getGraph();
    return Array.from(graph.files.values());
  }

  // get files not used in any note
  async getSlugsOfDanglingFiles(): Promise<Slug[]> {
    const graph = await this.#io.getGraph();
    const allBlocks: Block[]
      = Array.from(graph.indexes.blocks.values()).flat();
    const allInlineSpans = getAllInlineSpans(allBlocks);
    const allUsedSlugs = getSlugsFromInlineText(allInlineSpans);
    const allUsedFileSlugs = allUsedSlugs.filter(isValidSlug);
    return Array.from(graph.files.keys())
      .filter((slug) => {
        return !allUsedFileSlugs.includes(slug);
      });
  }


  async getReadableArbitraryGraphFileStream(
    slug: Slug,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    const graph = await this.#io.getGraph();
    if (!graph.files.has(slug)) {
      throw new Error(ErrorMessage.FILE_NOT_FOUND);
    }

    const filename = graph.files.get(slug)!.filename;

    const stream = await this.#io.getReadableArbitraryGraphFileStream(
      slug,
      filename,
      range,
    );
    return stream;
  }


  async getFileInfo(
    slug: Slug,
  ): Promise<FileInfo> {
    const graph = await this.#io.getGraph();
    const fileInfo = graph.files.get(slug);
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
      graph.pinnedNotes
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

    const oldLength = graph.pinnedNotes.length;

    graph.pinnedNotes = Array.from(
      new Set([...graph.pinnedNotes, slug]),
    );

    const newLength = graph.pinnedNotes.length;

    const updatePins = oldLength !== newLength;
    await this.#io.flushChanges(
      graph,
      updatePins,
      new Set(),
      new Set(),
      new Set(),
    );

    return this.getPins();
  }


  async movePinPosition(
    slug: Slug,
    offset: number,
  ): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    const oldPins = graph.pinnedNotes;

    if (!oldPins.includes(slug)) {
      throw new Error(ErrorMessage.PINNED_NOTE_NOT_FOUND);
    }

    const oldIndex = oldPins.indexOf(slug);
    const newIndex = oldIndex + offset;

    const newPins: Slug[] = oldPins
      .toSpliced(oldIndex, 1)
      .toSpliced(newIndex, 0, slug);

    graph.pinnedNotes = newPins;

    const updatePins = offset !== 0;
    await this.#io.flushChanges(
      graph,
      updatePins,
      new Set(),
      new Set(),
      new Set(),
    );

    return this.getPins();
  }

  async unpin(
    slugToRemove: Slug,
  ): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    let updatePins = false;

    graph.pinnedNotes
      = graph.pinnedNotes.filter((s) => {
        if (s === slugToRemove) {
          updatePins = true;
        }
        return s !== slugToRemove;
      });

    await this.#io.flushChanges(
      graph,
      updatePins,
      new Set(),
      new Set(),
      new Set(),
    );

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
