import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis } from "./lib/config";

const AppStatsItem = ({
  icon,
  label,
  value,
}) => {
  return <Tooltip
    title={label}
  >
    <span className="app-stats-item">{icon} {value}</span>
  </Tooltip>;
};


const AppStats = ({
  stats,
}) => {
  const showStats = !!stats;

  if (!showStats) {
    return <div id="app-stats">Loading stats ...</div>;
  }

  let percentageOfUnlinkedNotes:number = NaN;
  if (showStats && (stats.numberOfAllNotes > 0)) {
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
          `${stats.numberOfUnlinkedNotes.toLocaleString("en")}`
          + (
            percentageOfUnlinkedNotes
              ? ` (${percentageOfUnlinkedNotes.toLocaleString("en")} %)`
              : ""
          )
        }
      />
    </div>
  );
};

export default AppStats;
