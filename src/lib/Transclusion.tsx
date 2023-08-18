import { ReactElement } from "react";
import { getLines } from "./utils";
import { removeWikilinkPunctuation } from "./notes/noteUtils";

const getSummary = (
  noteContent: string,
  noteTitle: string,
): string => {
  const MAX_LINES = 5;

  const nonEmptyLines = noteContent
    .split("\n")
    .filter((line) => line.trim().length > 0);

  let transclusionContent;

  const noteContentContainsTitle = removeWikilinkPunctuation(nonEmptyLines[0])
    .includes(noteTitle);

  if (nonEmptyLines.length <= MAX_LINES) {
    transclusionContent = noteContentContainsTitle
      ? nonEmptyLines.slice(1).join("\n")
      : nonEmptyLines.join("\n");
  } else {
    transclusionContent = getLines(
      noteContent,
      noteContentContainsTitle ? 1 : 0,
      MAX_LINES,
      true,
    ) + "\n…";
  }

  return removeWikilinkPunctuation(transclusionContent);
};


export const getNoteTransclusionContent = (
  noteContent: string,
  noteTitle: string,
): ReactElement => {
  const summary = getSummary(noteContent, noteTitle);

  return <p className="transclusion-note-content">
    <span className="transclusion-note-title">{noteTitle}</span>
    {summary}
  </p>;
};

export const exportedForTesting = {
  getSummary,
};

