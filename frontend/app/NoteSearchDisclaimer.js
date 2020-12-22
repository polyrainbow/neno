import React from "react";

const NoteSearchDisclaimer = ({
  searchValue,
  numberOfResults,
  stats,
}) => {
  let label = "";
  if (numberOfResults) {
    if (
      typeof stats?.numberOfAllNotes === "number"
      && (numberOfResults === stats.numberOfAllNotes)
    ) {
      label = "";
    } else if (searchValue.length > 2) {
      label = numberOfResults + " note(s) found";
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
