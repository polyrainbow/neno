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
      const text = numberOfResults === 1
        ? "{number} note found"
        : "{number} notes found";
      label = text.replace("{number}", numberOfResults.toLocaleString("en"));
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
