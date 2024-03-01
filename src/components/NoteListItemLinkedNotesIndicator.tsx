import { getIconSrc } from "../lib/utils";
import { l } from "../lib/intl";

interface NoteListItemLinkedNotesIndicatorProps {
  isActive: boolean,
  numberOfLinkedNotes: number | null,
  onLinkIndicatorClick?: () => void,
  isLinkable: boolean,
}


const NoteListItemLinkedNotesIndicator = ({
  isActive,
  numberOfLinkedNotes,
  onLinkIndicatorClick,
  isLinkable,
}: NoteListItemLinkedNotesIndicatorProps) => {
  const linkControlLabel
    = (!isLinkable) && typeof numberOfLinkedNotes === "number"
      ? l("list.item.links.linked-to-x-notes", {
        numberOfLinkedNotes: numberOfLinkedNotes.toString(),
      })
      : isActive
        ? l("list.item.links.currently-selected")
        : l("list.item.links.link");


  return <button
    className={
      "note-list-item-linked-notes-indicator "
      + (isLinkable ? "linkable" : "not-linkable")
    }
    onClick={(e) => {
      onLinkIndicatorClick?.();
      e.stopPropagation();
    }}
    title={linkControlLabel}
  >
    <div
      className="note-list-item-linked-notes-indicator-content"
    >
      <img
        src={getIconSrc("link")}
        alt={linkControlLabel}
        className="svg-icon"
      />
      {
        (
          typeof numberOfLinkedNotes === "number"
          && !isNaN(numberOfLinkedNotes)
        )
          ? <div
            className="linked-notes-indicator-number"
          >
            {
              numberOfLinkedNotes > 0
                ? <span>
                  {numberOfLinkedNotes}
                </span>
                : <div
                  title={l("list.item.links.not-linked")}
                  className="unlinked-note-indicator"
                />
            }
          </div>
          : ""
      }
    </div>
  </button>;
};

export default NoteListItemLinkedNotesIndicator;
