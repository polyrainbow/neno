import React from "react";
import { yyyymmdd } from "./lib/utils.js";

const NoteListItem = ({
  note,
  isActive,
  index,
  showLinksIndicator,
  onClick,
}) => {
  const isHub = note.numberOfLinkedNotes >= 5;

  const trClassList = [];
  if (isHub) {
    trClassList.push("hub");
  }
  if (isActive) {
    trClassList.push("active");
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
      {note.title || (note.editorData && note.editorData.blocks[0].data.text)}
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
        : ""
    }
    <td
      className="update-time"
    >
      {yyyymmdd(new Date(note.updateTime))}
    </td>
  </tr>;
};

export default NoteListItem;
