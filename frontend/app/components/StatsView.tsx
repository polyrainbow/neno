import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import { emojis } from "../config";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";

interface StatsViewProps {
  databaseProvider: DatabaseProvider,
  toggleAppMenu: () => void,
}

const StatsView = ({
  databaseProvider,
  toggleAppMenu,
}: StatsViewProps) => {
  const [stats, setStats] = useState<Required<GraphStats> | null>(null);

  useEffect(() => {
    if (!databaseProvider) return;

    const updateStats = async () => {
      const stats = await databaseProvider.getStats({
        includeMetadata: true,
        includeAnalysis: true,
      }) as Required<GraphStats>;
      setStats(stats);
    };

    updateStats();
  }, [databaseProvider]);

  // @ts-ignore calling constructor via instance
  const databaseType = databaseProvider.constructor.type;

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section">
      <h1>{l("stats.graph-stats")}</h1>
      {
        stats !== null
          ? <>
            <h2>{l("stats.metadata")}</h2>
            <table className="data-table stats-table">
              <tbody>
                <tr>
                  <td>{l("stats.metadata.id")}</td>
                  <td>{stats.id}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.type")}</td>
                  <td>{databaseType}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.created-at")}</td>
                  <td>{makeTimestampHumanReadable(stats.createdAt)}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.updated-at")}</td>
                  <td>{makeTimestampHumanReadable(stats.updatedAt)}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.graph-size-without-files")}</td>
                  <td>{humanFileSize(stats.size.graph)}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.size-of-all-files")}</td>
                  <td>{humanFileSize(stats.size.files)}</td>
                </tr>
                <tr>
                  <td>
                    {emojis.document}{emojis.image}{emojis.audio}{emojis.video}
                    <span> </span>{l("stats.metadata.number-of-files")}
                  </td>
                  <td>{stats.numberOfFiles.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{emojis.pin} {l("stats.metadata.pins")}</td>
                  <td>{stats.numberOfPins.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <h2>{l("stats.analysis")}</h2>
            <StatsViewAnalysisTable stats={stats} />
          </>
          : <p>{l("stats.fetching")}</p>
      }
    </section>
  </>;
};

export default StatsView;
