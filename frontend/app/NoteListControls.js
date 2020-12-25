import React from "react";
import SearchInput from "./SearchInput.js";

const NoteListControls = ({
  value,
  onChange,
  sortMode,
  setSortMode,
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
          value="NUMBER_OF_LINKS_ASCENDING"
        >Number of links (ascending)</option>
        <option
          value="NUMBER_OF_LINKS_DESCENDING"
        >Number of links (descending)</option>
        <option
          value="HAS_FILES"
        >Notes with images/attachements</option>
      </select>
    </div>
  </section>;
};

export default NoteListControls;
