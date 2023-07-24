import { InlineText } from "../lib/subwaytext/interfaces/Block";
import NoteContentInlineText from "./NoteContentInlineText";

interface NoteContentBlockParagraphProps {
  runningText: InlineText,
}


const NoteContentBlockParagraph = ({
  runningText,
}: NoteContentBlockParagraphProps) => {
  return <p
    key={Math.random()}
    className="preview-block-paragraph"
  >
    <NoteContentInlineText runningText={runningText} />
  </p>;
};


export default NoteContentBlockParagraph;
