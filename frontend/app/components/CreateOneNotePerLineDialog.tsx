import React, { useState } from "react";
import { l } from "../lib/intl";
import Dialog from "./Dialog";

const CreateOneNotePerLineDialog = ({
  createOneNotePerLine,
  onClose,
}) => {
  const [text, setText] = useState("");
  const [isBusy, setIsBusy] = useState(false);


  return <Dialog
    onClickOnOverlay={onClose}
    className="create-one-note-per-line-dialog"
  >
    <h1>{l("dialog.create-one-note-per-line.heading")}</h1>
    <p>{l("dialog.create-one-note-per-line.explainer")}</p>
    <textarea
      onChange={(e) => setText(e.target.value)}
    ></textarea>
    {
      isBusy
        ? <p>{l("dialog.create-one-note-per-line.please-wait")}</p>
        : <>
          <button
            onClick={() => {
              setIsBusy(true);
              createOneNotePerLine(text.split("\n"));
              setIsBusy(false);
              onClose();
            }}
            className="default-button dialog-box-button default-action"
          >{l("dialog.create-one-note-per-line.confirm")}</button>
          <button
            onClick={onClose}
            className="default-button dialog-box-button"
          >{l("dialog.cancel")}</button>
        </>
    }
  </Dialog>;
};

export default CreateOneNotePerLineDialog;
