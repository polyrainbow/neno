import React from "react";
import { RunningText } from "../../../lib/subwaytext/interfaces/Block";
import NoteContentRunningText from "./NoteContentRunningText";

interface NoteContentBlockAudioProps {
  runningText: RunningText,
}


const NoteContentBlockParagraph = ({
  runningText,
}: NoteContentBlockAudioProps) => {
  return <p
    key={Math.random()}
    className="preview-block-paragraph"
  >
    <NoteContentRunningText runningText={runningText} />
  </p>;
};


export default NoteContentBlockParagraph;
