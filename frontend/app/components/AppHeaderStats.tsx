import React from "react";
import Tooltip from "./Tooltip.js";
import { l } from "../lib/intl.js";
import GraphStats from "../../../lib/notes/interfaces/GraphStats.js";
import Icon from "./Icon.js";

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
    <div
      style={{
        "display": "flex",
        "alignItems": "center",
        "gap": "2px",
      }}
    ><Icon icon={icon} size={24} title={label}/> {value}</div>
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
        icon={"note"}
        label={l("stats.number-of-notes")}
        value={stats.numberOfAllNotes.toLocaleString()}
      />
      <AppHeaderStatsItem
        icon={"link"}
        label={l("stats.number-of-links")}
        value={stats.numberOfLinks.toLocaleString()}
      />
      <AppHeaderStatsItem
        icon={"link_off"}
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
