import { useState, useEffect } from "react";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";
import { l } from "../lib/intl";
import GraphStats from "../lib/notes/interfaces/GraphStats";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useNotesProvider from "../hooks/useNotesProvider";
import BusyIndicator from "./BusyIndicator";
import StatsViewMetadataTable from "./StatsViewMetadataTable";

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

  // @ts-ignore calling constructor via instance
  const databaseType = notesProvider.constructor.type;

  return <>
    <HeaderContainerLeftRight />
    <section className="content-section">
      <h1>{l("stats.graph-stats")}</h1>
      {
        stats !== null
          ? <>
            <h2>{l("stats.metadata")}</h2>
            <StatsViewMetadataTable
              stats={stats}
              databaseType={databaseType}
            />
            <h2>{l("stats.analysis")}</h2>
            <StatsViewAnalysisTable
              stats={stats}
            />
          </>
          : <BusyIndicator
            alt={l("stats.fetching")}
            height={64}
          />
      }
    </section>
  </>;
};

export default StatsView;
