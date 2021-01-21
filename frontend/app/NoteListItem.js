import React from "react";
import { Tooltip } from "react-tippy";
import { yyyymmdd } from "./lib/utils.js";

const NoteListItem = ({
  note,
  isActive,
  isLinked,
  onSelect,
  onLinkChange,
}) => {
  const isHub = (
    typeof note.numberOfLinkedNotes === "number"
    && !isNaN(note.numberOfLinkedNotes)
    && note.numberOfLinkedNotes >= 5
  );

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

  const linkControlLabel
    = isActive
      ? "This is the currently selected note. It cannot be linked to itself."
      : isLinked
        ? "Remove link to this note"
        : "Add as link to selected note";


  return <div
    className={trClassList.join(" ")}
  >
    <div
      className="note-list-item-main"
      onClick={onSelect}
    >
      <div
        className="title"
      >
        {note.title}
      </div>
      <div className="note-list-item-second-row">
        <div
          className="info"
        >
          {yyyymmdd(new Date(note.updateTime))}
          {
            isHub
              ? " · 🐙 Hub"
              : ""
          }
        </div>
        <div
          className="note-features"
          style={{
            textAlign: "right",
          }}
        >
          {note.features?.containsText ? "✏️" : ""}
          {note.features?.containsWeblink ? "🌍" : ""}
          {note.features?.containsCode ? "🤖" : ""}
          {note.features?.containsImages ? "🖼️" : ""}
          {note.features?.containsAttachements ? "📎" : ""}
        </div>
      </div>
    </div>
    <Tooltip
      title={linkControlLabel}
      position="bottom"
      trigger="mouseenter focus"
      style={{
        display: "flex",
      }}
    >
      <div
        className="link-control"
        onClick={
          (e) => {
            (!isActive) && onLinkChange();
            e.stopPropagation();
          }
        }
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <img
            style={{ "verticalAlign": "bottom" }}
            src={
              "/assets/icons/" + (isLinked ? "link_off" : "link") + "-24px.svg"
            }
            alt={linkControlLabel}
            className="svg-icon"
          />
          <div
            className="linkedNotesIndicator"
          >
            {
              (
                typeof note.numberOfLinkedNotes === "number"
                && !isNaN(note.numberOfLinkedNotes)
              )
                ? note.numberOfLinkedNotes > 0
                  ? <span title={note.numberOfLinkedNotes + " Links"}>
                    {note.numberOfLinkedNotes}
                  </span>
                  : <span title="Not linked">🔴</span>
                : ""
            }
          </div>
        </div>
      </div>
    </Tooltip>
  </div>;
};

export default NoteListItem;
