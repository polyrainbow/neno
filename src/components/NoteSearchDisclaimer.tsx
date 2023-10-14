import { l } from "../lib/intl";

interface NoteSearchDisclaimerProps {
  searchValue: string;
  numberOfResults: number;
  numberOfAllNotes?: number;
}

const NoteSearchDisclaimer = ({
  searchValue,
  numberOfResults,
  numberOfAllNotes,
}: NoteSearchDisclaimerProps) => {
  let label = "";
  if (numberOfResults) {
    if (
      typeof numberOfAllNotes === "number"
      && (numberOfResults === numberOfAllNotes)
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

  return <p className="note-search-disclaimer">{label}</p>;
};

export default NoteSearchDisclaimer;
