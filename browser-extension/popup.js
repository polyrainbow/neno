// this script is executed each time the popup is opened
/* global chrome */

import {
  getNoteBlocks,
  putNote,
  isAuthenticated,
  getExistingNotesWithThisUrl,
  trimHostUrl,
} from "./utils.js";

const forbiddenUrlStartStrings = [
  "chrome://",
  "about:",
  "chrome-extension://",
];

const mainSection = document.getElementById("section_main");
const pushNoteButton = document.getElementById("button_pushNote");
const serverStatusElement = document.getElementById("server-status");
const noteTitleElement = document.getElementById("input_note-title");
const statusBar = document.getElementById("status-bar");
const existingNotesSection = document.getElementById("section_existing-notes");
const existingNotesContainer = document.getElementById("existing-notes");
const noteStatusElement = document.getElementById("note-status");

let activeNoteId = null;

const loadAndShowExistingNotesWithThisUrl = async (url, hostUrl, apiKey) => {
  const existingNotesResponse
    = await getExistingNotesWithThisUrl(url, hostUrl, apiKey);
  const existingNotes = existingNotesResponse.payload.results;
  if (existingNotes.length > 0) {
    existingNotes.forEach((note) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.innerHTML = note.title;
      a.href = hostUrl + "/editor/" + note.id;
      a.target = "_blank";
      p.appendChild(a);
      existingNotesContainer.appendChild(p);
    });
  } else {
    existingNotesContainer.innerHTML = "None found.";
  }
  existingNotesSection.style.display = "block";
};

const init = async ({
  apiKey,
  hostUrl,
  activeTab,
}) => {
  pushNoteButton
    .addEventListener("click", async () => {
      const noteText
        = document.getElementById("textarea_note-text").value;

      const blocks = getNoteBlocks({
        url: activeTab.url,
        pageTitle: activeTab.title,
        noteText,
      });

      const result = await putNote({
        note: {
          id: activeNoteId,
          blocks,
          title: noteTitleElement.value,
        },
        hostUrl,
        apiKey,
      });

      if (result.success) {
        noteStatusElement.innerHTML = "Note added. ";
        const a = document.createElement("a");
        a.innerHTML = "Click here to open it in NENO.";
        a.href = hostUrl + "/editor/" + result.payload.id;
        a.target = "_blank";
        noteStatusElement.appendChild(a);

        activeNoteId = result.payload.id;
        pushNoteButton.innerHTML = "Update";
      } else {
        noteStatusElement.innerHTML = "Error adding note: " + result.error;
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
    statusBar.style.backgroundColor = "green";
  } else {
    serverStatusElement.innerHTML
      = "Authentication error. Please check server and API key. Error: "
      + result.error;
    statusBar.style.backgroundColor = "red";
    pushNoteButton.disabled = true;
  }

  if (forbiddenUrlStartStrings.some(
    (startString) => activeTab.url.startsWith(startString),
  )) {
    mainSection.innerHTML = "This page cannot be added as a note.";
  }

  mainSection.style.display = "block";

  try {
    await loadAndShowExistingNotesWithThisUrl(activeTab.url, hostUrl, apiKey);
  } catch (e) {
    console.log(e);
  }
};


chrome.storage.sync.get(["apiKey", "hostUrl"], ({ apiKey, hostUrl }) => {
  const hostUrlTrimmed = trimHostUrl(hostUrl);
  chrome.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      const activeTab = tabs[0];
      init({ apiKey, hostUrl: hostUrlTrimmed, activeTab });
    });
});

