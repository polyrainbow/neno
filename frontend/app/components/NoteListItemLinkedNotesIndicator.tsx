import React from "react";
import Tooltip from "./Tooltip";
import { emojis } from "../lib/config.js";
import { getIconSrc } from "../lib/utils";
import { l } from "../lib/intl";


const NoteListItemLinkedNotesIndicator = ({
  isLinked,
  isActive,
  numberOfLinkedNotes,
  onLinkChange,
  isLinkable,
}) => {
  const linkControlLabel
    = (!isLinkable)
      ? l("list.item.links.linked-to-x-notes", { numberOfLinkedNotes })
      : isActive
        ? l("list.item.links.currently-selected")
        : isLinked
          ? l("list.item.links.unlink")
          : l("list.item.links.link");


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
                : <span title={l("list.item.links.not-linked")}
                  style={{
                    // style fix for
                    // https://stackoverflow.com/questions/70028281/emoji-font-displayed-in-web-pages-lose-color-when-bold
                    fontWeight: "normal",
                  }}
                >{emojis.unlinked}</span>
              : ""
          }
        </div>
      </div>
    </div>
  </Tooltip>;
};

export default NoteListItemLinkedNotesIndicator;
