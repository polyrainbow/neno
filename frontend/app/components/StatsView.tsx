import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import { emojis } from "../config.js";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils.js";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";
import { l } from "../lib/intl";

const StatsView = ({
  databaseProvider,
  toggleAppMenu,
}) => {
  const [stats, setStats] = useState<any>(null);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  useEffect(() => {
    if (!databaseProvider) return;

    const updateStats = async () => {
      const stats = await databaseProvider.getStats({
        includeMetadata: true,
        includeAnalysis: true,
      });
      setStats(stats);
      setStatus("READY");
    };

    updateStats();
  }, [databaseProvider]);


  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section">
      <h1>{l("stats.graph-stats")}</h1>
      {
        status === "READY"
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
                  <td>{databaseProvider.constructor.type}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.creation-time")}</td>
                  <td>{makeTimestampHumanReadable(stats.creationTime)}</td>
                </tr>
                <tr>
                  <td>{l("stats.metadata.update-time")}</td>
                  <td>{makeTimestampHumanReadable(stats.updateTime)}</td>
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
