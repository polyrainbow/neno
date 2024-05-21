import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import { getWikilinkForNote, shortenText } from "../lib/utils";
import { getNoteTitle } from "../lib/notes/noteUtils";
import HeaderButton from "./HeaderButton";

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
  const noteTitle = getNoteTitle(note.content);

  return <HeaderButton
    className={"pinned-note " + (isActive ? "active" : "")}
    onClick={() => onClick()}
    draggable
    onDragStart={(e) => {
      const wikilink = getWikilinkForNote(note.meta.slug, noteTitle);

      // element can either be linked (in editor) or moved
      // (to different position in header pin list)
      e.dataTransfer.effectAllowed = "linkMove";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", wikilink);
      onDragStart();
    }}
    onDragEnd={(e) => onDragEnd(e.nativeEvent)}
    onDragOver={(e: React.DragEvent<HTMLButtonElement>) => {
      e.dataTransfer.dropEffect = "move";
      onDragOver(e.nativeEvent);
      e.preventDefault(); // important to remove ghost return effect
    }}
    icon="push_pin"
  >
    {
      shortenText(
        noteTitle || note.meta.slug,
        35,
      )
    }
  </HeaderButton>;
};


export default NoteViewHeaderPinnedNote;
