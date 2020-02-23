const uploadButton = document.getElementById("button_upload");
const editor = new EditorJS({
  holderId: "editor",
  onReady: () => {
    console.log("Editor.js is ready to work!");
  },
  autofocus: true,
  placeholder: "Let`s write an awesome note!",
  hideToolbar: false,
});

uploadButton.addEventListener("click", () => {
  editor.save().then((outputData) => {
    console.log("Article data: ", outputData);
    const note = {
      editorData: outputData,
      links: [],
      time: outputData.time,
    };

    fetch("/api/note", {
      method: "PUT",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Note created");
        return response.json();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });
});
