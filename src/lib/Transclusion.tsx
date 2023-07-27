import { ReactElement } from "react";
import { getFirstLines } from "./utils";
import { removeWikilinkPunctuation } from "./notes/noteUtils";

export const getTransclusionContentFromNoteContent = (
  noteContent: string,
): ReactElement => {
  const MAX_LINES = 6;

  const lines = noteContent.split("\n");
  let transclusionContent;

  if (lines.length <= MAX_LINES) {
    transclusionContent = noteContent;
  } else {
    transclusionContent = getFirstLines(noteContent, MAX_LINES) + "\n…";
  }

  return <p className="transclusion-note-content">
    {removeWikilinkPunctuation(transclusionContent)}
  </p>;
};
