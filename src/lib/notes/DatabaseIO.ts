/*
  This class communicates with the Storage provider it is given to do
  IO operations on the file system.
  This class knows about the folder structure inside a graph folder but not
  about the outside folder structure. That is why it always passes
  a path relative to the graph folder. The storage
  provider is responsible to resolve the graph id to an absolute folder path.
*/


import Graph from "./types/Graph.js";
import { ErrorMessage } from "./types/ErrorMessage.js";
import StorageProvider from "./types/StorageProvider.js";
import {
  cleanSerializedNote,
  getSlugsFromParsedNote,
  parseGraphFileHeaders,
  parseSerializedExistingGraphFile,
  serializeNote,
  serializeNoteHeaders,
} from "./noteUtils.js";
import {
  Block,
} from "../subwaytext/types/Block.js";
import ByteRange from "./types/ByteRange.js";
import ExistingNote from "./types/ExistingNote.js";
import { Slug } from "./types/Slug.js";
// @ts-ignore
import subwaytextWorkerUrl from "../subwaytext/index.js?worker&url";
import {
  isValidSlug,
} from "./slugUtils.js";
import { FileInfo } from "./types/FileInfo.js";
import { CanonicalNoteHeader } from "./types/CanonicalNoteHeader.js";

export default class DatabaseIO {
  #storageProvider: StorageProvider;
  #loadedGraph: Graph | null = null;
  #graphRetrievalInProgress: Promise<void> | null = null;
  #finishedObtainingGraph: (() => void) = () => {};

  static #PINS_FILENAME = ".pins.neno";
  static #GRAPH_FILE_EXTENSION = ".subtext";
  static #ALIAS_HEADER_KEY = "alias-of";
  static #ARBITRARY_FILE_HEADER_KEY = "file";
  static #ARBITRARY_FILE_SIZE_HEADER_KEY = "size";

  // Block parsing is CPU intensive, so we use a web worker pool to parse
  // multiple notes in parallel.
  static #workerPool: Worker[] = [];

  // Returns the filename for a graph file with the given slug.
  static getSubtextGraphFilenameForSlug(slug: Slug): string {
    if (slug.length === 0) {
      throw new Error("Cannot get filename for empty slug");
    }
    return `${slug}${DatabaseIO.#GRAPH_FILE_EXTENSION}`;
  }

  static getSlugFromGraphFilename(filename: string): Slug {
    if (!filename.endsWith(DatabaseIO.#GRAPH_FILE_EXTENSION)) {
      throw new Error(
        "Filename does not end with default note filename extension",
      );
    }

    return filename.slice(0, -DatabaseIO.#GRAPH_FILE_EXTENSION.length);
  }

  static getArbitraryGraphFilepath(slug: Slug, filename: string): string {
    const lastSlashPos = slug.lastIndexOf("/");
    return lastSlashPos > -1
      ? slug.substring(0, lastSlashPos + 1) + filename
      : filename;
  }

  static parsePinsFile(pinsSerialized: string): Slug[] {
    if (pinsSerialized.length === 0) {
      return [];
    }
    return pinsSerialized.split("\n") as Slug[];
  }

  private async getGraphFilenamesFromStorageProvider(): Promise<string[]> {
    const objectNames = await this.#storageProvider.getAllObjectNames();

    return objectNames
      .filter(
        (filename: string) => {
          return filename.endsWith(DatabaseIO.#GRAPH_FILE_EXTENSION)
            && isValidSlug(DatabaseIO.getSlugFromGraphFilename(filename));
        },
      );
  }

  private async parseGraph(
    serializedGraphFiles: Map<Slug, string>,
    pinsSerialized?: string,
  ): Promise<Graph> {
    const parsedNotes = new Map<Slug, ExistingNote>();
    const aliases = new Map<Slug, Slug>();
    const files = new Map<Slug, FileInfo>();

    for (const [slug, serializedGraphFile] of serializedGraphFiles) {
      try {
        const serializedGraphFileCleaned = cleanSerializedNote(
          serializedGraphFile,
        );
        const headers = parseGraphFileHeaders(serializedGraphFileCleaned);

        if (headers.has(DatabaseIO.#ALIAS_HEADER_KEY)) {
          const targetSlug = headers.get(DatabaseIO.#ALIAS_HEADER_KEY)!;
          aliases.set(slug, targetSlug);
        } else if (
          headers.has(DatabaseIO.#ARBITRARY_FILE_HEADER_KEY)
          && headers.has(DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY)
        ) {
          const fileInfo: FileInfo = {
            slug,
            size: parseInt(
              headers.get(DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY)!,
            ),
            filename: headers.get(DatabaseIO.#ARBITRARY_FILE_HEADER_KEY)!,
            createdAt: headers.get("created-at"),
          };
          files.set(slug, fileInfo);
        } else {
          const parsedNote = parseSerializedExistingGraphFile(
            serializedGraphFile,
            slug,
          );
          parsedNotes.set(slug, parsedNote);
        }
      } catch (_e) {
        continue;
      }
    }

    let pinnedNotes: Slug[];

    if (typeof pinsSerialized === "string") {
      pinnedNotes = DatabaseIO.parsePinsFile(pinsSerialized);
    } else {
      pinnedNotes = [];
      await this.writePinsFile(pinnedNotes);
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
      files,
      pinnedNotes,
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex,
      },
    };

    return parsedGraphObject;
  }


  private async readAndParseGraphFromDisk(): Promise<Graph> {
    let pinsSerialized: string | undefined;
    try {
      pinsSerialized
        = await this.#storageProvider.readObjectAsString(
          DatabaseIO.#PINS_FILENAME,
        );
    } catch (_e) {
      pinsSerialized = undefined;
    }

    /*
      NOTES AND ALIASES
    */

    const noteFilenames = await this.getGraphFilenamesFromStorageProvider();

    const serializedNotes = new Map(
      await Promise.all(
        noteFilenames.map(
          async (filename: string): Promise<[Slug, string]> => {
            const slug = DatabaseIO.getSlugFromGraphFilename(filename);
            const serializedNote
              = await this.#storageProvider.readObjectAsString(
                filename,
              );
            return [slug, serializedNote];
          },
        ),
      ),
    );

    return this.parseGraph(serializedNotes, pinsSerialized);
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


  private async writePinsFile(pins: Slug[]) {
    await this.#storageProvider.writeObject(
      DatabaseIO.#PINS_FILENAME,
      pins.join("\n"),
    );
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
      DatabaseIO.getSubtextGraphFilenameForSlug(slug),
    );
    if (!rawNote) {
      throw new Error(ErrorMessage.GRAPH_NOT_FOUND);
    }

    return rawNote;
  }

  /*
    Retrieves the graph object. If forceDiskRead is true, the graph will be
    read from disk even if it is already loaded in memory.
    This is useful when you want to make sure you have the latest data from
    disk, e.g., after an external modification.
  */
  async getGraph(forceDiskRead = false): Promise<Graph> {
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
    if (this.#loadedGraph && !forceDiskRead) {
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
  // Beware that "all" won't delete abandoned graph files. So if a note is to
  // be deleted, its slug must be provided explicitly.
  async flushChanges(
    graph: Graph,
    flushPins: boolean,
    canonicalNoteSlugsToFlush: Set<Slug> | "all",
    aliasesToFlush: Set<Slug> | "all",
    arbitraryFilesToFlush: Set<Slug> | "all",
  ): Promise<void> {
    this.#loadedGraph = graph;

    if (canonicalNoteSlugsToFlush instanceof Set) {
      await Promise.all(
        Array.from(canonicalNoteSlugsToFlush).map(async (slug) => {
          const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
          if (!graph.notes.has(slug)) {
            await this.#storageProvider.removeObject(filename);
          } else {
            await this.#storageProvider.writeObject(
              filename,
              serializeNote(graph.notes.get(slug) as ExistingNote),
            );
          }
        }),
      );
    } else {
      for (const [slug, note] of graph.notes) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        await this.#storageProvider.writeObject(
          filename,
          serializeNote(note),
        );
      }
    }


    if (aliasesToFlush instanceof Set) {
      await Promise.all(Array.from(aliasesToFlush).map(async (alias) => {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        if (!graph.aliases.has(alias)) {
          await this.#storageProvider.removeObject(filename);
        } else {
          const canonicalSlug = graph.aliases.get(alias) as Slug;
          await this.#storageProvider.writeObject(
            filename,
            serializeNoteHeaders(new Map<string, string>([[
              DatabaseIO.#ALIAS_HEADER_KEY,
              canonicalSlug,
            ]])),
          );
        }
      }));
    } else {
      for (const [alias, canonicalSlug] of graph.aliases) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(alias);
        await this.#storageProvider.writeObject(
          filename,
          serializeNoteHeaders(new Map<string, string>([[
            DatabaseIO.#ALIAS_HEADER_KEY,
            canonicalSlug,
          ]])),
        );
      }
    }


    if (arbitraryFilesToFlush instanceof Set) {
      await Promise.all(Array.from(arbitraryFilesToFlush).map(async (slug) => {
        const sgfFilepath = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        if (!graph.files.has(slug)) {
          await this.#storageProvider.removeObject(sgfFilepath);
        } else {
          const fileInfo = graph.files.get(slug)!;
          const sizeHeaderValue = fileInfo.size.toString();
          const noteHeaders = new Map<string, string>([
            [DatabaseIO.#ARBITRARY_FILE_HEADER_KEY, fileInfo.filename],
            [DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY, sizeHeaderValue],
          ]);

          if (fileInfo.createdAt) {
            noteHeaders.set(
              CanonicalNoteHeader.CREATED_AT,
              fileInfo.createdAt?.toString(),
            );
          }

          if (fileInfo.updatedAt) {
            noteHeaders.set(
              CanonicalNoteHeader.UPDATED_AT,
              fileInfo.updatedAt?.toString(),
            );
          }

          const data = serializeNoteHeaders(noteHeaders);
          await this.#storageProvider.writeObject(
            sgfFilepath,
            data,
          );
        }
      }));
    } else {
      for (const [slug, fileInfo] of graph.files) {
        const filename = DatabaseIO.getSubtextGraphFilenameForSlug(slug);
        const size = fileInfo.size;
        const data = serializeNoteHeaders(new Map<string, string>([
          [DatabaseIO.#ARBITRARY_FILE_HEADER_KEY, fileInfo.filename],
          [DatabaseIO.#ARBITRARY_FILE_SIZE_HEADER_KEY, size.toString()],
        ]));
        await this.#storageProvider.writeObject(
          filename,
          data,
        );
      }
    }

    if (flushPins) {
      await this.writePinsFile(graph.pinnedNotes);
    }
  }


  /*
    Caution: We don't do any overwrite checks here. Last write wins.
  */
  async addFile(
    slug: Slug,
    source: ReadableStream,
  ): Promise<number> {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const size = await this.#storageProvider.writeObjectFromReadable(
      slug,
      source,
    );

    return size;
  }


  async moveArbitraryGraphFile(
    oldSlug: Slug,
    newSlug: Slug,
  ): Promise<void> {
    if (oldSlug !== newSlug) {
      await this.#storageProvider.renameObject(
        oldSlug,
        newSlug,
      );
    }
  }


  async deleteArbitraryGraphFile(
    relativeFilePath: string,
  ): Promise<void> {
    await this.#storageProvider.removeObject(relativeFilePath);
  }


  async getReadableArbitraryGraphFileStream(
    slug: Slug,
    filename: string,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    const filepath = DatabaseIO.getArbitraryGraphFilepath(slug, filename);
    const stream = await this.#storageProvider.getReadableStream(
      filepath,
      range,
    );

    return stream;
  }


  async getFileSize(
    slug: Slug,
  ): Promise<number> {
    if (!isValidSlug(slug)) {
      throw new Error(ErrorMessage.INVALID_SLUG);
    }

    const fileSize
      = await this.#storageProvider.getObjectSize(slug);

    return fileSize;
  }


  async getSizeOfNotes(): Promise<number> {
    const noteFilenames = await this.getGraphFilenamesFromStorageProvider();
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
    const noteFilenamesInStorage
      = await this.getGraphFilenamesFromStorageProvider();
    return noteFilenamesInStorage.length > 0;
  }
}
