import React from "react";
import Dialog from "./Dialog";

const SearchDialog = ({
  setSearchValue,
  onCancel,
}) => {
  return <Dialog
    onClickOnOverlay={onCancel}
    className="stats-dialog"
  >
    <h1>Search presets</h1>
    <h2>Duplicates</h2>
    <p>
      <button
        onClick={() => setSearchValue("duplicates:title")}
        className="default-button dialog-box-button"
      >Notes with duplicate titles</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValue("duplicates:url")}
        className="default-button dialog-box-button"
      >Notes with duplicate URLs</button>
    </p>
    <h2>Types</h2>
    <p>
      <button
        onClick={() => setSearchValue("has:audio")}
        className="default-button dialog-box-button"
      >Notes with audio</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValue("has:video")}
        className="default-button dialog-box-button"
      >Notes with video</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValue("has:document")}
        className="default-button dialog-box-button"
      >Notes with documents</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValue("has:image")}
        className="default-button dialog-box-button"
      >Notes with images</button>
    </p>
    <button
      onClick={onCancel}
      className="default-button dialog-box-button default-action"
    >Close</button>
  </Dialog>;
};

export default SearchDialog;
