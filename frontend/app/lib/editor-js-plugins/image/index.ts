/*
@license

MIT License

Copyright (c) 2020 CodeX

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

/**
 * Image Tool for the Editor.js
 *
 * @author CodeX <team@codex.so>
 * @license MIT
 * @see {@link https://github.com/editor-js/image}
 *
 * To developers.
 * To simplify Tool structure, we split it to 3 parts:
 *  1) index.js — main Tool's interface, public API and methods for working
 * with data
 *  2) ui.js — module for UI manipulations: render, showing preloader, etc
 *  3) tunes.js — working with Block Tunes: render buttons, handle clicks
 */

/**
 * @typedef {object} ImageToolData
 * @description Image Tool's input and output data format
 * @property {string} caption — image caption
 * @property {boolean} withBackground - should image be rendered with background
 * @property {object} file — Image file data returned from backend
 * @property {string} file.url — image URL
 */

// eslint-disable-next-line
import "./index.css";
import Tunes from "./tunes";
import * as svgs from "./svgs.js";
import ToolWithFileUpload from "../ToolWithFileUpload";
import { make } from "../utils.js";
import {
  FileInfo,
} from "../../../../../lib/notes/interfaces/FileInfo";


/**
 * @typedef {object} UploadResponseFormat
 * @description This format expected from backend on file uploading
 * @property {number} success - 1 for successful uploading, 0 for failure
 * @property {object} file - Object with file data.
 *                           'url' is required,
 *                           also can contain any additional data that will be
 *                           saved and passed back
 * @property {string} file.url - [Required] image source URL
 */
export default class ImageTool extends ToolWithFileUpload {
  api;
  readOnly;
  config;
  ui;
  tunes;
  data:{
    file: FileInfo,
    caption: string,
    withBackground: boolean,
  };

  nodes;

  /**
   * Notify core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * @param {object} tool - tool properties got from editor.js
   * @param {ImageToolData} tool.data - previously saved data
   * @param {ImageConfig} tool.config - user config for Tool
   * @param {object} tool.api - Editor.js API
   * @param {boolean} tool.readOnly - read-only mode flag
   */
  constructor({ data, config, api }) {
    super();

    this.api = api;

    this.nodes = {
      wrapper: null,
      button: null,
      title: null,
      caption: null,
    };

    /**
     * Tool's initial config
     */
    this.config = {
      captionPlaceholder: "Caption",
      buttonText: "Select image",
      fileHandling: config.fileHandling,
      filePickerAcceptTypes: [
        {
          description: "Image",
          accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg"],
            "image/webp": [".webp"],
            "image/gif": [".gif"],
            "image/svg+xml": [".svg"],
          },
        },
      ],
    };

    /**
     * Module for working with tunes
     */
    this.tunes = new Tunes({
      api,
      onChange: (tuneName) => this.tuneToggled(tuneName),
    });

    this.data = data;
  }


  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: svgs.toolbox,
      title: "Image",
    };
  }


  /**
   * CSS classes
   *
   * @return {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loader: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,
      apiButton: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: "image-tool",
      wrapperWithFile: "image-tool--with-file",
      wrapperLoading: "image-tool--loading",
      imageContainer: "image-tool__image",
      imagePreloader: "image-tool__image-preloader",
      imageEl: "image-tool__image-picture",
      caption: "image-tool__caption",
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
      tags: ["img"],

      /**
       * Paste URL of image into the Editor
       * We have disabled this because we want to be able to insert an image
       * url without turning it into an image
       */
      /* patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|webp|png)$/i,
      },*/

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
          "image/svg+xml",
        ],
      },
    };
  }


  /**
   * Return Block data
   *
   * @public
   * @return {ImageToolData}
   */
  save() {
    if (this.blockHasLoadedFile()) {
      const caption = this.nodes.caption;
      this.data.caption = caption.innerText;
    } else {
      this.data.caption = "";
      this.data.withBackground = false;
    }

    return this.data;
  }


  /**
   * Renders Block content
   *
   * @public
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
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @public
   *
   * @return {Element}
   */
  renderSettings() {
    return this.tunes.render(this.data);
  }


  async renderLoadedBlock() {
    this.nodes.caption = make("div", [this.CSS.input, this.CSS.caption], {
      contentEditable: true,
    });
    this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder;
    this.nodes.imageContainer = make("div", [this.CSS.imageContainer]);
    this.nodes.wrapper.appendChild(this.nodes.imageContainer);
    this.nodes.wrapper.appendChild(this.nodes.caption);
    this.nodes.caption.innerHTML = this.data.caption || "";

    Tunes.tunes.forEach(({ name: tune }) => {
      const value = typeof this.data[tune] !== "undefined"
        ? this.data[tune] === true || this.data[tune] === "true"
        : false;

      this.setTune(tune, value);
    });

    const url = await this.config.fileHandling.getUrl(this.data.file);
    const attributes = {
      src: url,
    };

    /**
     * Compose tag with defined attributes
     *
     * @type {Element}
     */
    this.nodes.imageEl = make("img", [this.CSS.imageEl], attributes);

    // this prevents editor.js from triggering the onChange callback as soon
    // as the image loads
    this.nodes.imageEl.setAttribute("data-mutation-free", "true");

    /**
     * Preloader does not exist on first rendering with presaved data
     */
    if (this.nodes.imagePreloader) {
      this.nodes.imagePreloader.style.backgroundImage = "";
    }

    this.nodes.imageContainer.appendChild(this.nodes.imageEl);
  }


  /**
   * Callback fired when Block Tune is activated
   *
   * @private
   *
   * @param {string} tuneName - tune that has been clicked
   * @return {void}
   */
  tuneToggled(tuneName) {
    // inverse tune state
    this.setTune(tuneName, !this.data[tuneName]);
  }

  /**
   * Set one tune
   *
   * @param {string} tuneName - {@link Tunes.tunes}
   * @param {boolean} value - tune state
   * @return {void}
   */
  setTune(tuneName, value) {
    this.data[tuneName] = value;
    this.applyTune(tuneName, value);
  }


  /**
   * Apply visual representation of activated tune
   *
   * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
   * @param {boolean} status - true for enable, false for disable
   * @return {void}
   */
  applyTune(tuneName, status) {
    this.nodes.wrapper.classList.toggle(
      `${this.CSS.wrapper}--${tuneName}`, status,
    );
  }
}
