import React from "react";
import { Tooltip } from "react-tippy";
import { emojis } from "./lib/config.js";

const AppStatsItem = ({
  icon,
  label,
  value,
}) => {
  return <Tooltip
    title={label}
    position="bottom"
    trigger="mouseenter focus"
  >
    <span className="app-stats-item">{icon} {value}</span>
  </Tooltip>;
};


const AppStats = ({
  stats,
}) => {
  const showStats = !!stats;

  if (!showStats) {
    return "Loading stats ...";
  }

  let percentageOfUnlinkedNotes = null;
  if (showStats) {
    percentageOfUnlinkedNotes = Math.round(
      (stats.numberOfUnlinkedNotes / stats.numberOfAllNotes) * 100 * 100,
    ) / 100;
  }

  return (
    <div id="app-stats">
      <AppStatsItem
        icon={emojis.note}
        label="Number of notes"
        value={stats.numberOfAllNotes.toLocaleString("en")}
      />
      <AppStatsItem
        icon={emojis.link}
        label="Number of links"
        value={stats.numberOfLinks.toLocaleString("en")}
      />
      <AppStatsItem
        icon={emojis.unlinked}
        label="Unlinked notes"
        value={
          `${stats.numberOfUnlinkedNotes.toLocaleString("en")} `
          + `(${percentageOfUnlinkedNotes.toLocaleString("en")} %)`
        }
      />
    </div>
  );
};

export default AppStats;
