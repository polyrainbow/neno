import React from "react";
import { l } from "../lib/intl";

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
      label = l(
        numberOfResults === 1
          ? "list.search.x-note-found"
          : "list.search.x-notes-found",
        { number: numberOfResults.toLocaleString() },
      );
    }
  } else if (searchValue.length > 0 && searchValue.length < 3) {
    label = "";
  }

  if (label === "") {
    return null;
  }

  return <p style={{
    fontSize: "16px",
    marginTop: "0",
    textAlign: "center",
  }}>{label}</p>;
};

export default NoteSearchDisclaimer;
