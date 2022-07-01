import { DEFAULT_NOTE_BLOCKS } from "../config";
import NoteContentBlock from "../../../lib/notes/interfaces/NoteContentBlock";
import DatabaseProvider from "../interfaces/DatabaseProvider";

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

interface LoadParams {
  data: NoteContentBlock[],
  parent: HTMLElement,
  onChange: (any) => void,
  databaseProvider: DatabaseProvider
}

interface EditorConfig {
  parent: HTMLElement,
  onChange: (any) => void,
  databaseProvider: DatabaseProvider,
}

let config:EditorConfig;

/*
  this instance queue makes sure that there are not several editor instances
  loaded in parallel and thus become visible on the screen. it queues all
  incoming load requests via a promise chain and executes one request only
  when the previous promise is fulfilled.
*/
let instanceQueue:Promise<any> | null = null;

let initializingStarted = false;

const loadInstance = async (data: NoteContentBlock[]) => {
  const { parent, onChange, databaseProvider } = config;

  // several plugins are able to upload and download files. the following
  // config object is passed to all of them
  const fileHandlingConfig = {
    uploadByFile: async (file:File) => {
      const { fileId } = await databaseProvider.uploadFile(file);
      return {
        success: true,
        file: {
          fileId,
          name: file.name,
          size: file.size,
        },
      };
    },
    uploadByUrl: async (url) => {
      // TODO: handle this case gracefully when using local database provider

      // @ts-ignore
      if (!databaseProvider.constructor.features.includes(
        "UPLOAD_BY_URL",
      )) {
        return {
          success: false,
        };
      }

      // @ts-ignore
      const { fileId, size } = await databaseProvider.uploadFileByUrl({
        url,
      });
      return {
        success: true,
        file: {
          fileId,
          size,
        },
      };
    },
    onDownload: async (file):Promise<void> => {
      const fileId = file.fileId;
      const name = file.name;
      const url = await databaseProvider.getUrlForFileId(fileId, name);
      window.open(url, "_blank");
    },
    getUrl: async (file) => {
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
          customRequestFunction: async (url:string) => {
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

const init = async ({
  data,
  parent,
  onChange,
  databaseProvider,
}: LoadParams):Promise<void> => {
  if (initializingStarted) {
    throw new Error("INITIALIZING_ALREADY_STARTED");
  }

  initializingStarted = true;

  config = {
    parent, onChange, databaseProvider,
  };

  instanceQueue = loadInstance(data);
  await instanceQueue;
};


const save = async ():Promise<NoteContentBlock[]> => {
  if (!instanceQueue) {
    throw new Error(
      "NO_INSTANCE_AVAILABLE",
    );
  }

  const instance = await instanceQueue;
  await instance.isReady;
  const editorData = await instance.save();

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


const update = async (newData: NoteContentBlock[]):Promise<void> => {
  if (!instanceQueue) {
    throw new Error("UPDATE_BEFORE_INIT");
  }

  await instanceQueue;

  const currentData = await save();

  if (JSON.stringify(newData) === JSON.stringify(currentData)) {
    return;
  }

  instanceQueue = instanceQueue.then((instance) => {
    instance.destroy();
    return loadInstance(newData);
  });

  await instanceQueue;
};


const isReady = async () => {
  if (!instanceQueue) {
    throw new Error("READY_QUERY_BEFORE_INIT");
  }

  await instanceQueue;
};


const focus = async ():Promise<void> => {
  if (!instanceQueue) {
    throw new Error(
      "Could not focus editor content because there is no instance yet.",
    );
  }

  (await instanceQueue).focus();
};


export {
  init,
  update,
  save,
  isReady,
  focus,
};
