import React from "react";
import { l } from "../lib/intl";
import Dialog from "./Dialog";


const SearchPresetDialogPreset = ({
  label,
  searchValue,
  onClick,
}) => {
  return <p>
    <button
      onClick={onClick}
      className="small-button dialog-box-button"
    >{searchValue}</button>
    {label}
  </p>;
};


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
    className="search-presets-dialog"
  >
    <h1>{l("list.search.presets")}</h1>
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("exact:")}
      label={l("list.search.presets.untitled-notes")}
      searchValue={"exact:"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("duplicates:title")}
      label={l("list.search.presets.notes-with-duplicate-titles")}
      searchValue={"duplicates:title"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("duplicates:url")}
      label={l("list.search.presets.notes-with-duplicate-urls")}
      searchValue={"duplicates:url"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("has-media:audio")}
      label={l("list.search.presets.notes-with-audio")}
      searchValue={"has-media:audio"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("has-media:video")}
      label={l("list.search.presets.notes-with-video")}
      searchValue={"has-media:video"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("has-media:pdf")}
      label={l("list.search.presets.notes-with-pdfs")}
      searchValue={"has-media:pdf"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("has-media:image")}
      label={l("list.search.presets.notes-with-images")}
      searchValue={"has-media:image"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("has-block:list")}
      label={l("list.search.presets.has-list")}
      searchValue={"has-block:list"}
    />
    <SearchPresetDialogPreset
      onClick={() => setSearchValueAndClose("has:custom-metadata")}
      label={l("list.search.presets.has-custom-metadata")}
      searchValue={"has:custom-metadata"}
    />
    <button
      onClick={onClose}
      className="default-button dialog-box-button default-action"
    >{l("dialog.close")}</button>
  </Dialog>;
};

export default SearchDialog;
