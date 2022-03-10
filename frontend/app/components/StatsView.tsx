import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import { emojis } from "../lib/config.js";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils.js";
import StatsViewAnalysisTable from "./StatsViewAnalysisTable";

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
      <h1>Graph Stats</h1>
      {
        status === "READY"
          ? <>
            <h2>Metadata</h2>
            <table className="data-table stats-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{stats.id}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{databaseProvider.constructor.type}</td>
                </tr>
                <tr>
                  <td>Creation time</td>
                  <td>{makeTimestampHumanReadable(stats.creationTime)}</td>
                </tr>
                <tr>
                  <td>Update time</td>
                  <td>{makeTimestampHumanReadable(stats.updateTime)}</td>
                </tr>
                <tr>
                  <td>Size of graph (without files)</td>
                  <td>{humanFileSize(stats.size.graph)}</td>
                </tr>
                <tr>
                  <td>Size of all files</td>
                  <td>{humanFileSize(stats.size.files)}</td>
                </tr>
                <tr>
                  <td>
                    {emojis.document}{emojis.image}{emojis.audio}{emojis.video}
                    <span> </span>Number of files
                  </td>
                  <td>{stats.numberOfFiles.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{emojis.pin} Pins</td>
                  <td>{stats.numberOfPins.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <h2>Analysis</h2>
            <StatsViewAnalysisTable stats={stats} />
          </>
          : <p>Fetching stats...</p>
      }
    </section>
  </>;
};

export default StatsView;
