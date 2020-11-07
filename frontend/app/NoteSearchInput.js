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
    } else {
      label = "Please type at least 3 characters to search";
    }
  }

  return <section id="search-input">
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        style={{
          "border": "none",
          "fontSize": "24px",
        }}
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
        title="Cancel search"
        onClick={() => onChange("")}
      >
        <img
          src="/assets/icons/cancel-24px.svg"
        />
      </button>
    </div>
    <span style={{
      fontSize: "16px",
      fontFamily: "sans-serif",
    }}>{label}</span>
  </section>;
};

export default NoteSearchInput;
