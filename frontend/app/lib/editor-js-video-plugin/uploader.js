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

/**
 * Module for file uploading.
 */
export default class Uploader {
  /**
   * @param {object} config.config
   * @param {object} config
   * @param {Function} onUpload - callback for successful file upload
   * @param {Function} onError - callback for uploading errors
   * @param {Function} config.onUpload
   * @param {Function} config.onError
   */
  constructor({ config, onUpload, onError }) {
    this.config = config;
    this.onUpload = onUpload;
    this.onError = onError;
  }

  /**
   * Handle clicks on the upload file button
   *
   * @fires ajax.transport()
   * @param {Function} onPreview - callback fired when preview is ready
   */
  uploadSelectedFile({ onPreview }) {
    // eslint-disable-next-line
    window.showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: "Video file",
          accept: {
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
          },
        },
      ],
    })
      .then(([fileHandle]) => {
        return fileHandle.getFile();
      })
      .then((file) => {
        onPreview();

        const customUpload = this.config.uploader(file);

        if (!isPromise(customUpload)) {
          // eslint-disable-next-line
          console.warn('Custom uploader method uploadByFile should return a Promise');
        }

        return customUpload;
      })
      .then((response) => {
        this.onUpload(response);
      })
      .catch((error) => {
        const message = (error && error.message)
          ? error.message
          : this.config.errorMessage;

        this.onError(message);
      });
  }
}

/**
 * Check if passed object is a Promise
 *
 * @param  {*}  object - object to check
 * @return {boolean}
 */
function isPromise(object) {
  return Promise.resolve(object) === object;
}
