import { useState, useEffect } from "react";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";
import { l } from "../lib/intl";
import GraphStats from "../lib/notes/types/GraphStats";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useNotesProvider from "../hooks/useNotesProvider";
import BusyIndicator from "./BusyIndicator";

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

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section">
      <h1>{l("stats.graph-stats")}</h1>
      {
        stats !== null
          ? <StatsViewAnalysisTable
            stats={stats}
          />
          : <BusyIndicator
            alt={l("stats.fetching")}
            height={64}
          />
      }
    </section>
  </>;
};

export default StatsView;
