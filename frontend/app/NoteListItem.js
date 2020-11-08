import React from "react";
import { yyyymmdd } from "./lib/utils.js";

const NoteListItem = ({
  note,
  isActive,
  isLinked,
  index,
  showLinksIndicator,
  onClick,
  onAdd,
  onDelete,
}) => {
  const isHub = note.numberOfLinkedNotes >= 5;

  const trClassList = ["note-list-item"];
  if (isHub) {
    trClassList.push("hub");
  }
  if (isActive) {
    trClassList.push("active");
  }
  if (isLinked) {
    trClassList.push("linked");
  }

  return <tr
    className={trClassList.join(" ")}
    onClick={onClick}
  >
    <td
      className="index"
      style={{ "textAlign": "right" }}
    >
      {index}
    </td>
    <td
      className="title"
    >
      {note.title}
    </td>
    <td
      className="noteListItemControls"
    >
      {
        onAdd
          ? <img
            style={{ "verticalAlign": "bottom" }}
            src="/assets/icons/link-24px.svg"
            title="Add as link to current note"
            onClick={(e) => {
              onAdd();
              e.stopPropagation();
            }}
            alt="Add as link to current note"
          />
          : null
      }
      {
        onDelete
          ? <img
            style={{ "verticalAlign": "bottom" }}
            src="/assets/icons/link_off-24px.svg"
            title="Remove"
            onClick={(e) => {
              onDelete();
              e.stopPropagation();
            }}
            alt="Remove link"
          />
          : null
      }
    </td>
    {
      showLinksIndicator
        ? <td
          className="linkedNotesIndicator"
        >
          {
            note.numberOfLinkedNotes > 0
              ? <span title={note.numberOfLinkedNotes + " Links"}>
                {note.numberOfLinkedNotes}
              </span>
              : <span title="Not linked">🔴</span>
          }
        </td>
        : null
    }
    <td
      className="update-time"
    >
      {yyyymmdd(new Date(note.updateTime))}
    </td>
  </tr>;
};

export default NoteListItem;
