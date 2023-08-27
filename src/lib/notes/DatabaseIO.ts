/*
  This class communicates with the Storage provider it is given to do
  IO operations on the file system.
  This class knows about the folder structure inside a graph folder but not
  about the outside folder structure. That is why it always passes
  a path relative to the graph folder. The storage
  provider is responsible to resolve the graph id to an absolute folder path.
*/


import Graph, { GraphMetadata } from "./interfaces/Graph.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";
import StorageProvider from "./interfaces/StorageProvider.js";
import {
  getAllInlineSpans,
  getSlugsFromInlineText,
  isFileSlug,
  parseSerializedExistingNote,
  serializeNote,
} from "./noteUtils.js";
import {
  Block,
} from "../subwaytext/interfaces/Block.js";
import ByteRange from "./interfaces/ByteRange.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import { Slug } from "./interfaces/Slug.js";
import { FILE_SLUG_PREFIX } from "./config.js";
// @ts-ignore
import subwaytextWorkerUrl from "../subwaytext/index.js?worker&url";
import { GraphMetadataV1, migrateToV2 } from "./migrations/v2.js";
import { GraphMetadataV2, migrateToV3 } from "./migrations/v3.js";

export default class DatabaseIO {
  #storageProvider: StorageProvider;
  #loadedGraph: Graph | null = null;
  #graphRetrievalInProgress: Promise<void> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #finishedObtainingGraph: (() => void) = () => {};

  #GRAPH_METADATA_FILENAME = ".graph.json";
  #NAME_OF_FILES_SUBDIRECTORY = "files";
  static #NOTE_FILE_EXTENSION = ".subtext";

  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool: Worker[] = [];

  // Returns the filename for a note with the given slug.
  static getFilenameForNoteSlug(slug: Slug): string {
    if (!slug) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#NOTE_FILE_EXTENSION}`;
  }

  static getSlugsFromFilenames(filenames: string[]): Slug[] {
    return filenames.filter((filename: string): boolean => {
      return filename.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION);
    }).map((filename: string): Slug => {
      return filename.slice(0, -DatabaseIO.#NOTE_FILE_EXTENSION.length);
    });
  }


  private async getNoteFilenamesFromGraphDirectory(): Promise<string[]> {
    return (await this.#storageProvider.listDirectory())
      .filter((entry: string): boolean => {
        return entry.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION);
      });
  }


  private async parseGraph(
    serializedNotes: Map<Slug, string>,
    metadataSerialized?: string,
  ): Promise<Graph> {
    let migrationPerformed = false;
    let parsedNotes = new Map<Slug, ExistingNote>();

    for (const [slug, serializedNote] of serializedNotes) {
      let parsedNote: ExistingNote;
      try {
        parsedNote = parseSerializedExistingNote(serializedNote, slug);
        parsedNotes.set(slug, parsedNote);
      } catch (e) {
        continue;
      }
    }

    let graphMetadata = typeof metadataSerialized === "string"
      ? JSON.parse(
        metadataSerialized,
      ) as GraphMetadata | GraphMetadataV2 | GraphMetadataV1
      : this.createEmptyGraphMetadata();

    if (!("version" in graphMetadata)) {
      const v2 = await migrateToV2(
        graphMetadata,
        parsedNotes,
        this.#storageProvider,
      );
      graphMetadata = v2.metadata;
      parsedNotes = v2.notes;
      migrationPerformed = true;
    }

    if (graphMetadata.version === "2") {
      const v3 = await migrateToV3(
        graphMetadata,
        parsedNotes,
      );
      graphMetadata = v3.metadata;
      parsedNotes = v3.notes;
      migrationPerformed = true;
    }

    const blockIndex = await DatabaseIO.createBlockIndex(
      Array.from(parsedNotes.values()),
    );
    const outgoingLinkIndex = DatabaseIO.createOutgoingLinkIndex(blockIndex);
    const backlinkIndex = DatabaseIO.createBacklinkIndex(outgoingLinkIndex);

    const parsedGraphObject: Graph = {
      notes: parsedNotes,
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex,
      },
      metadata: graphMetadata,
    };

    if (migrationPerformed) {
      await this.flushChanges(parsedGraphObject);
    }

    return parsedGraphObject;
  }


  private async readAndParseGraphFromDisk(): Promise<Graph> {
    const noteFilenames = await this.getNoteFilenamesFromGraphDirectory();

    let graphMetadataSerialized: string | undefined;
    try {
      graphMetadataSerialized
        = await this.#storageProvider.readObjectAsString(
          this.#GRAPH_METADATA_FILENAME,
        );
    } catch (e) {
      // if the file does not exist, we just create a new one later
      graphMetadataSerialized = undefined;
    }

    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename: string): Promise<[Slug, string]> => {
            const slug = filename.slice(
              0,
              -DatabaseIO.#NOTE_FILE_EXTENSION.length,
            );
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


  // getSlugsFromParsedNote returns all slugs that are referenced in the note.
  static getSlugsFromParsedNote(note: Block[]): Slug[] {
    const inlineSpans = getAllInlineSpans(note);
    const slugs = getSlugsFromInlineText(inlineSpans);
    return slugs;
  }


  /*
    The outgoing link index contains all links that are referenced in a note,
    no matter if the link target exists or not.
  */
  private static createOutgoingLinkIndex(
    blockIndex: Map<Slug, Block[]>,
  ): Map<Slug, Set<Slug>> {
    const outgoingLinkIndex = new Map<Slug, Set<Slug>>();

    for (const [slug, blocks] of blockIndex) {
      const outgoingLinks = DatabaseIO.getSlugsFromParsedNote(blocks)
        .filter((link: Slug): boolean => {
          return !link.startsWith(FILE_SLUG_PREFIX);
        });
      outgoingLinkIndex.set(slug, new Set(outgoingLinks));
    }
    return outgoingLinkIndex;
  }


  /*
    The backlinks index only contains slugs of existing notes that
    reference a note.
  */
  private static createBacklinkIndex(
    outgoingLinks: Map<Slug, Set<Slug>>,
  ): Map<Slug, Set<Slug>> {
    const backlinkIndex = new Map<Slug, Set<Slug>>();

    for (const [slug, links] of outgoingLinks) {
      if (!backlinkIndex.has(slug)) {
        backlinkIndex.set(slug, new Set<Slug>());
      }

      for (const link of links) {
        if (!backlinkIndex.has(link)) {
          backlinkIndex.set(link, new Set<Slug>());
        }

        if (
          (!slug.startsWith(FILE_SLUG_PREFIX)
          && !link.startsWith(FILE_SLUG_PREFIX))
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          backlinkIndex.get(link)!.add(slug);
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


  private async writeGraphMetadataFile(graph: Graph) {
    await this.#storageProvider.writeObject(
      this.#GRAPH_METADATA_FILENAME,
      // we pretty print the JSON for Git to be able to show better diffs
      JSON.stringify(graph.metadata, null, 2),
    );
  }


  private createEmptyGraphMetadata(): GraphMetadata {
    return {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      screenPosition: {
        translateX: 200, // good value to see INPI completely
        translateY: 200, // good value to see INPI completely
        scale: 1,
      },
      initialNodePosition: {
        x: 0,
        y: 0,
      },
      pinnedNotes: [],
      files: [],
      version: "3",
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

    // Flushing the graph will also save it in memory for
    // faster access the next time.
    await this.flushChanges(graphFromDisk, []);
    this.#finishedObtainingGraph();
    return graphFromDisk;
  }


  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. It should always be called
  // after any operation on the internal graph representation
  // has been performed.
  // If slugsToFlush is not provided, all notes will be flushed. This should
  // only be done if really necessary.
  // The graph metadata file will always be refreshed.
  async flushChanges(
    graph: Graph,
    slugsToFlush?: Slug[],
  ): Promise<void> {
    graph.metadata.updatedAt = Date.now();
    this.#loadedGraph = graph;
    await this.writeGraphMetadataFile(graph);

    if (slugsToFlush) {
      await Promise.all(slugsToFlush.map(async (slug) => {
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
  }


  async addFile(
    slug: Slug,
    source: ReadableStream,
  ): Promise<number> {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      slug.substring(FILE_SLUG_PREFIX.length),
    );
    const size = await this.#storageProvider.writeObjectFromReadable(
      filepath,
      source,
    );
    return size;
  }


  async deleteFile(
    slug: Slug,
  ): Promise<void> {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    await this.#storageProvider.removeObject(
      this.#storageProvider.joinPath(
        this.#NAME_OF_FILES_SUBDIRECTORY,
        slug.substring(FILE_SLUG_PREFIX.length),
      ),
    );
  }


  async getReadableFileStream(
    slug: Slug,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      slug.substring(FILE_SLUG_PREFIX.length),
    );

    const stream = await this.#storageProvider.getReadableStream(
      filepath,
      range,
    );

    return stream;
  }


  async getFileSize(
    slug: Slug,
  ): Promise<number> {
    if (!isFileSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      slug.substring(FILE_SLUG_PREFIX.length),
    );
    const fileSize
      = await this.#storageProvider.getFileSize(filepath);

    return fileSize;
  }


  async getFiles(): Promise<Slug[]> {
    // It could be that the directory does not exist yet. In that case, return
    // an empty array.
    try {
      const directoryListing = await this.#storageProvider.listDirectory(
        this.#NAME_OF_FILES_SUBDIRECTORY,
      );
      // Filter out system files
      const files = directoryListing.filter((filename: string): boolean => {
        return !filename.startsWith(".");
      });
      return files;
    } catch (e) {
      return [];
    }
  }


  async getSizeOfGraphFiles(): Promise<number> {
    // maybe the file folder was not created yet, so let's just try
    try {
      const size = await this.#storageProvider.getFolderSize(
        this.#NAME_OF_FILES_SUBDIRECTORY,
      );
      return size;
    } catch (e) {
      return 0;
    }
  }


  async getSizeOfGraph(): Promise<number> {
    try {
      const size = await this.#storageProvider.getFolderSize();
      return size;
    } catch (e) {
      return 0;
    }
  }


  async getSizeOfGraphWithFiles(): Promise<number> {
    const sizes = await Promise.all([
      this.getSizeOfGraph(),
      this.getSizeOfGraphFiles(),
    ]);

    return sizes[0] + sizes[1];
  }
}
