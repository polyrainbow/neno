import { l } from "../lib/intl";
import { getIconSrc } from "../lib/utils";
import BusyIndicator from "./BusyIndicator";

export enum NoteListStatus {
  DEFAULT = "DEFAULT",
  BUSY = "BUSY",
  NO_NOTES_FOUND = "NO_NOTES_FOUND",
}

interface NoteListStatusIndicatorProps {
  status: NoteListStatus;
}

const NoteListStatusIndicator = ({
  status,
}: NoteListStatusIndicatorProps) => {
  if (status === NoteListStatus.BUSY) {
    return <div
      className="splash-message"
    >
      <BusyIndicator alt={l("list.status.busy")} height={64} />
    </div>;
  }

  const map: Map<NoteListStatus, {
    label: string;
    icon: string;
  }> = new Map([
    [
      NoteListStatus.NO_NOTES_FOUND,
      {
        label: l("list.status.no-notes-found"),
        icon: "radio_button_unchecked",
      },
    ],
  ]);

  const activeState = map.get(status)!;

  return <div
    className="splash-message"
  >
    <img
      src={getIconSrc(activeState.icon)}
      alt={activeState.label}
      className="svg-icon"
    />
    <p>{activeState.label}</p>
  </div>;
};

export default NoteListStatusIndicator;
