import React, { useEffect, useState } from "react";
import {
  isAuthenticated,
} from "../utils";

const StatusBar = ({ apiKey, hostUrl, setGraphId }) => {
  const [statusMessage, setStatusMessage] = useState("Verifying server ...");
  const [statusColor, setStatusColor] = useState("");

  useEffect(() => {
    const updateStatusBar = async () => {
      if (
        (typeof hostUrl !== "string")
        || (hostUrl.length === 0)
        || (typeof apiKey !== "string")
        || (apiKey.length === 0)
      ) {
        setStatusMessage(
          "Invalid credentials: Please check server hostname and API key.",
        );
        setStatusColor("#ff4c4c");
        return;
      }

      const result = await isAuthenticated(hostUrl, apiKey);

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
      }
    };

    updateStatusBar();
  }, [hostUrl, apiKey]);

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
