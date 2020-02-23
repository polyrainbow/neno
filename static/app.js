const uploadButton = document.getElementById("button_upload");
const removeButton = document.getElementById("button_remove");
const listContainer = document.getElementById("list");

const activeNoteId = null;

// eslint-disable-next-line no-undef
const editor = new EditorJS({
  holderId: "editor",
  onReady: () => {
    console.log("Editor.js is ready to work!");
  },
  autofocus: true,
  placeholder: "Let`s write an awesome note!",
  hideToolbar: false,
  tools: {
    // eslint-disable-next-line no-undef
    header: Header,
    linkTool: {
      // eslint-disable-next-line no-undef
      class: LinkTool,
      config: {
        // endpoint: 'http://localhost:8080/fetchUrl', // Your backend endpoint for url data fetching
      },
    },
  },
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
        return refreshNotesList();
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });
});


const loadNote = (noteId) => {
  return fetch("/api/note/" + noteId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((note) => {
      // load note in editor
    });
};

const createAndAppendNoteListItem = (note) => {
  const listItem = document.createElement("tr");
  const tdId = document.createElement("td");
  tdId.innerHTML = note.id;
  listItem.appendChild(tdId);
  const tdTitle = document.createElement("td");
  tdTitle.innerHTML = note.title;
  listContainer.appendChild(listItem);
  listItem.addEventListener("click", () => {
    loadNote(note.id);
  });
};

const createNotesList = (notes) => {
  listContainer.innerHTML = "";
  notes.forEach(createAndAppendNoteListItem);
};

const refreshNotesList = () => {
  return fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((notes) => {
      createNotesList(notes);
    });
};

refreshNotesList();


