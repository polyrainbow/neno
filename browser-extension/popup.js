/* eslint-disable */
// this script is executed each time the popup is opened

const addPageButton = document.getElementById("button_addPage");

addPageButton
  .addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const tabUrl = tab.url;

    const noteTitle = document.getElementById("input_note-title").value;

    const additionalNoteText
      = document.getElementById("textarea_note-text").value;

    chrome.storage.sync.get(["apiKey", "hostUrl"], ({ apiKey, hostUrl }) => {
      const blocks = [
        {
          type: "header",
          data: {
            level: 1,
            text: noteTitle,
          },
        },
        {
          type: "linkTool",
          data: {
            link: tabUrl,
            meta: {
              title: tab.title,
              description: "",
              image: {
                url: "",
              },
            },
          },
        },
      ];

      if (additionalNoteText.trim().length > 0) {
        blocks.push({
          type: "paragraph",
          data: {
            text: additionalNoteText,
          }
        });
      }

      const requestBody = {
        note: {
          blocks,
        },
        options: {
          ignoreDuplicateTitles: true,
        },
      };

      let hostUrlTrimmed = hostUrl;

      while (hostUrlTrimmed[hostUrlTrimmed.length - 1] === "/"){
        hostUrlTrimmed = hostUrlTrimmed.substring(0, hostUrlTrimmed.length - 1);
      }

      fetch(hostUrlTrimmed + "/api/note", {
        method: "PUT",
        headers: {
          "X-Auth-Token": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success === true) {
            document.getElementById("div_controls").innerHTML = "Note added.";
          } else {
            serverStatusElement.innerHTML = "Error adding note.";
          }
        });
    });
  });

chrome.tabs.query({ active: true, currentWindow: true })
  .then((tabs) => {
    document.getElementById("input_note-title").value = tabs[0].title;
  });

const serverStatusElement = document.getElementById("server-status");

chrome.storage.sync.get(["apiKey", "hostUrl"], ({ apiKey, hostUrl }) => {
  let hostUrlTrimmed = hostUrl;

  while (hostUrlTrimmed[hostUrlTrimmed.length - 1] === "/"){
    hostUrlTrimmed = hostUrlTrimmed.substring(0, hostUrlTrimmed.length - 1);
  }

  fetch(hostUrlTrimmed + "/api/authenticated", {
    method: "GET",
    headers: {
      "X-Auth-Token": apiKey,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.success === true) {
        serverStatusElement.innerHTML
          = "Server ready. User: " + response.payload.dbId;
      } else {
        serverStatusElement.innerHTML
          = "Authentication error. Please check server and API key";
        addPageButton.disabled = true;
      }
    })
    .catch((e) => {
      serverStatusElement.innerHTML
        = "Authentication error. Please check server and API key. "
        + e.message;
      addPageButton.disabled = true;
    });
});

