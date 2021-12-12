import { DEFAULT_NOTE_BLOCKS } from "./config";
import { getUrlForFileId } from "./utils";

// this instance queue makes sure that there are not several editor instances
// loaded in parallel and thus become visible on the screen. it queues all
// incoming promises and executes them only when their previous promise has
// fulfilled
let instanceQueue:Promise<any> | null = null;


const loadInstance = async ({
  data,
  parent,
  onChange,
  databaseProvider,
}) => {
  const modules = await Promise.all([
    import("@editorjs/editorjs"),
    import("@editorjs/header"),
    import("./editor-js-plugins/link/index.js"),
    import("./editor-js-plugins/image/index.js"),
    import("@editorjs/list"),
    import("./editor-js-plugins/code/index.js"),
    import("./editor-js-plugins/document/index.js"),
    import("./editor-js-plugins/audio/index.js"),
    import("./editor-js-plugins/video/index.js"),
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

  // several plugins are able to upload and download files. the following
  // config object is passed to all of them
  const fileHandlingConfig = {
    uploadByFile: async (file) => {
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
    onDownload: async (file) => {
      const fileId = file.fileId;
      const name = file.name;
      const url = await getUrlForFileId(fileId, databaseProvider, name);
      window.open(url, "_blank");
    },
    getUrl: async (file) => {
      const fileId = file.fileId;
      const name = file.name;
      const url = await getUrlForFileId(fileId, databaseProvider, name);
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
          customRequestFunction: async (url) => {
            const metadata = await databaseProvider.getUrlMetadata(url);

            return {
              "success": true,
              "url": url,
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
          types: "application/pdf",
        },
      },
      audio: {
        class: Audio,
        config: {
          fileHandling: fileHandlingConfig,
          types: "audio/mp3, audio/mpeg",
        },
      },
      video: {
        class: Video,
        config: {
          fileHandling: fileHandlingConfig,
          types: "video/mp4, video/webm",
        },
      },
    },
    onChange,
  });

  await instance.isReady;
  return instance;
};


const load = async ({ data, parent, onChange, databaseProvider }) => {
  if (instanceQueue === null) {
    instanceQueue = loadInstance({ data, parent, onChange, databaseProvider });
  } else {
    instanceQueue = instanceQueue.then((instance) => {
      instance.destroy();
      return loadInstance({ data, parent, onChange, databaseProvider });
    });
  }

  const instance = await instanceQueue;
  return instance;
};


const save = async () => {
  if (!instanceQueue) return false;
  const instance = await instanceQueue;
  await instance.isReady;
  const editorData = await instance.save();

  // when the user did not enter anything, editor.js
  // decides to remove those blocks. but we want to have at least an empty
  // heading block being present, so the user is always encouraged to give its
  // note a title
  if (editorData.blocks.length === 0) {
    editorData.blocks = [...DEFAULT_NOTE_BLOCKS];
  }
  return editorData.blocks;
};


const focus = async () => {
  (await instanceQueue).focus();
};


export {
  load,
  save,
  focus,
};
