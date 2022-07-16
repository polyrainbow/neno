
/*
  This module is a wrapper for providing editor.js functionality to the
  React app.
  See event queue comment below for more details.
*/
import { DEFAULT_NOTE_BLOCKS } from "../config";
import NoteContentBlock from "../../../lib/notes/interfaces/NoteContentBlock";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { getFileTypeFromFilename } from "./utils";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";

const modules = await Promise.all([
  import("@editorjs/editorjs"),
  import("@editorjs/header"),
  import("./editor-js-plugins/link/index"),
  import("./editor-js-plugins/image/index"),
  import("@editorjs/list"),
  import("./editor-js-plugins/code/index"),
  import("./editor-js-plugins/document/index"),
  import("./editor-js-plugins/audio/index"),
  import("./editor-js-plugins/video/index"),
]);

const [
  EditorJS,
  Header,
  Link,
  Image,
  List,
  Code,
  Document,
  Audio,
  Video,
] = modules.map((module) => module.default);

interface InstanceInitParams {
  data: NoteContentBlock[],
  parent: HTMLElement,
  onChange: (any) => void,
  databaseProvider: DatabaseProvider
}

interface Instance {
  editorJSInstance: any, // extends { save: Promise<any> },
  params: InstanceInitParams,
  instanceId: number,
}


/*
  this event queue makes sure that there are not several editor instances
  loaded in parallel and thus become visible on the screen. it queues all
  incoming init/update/focus/destroy requests via a promise chain and executes
  one request only when the previous promise is fulfilled.

  This fancy setup is necessary since React with its reactive UI and editor.js
  with its async init and destroy procedures do not fit nicely together out of
  the box. We also need a simple mechanism to update the data in the editor
  which is provided by this module.

  Event order has restrictions: Editor.scheduleInit() must have been run before
  Editor.scheduleUpdate(), Editor.scheduleFocus() and Editor.scheduleDetroy().
  These functions are synchronous, because they only schedule those events.
  They don't wait until these things are finished.
*/
let eventQueue: Promise<Instance | null> = Promise.resolve(null);

let idCounter = 0;

const loadEditorJSInstance = async (params: InstanceInitParams) => {
  const { data, parent, onChange, databaseProvider } = params;

  // several plugins are able to upload and download files. the following
  // config object is passed to all of them
  const fileHandlingConfig = {
    uploadByFile: async (file: File): Promise<FileInfo> => {
      const { fileId } = await databaseProvider.uploadFile(file);

      const type = getFileTypeFromFilename(file.name);

      if (!type) {
        throw new Error("Unknown file type");
      }

      return {
        fileId,
        name: file.name,
        size: file.size,
      };
    },
    onDownload: async (file: FileInfo): Promise<void> => {
      const fileId = file.fileId;
      const name = file.name;
      const url = await databaseProvider.getUrlForFileId(fileId, name);
      window.open(url, "_blank");
    },
    getUrl: async (file: FileInfo) => {
      const fileId = file.fileId;
      const name = file.name;
      const url = await databaseProvider.getUrlForFileId(fileId, name);
      return url;
    },
  };

  const instance = new EditorJS({
    logLevel: "ERROR",
    holder: parent,
    data: {
      blocks: data,
      version: "2.17.1",
      time: Date.now(),
    },
    autofocus: true,
    placeholder: "",
    hideToolbar: false,
    tools: {
      header: {
        class: Header,
        placeholder: "Note title",
      },
      link: {
        class: Link,
        config: {
          customRequestFunction: async (url: string) => {
            const metadata = await databaseProvider.getUrlMetadata(url);

            return {
              "success": true,
              url,
              "meta": {
                "title": metadata.title,
                "description": metadata.description,
                "image": {
                  "url": metadata.image,
                },
              },
            };
          },
        },
      },
      image: {
        class: Image,
        config: {
          fileHandling: fileHandlingConfig,
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      code: {
        class: Code,
        config: {
          // placeholder must not be an empty string because then it would use
          // the default placeholder which we don't want
          placeholder: " ",
        },
      },
      document: {
        class: Document,
        config: {
          fileHandling: fileHandlingConfig,
        },
      },
      audio: {
        class: Audio,
        config: {
          fileHandling: fileHandlingConfig,
        },
      },
      video: {
        class: Video,
        config: {
          fileHandling: fileHandlingConfig,
        },
      },
    },
    onChange,
  });

  await instance.isReady;
  return instance;
};


/** EXPORTS */

const scheduleInit = (params: InstanceInitParams): void => {
  eventQueue = eventQueue.then(async () => {
    const instanceId = idCounter++;
    const editorJSInstance = await loadEditorJSInstance(params);
    const instance: Instance = {
      editorJSInstance,
      params,
      instanceId,
    };
    return instance;
  });
};


const saveInstance = async (
  instance: Instance,
): Promise<NoteContentBlock[]> => {
  const editorData = await instance.editorJSInstance.save();

  // when the user did not enter anything, editor.js
  // decides to remove those blocks. but we want to have at least an empty
  // paragraph block being present, so the user can just start to type
  if (editorData.blocks.length === 0) {
    editorData.blocks = [...DEFAULT_NOTE_BLOCKS];
  }

  // editor.js assigns IDs to blocks, but we do not need or want them
  // when saving the blocks
  editorData.blocks.forEach((block) => {
    delete block.id;
  });

  return editorData.blocks as NoteContentBlock[];
};


const save = async (): Promise<NoteContentBlock[]> => {
  const currentInstance = await eventQueue;

  if (!currentInstance) {
    throw new Error(
      "NO_INSTANCE_AVAILABLE",
    );
  }

  const blocks = await saveInstance(currentInstance);
  return blocks;
};


const createUpdatedInstance = async (
  currentInstance: Instance | null,
  newData: NoteContentBlock[],
): Promise<Instance> => {
  if (!currentInstance) {
    throw new Error("NO_INSTANCE_INITIALIZED_FOR_UPDATE");
  }
  const currentData = await saveInstance(currentInstance);
  if (JSON.stringify(newData) === JSON.stringify(currentData)) {
    // nothing to do, just return current instance
    return currentInstance;
  }
  currentInstance.editorJSInstance.destroy();
  const newParams = {
    ...currentInstance.params,
    data: newData,
  };
  const instanceId = idCounter++;
  const newInstance: Instance = {
    editorJSInstance: await loadEditorJSInstance(newParams),
    params: newParams,
    instanceId,
  };
  return newInstance;
};


// push update event to event queue
const scheduleUpdate = (newData: NoteContentBlock[]): void => {
  eventQueue = eventQueue.then(
    (currentInstance: Instance | null): Promise<Instance> => {
      const newInstancePromise
        = createUpdatedInstance(currentInstance, newData);
      return newInstancePromise;
    },
  );
};


const isReady = async () => {
  const currentInstance = await eventQueue;

  if (!currentInstance) {
    throw new Error("READY_QUERY_BEFORE_INIT");
  }
};


// append focus event to event queue
const scheduleFocus = (): void => {
  eventQueue = eventQueue.then(
    async (currentInstance: Instance | null): Promise<Instance> => {
      if (!currentInstance) {
        throw new Error(
          "NO_INSTANCE_INITIALIZED_FOR_FOCUS",
        );
      }

      currentInstance.editorJSInstance.focus();
      return currentInstance;
    },
  );
};


const scheduleDestroy = (): void => {
  eventQueue = eventQueue.then(async (currentInstance) => {
    if (!currentInstance) {
      throw new Error(
        "NO_INSTANCE_INITIALIZED_TO_DESTROY",
      );
    }

    currentInstance.editorJSInstance.destroy();
    return null;
  });
};


export {
  scheduleInit,
  scheduleUpdate,
  save,
  isReady,
  scheduleFocus,
  scheduleDestroy,
};
