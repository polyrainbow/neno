import React from "react";


const NoteSearchInput = ({
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
      <button
        className="icon-button"
        title="Clear search"
        onClick={() => onChange("")}
        disabled={value.length === 0}
      >
        <img
          src={
            value.length > 0
              ? "/assets/icons/cancel-24px.svg"
              : "/assets/icons/cancel-24px_disabled.svg"
          }
          alt="Clear search"
        />
      </button>
      <span style={{
        fontSize: "16px",
      }}>{label}</span>
    </div>
    <select
      style={{
        fontSize: "24px",
        border: "none",
      }}
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option
        value="UPDATE_DATE_ASCENDING"
      >Sort by update date (ascending)</option>
      <option
        value="UPDATE_DATE_DESCENDING"
      >Sort by update date (descending)</option>
      <option
        value="NUMBER_OF_LINKS_ASCENDING"
      >Sort by number of links (ascending)</option>
      <option
        value="NUMBER_OF_LINKS_DESCENDING"
      >Sort by number of links (descending)</option>
    </select>
  </section>;
};

export default NoteSearchInput;
