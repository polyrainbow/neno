import React from "react";
import Tooltip from "./Tooltip";
import { emojis } from "./lib/config.js";
import { getIconSrc } from "./lib/utils";


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
      onClick={(e) => {
        if (isLinkable && (!isActive)) {
          onLinkChange();
          e.stopPropagation();
        }
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <img
          style={{ "verticalAlign": "bottom" }}
          src={
            getIconSrc(isLinked ? "link_off" : "link")
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
