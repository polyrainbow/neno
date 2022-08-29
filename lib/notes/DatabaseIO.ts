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
import ReadableWithMimeType from "./interfaces/ReadableWithMimeType.js";
import * as config from "./config.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";
import { GraphId } from "../../backend/interfaces/GraphId.js";
import updateGraphDataStructure from "./updateGraphDataStructure.js";
import cleanUpGraph from "./cleanUpGraph.js";
import StorageProvider from "./interfaces/StorageProvider.js";
import { SomeReadableStream } from "./interfaces/SomeReadableStream.js";


export default class DatabaseIO {
  #storageProvider: StorageProvider;
  #loadedGraphs: Map<GraphId, Graph> = new Map();
  #graphRetrievalInProgress: Promise<void> = Promise.resolve();
  #finishedObtainingGraph: (() => void) = () => {return;};

  #GRAPH_FILE_NAME = "graph.json";
  #NAME_OF_FILES_SUBDIRECTORY = "files";


  private async readGraphFile(
    graphId: GraphId,
  ): Promise<Graph | null> {
    try {
      const json = await this.#storageProvider.readObjectAsString(
        graphId,
        this.#GRAPH_FILE_NAME,
      );
      const object: Graph = JSON.parse(json);
      return object;
    } catch (e) {
      return null;
    }
  }


  private async writeGraphFile (graphId: GraphId, graph: Graph) {
    await this.#storageProvider.writeObject(
      graphId,
      this.#GRAPH_FILE_NAME,
      JSON.stringify(graph),
    );
  }


  private createGraph (): Graph {
    const newGraph: Graph = {
      creationTime: Date.now(),
      updateTime: Date.now(),
      notes: [],
      links: [],
      idCounter: 0,
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
    };

    return newGraph;
  }


  /**
    PUBLIC
  **/

  constructor(config) {
    this.#storageProvider = config.storageProvider;
  }


  async getGraph(graphId: GraphId): Promise<Graph> {
    // We only want to get one graph at a time to reduce unnecessary disk usage
    // that occurs when a consumer performs two or more API calls at the same
    // time. To prevent accessing the disk twice or more for the same data,
    // let's wait here until other executions of this function are finished.
    await this.#graphRetrievalInProgress;
    // and then make others wait
    this.#graphRetrievalInProgress = new Promise((resolve) => {
      this.#finishedObtainingGraph = resolve;
    });

    // we try to get the requested graph object in 3 ways:

    // Way 1: Fast memory access: try to get it from loaded graph objects
    if (this.#loadedGraphs.has(graphId)){
      this.#finishedObtainingGraph();
      return this.#loadedGraphs.get(graphId) as Graph;
    }

    // Way 2: Slow disk access: try to get it from the file on the disk
    const graphFromFile: Graph | null
      = await this.readGraphFile(graphId);
    if (graphFromFile) {
      // when we open a graph from file for the first time, let's make sure
      // it has the up-to-date data structure and is cleaned up.
      await updateGraphDataStructure(
        graphFromFile,
        (fileId) => this.getFileSize(graphId, fileId),
      );
      cleanUpGraph(graphFromFile);

      // flushing these changes will also save the graph in memory for
      // faster access the next time
      await this.flushChanges(graphId, graphFromFile);
      this.#finishedObtainingGraph();
      return graphFromFile;
    }

    // Way 3: If there is no graph object in memory or on the disk, create a new
    // graph object
    const newGraph: Graph = this.createGraph();
    // write it to memory and disk
    await this.flushChanges(graphId, newGraph);
    this.#finishedObtainingGraph();
    return newGraph;
  }


  // flushChanges makes sure that the changes applied to the graph object are
  // written to the disk and thus are persistent. it should always be called
  // after any operation on the main data object has been performed.
  async flushChanges (graphId: GraphId, graph: Graph): Promise<void> {
    graph.updateTime = Date.now();
    this.#loadedGraphs.set(graphId, graph);
    await this.writeGraphFile(graphId, graph);
  }


  async addFile(
    graphId: GraphId,
    fileId: FileId,
    source: SomeReadableStream,
  ): Promise<number> {
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      fileId,
    );
    const size = await this.#storageProvider.writeObjectFromReadable(
      graphId,
      filepath,
      source,
    );
    return size;
  }


  async deleteFile(
    graphId: GraphId,
    fileId: FileId,
  ): Promise<void> {
    await this.#storageProvider.removeObject(
      graphId,
      this.#storageProvider.joinPath(
        this.#NAME_OF_FILES_SUBDIRECTORY,
        fileId,
      ),
    );
  }


  async getReadableGraphStream(
    graphId: GraphId,
    withFiles: boolean,
  ): Promise<SomeReadableStream> {
    if (!this.#storageProvider.getArchiveStreamOfFolder) {
      throw new Error(ErrorMessage.NOT_SUPPORTED_BY_STORAGE_PROVIDER);
    }

    if (!withFiles) {
      const stream = await this.#storageProvider.getReadableStream(
        graphId,
        this.#GRAPH_FILE_NAME,
      );
      return stream;
    }

    return this.#storageProvider.getArchiveStreamOfFolder(graphId, "");
  }


  async getReadableFileStream(
    graphId: GraphId,
    fileId: FileId,
    range,
  ): Promise<ReadableWithMimeType> {
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      fileId,
    );

    const stream = await this.#storageProvider.getReadableStream(
      graphId,
      filepath,
      range,
    );

    const extension = fileId.substring(fileId.lastIndexOf(".") + 1)
      .toLocaleLowerCase();

    const fileType = config.ALLOWED_FILE_TYPES
      .find((ft) => {
        return ft.extension === extension;
      });

    if (!fileType) {
      throw Error(ErrorMessage.INVALID_FILENAME_EXTENSION);
    }

    const mimeType = fileType.mimeType;

    return {
      readable: stream,
      mimeType,
    };
  }


  async getFileSize(
    graphId: GraphId,
    fileId: FileId,
  ): Promise<number> {
    const filepath = this.#storageProvider.joinPath(
      this.#NAME_OF_FILES_SUBDIRECTORY,
      fileId,
    );
    const fileSize
      = await this.#storageProvider.getFileSize(graphId, filepath);

    return fileSize;
  }


  async getFiles(
    graphId: GraphId
  ): Promise<FileId[]> {
    // it could be that the directory does not exist yet
    try {
      const directoryListing = await this.#storageProvider.listDirectory(
        graphId,
        this.#NAME_OF_FILES_SUBDIRECTORY,
      );
      // filter out system files
      const files = directoryListing.filter(stringContainsUUID);
      return files;
    } catch (e) {
      return [];
    }
  }


  async getSizeOfGraphFiles(
    graphId: GraphId,
  ): Promise<number> {
    // maybe the file folder was not created yet, so let's just try
    try {
      const size = await this.#storageProvider.getFolderSize(
        graphId,
        this.#NAME_OF_FILES_SUBDIRECTORY,
      );
      return size;
    } catch (e) {
      return 0;
    }
  }


  async getSizeOfGraph(
    graphId: GraphId,
  ): Promise<number> {
    const fileSize
      = await this.#storageProvider.getFileSize(graphId, this.#GRAPH_FILE_NAME);

    return fileSize;
  }


  async getSizeOfGraphWithFiles(
    graphId: GraphId,
  ): Promise<number> {
    const sizes = await Promise.all([
      this.getSizeOfGraph(graphId),
      this.getSizeOfGraphFiles(graphId),
    ]);

    return sizes[0] + sizes[1];
  }


  async getNumberOfFiles(
    graphId: GraphId,
  ): Promise<number> {
    // it could be that the directory does not exist yet
    try {
      const directoryListing = await this.#storageProvider.listDirectory(
        graphId,
        this.#NAME_OF_FILES_SUBDIRECTORY,
      );
      // filter out system files
      const files = directoryListing.filter(stringContainsUUID);
      return files.length;
    } catch (e) {
      return 0;
    }
  }
}
