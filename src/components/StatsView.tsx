import { useState, useEffect } from "react";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";
import { l } from "../lib/intl";
import GraphStats from "../lib/notes/types/GraphStats";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useNotesProvider from "../hooks/useNotesProvider";
import BusyIndicator from "./BusyIndicator";
import NavigationRail from "./NavigationRail";

const StatsView = () => {
  const notesProvider = useNotesProvider();
  const [stats, setStats] = useState<Required<GraphStats> | null>(null);

  useEffect(() => {
    const updateStats = async () => {
      const stats = await notesProvider.getStats({
        includeMetadata: true,
        includeAnalysis: true,
      }) as Required<GraphStats>;
      setStats(stats);
    };

    updateStats();
  }, [notesProvider]);

  return <div className="view">
    <NavigationRail activeView="stats" />
    <HeaderContainerLeftRight />
    <section className="content-section">
      {
        stats !== null
          ? <StatsViewAnalysisTable
            stats={stats}
          />
          : <BusyIndicator
            alt={l("stats.fetching")}
          />
      }
    </section>
  </div>;
};

export default StatsView;
