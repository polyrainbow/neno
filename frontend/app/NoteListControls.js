import React from "react";
import SearchInput from "./SearchInput.js";
import IconButton from "./IconButton.js";

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
  showNotesWithDuplicateURLs,
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
          width: "200px",
        }}
      />
      <IconButton
        id="button_show_notes_with_duplicate_urls"
        title="Show notes with same URLs"
        icon="view_agenda"
        onClick={showNotesWithDuplicateURLs}
      />
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <label
        htmlFor="sortModeSelect"
        style={{
          margin: "0px 5px",
        }}
      >Sort by</label>
      <select
        id="sortModeSelect"
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value)}
        style={{
          width: "320px",
        }}
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
          value="HAS_FILES"
        >Notes with images/files</option>
        <option
          value="NUMBER_OF_CHARACTERS_DESCENDING"
        >Number of chars (descending)</option>
      </select>
    </div>
  </section>;
};

export default NoteListControls;
