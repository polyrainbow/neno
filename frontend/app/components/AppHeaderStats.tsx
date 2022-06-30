import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis } from "../config";
import { l } from "../lib/intl.js";
import GraphStats from "../../../lib/notes/interfaces/GraphStats.js";

interface AppHeaderStatsItemProps {
  icon: string,
  label: string,
  value: string,
}

const AppHeaderStatsItem = ({
  icon,
  label,
  value,
}: AppHeaderStatsItemProps) => {
  return <Tooltip
    title={label}
  >
    <span className="app-stats-item">{icon} {value}</span>
  </Tooltip>;
};


interface AppHeaderStatsProps {
  stats: GraphStats,
}


const AppHeaderStats = ({
  stats,
}: AppHeaderStatsProps) => {
  const showStats = !!stats;

  if (!showStats) {
    return <div id="app-stats">{l("stats.loading-stats")}</div>;
  }

  let percentageOfUnlinkedNotes = NaN;
  if (showStats && (stats.numberOfAllNotes > 0)) {
    percentageOfUnlinkedNotes = Math.round(
      (stats.numberOfUnlinkedNotes / stats.numberOfAllNotes) * 100 * 100,
    ) / 100;
  }

  return (
    <div id="app-stats">
      <AppHeaderStatsItem
        icon={emojis.note}
        label={l("stats.number-of-notes")}
        value={stats.numberOfAllNotes.toLocaleString()}
      />
      <AppHeaderStatsItem
        icon={emojis.link}
        label={l("stats.number-of-links")}
        value={stats.numberOfLinks.toLocaleString()}
      />
      <AppHeaderStatsItem
        icon={emojis.unlinked}
        label={l("stats.unlinked-notes")}
        value={
          `${stats.numberOfUnlinkedNotes.toLocaleString()}`
          + (
            percentageOfUnlinkedNotes
              ? ` (${percentageOfUnlinkedNotes.toLocaleString()} %)`
              : ""
          )
        }
      />
    </div>
  );
};

export default AppHeaderStats;
