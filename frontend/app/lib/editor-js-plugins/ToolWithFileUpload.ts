import {
  FileInfo,
} from "../../../../lib/notes/interfaces/FileInfo";
import { getFileFromUserSelection, make, moveCaretToEnd } from "./utils";

/*
  This is an abstract class for all editor.js tools that have file upload
  functionality. It provides the following features:
  * rendering an upload button
  * opening a file picker
  * uploading the file
  * showing an upload animation
  * handling editor.js paste events (paste config needs to be set by the tool
    itself)
  * state management
*/
export default abstract class ToolWithFileUpload {
  abstract config;
  abstract nodes;
  abstract CSS;
  abstract data:{
    file: FileInfo,
    [key: string]: any,
  };

  abstract save(toolContent: HTMLElement);
  abstract render():void;
  abstract renderLoadedBlock():void;

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
    if (event.type === "file") {
      const file = event.detail.file;
      this.#uploadFileAndRefreshUI(file);
    }
  }


  async #uploadFileAndRefreshUI(file:File):Promise<void> {
    this.#showUploadIndicator();
    try {
      const response:FileInfo
        = await this.config.fileHandling.uploadByFile(file);
      this.#handleDatabaseResponse(response);
    } catch (e) {
      this.#handleFailedUpload(e);
    }
  }


  #handleDatabaseResponse(fileMetadata:FileInfo):void {
    this.#addFileMetadataToState(fileMetadata);
    this.nodes.button.remove();
    this.#hideUploadIndicator();
    this.renderLoadedBlock();
    moveCaretToEnd(this.nodes.title);
    this.nodes.title.focus();
  }


  protected renderUploadButton():void {
    this.nodes.button = make("div", [this.CSS.apiButton, this.CSS.button]);
    this.nodes.button.innerHTML = this.config.buttonText;
    /*
      editorjs core will automatically click on this button because we assign
      it CSS classes defined by the editorjs core API.
      that is why we need to use an arrow function here because otherwise "this"
      is not this class anymore and the event handler does not work.
    */
    this.nodes.button.addEventListener("click", () => {
      this.#getAndUploadFile();
    });
    this.nodes.wrapper.appendChild(this.nodes.button);
  }


  async #getAndUploadFile():Promise<void> {
    const file = await getFileFromUserSelection(
      this.config.filePickerAcceptTypes,
    );
    await this.#uploadFileAndRefreshUI(file);
  }


  #showUploadIndicator():void {
    this.nodes.wrapper.classList.add(
      this.CSS.wrapperLoading,
      this.CSS.loader,
    );
  }


  #hideUploadIndicator():void {
    this.nodes.wrapper.classList.remove(
      this.CSS.wrapperLoading,
      this.CSS.loader,
    );
  }


  /**
   * Fires after clicks on the Toolbox AudioTool Icon
   * Initiates click on the Select File button
   *
   * @public
   */
  appendCallback():void {
    this.nodes.button.click();
  }


  blockHasLoadedFile():boolean {
    return typeof this.data.file === "object";
  }


  #addFileMetadataToState(fileMetadata:FileInfo):void {
    this.data.file = fileMetadata;
  }


  #handleFailedUpload(error) {
    console.error(error);
    this.#hideUploadIndicator();
  }
}
