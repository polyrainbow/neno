import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis, ICON_PATH } from "./lib/config.js";


const NoteListItemLinkedNotesIndicator = ({
  isLinked,
  isActive,
  numberOfLinkedNotes,
  onLinkChange,
  isLinkable,
}) => {
  const linkControlLabel
    = (!isLinkable)
      ? `This note is linked to ${numberOfLinkedNotes} other note(s).`
      : isActive
        ? "This is the currently selected note. It cannot be linked to itself."
        : isLinked
          ? "Remove link to this note"
          : "Add as link to selected note";


  return <Tooltip
    title={linkControlLabel}
  >
    <div
      className={"link-control " + (isLinkable ? "linkable" : "not-linkable")}
      onClick={
        isLinkable && (!isActive)
          ? (e) => {
            onLinkChange();
            e.stopPropagation();
          }
          : null
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
            ICON_PATH + (isLinked ? "link_off" : "link") + "-24px.svg"
          }
          alt={linkControlLabel}
          className="svg-icon"
        />
        <div
          className="linkedNotesIndicatorNumber"
        >
          {
            (
              typeof numberOfLinkedNotes === "number"
              && !isNaN(numberOfLinkedNotes)
            )
              ? numberOfLinkedNotes > 0
                ? <span title={numberOfLinkedNotes + " Links"}>
                  {numberOfLinkedNotes}
                </span>
                : <span title="Not linked">{emojis.unlinked}</span>
              : ""
          }
        </div>
      </div>
    </div>
  </Tooltip>;
};

export default NoteListItemLinkedNotesIndicator;
