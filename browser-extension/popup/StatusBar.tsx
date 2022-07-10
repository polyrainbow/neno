import React, { useEffect, useState } from "react";
import {
  isAuthenticated,
} from "../utils";

const StatusBar = ({ config, setGraphId }) => {
  const [statusMessage, setStatusMessage] = useState("Verifying server ...");
  const [statusColor, setStatusColor] = useState("");

  useEffect(() => {
    const updateStatusBar = async () => {
      if (
        (typeof config.hostUrl !== "string")
        || (config.hostUrl.length === 0)
        || (typeof config.apiKey !== "string")
        || (config.apiKey.length === 0)
      ) {
        return;
      }

      const result = await isAuthenticated(config);

      if (result.success) {
        setStatusMessage(
          "Server ready. Graph ID: " + result.payload.graphIds[0],
        );
        setGraphId(result.payload.graphIds[0]);
        setStatusColor("#40c940");
      } else {
        setStatusMessage(
          "Authentication error. Please check server and API key. Error: "
          + result.error,
        );
        setStatusColor("#ff4c4c");
        // TODO: pushNoteButton.disabled = true;
      }
    };

    updateStatusBar();
  }, [config.hostUrl, config.apiKey]);

  return <footer
    style={{
      "margin": "0",
      "backgroundColor": statusColor,
    }}
  >
    <p id="server-status">{statusMessage}</p>
  </footer>;
};

export default StatusBar;
