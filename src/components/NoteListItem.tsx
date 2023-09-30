import NoteListItemLinkedNotesIndicator
  from "./NoteListItemLinkedNotesIndicator";
import NoteListItemInfo from "./NoteListItemInfo";
import { l } from "../lib/intl";
import NoteListItemType from "../lib/notes/interfaces/NoteListItem";
import SparseNoteInfo from "../lib/notes/interfaces/SparseNoteInfo";

interface NoteListItemProps {
  key: string,
  note: NoteListItemType | SparseNoteInfo,
  isActive: boolean,
  isLinked: boolean,
  onSelect: any,
  onLinkIndicatorClick?: () => void,
  isLinkable: boolean,
}


const NoteListItem = ({
  note,
  isActive,
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
  trClassList.push(isLinkable ? "linkable" : "not-linkable");


  return <div
    className={trClassList.join(" ")}
  >
    <div
      className="note-list-item-main with-link-edge"
      onClick={onSelect}
    >
      <div
        className="title"
      >
        {note.title || l("list.untitled-note")}
      </div>
      <div className="note-list-item-second-row">
        {
          "linkCount" in note
            ? <>
              <NoteListItemInfo note={note} />
            </>
            : "/" + note.slug
        }
      </div>
    </div>
    <NoteListItemLinkedNotesIndicator
      isLinkable={isLinkable}
      isActive={isActive}
      numberOfLinkedNotes={"linkCount" in note ? note.linkCount.sum : null}
      onLinkIndicatorClick={onLinkIndicatorClick}
    />
  </div>;
};

export default NoteListItem;
