/*
@license

MIT License

Copyright (c) 2019 Editor.js

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


import "./index.css";
import * as svgs from "./svgs";
import {
  make,
} from "../utils";
import {
  humanFileSize,
} from "../../utils";
import {
  NoteContentBlockFileMetadata,
} from "../../../../../lib/notes/interfaces/NoteContentBlock";
import ToolWithFileUpload from "../ToolWithFileUpload";


export default class AudioTool extends ToolWithFileUpload {
  api;
  nodes;
  data:{
    file: NoteContentBlockFileMetadata,
  };

  config;

  constructor({ data, config, api }) {
    super();

    this.api = api;

    this.nodes = {
      wrapper: null,
      button: null,
      title: null,
    };

    this.config = {
      buttonText: "Select audio",
      fileHandling: config.fileHandling,
      filePickerAcceptTypes: [
        {
          description: "Audio File",
          accept: {
            "audio/mp3": [".mp3"],
            "audio/mpeg": [".mp3"],
            "audio/flac": [".flac"],
          },
        },
      ],
    };

    this.data = data;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  static get toolbox() {
    return {
      icon: svgs.toolbox,
      title: "Audio",
    };
  }

  /**
   * Tool's CSS classes
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      apiButton: this.api.styles.button,
      loader: this.api.styles.loader,
      /**
       * Tool's classes
       */
      wrapper: "cdx-audio",
      wrapperWithFile: "cdx-audio--with-file",
      wrapperLoading: "cdx-audio--loading",
      button: "cdx-audio__button",
      title: "cdx-audio__title",
      size: "cdx-audio__size",
      downloadButton: "cdx-audio__download-button",
      fileInfo: "cdx-audio__file-info",
      fileIcon: "cdx-audio__file-icon",
    };
  }


  /**
   * Specify paste substitutes
   *
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @return {{
   *   tags: string[],
   *   patterns: object<string, RegExp>,
   *   files: {extensions: string[], mimeTypes: string[]}
   * }}
   */
  static get pasteConfig() {
    return {
      /**
       * Paste HTML into Editor
       */
      // tags: ["audio"],

      /**
       * Paste URL of audio into the Editor
       * We have disabled this because we want to be able to insert a
       * url without turning it into an audio block
       */
      /* patterns: {
        audio: /https?:\/\/\S+\.mp3$/i,
      },*/

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["audio/mp3", "audio/mpeg", "audio/flac"],
        extensions: ["mp3"],
      },
    };
  }


  /**
   * Return Block data
   *
   * @param {HTMLElement} toolContent
   * @return {AudioToolData}
   */
  save(toolContent) {
    if (this.blockHasLoadedFile()) {
      const name = toolContent.querySelector(`.${this.CSS.title}`).innerHTML;
      this.data.file.name = name;
    }

    return this.data;
  }

  /**
   * Renders Block content
   *
   * @return {HTMLDivElement}
   */
  render() {
    const holder = make("div", [this.CSS.baseClass]);
    this.nodes.wrapper = make("div", [this.CSS.wrapper]);

    if (this.blockHasLoadedFile()) {
      this.renderLoadedBlock();
    } else {
      this.renderUploadButton();
    }

    holder.appendChild(this.nodes.wrapper);
    return holder;
  }


  /**
   * If upload is successful, show info about the file
   */
  async renderLoadedBlock() {
    this.nodes.wrapper.classList.add(this.CSS.wrapperWithFile);

    const { file: { size, name } } = this.data;

    const fileInfo = make("div", [this.CSS.fileInfo]);

    this.nodes.title = make("div", [this.CSS.title], {
      contentEditable: true,
    });

    this.nodes.title.textContent = name;
    fileInfo.appendChild(this.nodes.title);

    if (size) {
      const fileSize = make("div", [this.CSS.size]);
      fileSize.textContent = humanFileSize(size);
      fileInfo.appendChild(fileSize);
    }

    const downloadIcon = make("a", [this.CSS.downloadButton], {
      innerHTML: svgs.arrowDownload,
    });

    downloadIcon.addEventListener("click", () => {
      this.config.fileHandling.onDownload(this.data.file);
    });

    const firstLine = make("div", ["cdx-audio-first-line"]);

    firstLine.appendChild(fileInfo);
    firstLine.appendChild(downloadIcon);

    const secondLine = make("div", ["cdx-audio-second-line"]);
    secondLine.setAttribute("data-mutation-free", "true");

    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    audioElement.src = await this.config.fileHandling.getUrl(this.data.file);
    audioElement.style.width = "100%";
    audioElement.style.marginTop = "20px";
    // this prevents editor.js from triggering the onChange callback as soon
    // as the audio loads
    audioElement.setAttribute("data-mutation-free", "true");
    secondLine.appendChild(audioElement);

    this.nodes.wrapper.appendChild(firstLine);
    this.nodes.wrapper.appendChild(secondLine);
  }
}
