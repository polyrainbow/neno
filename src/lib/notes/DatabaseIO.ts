/*
  This class communicates with the Storage provider it is given to do
  IO operations on the file system.
  This class knows about the folder structure inside a graph folder but not
  about the outside folder structure. That is why it always passes
  a path relative to the graph folder. The storage
  provider is responsible to resolve the graph id to an absolute folder path.
*/


import Graph, { GraphMetadata } from "./types/Graph.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import StorageProvider from "./types/StorageProvider.js";
import {
  getSlugsFromParsedNote,
  parseSerializedExistingNote,
  serializeNote,
} from "./noteUtils.js";
import {
  Block,
} from "../subwaytext/types/Block.js";
import ByteRange from "./types/ByteRange.js";
import ExistingNote from "./types/ExistingNote.js";
import { Slug } from "./types/Slug.js";
// @ts-ignore
import subwaytextWorkerUrl from "../subwaytext/index.js?worker&url";
import WriteGraphMetadataAction from "./types/FlushGraphMetadataAction.js";
import { isValidFileSlug, isValidSlug } from "./slugUtils.js";
import { getCurrentISODateTime } from "./utils.js";

export default class DatabaseIO {
  #storageProvider: StorageProvider;
  #loadedGraph: Graph | null = null;
  #graphRetrievalInProgress: Promise<void> | null = null;
  #finishedObtainingGraph: (() => void) = () => {};

  #GRAPH_METADATA_FILENAME = ".graph.json";
  static #NOTE_FILE_EXTENSION = ".subtext";
  #ALIAS_HEADER = ":alias-of:";

  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool: Worker[] = [];

  // Returns the filename for a note with the given slug.
  static getFilenameForNoteSlug(slug: Slug): string {
    if (slug.length === 0) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#NOTE_FILE_EXTENSION}`;
  }

  static getSlugFromNoteFilename(filename: string): Slug {
    if (!filename.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION)) {
      throw new Error(
        "Filename does not end with default note filename extension",
      );
    }

    return filename.slice(0, -DatabaseIO.#NOTE_FILE_EXTENSION.length);
  }

  private async getNoteFilenamesFromStorageProvider(): Promise<string[]> {
    const objectNames = await this.#storageProvider.getAllObjectNames();

    return objectNames
      .filter(
        (filename: string) => {
          return filename.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION)
            && isValidSlug(DatabaseIO.getSlugFromNoteFilename(filename));
        },
      );
  }

  private async parseGraph(
    serializedNotesAndAliases: Map<Slug, string>,
    metadataSerialized?: string,
  ): Promise<Graph> {
    const parsedNotes = new Map<Slug, ExistingNote>();
    const aliases = new Map<Slug, Slug>();

    for (const [slug, serializedNote] of serializedNotesAndAliases) {
      let parsedNote: ExistingNote;
      try {
        if (serializedNote.startsWith(this.#ALIAS_HEADER)) {
          const canonicalSlug = serializedNote.slice(this.#ALIAS_HEADER.length);
          aliases.set(slug, canonicalSlug);
        } else {
          parsedNote = parseSerializedExistingNote(serializedNote, slug);
          parsedNotes.set(slug, parsedNote);
        }
      } catch (_e) {
        continue;
      }
    }

    let graphMetadata;

    if (typeof metadataSerialized === "string") {
      graphMetadata = JSON.parse(
        metadataSerialized,
      ) as GraphMetadata;
    } else {
      graphMetadata = this.createEmptyGraphMetadata();
      await this.writeGraphMetadataFile(graphMetadata);
    }

    const blockIndex = await DatabaseIO.createBlockIndex(
      Array.from(parsedNotes.values()),
    );
    const outgoingLinkIndex = DatabaseIO.createOutgoingLinkIndex(blockIndex);
    const backlinkIndex = DatabaseIO.createBacklinkIndex(
      outgoingLinkIndex,
      new Set<Slug>(parsedNotes.keys()),
      aliases,
    );

    const parsedGraphObject: Graph = {
      notes: parsedNotes,
      aliases,
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex,
      },
      metadata: graphMetadata,
    };

    return parsedGraphObject;
  }


  private async readAndParseGraphFromDisk(): Promise<Graph> {
    /*
      METADATA
    */

    let graphMetadataSerialized: string | undefined;
    try {
      graphMetadataSerialized
        = await this.#storageProvider.readObjectAsString(
          this.#GRAPH_METADATA_FILENAME,
        );
    } catch (_e) {
      graphMetadataSerialized = undefined;
    }

    /*
      NOTES AND ALIASES
    */

    const noteFilenames = await this.getNoteFilenamesFromStorageProvider();

    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename: string): Promise<[Slug, string]> => {
            const slug = DatabaseIO.getSlugFromNoteFilename(filename);
            const serializedNote
              = await this.#storageProvider.readObjectAsString(
                filename,
              );
            return [slug, serializedNote];
          },
        ),
      ),
    );

    return this.parseGraph(serializedNotes, graphMetadataSerialized);
  }


  /*
    The outgoing link index contains all links that are referenced in a note,
    including links to files, no matter if the link target exists or not.
  */
  private static createOutgoingLinkIndex(
    blockIndex: Map<Slug, Block[]>,
  ): Map<Slug, Set<Slug>> {
    const outgoingLinkIndex = new Map<Slug, Set<Slug>>();

    for (const [slug, blocks] of blockIndex) {
      const outgoingLinks = getSlugsFromParsedNote(blocks);
      outgoingLinkIndex.set(slug, new Set(outgoingLinks));
    }
    return outgoingLinkIndex;
  }


  /*
    The backlinks index only contains slugs of existing notes that
    reference a note or one of its aliases.
  */
  private static createBacklinkIndex(
    outgoingLinks: Map<Slug, Set<Slug>>,
    existingNoteSlugs: Set<Slug>,
    aliases: Map<Slug, Slug>,
  ): Map<Slug, Set<Slug>> {
    const backlinkIndex = new Map<Slug, Set<Slug>>();

    for (const [slug, links] of outgoingLinks) {
      if (!backlinkIndex.has(slug)) {
        backlinkIndex.set(slug, new Set<Slug>());
      }

      for (const link of links) {
        // We only want to add backlinks to existing notes
        if (existingNoteSlugs.has(link)) {
          if (!backlinkIndex.has(link)) {
            backlinkIndex.set(link, new Set<Slug>());
          }

          backlinkIndex.get(link)!.add(slug);
        }

        if (aliases.has(link)) {
          const canonicalSlug = aliases.get(link) as Slug;
          if (!backlinkIndex.has(canonicalSlug)) {
            backlinkIndex.set(canonicalSlug, new Set<Slug>());
          }

          backlinkIndex.get(canonicalSlug)!.add(slug);
        }
      }
    }
    return backlinkIndex;
  }


  private static createBlockIndex(
    notes: ExistingNote[],
  ): Promise<Map<Slug, Block[]>> {
    interface UnparsedDocument {
      id: string;
      content: string;
    }

    interface ParsedDocument {
      id: string;
      parsedContent: Block[];
    }

    const concurrency = navigator.hardwareConcurrency || 2;

    if (DatabaseIO.#workerPool.length === 0) {
      for (let t = 0; t < concurrency; t++) {
        const worker = new Worker(
          subwaytextWorkerUrl,
          { type: "module" },
        );
        this.#workerPool.push(worker);
      }
    }

    return new Promise<Map<Slug, Block[]>>((resolve, reject) => {
      const blockIndex = new Map<Slug, Block[]>();

      for (let t = 0; t < concurrency; t++) {
        const notesPerThread = Math.ceil(notes.length / concurrency);
        const start = t * notesPerThread;
        const end = Math.min((t + 1) * notesPerThread, notes.length);
        const notesForThread = notes.slice(start, end)
          .map((note: ExistingNote): UnparsedDocument => {
            return {
              id: note.meta.slug,
              content: note.content,
            };
          });
        const worker = DatabaseIO.#workerPool[t];

        worker.onmessage = (event: MessageEvent<ParsedDocument[]>) => {
          const notesParsed = event.data;
          for (const noteParsed of notesParsed) {
            blockIndex.set(noteParsed.id, noteParsed.parsedContent);
          }
          if (blockIndex.size === notes.length) {
            resolve(blockIndex);
            return;
          }
        };

        worker.onerror = (event: ErrorEvent) => {
          reject(event.error);
        };

        worker.postMessage({
          "action": "PARSE_NOTES",
          "notes": notesForThread,
        });
      }
    });
  }


  private async writeGraphMetadataFile(graphMetadata: GraphMetadata) {
    await this.#storageProvider.writeObject(
      this.#GRAPH_METADATA_FILENAME,
      // we pretty print the JSON for Git to be able to show better diffs
      JSON.stringify(graphMetadata, null, 2),
    );
  }


  private createEmptyGraphMetadata(): GraphMetadata {
    return {
      createdAt: getCurrentISODateTime(),
      updatedAt: getCurrentISODateTime(),
      pinnedNotes: [],
      files: [],
      version: "5",
    };
  }

  /**
    PUBLIC
  **/

  constructor(config: {
    storageProvider: StorageProvider,
  }) {
    this.#storageProvider = config.storageProvider;
  }


  async getRawNote(
    slug: Slug,
  ): Promise<string> {
    const rawNote = await this.#storageProvider.readObjectAsString(
      DatabaseIO.getFilenameForNoteSlug(slug),
    );
    if (!rawNote) {
      throw new Error(ErrorMessage.GRAPH_NOT_FOUND);
    }

    return rawNote;
  }


  async getGraph(): Promise<Graph> {
    // We only want to get one graph at a time to reduce unnecessary disk usage
    // that occurs when a consumer performs two or more API calls at the same
    // time. To prevent accessing the disk twice or more for the same data,
    // let's wait here until other executions of this function are finished.
    if (this.#graphRetrievalInProgress) {
      await this.#graphRetrievalInProgress;
    }
    // and then make others wait
    this.#graphRetrievalInProgress = new Promise((resolve) => {
      this.#finishedObtainingGraph = () => {
        this.#graphRetrievalInProgress = null;
        resolve();
      };
    });

    // Now let's try to get the requested graph object in 2 ways:
    // Way 1: Fast memory access: try to get it from loaded graph objects
    if (this.#loadedGraph) {
      this.#finishedObtainingGraph();
      return this.#loadedGraph;
    }

    // Way 2: Slow disk access. We first need to read from disk,
    // parse everything, and create indexes.
    const graphFromDisk: Graph
      = await this.readAndParseGraphFromDisk();

    // Save the graph in memory for faster access the next time.
    this.#loadedGraph = graphFromDisk;

    this.#finishedObtainingGraph();
    return graphFromDisk;
  }


  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. It should always be called
  // after any operation on the internal graph representation
  // has been performed.
  async flushChanges(
    graph: Graph,
    writeGraphMetadata: WriteGraphMetadataAction,
    canonicalSlugsToFlush: Set<Slug> | "all",
    aliasesToFlush: Set<Slug> | "all",
  ): Promise<void> {
    if (
      writeGraphMetadata === WriteGraphMetadataAction.WRITE
      || writeGraphMetadata
        === WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE
    ) {
      if (
        writeGraphMetadata
          === WriteGraphMetadataAction.UPDATE_TIMESTAMP_AND_WRITE
      ) {
        graph.metadata.updatedAt = getCurrentISODateTime();
      }
      await this.writeGraphMetadataFile(graph.metadata);
    }

    this.#loadedGraph = graph;

    if (canonicalSlugsToFlush instanceof Set) {
      await Promise.all(Array.from(canonicalSlugsToFlush).map(async (slug) => {
        const filename = DatabaseIO.getFilenameForNoteSlug(slug);
        if (!graph.notes.has(slug)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            serializeNote(graph.notes.get(slug) as ExistingNote),
          );
        }
      }));
    } else {
      for (const [slug, note] of graph.notes) {
        const filename = DatabaseIO.getFilenameForNoteSlug(slug);
        if (!graph.notes.has(slug)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            serializeNote(note),
          );
        }
      }
    }


    if (aliasesToFlush instanceof Set) {
      await Promise.all(Array.from(aliasesToFlush).map(async (alias) => {
        const filename = DatabaseIO.getFilenameForNoteSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          const canonicalSlug = graph.aliases.get(alias) as Slug;
          await this.#storageProvider.writeObject(
            filename,
            `${this.#ALIAS_HEADER}${canonicalSlug}`,
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getFilenameForNoteSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          await this.#storageProvider.writeObject(
            filename,
            `${this.#ALIAS_HEADER}${canonicalSlug}`,
          );
        }
      }
    }
  }


  async addFile(
    slug: Slug,
    source: ReadableStream,
  ): Promise<number> {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const size = await this.#storageProvider.writeObjectFromReadable(
      slug,
      source,
    );
    return size;
  }


  async renameFile(
    slug: Slug,
    newSlug: Slug,
  ): Promise<void> {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    if (!isValidFileSlug(newSlug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    await this.#storageProvider.renameFile(
      slug,
      newSlug,
    );
  }


  async deleteFile(
    slug: Slug,
  ): Promise<void> {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    await this.#storageProvider.removeObject(slug);
  }


  async getReadableStream(
    slug: Slug,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const stream = await this.#storageProvider.getReadableStream(
      slug,
      range,
    );

    return stream;
  }


  async getFileSize(
    slug: Slug,
  ): Promise<number> {
    if (!isValidFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const fileSize
      = await this.#storageProvider.getObjectSize(slug);

    return fileSize;
  }


  async getSizeOfNotes(): Promise<number> {
    const noteFilenames = await this.getNoteFilenamesFromStorageProvider();
    const noteSizes = [];
    for (const noteFilename of noteFilenames) {
      const noteSize = await this.#storageProvider.getObjectSize(noteFilename);
      noteSizes.push(noteSize);
    }

    return noteSizes.reduce((a, b) => a + b, 0);
  }

  async getTotalStorageSize(): Promise<number> {
    return this.#storageProvider.getTotalSize();
  }

  async graphExistsInStorage(): Promise<boolean> {
    try {
      await this.#storageProvider.readObjectAsString(
        this.#GRAPH_METADATA_FILENAME,
      );
      return true;
    } catch (_e) {
      const noteFilenamesInStorage
        = await this.getNoteFilenamesFromStorageProvider();
      return noteFilenamesInStorage.length > 0;
    }
  }
}
