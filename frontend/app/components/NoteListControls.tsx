import React from "react";
import SearchInput from "./SearchInput.js";
import IconButton from "./IconButton";
import { l } from "../lib/intl.js";

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  openSearchDialog,
  refreshNoteList,
}) => {
  return <section id="section-search-input">
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <SearchInput
        placeholder={l("list.search.placeholder")}
        value={value}
        onChange={onChange}
        inputStyle={{
          width: "250px",
        }}
      />
      <IconButton
        id="button_show_search dialog"
        title={l("list.search.presets")}
        icon="saved_search"
        onClick={openSearchDialog}
      />
      <IconButton
        id="button_refresh-note-list"
        title={l("list.refresh")}
        icon="refresh"
        onClick={refreshNoteList}
      />
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <select
        id="sortModeSelect"
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value)}
      >
        <option
          value="CREATION_DATE_ASCENDING"
        >{l("list.sort-mode.creation-date-ascending")}</option>
        <option
          value="CREATION_DATE_DESCENDING"
        >{l("list.sort-mode.creation-date-descending")}</option>
        <option
          value="UPDATE_DATE_ASCENDING"
        >{l("list.sort-mode.update-date-ascending")}</option>
        <option
          value="UPDATE_DATE_DESCENDING"
        >{l("list.sort-mode.update-date-descending")}</option>
        <option
          value="TITLE_ASCENDING"
        >{l("list.sort-mode.title-a-z")}</option>
        <option
          value="TITLE_DESCENDING"
        >{l("list.sort-mode.title-z-a")}</option>
        <option
          value="NUMBER_OF_LINKS_ASCENDING"
        >{l("list.sort-mode.number-of-links-ascending")}</option>
        <option
          value="NUMBER_OF_LINKS_DESCENDING"
        >{l("list.sort-mode.number-of-links-descending")}</option>
        <option
          value="NUMBER_OF_FILES_ASCENDING"
        >{l("list.sort-mode.number-of-files-ascending")}</option>
        <option
          value="NUMBER_OF_FILES_DESCENDING"
        >{l("list.sort-mode.number-of-files-descending")}</option>
        <option
          value="NUMBER_OF_CHARACTERS_ASCENDING"
        >{l("list.sort-mode.number-of-chars-ascending")}</option>
        <option
          value="NUMBER_OF_CHARACTERS_DESCENDING"
        >{l("list.sort-mode.number-of-chars-descending")}</option>
      </select>
    </div>
  </section>;
};

export default NoteListControls;
