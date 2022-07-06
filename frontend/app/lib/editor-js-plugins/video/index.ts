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
import * as svgs from "./svgs.js";
import {
  make,
} from "../utils.js";
import {
  humanFileSize,
} from "../../utils";
import {
  NoteContentBlockFileMetadata,
} from "../../../../../lib/notes/interfaces/NoteContentBlock";
import ToolWithFileUpload from "../ToolWithFileUpload";


export default class VideoTool extends ToolWithFileUpload {
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
      buttonText: "Select video",
      fileHandling: config.fileHandling,
      filePickerAcceptTypes: [
        {
          description: "Video file",
          accept: {
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
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
      title: "Video",
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
      wrapper: "cdx-video",
      wrapperWithFile: "cdx-video--with-file",
      wrapperLoading: "cdx-video--loading",
      button: "cdx-video__button",
      title: "cdx-video__title",
      size: "cdx-video__size",
      downloadButton: "cdx-video__download-button",
      fileInfo: "cdx-video__file-info",
      fileIcon: "cdx-video__file-icon",
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
      // tags: ["video"],

      /**
       * Paste URL of audio into the Editor
       * We have disabled this because we want to be able to insert a
       * url without turning it into an audio block
       */
      /* patterns: {
        audio: /https?:\/\/\S+\.mp4$/i,
      },*/

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["video/mp4", "video/webm"],
        extensions: ["mp4", "webm"],
      },
    };
  }


  /**
   * Return Block data
   *
   * @param {HTMLElement} toolContent
   * @return {VideoToolData}
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
  render():HTMLElement {
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


  async renderLoadedBlock():Promise<void> {
    this.nodes.wrapper.classList.add(this.CSS.wrapperWithFile);
    const { file: { size, name } } = this.data;
    const fileInfo = make("div", [this.CSS.fileInfo]);

    this.nodes.title = make("div", [this.CSS.title], {
      contentEditable: true,
    });

    this.nodes.title.textContent = name;
    fileInfo.appendChild(this.nodes.title);

    // Currently size might be -1 when the note was created from a dangling
    // file. We can remove this condition if this is not the case anymore.
    if (size > 0) {
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

    const firstLine = make("div", ["cdx-video-first-line"]);

    firstLine.appendChild(fileInfo);
    firstLine.appendChild(downloadIcon);

    const secondLine = make("div", ["cdx-video-second-line"]);
    secondLine.setAttribute("data-mutation-free", "true");

    const videoElement = document.createElement("video");
    videoElement.controls = true;
    videoElement.src = await this.config.fileHandling.getUrl(this.data.file);
    videoElement.style.width = "100%";
    videoElement.style.marginTop = "20px";
    // this prevents editor.js from triggering the onChange callback as soon
    // as the audio loads
    videoElement.setAttribute("data-mutation-free", "true");
    secondLine.appendChild(videoElement);

    this.nodes.wrapper.appendChild(firstLine);
    this.nodes.wrapper.appendChild(secondLine);
  }
}
