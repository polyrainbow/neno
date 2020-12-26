import React, { useState } from "react";
import Dialog from "./Dialog.js";

const ImportLinksDialog = ({
  importLinksAsNotes,
  onCancel,
}) => {
  const [text, setText] = useState("");
  const [isBusy, setIsBusy] = useState(false);


  return <Dialog
    onClickOnOverlay={onCancel}
    className="import-link-dialog"
  >
    <h1>Import links as notes</h1>
    <p>Separate links by line breaks</p>
    <textarea
      style={{
        "width": "100%",
        "display": "block",
        "height": "200px",
      }}
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
            }}
            className="default-button default-action"
          >Import as notes</button>
          <button
            onClick={onCancel}
            className="default-button"
          >Cancel</button>
        </>
    }
  </Dialog>;
};

export default ImportLinksDialog;
