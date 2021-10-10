// this script is executed each time the popup is opened
/* global chrome */

import {
  getNoteBlocks,
  putNote,
  isAuthenticated,
} from "./utils.js";

const mainSection = document.getElementById("section_main");
const addPageButton = document.getElementById("button_addPage");
const serverStatusElement = document.getElementById("server-status");
const controlsContainer = document.getElementById("div_controls");
const noteTitleElement = document.getElementById("input_note-title");

const init = async ({
  apiKey,
  hostUrl,
  activeTab,
}) => {
  addPageButton
    .addEventListener("click", async () => {
      const noteTitle = noteTitleElement.value;

      const noteText
        = document.getElementById("textarea_note-text").value;

      const blocks = getNoteBlocks({
        noteTitle,
        url: activeTab.url,
        pageTitle: activeTab.title,
        noteText,
      });

      const result = await putNote({
        blocks,
        hostUrl,
        apiKey,
      });

      if (result.success) {
        controlsContainer.innerHTML = "Note added.";
      } else {
        serverStatusElement.innerHTML = "Error adding note: " + result.error;
      }
    });

  noteTitleElement.value = activeTab.title;

  const result = await isAuthenticated({
    hostUrl,
    apiKey,
  });

  if (result.success) {
    serverStatusElement.innerHTML
      = "Server ready. User: " + result.payload.dbId;
  } else {
    serverStatusElement.innerHTML
      = "Authentication error. Please check server and API key. Error: "
      + result.error;
    addPageButton.disabled = true;
  }

  if (activeTab.url.startsWith("chrome://")) {
    mainSection.innerHTML = "This page cannot be added as a note.";
  }

  mainSection.style.display = "block";
};


chrome.storage.sync.get(["apiKey", "hostUrl"], ({ apiKey, hostUrl }) => {
  chrome.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      const activeTab = tabs[0];
      init({ apiKey, hostUrl, activeTab });
    });
});

