import React from "react";
import { RunningText } from "../../../lib/subwaytext/interfaces/Block";
import NoteContentRunningText from "./NoteContentRunningText";

interface NoteContentBlockQuoteProps {
  runningText: RunningText,
}


const NoteContentBlockQuote = ({
  runningText,
}: NoteContentBlockQuoteProps) => {
  return <blockquote
    key={Math.random()}
    className="preview-block-quote"
  >
    <NoteContentRunningText runningText={runningText} />
  </blockquote>;
};


export default NoteContentBlockQuote;
