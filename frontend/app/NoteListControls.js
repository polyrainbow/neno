import React from "react";
import SearchInput from "./SearchInput.js";

const NoteListControls = ({
  value,
  onChange,
  displayedNotes,
  stats,
  sortBy,
  setSortBy,
}) => {
  let label = "";
  if (displayedNotes) {
    if (
      typeof stats?.numberOfAllNotes === "number"
      && (displayedNotes.length === stats.numberOfAllNotes)
    ) {
      label = "Showing all " + stats.numberOfAllNotes + " note(s)";
    } else if (value.length > 2) {
      label = displayedNotes.length + " note(s) found";
    }
  } else if (value.length > 0 && value.length < 3) {
    label = "";
  }

  return <section id="section-search-input">
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <SearchInput
        label="Search notes"
        value={value}
        onChange={onChange}
      />
      <span style={{
        fontSize: "16px",
      }}>{label}</span>
    </div>
    <label
      htmlFor="sortBySelect"
      style={{
        margin: "0px 5px",
      }}
    >Sort by</label>
    <select
      id="sortBySelect"
      style={{
        fontSize: "24px",
        border: "none",
      }}
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
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
    </select>
  </section>;
};

export default NoteListControls;
