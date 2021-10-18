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
import Uploader from "./uploader.js";
import * as svgs from "./svgs.js";
const LOADER_TIMEOUT = 500;

/**
 * @typedef {object} DocumentToolData
 * @description Document Tool's output data format
 * @property {DocumentFileData} file - object containing information about the
 * file
 * @property {string} title - file's title
 */

/**
 * @typedef {object} DocumentFileData
 * @description Document Tool's file format
 * @property {string} [url] - file's upload url
 * @property {string} [size] - file's size
 * @property {string} [extension] - file's extension
 * @property {string} [name] - file's name
 */

/**
 * @typedef {object} FileData
 * @description Document Tool's response from backend
 * @property {string} url - file's url
 * @property {string} name - file's name with extension
 * @property {string} extension - file's extension
 */

/**
 * @typedef {object} UploadResponseFormat
 * @description This format expected from backend on file upload
 * @property {number} success  - 1 for successful uploading, 0 for failure
 * @property {FileData} file - backend response with uploaded file data.
 */

/**
 * @typedef {object} DocumentToolConfig
 * @description Config supported by Tool
 * @property {string} endpoint - file upload url
 * @property {string} field - field name for uploaded file
 * @property {string} types - available mime-types
 * @property {string} placeholder
 * @property {string} errorMessage
 * @property {object} additionalRequestHeaders - allows to pass custom headers
 * with Request
 */

/**
 * @class DocumentTool
 * @classdesc DocumentTool for Editor.js 2.0
 *
 * @property {API} api - Editor.js API
 * @property {DocumentToolData} data
 * @property {DocumentToolConfig} config
 */
export default class DocumentTool {
  /**
   * @param {DocumentToolData} data
   * @param {object} config
   * @param {API} api
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.nodes = {
      wrapper: null,
      button: null,
      title: null,
    };

    this._data = {
      file: {},
      title: "",
    };

    this.config = {
      endpoint: config.endpoint || "",
      field: config.field || "file",
      types: config.types || "*",
      buttonText: config.buttonText || "Select file to upload",
      errorMessage: config.errorMessage || "File upload failed",
      additionalRequestHeaders: config.additionalRequestHeaders || {},
      uploader: config.uploader,
      onDownload: config.onDownload,
    };

    this.data = data;

    /**
     * Module for files uploading
     */
    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response) => this.onUpload(response),
      onError: (error) => this.uploadingFailed(error),
    });

    this.enableFileUpload = this.enableFileUpload.bind(this);
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
   * Possible files' extension colors
   */
  get EXTENSIONS() {
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
      mp3: "#eab456",
      mp4: "#f676a6",
      xls: "#3f9e64",
      html: "#2988f0",
      htm: "#2988f0",
      png: "#f676a6",
      jpg: "#f67676",
      jpeg: "#f67676",
      gif: "#f6af76",
      zip: "#4f566f",
      rar: "#4f566f",
      exe: "#e26f6f",
      svg: "#bf5252",
      key: "#e07066",
      sketch: "#df821c",
      ai: "#df821c",
      psd: "#388ae5",
      dmg: "#e26f6f",
      json: "#2988f0",
      csv: "#3f9e64",
    };
  }

  /**
   * Return Block data
   *
   * @param {HTMLElement} toolsContent
   * @return {DocumentToolData}
   */
  save(toolsContent) {
    /**
     * If file was uploaded
     */
    if (this.pluginHasData()) {
      const title = toolsContent.querySelector(`.${this.CSS.title}`).innerHTML;

      Object.assign(this.data, { title });
    }

    return this.data;
  }

  /**
   * Renders Block content
   *
   * @return {HTMLDivElement}
   */
  render() {
    const holder = this.make("div", this.CSS.baseClass);

    this.nodes.wrapper = this.make("div", this.CSS.wrapper);

    if (this.pluginHasData()) {
      this.showFileData();
    } else {
      this.prepareUploadButton();
    }

    holder.appendChild(this.nodes.wrapper);

    return holder;
  }

  /**
   * Prepares button for file uploading
   */
  prepareUploadButton() {
    this.nodes.button = this.make("div", [this.CSS.apiButton, this.CSS.button]);
    this.nodes.button.innerHTML = `${svgs.toolbox} ${this.config.buttonText}`;
    this.nodes.button.addEventListener("click", this.enableFileUpload);
    this.nodes.wrapper.appendChild(this.nodes.button);
  }

  /**
   * Fires after clicks on the Toolbox DocumentTool Icon
   * Initiates click on the Select File button
   *
   * @public
   */
  appendCallback() {
    this.nodes.button.click();
  }

  /**
   * Checks if any of Tool's fields have data
   *
   * @return {boolean}
   */
  pluginHasData() {
    return this.data.title !== ""
      || Object.values(this.data.file).some(
        (item) => typeof item !== "undefined",
      );
  }

  /**
   * Allow to upload files on button click
   */
  enableFileUpload() {
    this.uploader.uploadSelectedFile({
      onPreview: () => {
        this.nodes.wrapper.classList.add(
          this.CSS.wrapperLoading, this.CSS.loader,
        );
      },
    });
  }

  /**
   * File uploading callback
   *
   * @param {UploadResponseFormat} response
   */
  onUpload(response) {
    if (response.success && response.file) {
      const receivedFileData = response.file || {};
      const filename = receivedFileData.name;
      const extension = filename && filename.split(".").pop();

      this.data = {
        file: {
          ...receivedFileData,
          extension,
        },
        title: filename || "",
      };

      this.nodes.button.remove();
      this.showFileData();
      this.moveCaretToEnd(this.nodes.title);
      this.nodes.title.focus();
      this.removeLoader();
    } else {
      this.uploadingFailed(this.config.errorMessage);
    }
  }

  /**
   * Handles uploaded file's extension and appends corresponding icon
   */
  appendFileIcon() {
    const extension = this.data.file.extension || "";
    const extensionColor = this.EXTENSIONS[extension];

    const fileIcon = this.make("div", this.CSS.fileIcon, {
      innerHTML: extensionColor ? svgs.custom : svgs.standard,
    });

    if (extensionColor) {
      fileIcon.style.color = extensionColor;
      fileIcon.setAttribute("data-extension", extension);
    }

    this.nodes.wrapper.appendChild(fileIcon);
  }

  /**
   * Removes tool's loader
   */
  removeLoader() {
    setTimeout(
      () => {
        this.nodes.wrapper.classList.remove(
          this.CSS.wrapperLoading,
          this.CSS.loader,
        );
      },
      LOADER_TIMEOUT,
    );
  }

  /**
   * If upload is successful, show info about the file
   */
  showFileData() {
    this.nodes.wrapper.classList.add(this.CSS.wrapperWithFile);

    const { file: { size, url }, title } = this.data;

    this.appendFileIcon();

    const fileInfo = this.make("div", this.CSS.fileInfo);

    if (title) {
      this.nodes.title = this.make("div", this.CSS.title, {
        contentEditable: true,
      });

      this.nodes.title.textContent = title;
      fileInfo.appendChild(this.nodes.title);
    }

    if (size) {
      let sizePrefix;
      let formattedSize;
      const fileSize = this.make("div", this.CSS.size);

      if (Math.log10(+size) >= 6) {
        sizePrefix = "MiB";
        formattedSize = size / Math.pow(2, 20);
      } else {
        sizePrefix = "KiB";
        formattedSize = size / Math.pow(2, 10);
      }

      fileSize.textContent = formattedSize.toFixed(1);
      fileSize.setAttribute("data-size", sizePrefix);
      fileInfo.appendChild(fileSize);
    }

    this.nodes.wrapper.appendChild(fileInfo);

    const downloadIcon = this.make("a", this.CSS.downloadButton, {
      innerHTML: svgs.arrowDownload,
    });

    if (typeof this.config.onDownload === "function") {
      downloadIcon.addEventListener("click", () => {
        this.config.onDownload(this.data.file);
      });
    } else {
      downloadIcon.href = url;
      downloadIcon.target = "_blank";
      downloadIcon.rel = "nofollow noindex noreferrer";
    }

    this.nodes.wrapper.appendChild(downloadIcon);
  }

  /**
   * If file uploading failed, remove loader and show notification
   *
   * @param {string} errorMessage -  error message
   */
  uploadingFailed(errorMessage) {
    this.api.notifier.show({
      message: errorMessage,
      style: "error",
    });

    this.removeLoader();
  }

  /**
   * Return Document Tool's data
   *
   * @return {DocumentToolData}
   */
  get data() {
    return this._data;
  }

  /**
   * Stores all Tool's data
   *
   * @param {DocumentToolData} data
   */
  set data({ file, title }) {
    this._data = Object.assign({}, {
      file: {
        url: (file && file.url) || this._data.file.url,
        name: (file && file.name) || this._data.file.name,
        extension: (file && file.extension) || this._data.file.extension,
        size: (file && file.size) || this._data.file.size,
        ...file,
      },
      title: title || this._data.title,
    });
  }

  /**
   * Moves caret to the end of contentEditable element
   *
   * @param {HTMLElement} element - contentEditable element
   */
  moveCaretToEnd(element) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Helper method for elements creation
   *
   * @param {string} tagName
   * @param {array?} classNames
   * @param {object} attributes
   * @return {HTMLElement}
   */
  make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    // eslint-disable-next-line guard-for-in
    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
