import NoteListItemLinkedNotesIndicator
  from "./NoteListItemLinkedNotesIndicator";
import NoteListItemInfo from "./NoteListItemInfo";
import { l } from "../lib/intl";
import NoteListItemType from "../lib/notes/types/NoteListItem";
import SparseNoteInfo from "../lib/notes/types/SparseNoteInfo";

interface NoteListItemProps {
  key: string,
  note: NoteListItemType | SparseNoteInfo,
  isActive: boolean,
  isLinked: boolean,
  onSelect: () => void,
  onLinkIndicatorClick?: () => void,
  isLinkable: boolean,
  isSelected: boolean,
}


const NoteListItem = ({
  note,
  isActive,
  isSelected,
  isLinked,
  onSelect,
  onLinkIndicatorClick,
  isLinkable,
}: NoteListItemProps) => {
  const trClassList = ["note-list-item"];
  if (isActive) {
    trClassList.push("active");
  }
  if (isLinked) {
    trClassList.push("linked");
  }
  if (isSelected) {
    trClassList.push("selected");
  }
  trClassList.push(isLinkable ? "linkable" : "not-linkable");


  return <div
    className={trClassList.join(" ")}
  >
    <button
      className="note-list-item-main with-link-edge"
      onClick={() => onSelect()}
    >
      <div
        className="title"
      >
        {note.title || l("list.untitled-note")}
      </div>
      <NoteListItemInfo note={note} />
    </button>
    <NoteListItemLinkedNotesIndicator
      isLinkable={isLinkable}
      isActive={isActive}
      numberOfLinkedNotes={"linkCount" in note ? note.linkCount.sum : null}
      onLinkIndicatorClick={onLinkIndicatorClick}
    />
  </div>;
};

export default NoteListItem;
