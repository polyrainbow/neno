import React, { useEffect, useState } from "react";

export default () => {
  const [hostUrl, setHostUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["apiKey", "hostUrl"], ({ apiKey, hostUrl }) => {
      setHostUrl(hostUrl);
      setApiKey(apiKey);
    });
  }, []);

  return <div>
    <h1>NENO Browser Extension Options</h1>
    <h2>Host URL</h2>
    <input
      type="text"
      id="input_host-url"
      value={hostUrl}
      onInput={(e) => {
        const newHostUrl = (e.target as HTMLInputElement).value.trim();
        setHostUrl(newHostUrl);
        chrome.storage.sync.set({ hostUrl: newHostUrl });
      }}
    />
    <h2>API Key</h2>
    <input
      type="text"
      id="input_api-key"
      value={apiKey}
      onInput={(e) => {
        const newApiKey = (e.target as HTMLInputElement).value.trim();
        setApiKey(newApiKey);
        chrome.storage.sync.set({ apiKey: newApiKey });
      }}
    />
  </div>;
}
