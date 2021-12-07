import React from "react";
import SearchInput from "./SearchInput.js";
import IconButton from "./IconButton";

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  showSearchDialog,
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
        placeholder="Search notes..."
        value={value}
        onChange={onChange}
        inputStyle={{
          width: "250px",
        }}
      />
      <IconButton
        id="button_show_search dialog"
        title="Search presets"
        icon="saved_search"
        onClick={showSearchDialog}
      />
      <IconButton
        id="button_refresh-note-list"
        title="Refresh list"
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
        >Creation date (ascending)</option>
        <option
          value="CREATION_DATE_DESCENDING"
        >Creation date (descending)</option>
        <option
          value="UPDATE_DATE_ASCENDING"
        >Update date (ascending)</option>
        <option
          value="UPDATE_DATE_DESCENDING"
        >Update date (descending)</option>
        <option
          value="TITLE_ASCENDING"
        >Title (A-Z)</option>
        <option
          value="TITLE_DESCENDING"
        >Title (Z-A)</option>
        <option
          value="NUMBER_OF_LINKS_ASCENDING"
        >Number of links (ascending)</option>
        <option
          value="NUMBER_OF_LINKS_DESCENDING"
        >Number of links (descending)</option>
        <option
          value="NUMBER_OF_FILES_ASCENDING"
        >Number of files (ascending)</option>
        <option
          value="NUMBER_OF_FILES_DESCENDING"
        >Number of files (descending)</option>
        <option
          value="NUMBER_OF_CHARACTERS_ASCENDING"
        >Number of chars (ascending)</option>
        <option
          value="NUMBER_OF_CHARACTERS_DESCENDING"
        >Number of chars (descending)</option>
      </select>
    </div>
  </section>;
};

export default NoteListControls;
