/* eslint-disable */

const inputHostUrl = document.getElementById("input_host-url");
const inputApiKey = document.getElementById("input_api-key");

chrome.storage.sync.get(["apiKey", "hostUrl"], ({ apiKey, hostUrl }) => {
  inputHostUrl.value = hostUrl;
  inputApiKey.value = apiKey;
});

inputHostUrl.addEventListener("input", (e) => {
  const hostUrl = e.target.value;
  chrome.storage.sync.set({ hostUrl });
  console.log("NENO host url updated");
});

inputApiKey.addEventListener("input", (e) => {
  const apiKey = e.target.value;
  chrome.storage.sync.set({ apiKey });
  console.log("NENO API token updated");
});