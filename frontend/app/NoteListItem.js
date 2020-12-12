import React from "react";
import { yyyymmdd } from "./lib/utils.js";
import NoteListItemButton from "./NoteListItemButton.js";

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
    {
      note.features
        ? <td
          className="note-features"
          style={{
            width: "45px",
            textAlign: "right",
          }}
        >
          {note.features.containsText ? "✏️" : ""}
          {note.features.containsWeblink ? "🌍" : ""}
          {note.features.containsCode ? "🤖" : ""}
          {note.features.containsImages ? "🖼️" : ""}
          {note.features.containsAttachements ? "📎" : ""}
        </td>
        : null
    }
    <td
      className="noteListItemControls"
    >
      {
        onAdd
          ? <NoteListItemButton
            icon="link"
            title="Add as link to current note"
            onClick={onAdd}
          />
          : null
      }
      {
        onDelete
          ? <NoteListItemButton
            icon="link_off"
            title="Remove link to this note"
            onClick={onDelete}
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
