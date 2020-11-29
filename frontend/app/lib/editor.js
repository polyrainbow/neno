import * as Config from "./config.js";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Link from "@editorjs/link";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Code from "@editorjs/code";

let instance = null;

const load = async ({ data, parent, onChange }) => {
  // destroy does currently not work
  // https://github.com/codex-team/editor.js/issues/1400
  // https://github.com/codex-team/editor.js/issues/1380
  // instance && instance.destroy();
  parent.innerHTML = "";

  instance = new EditorJS({
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
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      code: Code,
    },
    onChange,
  });

  await instance.isReady;
  return true;
};


const save = async () => {
  if (!instance) return false;
  await instance.isReady;
  const editorData = await instance.save();
  return editorData;
};


export {
  load,
  save,
};
