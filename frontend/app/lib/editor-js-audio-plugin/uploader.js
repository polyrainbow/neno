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
          description: "MP3 File",
          accept: {
            "audio/mp3": [".mp3"],
            "audio/mpeg": [".mp3"],
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
