import React from "react";
import IconButton from "./IconButton.js";

const NoteListControls = ({
  value,
  onChange,
  displayedNotes,
  allNotes,
  sortBy,
  setSortBy,
}) => {
  let label = "";
  if (displayedNotes) {
    if (allNotes && (displayedNotes.length === allNotes.length)) {
      label = "Showing all " + allNotes.length + " note(s)";
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
      <label
        htmlFor="search-input"
        style={{
          marginRight: "5px",
        }}
      >Search notes</label>
      <input
        style={{
          "border": "none",
          "fontSize": "24px",
        }}
        id="search-input"
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => {onChange(e.target.value);}}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
          }
        }}
      />
      <IconButton
        title="Clear search"
        icon={
          value.length > 0
            ? "cancel"
            : "cancel_disabled"
        }
        onClick={() => onChange("")}
        disabled={value.length === 0}
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
