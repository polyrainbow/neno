import React from "react";
import Dialog from "./Dialog";

const SearchDialog = ({
  setSearchValue,
  onClose,
}) => {
  const setSearchValueAndClose = (searchValue) => {
    setSearchValue(searchValue);
    onClose();
  };

  return <Dialog
    onClickOnOverlay={onClose}
    className="stats-dialog"
  >
    <h1>Search presets</h1>
    <p>
      <button
        onClick={() => setSearchValueAndClose("exact:")}
        className="default-button dialog-box-button"
      >Untitled notes</button>
    </p>
    <h2>Duplicates</h2>
    <p>
      <button
        onClick={() => setSearchValueAndClose("duplicates:title")}
        className="default-button dialog-box-button"
      >Notes with duplicate titles</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("duplicates:url")}
        className="default-button dialog-box-button"
      >Notes with duplicate URLs</button>
    </p>
    <h2>Types</h2>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has:audio")}
        className="default-button dialog-box-button"
      >Notes with audio</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has:video")}
        className="default-button dialog-box-button"
      >Notes with video</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has:document")}
        className="default-button dialog-box-button"
      >Notes with documents</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has:image")}
        className="default-button dialog-box-button"
      >Notes with images</button>
    </p>
    <button
      onClick={onClose}
      className="default-button dialog-box-button default-action"
    >Close</button>
  </Dialog>;
};

export default SearchDialog;
