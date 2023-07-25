/*
  This class communicates with the Storage provider it is given to do
  IO operations on the file system.
  This class knows about the folder structure inside a graph folder but not
  about the outside folder structure. That is why it always passes a graph id
  to the storage provider and a path relative to the graph folder. The storage
  provider is responsible to resolve the graph id to an absolute folder path.
*/


import { stringContainsUUID } from "../utils.js";
import { FileId } from "./interfaces/FileId.js";
import Graph from "./interfaces/Graph.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";
import StorageProvider from "./interfaces/StorageProvider.js";
import {
  parseSerializedExistingNote,
  serializeNote,
  sluggifyLink,
} from "./noteUtils.js";
import {
  Block,
  BlockType,
  InlineText,
  Span,
} from "../subwaytext/interfaces/Block.js";
import ByteRange from "./interfaces/ByteRange.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import { Slug } from "./interfaces/Slug.js";
import { SpanType } from "../subwaytext/interfaces/SpanType.js";
import { FILE_SLUG_PREFIX } from "./config.js";
// @ts-ignore
import subwaytextWorkerUrl from "../subwaytext/index.js?worker&url";

export default class DatabaseIO {
  #storageProvider: StorageProvider;
  #loadedGraph: Graph | null = null;
  #graphRetrievalInProgress: Promise<void> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #finishedObtainingGraph: (() => void) = () => {};

  #GRAPH_METADATA_FILENAME = ".graph.json";
  #NAME_OF_FILES_SUBDIRECTORY = "files";
  static #NOTE_FILE_EXTENSION = ".subtext";
  static #workerPool: Worker[] = [];


  static getFilenameForSlug(slug: Slug): string {
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


  private async getSlugsFromGraphDirectory(): Promise<string[]> {
    return (await this.#storageProvider.listDirectory())
      .filter((entry: string): boolean => {
        return entry.endsWith(DatabaseIO.#NOTE_FILE_EXTENSION);
      });
  }


  private async readAndParseGraphFromDisk(): Promise<Graph> {
    const filenames = await this.getSlugsFromGraphDirectory();
    const slugs = DatabaseIO.getSlugsFromFilenames(filenames);
    const nonParseableNote = Symbol("NOT_PARSEABLE");

    const parsedNotes = (await Promise.all(
      slugs.map(async (slug: string): Promise<ExistingNote | symbol> => {
        const serializedNote = await this.#storageProvider.readObjectAsString(
          this.#storageProvider.joinPath(
            DatabaseIO.getFilenameForSlug(slug),
          ),
        );
        let parsedNote: ExistingNote | symbol;
        try {
          parsedNote = parseSerializedExistingNote(serializedNote);
        } catch (e) {
          parsedNote = nonParseableNote;
        }

        return parsedNote;
      }),
    ))
      .filter(
        (parsedNote: ExistingNote | symbol): parsedNote is ExistingNote => {
          return parsedNote !== nonParseableNote;
        },
      );

    const graphMetadata = JSON.parse(
      await this.#storageProvider.readObjectAsString(
        this.#GRAPH_METADATA_FILENAME,
      ),
    );

    const blockIndex = await DatabaseIO.createBlockIndex(parsedNotes);
    const outgoingLinkIndex = DatabaseIO.createOutgoingLinkIndex(blockIndex);
    const backlinkIndex = DatabaseIO.createBacklinkIndex(outgoingLinkIndex);

    const parsedGraphObject: Graph = {
      notes: new Map(
        parsedNotes.map((note: ExistingNote): [Slug, ExistingNote] => {
          return [note.meta.slug, note];
        }),
      ),
      indexes: {
        blocks: blockIndex,
        outgoingLinks: outgoingLinkIndex,
        backlinks: backlinkIndex,
      },
      metadata: graphMetadata,
    };

    return parsedGraphObject;
  }


  static #getSlugsFromInlineText(text: InlineText): Slug[] {
    return text.filter(
      (span: Span): boolean => {
        return span.type === SpanType.SLASHLINK
          || span.type === SpanType.WIKILINK;
      },
    ).map((span: Span): Slug => {
      if (span.type === SpanType.SLASHLINK) {
        return span.text.substring(1);
      } else {
        return sluggifyLink(span.text.substring(2, span.text.length - 2));
      }
    });
  }


  static getSlugsFromParsedNote(note: Block[]): Slug[] {
    const links = note.reduce(
      (outgoingLinks: Slug[], block: Block): Slug[] => {
        if (block.type === BlockType.PARAGRAPH) {
          const links = DatabaseIO.#getSlugsFromInlineText(block.data.text);
          return outgoingLinks.concat(links);
        } else if (block.type === BlockType.LIST) {
          const links = block.data.items.reduce(
            (links: Slug[], item: InlineText): Slug[] => {
              const itemLinks = DatabaseIO.#getSlugsFromInlineText(item);
              return links.concat(itemLinks);
            },
            [],
          );
          return outgoingLinks.concat(links);
        } else if (block.type === BlockType.SLASHLINK) {
          return outgoingLinks.concat([block.data.link]);
        } else {
          return outgoingLinks;
        }
      },
      [],
    );

    return links;
  }


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
        worker.postMessage(notesForThread);
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


  private createGraph(): Graph {
    const newGraph: Graph = {
      metadata: {
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
      },
      notes: new Map(),
      indexes: {
        blocks: new Map<Slug, Block[]>(),
        backlinks: new Map<Slug, Set<Slug>>(),
        outgoingLinks: new Map<Slug, Set<Slug>>(),
      },
    };

    return newGraph;
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
      DatabaseIO.getFilenameForSlug(slug),
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
    // we try to get the requested graph object in 3 ways:

    // Way 1: Fast memory access: try to get it from loaded graph objects
    if (this.#loadedGraph) {
      this.#finishedObtainingGraph();
      return this.#loadedGraph;
    }

    // Way 2: Slow disk access: try to get it from the file on the disk
    try {
      const graphFromDisk: Graph
        = await this.readAndParseGraphFromDisk();

      // flushing these changes will also save the graph in memory for
      // faster access the next time
      await this.flushChanges(graphFromDisk, []);
      this.#finishedObtainingGraph();
      return graphFromDisk;
    } catch (error) {
      // Way 3: If there is no graph object in memory or on the disk,
      // create a new graph object
      const newGraph: Graph = this.createGraph();
      // write it to memory and disk
      await this.flushChanges(newGraph);
      this.#finishedObtainingGraph();
      return newGraph;
    }
  }


  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. it should always be called
  // after any operation on the main data object has been performed.
  // if slugsToFlush is not provided, all notes will be flushed.
  async flushChanges(
    graph: Graph,
    slugsToFlush?: Slug[],
  ): Promise<void> {
    graph.metadata.updatedAt = Date.now();
    this.#loadedGraph = graph;
    await this.writeGraphMetadataFile(graph);

    if (slugsToFlush) {
      await Promise.all(slugsToFlush.map(async (slug) => {
        const filename = DatabaseIO.getFilenameForSlug(slug);
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
        const filename = DatabaseIO.getFilenameForSlug(slug);
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
    fileId: FileId,
    source: ReadableStream,
  ): Promise<number> {
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      fileId,
    );
    const size = await this.#storageProvider.writeObjectFromReadable(
      filepath,
      source,
    );
    return size;
  }


  async deleteFile(
    fileId: FileId,
  ): Promise<void> {
    await this.#storageProvider.removeObject(
      this.#storageProvider.joinPath(
        this.#NAME_OF_FILES_SUBDIRECTORY,
        fileId,
      ),
    );
  }


  async getReadableGraphStream(
    withFiles: boolean,
  ): Promise<ReadableStream> {
    if (!this.#storageProvider.getArchiveStreamOfFolder) {
      throw new Error(ErrorMessage.NOT_SUPPORTED_BY_STORAGE_PROVIDER);
    }

    if (!withFiles) {
      const stream = await this.#storageProvider.getReadableStream(
        this.#GRAPH_METADATA_FILENAME,
      );
      return stream;
    }

    return this.#storageProvider.getArchiveStreamOfFolder();
  }


  async getReadableFileStream(
    fileId: FileId,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      fileId,
    );

    const stream = await this.#storageProvider.getReadableStream(
      filepath,
      range,
    );

    return stream;
  }


  async getFileSize(
    fileId: FileId,
  ): Promise<number> {
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      fileId,
    );
    const fileSize
      = await this.#storageProvider.getFileSize(filepath);

    return fileSize;
  }


  async getFiles(): Promise<FileId[]> {
    // it could be that the directory does not exist yet
    try {
      const directoryListing = await this.#storageProvider.listDirectory(
        this.#NAME_OF_FILES_SUBDIRECTORY,
      );
      // filter out system files
      const files = directoryListing.filter(stringContainsUUID);
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
