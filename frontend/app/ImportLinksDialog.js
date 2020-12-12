import React, { useState } from "react";
import Overlay from "./Overlay.js";

const ImportLinksDialog = ({
  importLinksAsNotes,
  onCancel,
}) => {
  const [text, setText] = useState("");


  return <Overlay
    onClick={onCancel}
  >
    <div
      style={{
        "width": "400px",
        "display": "block",
        "padding": "20px",
        "margin": "auto",
      }}
      className="import-link-dialog"
      onClick={(e) => e.stopPropagation()}
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
      <button
        onClick={() => {
          importLinksAsNotes(text.split("\n"));
        }}
        className="dialog-box-button"
      >Import as notes</button>
      <button
        onClick={onCancel}
        className="dialog-box-button"
      >Cancel</button>
    </div>
  </Overlay>;
};

export default ImportLinksDialog;
