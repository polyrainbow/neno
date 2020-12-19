import * as Config from "./config.js";
import * as tokenManager from "./tokenManager.js";

// this instance queue makes sure that there are not several editor instances
// loaded in parallel and thus become visible on the screen. it queues all
// incoming promises and executes them only when their previous promise has
// fulfilled
let instanceQueue = null;

const load = async ({ data, parent, onChange }) => {
  if (instanceQueue === null) {
    instanceQueue = loadInstance({ data, parent, onChange });
  } else {
    instanceQueue = instanceQueue.then(() => {
      return loadInstance({ data, parent, onChange });
    });
  }

  const instance = await instanceQueue;
  return instance;
};


const loadInstance = async ({ data, parent, onChange }) => {
  const modules = await Promise.all([
    import("@editorjs/editorjs"),
    import("@editorjs/header"),
    import("@editorjs/link"),
    import("@editorjs/image"),
    import("@editorjs/list"),
    import("@editorjs/code"),
    import("@editorjs/attaches"),
  ]);

  const [
    EditorJS,
    Header,
    Link,
    Image,
    List,
    Code,
    Attaches,
  ] = modules.map((module) => module.default);

  // destroy does currently not work
  // https://github.com/codex-team/editor.js/issues/1400
  // https://github.com/codex-team/editor.js/issues/1380
  // instance && instance.destroy();
  parent.innerHTML = "";

  const instance = new EditorJS({
    holder: parent,
    data,
    autofocus: true,
    placeholder: "Let's write an awesome note!",
    hideToolbar: false,
    tools: {
      header: {
        class: Header,
        placeholder: "Note title",
      },
      linkTool: {
        class: Link,
        config: {
          endpoint: Config.API_URL + "link-data",
          additionalRequestHeaders: {
            authorization: "Bearer " + tokenManager.get(),
          },
        },
      },
      image: {
        class: Image,
        config: {
          endpoints: {
            // Your backend file uploader endpoint
            byFile: Config.API_URL + "image",
            // endpoint providing uploading by Url
            byUrl: Config.API_URL + "image-by-url",
          },
          additionalRequestHeaders: {
            authorization: "Bearer " + tokenManager.get(),
          },
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      code: Code,
      attaches: {
        class: Attaches,
        config: {
          endpoint: Config.API_URL + "file",
          field: "file",
          types: "application/pdf",
          buttonText: "Select PDF file",
          errorMessage: "File upload failed",
          additionalRequestHeaders: {
            authorization: "Bearer " + tokenManager.get(),
          },
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
  return editorData;
};


export {
  load,
  save,
};
