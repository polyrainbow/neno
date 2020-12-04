import React from "react";
import { Tooltip } from "react-tippy";

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
  const showStats = stats !== null;

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
        icon="📝"
        label="Number of notes"
        value={stats.numberOfAllNotes}
      />
      <AppStatsItem
        icon="🔗"
        label="Number of links"
        value={stats.numberOfLinks}
      />
      <AppStatsItem
        icon="🔴"
        label="Unlinked notes"
        value={
          `${stats.numberOfUnlinkedNotes} `
          + `(${percentageOfUnlinkedNotes} %)`
        }
      />
    </div>
  );
};

export default AppStats;
