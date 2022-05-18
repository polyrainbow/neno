import React, { useState } from "react";
import { l } from "../lib/intl";
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
    <h1>{l("import-links.heading")}</h1>
    <p>{l("import-links.explainer")}</p>
    <textarea
      onChange={(e) => setText(e.target.value)}
    ></textarea>
    {
      isBusy
        ? <p>{l("import-links.please-wait")}</p>
        : <>
          <button
            onClick={() => {
              setIsBusy(true);
              importLinksAsNotes(text.split("\n"));
              setIsBusy(false);
              onClose();
            }}
            className="default-button dialog-box-button default-action"
          >{l("import-links.confirm")}</button>
          <button
            onClick={onClose}
            className="default-button dialog-box-button"
          >{l("dialog.cancel")}</button>
        </>
    }
  </Dialog>;
};

export default ImportLinksDialog;
