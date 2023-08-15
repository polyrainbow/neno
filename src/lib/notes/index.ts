import DatabaseIO from "./DatabaseIO.js";
import {
  updateNotePosition,
  createNoteToTransmit,
  getSortFunction,
  getNumberOfLinkedNotes,
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
} from "./noteUtils.js";
import GraphVisualization from "./interfaces/GraphVisualization.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import GraphNode from "./interfaces/GraphVisualizationNode.js";
import GraphStats from "./interfaces/GraphStats.js";
import GraphVisualizationFromUser
  from "./interfaces/GraphVisualizationFromUser.js";
import GraphNodePositionUpdate from "./interfaces/NodePositionUpdate.js";
import * as config from "./config.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import GraphObject from "./interfaces/Graph.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";
import GraphStatsRetrievalOptions
  from "./interfaces/GraphStatsRetrievalOptions.js";
import StorageProvider from "./interfaces/StorageProvider.js";
import { FileInfo } from "./interfaces/FileInfo.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import { NoteSaveRequest } from "./interfaces/NoteSaveRequest.js";
import subwaytext from "../subwaytext/index.js";
import { search } from "./search.js";
import DatabaseQuery from "./interfaces/DatabaseQuery.js";
import NoteListPage from "./interfaces/NoteListPage.js";
import ByteRange from "./interfaces/ByteRange.js";
import { Slug } from "./interfaces/Slug.js";
import { Block } from "../subwaytext/interfaces/Block.js";
import serialize from "../subwaytext/serialize.js";


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

    // Backlinks index
    const ourBacklinks = new Set<Slug>();

    if (!graph.indexes.backlinks.has(ourSlug)) {
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

      const theirOutgoingLinks = graph.indexes.outgoingLinks.get(
        someExistingSlug,
      ) as Set<Slug>;

      if (theirOutgoingLinks.has(ourSlug)) {
        ourBacklinks.add(someExistingSlug);
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

    if (!graph.notes.has(slug)) {
      throw new Error(ErrorMessage.NOTE_NOT_FOUND);
    }

    const noteFromDB = graph.notes.get(slug) as ExistingNote;

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
    return this.#io.getRawNote(slug);
  }


  async getNotesList(
    query: DatabaseQuery,
  ): Promise<NoteListPage> {
    const graph: GraphObject = await this.#io.getGraph();
    return search(graph, query);
  }


  async getGraphVisualization(
  ): Promise<GraphVisualization> {
    const graph = await this.#io.getGraph();

    const graphNodes: GraphNode[] = Array.from(graph.notes.values()).map(
      (note: ExistingNote) => {
        const graphNode: GraphNode = {
          slug: note.meta.slug,
          title: getNoteTitle(note),
          position: note.meta.position,
          createdAt: note.meta.createdAt,
          updatedAt: note.meta.updatedAt,
        };
        return graphNode;
      },
    );

    const graphVisualization: GraphVisualization = {
      nodes: graphNodes,
      links: getGraphLinks(graph),
      screenPosition: graph.metadata.screenPosition,
      initialNodePosition: graph.metadata.initialNodePosition,
    };

    /*
      It's necessary to make the returned object from this class
      mutation-resistant, because manipulating this object by the consumer
      would trigger changes in our data storage.
      So let's create a clone.
    */
    return structuredClone(graphVisualization);
  }


  async getStats(
    options: GraphStatsRetrievalOptions,
  ): Promise<GraphStats> {
    const graph: GraphObject = await this.#io.getGraph();

    const numberOfUnlinkedNotes = getNumberOfUnlinkedNotes(graph);

    let stats: GraphStats = {
      numberOfAllNotes: graph.notes.size,
      numberOfLinks: getGraphLinks(graph).length,
      numberOfFiles: graph.metadata.files.length,
      numberOfPins: graph.metadata.pinnedNotes.length,
      numberOfUnlinkedNotes,
    };

    if (options.includeMetadata) {
      stats = {
        ...stats,
        createdAt: graph.metadata.createdAt,
        updatedAt: graph.metadata.updatedAt,
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

      stats = {
        ...stats,
        numberOfComponents,
        numberOfComponentsWithMoreThanOneNode:
          numberOfComponents - numberOfUnlinkedNotes,
        numberOfHubs: Array.from(graph.notes.values())
          .filter((note) => {
            const numberOfLinkedNotes = getNumberOfLinkedNotes(
              graph,
              note.meta.slug,
            );
            return numberOfLinkedNotes.sum
              >= config.MIN_NUMBER_OF_LINKS_FOR_HUB;
          })
          .length,
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


  async setGraphVisualization(
    graphVisualizationFromUser: GraphVisualizationFromUser,
  ): Promise<void> {
    const graph: GraphObject = await this.#io.getGraph();
    const nodePositionUpdates = graphVisualizationFromUser.nodePositionUpdates;
    nodePositionUpdates.forEach(
      (nodePositionUpdate: GraphNodePositionUpdate): void => {
        updateNotePosition(graph, nodePositionUpdate);
      },
    );

    graph.metadata.screenPosition
      = graphVisualizationFromUser.screenPosition;
    graph.metadata.initialNodePosition
      = graphVisualizationFromUser.initialNodePosition;
    await this.#io.flushChanges(
      graph,
      nodePositionUpdates.map(
        (update: GraphNodePositionUpdate): Slug => {
          return update.slug;
        },
      ),
    );
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
        const oldSlug = existingNote.meta.slug;
        const newSlug = noteSaveRequest.changeSlugTo;

        const notesReferencingOurNoteBeforeChange
          = Array.from((graph.indexes.backlinks.get(oldSlug) as Set<Slug>))
            .map((slug) => {
              return graph.notes.get(slug) as ExistingNote;
            });

        graph.notes.delete(oldSlug);
        NotesProvider.removeSlugFromIndexes(graph, oldSlug);
        await this.#io.flushChanges(graph, [oldSlug]);

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
            await this.#io.flushChanges(graph, [thatNote.meta.slug]);
          }
        }
      } else {
        graph.notes.set(existingNote.meta.slug, existingNote);
      }

      NotesProvider.updateIndexes(graph, existingNote);
      await this.#io.flushChanges(graph, [existingNote.meta.slug]);

      const noteToTransmit: NoteToTransmit
        = await createNoteToTransmit(existingNote, graph);
      return noteToTransmit;
    }

    /* create new note */
    const existingSlugs = Array.from(graph.notes.keys());
    let slug: Slug;

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

      slug = noteSaveRequest.changeSlugTo;
    } else {
      slug = createSlug(
        noteFromUser.content,
        existingSlugs,
      );
    }

    // the new note becomes an existing note, that's why the funny typing here
    const newNote: ExistingNote = {
      meta: {
        slug,
        // Let's make sure that when manipulating the position object at some
        // point, we don't accidentally manipulate the initialNodePosition
        // object.
        // So let's copy the primitive values one by one. This actually
        // prevents bugs from occuring in local mode, where API output from this
        // module is not consistently serialized and re-parsed. It could also be
        // cloned (e. g. via structuredClone()) without destroying references,
        // which would just defer the issue outside of this module.
        position: noteFromUser.meta.position ?? {
          x: graph.metadata.initialNodePosition.x,
          y: graph.metadata.initialNodePosition.y,
        },
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
    await this.#io.flushChanges(graph, [newNote.meta.slug]);

    const noteToTransmit: NoteToTransmit
      = await createNoteToTransmit(newNote, graph);
    return noteToTransmit;
  }


  putRawNote(
    rawNote: string,
  ): Promise<NoteToTransmit> {
    const note = parseSerializedNewNote(rawNote);

    const noteSaveRequest = {
      note,
      changes: [],
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
    graph.metadata.pinnedNotes
      = graph.metadata.pinnedNotes.filter((s) => s !== slug);

    NotesProvider.removeSlugFromIndexes(graph, slug);

    await this.#io.flushChanges(graph, [slug]);
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
    await this.#io.flushChanges(graph, []);

    return fileInfo;
  }


  async deleteFile(
    slug: Slug,
  ): Promise<void> {
    await this.#io.deleteFile(slug);

    const graph = await this.#io.getGraph();
    graph.metadata.files
      = graph.metadata.files.filter((file) => file.slug !== slug);
    await this.#io.flushChanges(graph, []);
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

    graph.metadata.pinnedNotes = Array.from(
      new Set([...graph.metadata.pinnedNotes, slug]),
    );

    await this.#io.flushChanges(graph, []);

    return this.getPins();
  }


  async unpin(
    slug: Slug,
  ): Promise<NoteToTransmit[]> {
    const graph = await this.#io.getGraph();

    graph.metadata.pinnedNotes
      = graph.metadata.pinnedNotes.filter((s) => s !== slug);

    await this.#io.flushChanges(graph, []);

    return this.getPins();
  }
}
