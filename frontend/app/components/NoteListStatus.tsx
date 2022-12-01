import React from "react";
import { l } from "../lib/intl";
import { getIconSrc } from "../lib/utils";
import BusyIndicator from "./BusyIndicator";

const NoteListStatus = ({
  status,
}) => {
  const map = {
    SEARCH_VALUE_TOO_SHORT: {
      label: l("list.status.too-short"),
      icon: "looks_3",
    },
    NO_NOTES_FOUND: {
      label: l("list.status.no-notes-found"),
      icon: "radio_button_unchecked",
    },
  };

  const activeState = map[status];

  return <div
    className="splash-message"
  >
    {
      status === "BUSY"
        ? <BusyIndicator alt={l("list.status.busy")} height={64} />
        : <>
          <img
            src={getIconSrc(activeState.icon)}
            alt={activeState.label}
            className="svg-icon"
          />
          <p>{activeState.label}</p>
        </>
    }

  </div>;
};

export default NoteListStatus;
