import React, { useState } from "react";
import Dialog from "./Dialog";

const ImportLinksDialog = ({
  importLinksAsNotes,
  onClose,
}) => {
  const [text, setText] = useState("");
  const [isBusy, setIsBusy] = useState(false);


  return <Dialog
    onClickOnOverlay={onClose}
    className="import-link-dialog"
  >
    <h1>Import links as notes</h1>
    <p>Separate links by line breaks</p>
    <textarea
      onChange={(e) => setText(e.target.value)}
    ></textarea>
    {
      isBusy
        ? <p>Please wait while links are imported ...</p>
        : <>
          <button
            onClick={() => {
              setIsBusy(true);
              importLinksAsNotes(text.split("\n"));
              setIsBusy(false);
              onClose();
            }}
            className="default-button dialog-box-button default-action"
          >Import as notes</button>
          <button
            onClick={onClose}
            className="default-button dialog-box-button"
          >Cancel</button>
        </>
    }
  </Dialog>;
};

export default ImportLinksDialog;
