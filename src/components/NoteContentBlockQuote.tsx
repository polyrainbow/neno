import { InlineText } from "../lib/subwaytext/interfaces/Block";
import NoteContentInlineText from "./NoteContentInlineText";

interface NoteContentBlockQuoteProps {
  runningText: InlineText,
}


const NoteContentBlockQuote = ({
  runningText,
}: NoteContentBlockQuoteProps) => {
  return <blockquote
    key={Math.random()}
    className="preview-block-quote"
  >
    <NoteContentInlineText runningText={runningText} />
  </blockquote>;
};


export default NoteContentBlockQuote;
