import React from "react";
import { l } from "../lib/intl";
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
    <h1>{l("list.search.presets")}</h1>
    <p>
      <button
        onClick={() => setSearchValueAndClose("exact:")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.untitled-notes")}</button>
    </p>
    <h2>{l("list.search.presets.duplicates")}</h2>
    <p>
      <button
        onClick={() => setSearchValueAndClose("duplicates:title")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.notes-with-duplicate-titles")}</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("duplicates:url")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.notes-with-duplicate-urls")}</button>
    </p>
    <h2>Types</h2>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has-media:audio")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.notes-with-audio")}</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has-media:video")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.notes-with-video")}</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has-media:document")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.notes-with-documents")}</button>
    </p>
    <p>
      <button
        onClick={() => setSearchValueAndClose("has-media:image")}
        className="default-button dialog-box-button"
      >{l("list.search.presets.notes-with-images")}</button>
    </p>
    <button
      onClick={onClose}
      className="default-button dialog-box-button default-action"
    >{l("dialog.close")}</button>
  </Dialog>;
};

export default SearchDialog;
