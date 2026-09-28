import { l } from "../lib/intl";
import GraphStats from "../lib/notes/types/GraphStats";
import AppHeaderStatsItem from "./AppHeaderStatsItem";

interface AppHeaderStatsProps {
  stats: GraphStats,
}


const AppHeaderStats = ({
  stats,
}: AppHeaderStatsProps) => {
  return (
    <div className="header-stats">
      <AppHeaderStatsItem
        icon={"note"}
        label={l("stats.number-of-notes")}
        value={stats.numberOfAllNotes.toLocaleString()}
      />
    </div>
  );
};

export default AppHeaderStats;
