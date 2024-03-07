import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import { getIconSrc, shortenText } from "../lib/utils";
import { getNoteTitle } from "../lib/notes/noteUtils";

interface NoteViewHeaderPinnedNoteProps {
  key: string,
  note: NoteToTransmit,
  isActive: boolean,
  onClick: () => void,
  onDragStart: () => void,
  onDragEnd: (e: DragEvent) => void,
  onDragOver: (e: DragEvent) => void,
}

const NoteViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
}: NoteViewHeaderPinnedNoteProps) => {
  return <button
    className={"pinned-note " + (isActive ? "active" : "")}
    onClick={() => onClick()}
    draggable
    onDragStart={(e) => {
      // element can either be linked (in editor) or moved
      // (to different position in header pin list)
      e.dataTransfer.effectAllowed = "linkMove";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", "[[" + note.meta.slug + "]]");
      onDragStart();
    }}
    onDragEnd={(e) => onDragEnd(e.nativeEvent)}
    onDragOver={(e: React.DragEvent<HTMLButtonElement>) => {
      e.dataTransfer.dropEffect = "move";
      onDragOver(e.nativeEvent);
      e.preventDefault(); // important to remove ghost return effect
    }}
  >
    <img
      src={getIconSrc("push_pin")}
      alt={"Pinned note"}
      width="24"
      height="24"
      className="svg-icon"
      draggable={false}
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
