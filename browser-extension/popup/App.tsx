import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Header from "./Header";
import StatusBar from "./StatusBar";
import {
  trimHostUrl,
} from "../utils";

export default () => {
  const [config, setConfig] = useState({
    apiKey: null,
    hostUrl: null,
  });
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [graphId, setGraphId] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get([
      "apiKey",
      "hostUrl",
    ], ({ apiKey, hostUrl }) => {
      const hostUrlTrimmed = trimHostUrl(hostUrl);

      setConfig({
        apiKey,
        hostUrl: hostUrlTrimmed,
      });
    });

    chrome.tabs.query({ active: true, currentWindow: true })
      .then((tabs) => {
        setActiveTab(tabs[0]);
      });
  }, []);

  return <>
    <Header />
    <Editor
      config={config}
      activeTab={activeTab}
      graphId={graphId}
    />
    <StatusBar
      config={config}
      setGraphId={setGraphId}
    />
  </>;
};
