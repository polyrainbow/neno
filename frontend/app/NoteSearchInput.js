import React from "react";


const NoteSearchInput = ({
  value,
  onChange,
  displayedNotes,
  allNotes,
}) => {
  let label = "";
  if (displayedNotes) {
    if (allNotes && (displayedNotes.length === allNotes.length)) {
      label = "Showing all " + allNotes.length + " note(s)";
    } else if (value.length > 2) {
      label = displayedNotes.length + " note(s) found";
    }
  } else if (value.length > 0 && value.length < 3) {
    label = "Please type at least 3 characters to search";
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
      >
        <img
          src="/assets/icons/cancel-24px.svg"
          alt="Clear search"
        />
      </button>
    </div>
    <span style={{
      fontSize: "16px",
    }}>{label}</span>
  </section>;
};

export default NoteSearchInput;
