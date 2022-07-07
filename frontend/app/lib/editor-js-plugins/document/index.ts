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
  getExtensionFromFilename,
  humanFileSize,
} from "../../utils";
import ToolWithFileUpload from "../ToolWithFileUpload";
import { FileInfo } from "../../../../../lib/notes/interfaces/FileInfo";


export default class DocumentTool extends ToolWithFileUpload {
  api;
  nodes;
  data:{
    file: FileInfo,
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
      buttonText: "Select document",
      fileHandling: config.fileHandling,
      filePickerAcceptTypes: [
        {
          description: "PDF file",
          accept: {
            "application/pdf": [".pdf"],
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
      title: "Document",
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
      wrapper: "cdx-document",
      wrapperWithFile: "cdx-document--with-file",
      wrapperLoading: "cdx-document--loading",
      button: "cdx-document__button",
      title: "cdx-document__title",
      size: "cdx-document__size",
      downloadButton: "cdx-document__download-button",
      fileInfo: "cdx-document__file-info",
      fileIcon: "cdx-document__file-icon",
    };
  }

  /**
   * Colors for file thumbnails
   */
  get EXTENSIONS_COLORS() {
    return {
      doc: "#3e74da",
      docx: "#3e74da",
      odt: "#3e74da",
      pdf: "#d47373",
      rtf: "#656ecd",
      tex: "#5a5a5b",
      txt: "#5a5a5b",
      pptx: "#e07066",
      ppt: "#e07066",
      xls: "#3f9e64",
      html: "#2988f0",
      htm: "#2988f0",
      zip: "#4f566f",
      rar: "#4f566f",
      exe: "#e26f6f",
      ai: "#df821c",
      psd: "#388ae5",
      json: "#2988f0",
      csv: "#3f9e64",
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
       * Paste URL of audio into the Editor
       * We have disabled this because we want to be able to insert a
       * url without turning it into an audio block
       */
      /* patterns: {
        document: /https?:\/\/\S+\.pdf$/i,
      },*/

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["application/pdf"],
        extensions: ["pdf"],
      },
    };
  }


  /**
   * Return Block data
   *
   * @param {HTMLElement} toolContent
   * @return {DocumentToolData}
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


  appendFileIcon() {
    const extension = getExtensionFromFilename(this.data.file.fileId);
    if (!extension) {
      return;
    }

    const extensionColor = this.EXTENSIONS_COLORS[extension];

    const fileIcon = make("div", [this.CSS.fileIcon], {
      innerHTML: extensionColor ? svgs.custom : svgs.standard,
    });

    if (extensionColor) {
      fileIcon.style.color = extensionColor;
      fileIcon.setAttribute("data-extension", extension);
    }

    this.nodes.wrapper.appendChild(fileIcon);
  }


  /**
   * If upload is successful, show info about the file
   */
  renderLoadedBlock() {
    this.nodes.wrapper.classList.add(this.CSS.wrapperWithFile);

    const { file: { size, name } } = this.data;

    this.appendFileIcon();

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

    this.nodes.wrapper.appendChild(fileInfo);

    const downloadIcon = make("a", [this.CSS.downloadButton], {
      innerHTML: svgs.arrowDownload,
    }) as HTMLAnchorElement;

    downloadIcon.addEventListener("click", () => {
      this.config.fileHandling.onDownload(this.data.file);
    });

    this.nodes.wrapper.appendChild(downloadIcon);
  }
}
