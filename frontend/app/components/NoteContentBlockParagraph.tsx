import React from "react";
import { RunningText } from "../../../lib/subwaytext/interfaces/Block";
import NoteContentRunningText from "./NoteContentRunningText";

interface NoteContentBlockParagraphProps {
  runningText: RunningText,
}


const NoteContentBlockParagraph = ({
  runningText,
}: NoteContentBlockParagraphProps) => {
  return <p
    key={Math.random()}
    className="preview-block-paragraph"
  >
    <NoteContentRunningText runningText={runningText} />
  </p>;
};


export default NoteContentBlockParagraph;
