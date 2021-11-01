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
 * To simplify Tool structure, we split it to 4 parts:
 *  1) index.js — main Tool's interface, public API and methods for working
 * with data
 *  2) uploader.js — module that has methods for sending files via AJAX: from
 * device, by URL or File pasting
 *  3) ui.js — module for UI manipulations: render, showing preloader, etc
 *  4) tunes.js — working with Block Tunes: render buttons, handle clicks
 *
 * For debug purposes there is a testing server
 * that can save uploaded files and return a Response
 * {@link UploadResponseFormat}
 *
 *       $ node dev/server.js
 *
 * It will expose 8008 port, so you can pass http://localhost:8008 with the Tools config:
 *
 * image: {
 *   class: ImageTool,
 *   config: {
 *     endpoints: {
 *       byFile: 'http://localhost:8008/uploadFile',
 *       byUrl: 'http://localhost:8008/fetchUrl',
 *     }
 *   },
 * },
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
import Ui from "./ui.js";
import Tunes from "./tunes.js";
import * as svgs from "./svgs.js";
import Uploader from "./uploader.js";

/**
 * @typedef {object} ImageConfig
 * @description Config supported by Tool
 * @property {object} endpoints - upload endpoints
 * @property {string} endpoints.byFile - upload by file
 * @property {string} endpoints.byUrl - upload by URL
 * @property {string} field - field name for uploaded image
 * @property {string} types - available mime-types
 * @property {string} captionPlaceholder - placeholder for Caption field
 * @property {object} additionalRequestData - any data to send with requests
 * @property {object} additionalRequestHeaders - allows to pass custom headers
 * with Request
 * @property {string} buttonContent - overrides for Select File button
 * @property {object} [uploader] - optional custom uploader
 * @property {function(File): Promise.<UploadResponseFormat>}
 * [uploader.uploadByFile] - method that upload image by File
 * @property {function(string): Promise.<UploadResponseFormat>}
 * [uploader.uploadByUrl] - method that upload image by URL
 */

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
export default class ImageTool {
  /**
   * Notify core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
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
   * @param {object} tool - tool properties got from editor.js
   * @param {ImageToolData} tool.data - previously saved data
   * @param {ImageConfig} tool.config - user config for Tool
   * @param {object} tool.api - Editor.js API
   * @param {boolean} tool.readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Tool's initial config
     */
    this.config = {
      endpoints: config.endpoints || "",
      additionalRequestData: config.additionalRequestData || {},
      additionalRequestHeaders: config.additionalRequestHeaders || {},
      field: config.field || "image",
      types: config.types || "image/*",
      captionPlaceholder: this.api.i18n.t(
        config.captionPlaceholder || "Caption",
      ),
      buttonContent: config.buttonContent || "",
      uploader: config.uploader,
      actions: config.actions || [],
      getUrl: config.getUrl || null,
    };

    /**
     * Module for file uploading
     */
    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response) => this.onUpload(response),
      onError: (error) => this.uploadingFailed(error),
    });

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      onSelectFile: () => {
        this.uploader.uploadSelectedFile({
          onPreview: (src) => {
            this.ui.showPreloader(src);
          },
        });
      },
      readOnly,
    });

    /**
     * Module for working with tunes
     */
    this.tunes = new Tunes({
      api,
      actions: this.config.actions,
      onChange: (tuneName) => this.tuneToggled(tuneName),
    });

    /**
     * Set saved state
     */
    this._data = {};
    this.data = data;
  }

  /**
   * Renders Block content
   *
   * @public
   *
   * @return {HTMLDivElement}
   */
  render() {
    return this.ui.render(this.data);
  }

  /**
   * Return Block data
   *
   * @public
   *
   * @return {ImageToolData}
   */
  save() {
    const caption = this.ui.nodes.caption;

    this._data.caption = caption.innerHTML;

    return this.data;
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

  /**
   * Fires after clicks on the Toolbox Image Icon
   * Initiates click on the Select File button
   *
   * @public
   */
  appendCallback() {
    this.ui.nodes.fileButton.click();
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
       */
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i,
      },

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ["image/*"],
      },
    };
  }

  /**
   * Specify paste handlers
   *
   * @public
   * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
   * @param {CustomEvent} event - editor.js custom paste event
   *                              {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
   * @return {void}
   */
  onPaste(event) {
    switch (event.type) {
    case "tag": {
      const image = event.detail.data;

      /** Images from PDF */
      if (/^blob:/.test(image.src)) {
        fetch(image.src)
          .then((response) => response.blob())
          .then((file) => {
            this.uploadFile(file);
          });

        break;
      }

      this.uploadUrl(image.src);
      break;
    }
    case "pattern": {
      const url = event.detail.data;

      this.uploadUrl(url);
      break;
    }
    case "file": {
      const file = event.detail.file;

      this.uploadFile(file);
      break;
    }
    }
  }

  /**
   * Private methods
   */

  /**
   * Stores all Tool's data
   *
   * @private
   *
   * @param {ImageToolData} data - data in Image Tool format
   */
  set data(data) {
    this.image = data.file;

    this._data.caption = data.caption || "";
    this.ui.fillCaption(this._data.caption);

    Tunes.tunes.forEach(({ name: tune }) => {
      const value = typeof data[tune] !== "undefined"
        ? data[tune] === true || data[tune] === "true"
        : false;

      this.setTune(tune, value);
    });
  }

  /**
   * Return Tool data
   *
   * @private
   *
   * @return {ImageToolData}
   */
  get data() {
    return this._data;
  }


  get image() {
    return this._data.file;
  }

  /**
   * Set new image file
   *
   * @private
   *
   * @param {object} file - uploaded file data
   */
  set image(file) {
    this._data.file = file || {};

    if (file) {
      if (typeof this.config.getUrl === "function") {
        this.config.getUrl(file)
          .then((url) => {
            this.ui.fillImage(url);
          })
          .catch((e) => {
            throw new Error(e);
          });
      } else if (typeof file.url === "string") {
        this.ui.fillImage(file.url);
      } else {
        throw new Error("Cannot set image url.");
      }
    }
  }

  /**
   * File uploading callback
   *
   * @private
   *
   * @param {UploadResponseFormat} response - uploading server response
   * @return {void}
   */
  onUpload(response) {
    if (response.success && response.file) {
      this.image = response.file;
    } else {
      this.uploadingFailed("incorrect response: " + JSON.stringify(response));
    }
  }

  /**
   * Handle uploader errors
   *
   * @private
   * @param {string} errorText - uploading error text
   * @return {void}
   */
  uploadingFailed(errorText) {
    console.log("Image Tool: uploading failed because of", errorText);
    this.ui.hidePreloader();
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
    this.setTune(tuneName, !this._data[tuneName]);
  }

  /**
   * Set one tune
   *
   * @param {string} tuneName - {@link Tunes.tunes}
   * @param {boolean} value - tune state
   * @return {void}
   */
  setTune(tuneName, value) {
    this._data[tuneName] = value;

    this.ui.applyTune(tuneName, value);
  }

  /**
   * Show preloader and upload image file
   *
   * @param {File} file - file that is currently uploading (from paste)
   * @return {void}
   */
  async uploadFile(file) {
    const result = await this.config.uploader.uploadByFile(file);
    this.onUpload(result);
  }

  /**
   * Show preloader and upload image by target url
   *
   * @param {string} url - url pasted
   * @return {void}
   */
  uploadUrl(url) {
    this.ui.showPreloader(url);
    this.uploader.uploadByUrl(url);
  }
}
