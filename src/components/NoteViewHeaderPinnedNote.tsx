import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import {
  getAppPath,
  getIconSrc,
  getWikilinkForNote,
  handleSpaClick,
  shortenText,
} from "../lib/utils";
import { getNoteTitle } from "../lib/notes/noteUtils";
import { PathTemplate } from "../types/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";

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
  const href = getAppPath(PathTemplate.EXISTING_NOTE, new Map([
    ["GRAPH_ID", LOCAL_GRAPH_ID],
    ["SLUG", note.meta.slug],
  ]));

  return <a
    href={href}
    className={
      "with-icon pinned-note " + (isActive ? "active" : "")
    }
    onClick={(e) => handleSpaClick(e, onClick)}
    draggable
    onDragStart={(e) => {
      const wikilink = getWikilinkForNote(note.meta.slug, noteTitle);

      // Anchors auto-populate the drag with their URL and HTML; clear
      // first so only the wikilink is delivered to the editor.
      e.dataTransfer.clearData();

      // element can either be linked (in editor) or moved
      // (to different position in header pin list)
      e.dataTransfer.effectAllowed = "linkMove";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", wikilink);
      onDragStart();
    }}
    onDragEnd={(e) => onDragEnd(e.nativeEvent)}
    onDragOver={(e: React.DragEvent<HTMLAnchorElement>) => {
      e.dataTransfer.dropEffect = "move";
      onDragOver(e.nativeEvent);
      e.preventDefault(); // important to remove ghost return effect
    }}
  >
    <img
      src={getIconSrc("push_pin")}
      role="presentation"
      className="svg-icon"
      draggable={false}
    />
    <span>
      {
        shortenText(
          noteTitle || note.meta.slug,
          35,
        )
      }
    </span>
  </a>;
};


export default NoteViewHeaderPinnedNote;
