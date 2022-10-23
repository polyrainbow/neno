import React, { useState, useEffect } from "react";
import { emojis } from "../config";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";
import { l } from "../lib/intl";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
// import AppMenu from "./AppMenu";
import useGraphId from "../hooks/useGraphId";
import useDatabaseProvider from "../hooks/useDatabaseProvider";

const StatsView = () => {
  const databaseProvider = useDatabaseProvider();
  const [stats, setStats] = useState<Required<GraphStats> | null>(null);
  const graphId = useGraphId();

  useEffect(() => {
    const updateStats = async () => {
      const stats = await databaseProvider.getStats(graphId, {
        includeMetadata: true,
        includeAnalysis: true,
      }) as Required<GraphStats>;
      setStats(stats);
    };

    updateStats();
  }, [databaseProvider]);

  if (!graphId) return null;

  // @ts-ignore calling constructor via instance
  const databaseType = databaseProvider.constructor.type;

  return <>
    <HeaderContainerLeftRight />
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
            <StatsViewAnalysisTable
              stats={stats}
              graphId={graphId}
            />
          </>
          : <p>{l("stats.fetching")}</p>
      }
    </section>
    {/* <AppMenu
      onClose={() => setIsAppMenuOpen(false)}
      databaseProvider={databaseProvider}
      createOneNotePerLine={createOneNotePerLine}
      switchGraphs={switchGraphs}
      createNewNote={createNewNote}
      graphId={activeGraphId}
    /> */}
  </>;
};

export default StatsView;
