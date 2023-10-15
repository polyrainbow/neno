import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import { getIconSrc, shortenText } from "../lib/utils";
import { getNoteTitle } from "../lib/notes/noteUtils";

interface NoteViewHeaderPinnedNoteProps {
  key: string,
  note: NoteToTransmit,
  isActive: boolean,
  onClick: any,
}

const NoteViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
}: NoteViewHeaderPinnedNoteProps) => {
  return <button
    className={"pinned-note " + (isActive ? "active" : "")}
    onClick={onClick}
  >
    <img
      src={getIconSrc("push_pin")}
      alt={"Pinned note"}
      width="24"
      height="24"
      className="svg-icon"
    />
    <p>{
      shortenText(
        getNoteTitle(note) || note.meta.slug,
        35,
      )
    }</p>
  </button>;
};


export default NoteViewHeaderPinnedNote;
