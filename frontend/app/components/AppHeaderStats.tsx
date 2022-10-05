import React from "react";
import { l } from "../lib/intl";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import AppHeaderStatsItem from "./AppHeaderStatsItem";
import BusyIndicator from "./BusyIndicator";

interface AppHeaderStatsProps {
  stats: GraphStats,
}


const AppHeaderStats = ({
  stats,
}: AppHeaderStatsProps) => {
  const showStats = !!stats;

  if (!showStats) {
    return <div className="header-stats">
      <BusyIndicator
        alt={l("stats.loading-stats")}
        height={20}
      />
    </div>;
  }

  let percentageOfUnlinkedNotes = NaN;
  if (showStats && (stats.numberOfAllNotes > 0)) {
    percentageOfUnlinkedNotes = Math.round(
      (stats.numberOfUnlinkedNotes / stats.numberOfAllNotes) * 100 * 100,
    ) / 100;
  }

  return (
    <div className="header-stats">
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
