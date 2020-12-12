import React from "react";

const NoteSearchDisclaimer = ({
  searchValue,
  notes,
  stats,
}) => {
  let label = "";
  if (notes) {
    if (
      typeof stats?.numberOfAllNotes === "number"
      && (notes.length === stats.numberOfAllNotes)
    ) {
      label = "";
    } else if (searchValue.length > 2) {
      label = notes.length + " note(s) found";
    }
  } else if (searchValue.length > 0 && searchValue.length < 3) {
    label = "";
  }

  if (label === "") {
    return null;
  }

  return <p style={{
    fontSize: "16px",
    textAlign: "center",
  }}>{label}</p>;
};

export default NoteSearchDisclaimer;
