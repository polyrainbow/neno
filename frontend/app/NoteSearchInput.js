import React from "react";


const NoteSearchInput = ({
  value,
  onChange,
}) => {
  return <section id="search-input">
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
  </section>;
};

export default NoteSearchInput;
