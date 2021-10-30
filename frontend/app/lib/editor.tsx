import { getUrlForFileId } from "./utils";

// this instance queue makes sure that there are not several editor instances
// loaded in parallel and thus become visible on the screen. it queues all
// incoming promises and executes them only when their previous promise has
// fulfilled
let instanceQueue:Promise<any> | null = null;

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
    import("@editorjs/code"),
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

  const instance = new EditorJS({
    logLevel: "ERROR",
    holder: parent,
    data: {
      blocks: data,
      version: "2.17.1",
      time: Date.now(),
    },
    autofocus: true,
    placeholder: "Let's write an awesome note!",
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
              "success": 1,
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
          uploader: {
            uploadByFile: async (file) => {
              const fileId = await databaseProvider.uploadFile(file);
              return {
                success: 1,
                file: {
                  "size": file.size,
                  "fileId": fileId,
                },
              };
            },
            uploadByUrl: async (url) => {
              const fileId = await databaseProvider.uploadFileByUrl({
                url,
              });
              return {
                success: 1,
                file: {
                  "fileId": fileId,
                },
              };
            },
          },
          getUrl: async (file) => {
            const fileId = file.fileId;
            // currently we don't support public names for images, that's why
            // we're passing null here
            const url = await getUrlForFileId(fileId, databaseProvider, null);
            return url;
          },
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
          uploader: async (file) => {
            const fileId = await databaseProvider.uploadFile(file);
            return {
              success: 1,
              file: {
                "size": file.size,
                "name": file.name,
                "fileId": fileId,
              },
            };
          },
          onDownload: async (file) => {
            const fileId = file.fileId;
            const name = file.name;
            const url = await getUrlForFileId(fileId, databaseProvider, name);
            window.open(url, "_blank");
          },
          field: "file",
          types: "application/pdf",
          buttonText: "Select PDF file",
          errorMessage: "File upload failed",
        },
      },
      audio: {
        class: Audio,
        config: {
          uploader: async (file) => {
            const fileId = await databaseProvider.uploadFile(file);
            return {
              success: 1,
              file: {
                "size": file.size,
                "name": file.name,
                "fileId": fileId,
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
          field: "file",
          types: "audio/mp3, audio/mpeg",
          buttonText: "Select MP3 file",
          errorMessage: "File upload failed",
        },
      },
      video: {
        class: Video,
        config: {
          uploader: async (file) => {
            const fileId = await databaseProvider.uploadFile(file);
            return {
              success: 1,
              file: {
                "size": file.size,
                "name": file.name,
                "fileId": fileId,
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
          field: "file",
          types: "video/mp4, video/webm",
          buttonText: "Select video file",
          errorMessage: "File upload failed",
        },
      },
    },
    onChange,
  });

  await instance.isReady;
  return instance;
};


const save = async () => {
  if (!instanceQueue) return false;
  const instance = await instanceQueue;
  await instance.isReady;
  const editorData = await instance.save();
  return editorData.blocks;
};


export {
  load,
  save,
};
