import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Header from "./Header";
import StatusBar from "./StatusBar";
import {
  trimHostUrl,
} from "../utils";

let didInit = false;

const App = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hostUrl, setHostUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [graphId, setGraphId] = useState(null);

  useEffect(() => {
    // https://beta.reactjs.org/learn/you-might-not-need-an-effect#initializing-the-application
    if (!didInit) {
      didInit = true;

      chrome.storage.sync.get(
        [
          "apiKey",
          "hostUrl",
        ],
        ({ apiKey: apiKeyFromStorage, hostUrl: hostUrlFromStorage }) => {
          const hostUrlFromStorageTrimmed
            = trimHostUrl(hostUrlFromStorage || "");
          setApiKey(apiKeyFromStorage || "");
          setHostUrl(hostUrlFromStorageTrimmed);
        },
      );

      chrome.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
          setActiveTab(tabs[0]);
        });
    }
  }, []);

  return <>
    <Header
      hostUrl={hostUrl}
    />
    {
      apiKey && hostUrl && activeTab && graphId
        ? <Editor
          apiKey={apiKey}
          hostUrl={hostUrl}
          activeTab={activeTab}
          graphId={graphId}
        />
        : <main><p>Loading...</p></main>
    }
    <StatusBar
      apiKey={apiKey}
      hostUrl={hostUrl}
      setGraphId={setGraphId}
    />
  </>;
};

export default App;
