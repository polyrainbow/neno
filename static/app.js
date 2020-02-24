const editorContainer = document.getElementById("editor");
const newButton = document.getElementById("button_new");
const uploadButton = document.getElementById("button_upload");
const removeButton = document.getElementById("button_remove");
const listContainer = document.getElementById("list");
const spanActiveNoteId = document.getElementById("span_activeNoteId");

const placeholderNoteObject = {
  "time": 1582493003964,
  "blocks": [
    {
      "type": "header",
      "data": {
        "text": "Note title",
        "level": 1,
      },
    },
    {
      "type": "paragraph",
      "data": {
        "text": "Note text",
      },
    },
    {
      "type": "linkTool",
      "data": {
        "link": "",
        "meta": {},
      },
    },
  ],
  "version": "2.16.1",
};

let editor;
let activeNoteId = null;

const loadEditor = (data) => {
  editor && editor.destroy();

  // eslint-disable-next-line no-undef
  editor = new EditorJS({
    holder: editorContainer,
    data: data || placeholderNoteObject,
    autofocus: true,
    placeholder: "Let's write an awesome note!",
    hideToolbar: false,
    tools: {
      header: {
        // eslint-disable-next-line no-undef
        class: Header,
        placeholder: "Note title",
      },
      linkTool: {
        // eslint-disable-next-line no-undef
        class: LinkTool,
        config: {
          endpoint: "/api/link-data",
        },
      },
    },
  });
};


const loadNote = (noteId) => {
  if (typeof noteId !== "number") {
    activeNoteId = null;
    spanActiveNoteId.innerHTML = activeNoteId;
    loadEditor(null);
    return;
  }

  return fetch("/api/note/" + noteId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((note) => {
      activeNoteId = note.id;
      spanActiveNoteId.innerHTML = activeNoteId;
      loadEditor(note.editorData);
      refreshNotesList();
    });
};


const createAndAppendNoteListItem = (note) => {
  const listItem = document.createElement("tr");

  if (note.id === activeNoteId) {
    listItem.classList.add("active");
  }

  const tdId = document.createElement("td");
  tdId.innerHTML = note.id;
  listItem.appendChild(tdId);

  const tdTitle = document.createElement("td");
  tdTitle.innerHTML = note.title;
  listItem.appendChild(tdTitle);

  const tdTime = document.createElement("td");
  tdTime.innerHTML = new Date(note.time);
  listItem.appendChild(tdTime);

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


const saveNote = () => {
  editor.save().then((outputData) => {
    const note = {
      editorData: outputData,
      time: outputData.time,
    };

    if (typeof activeNoteId === "number") {
      note.id = activeNoteId;
    }

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
        activeNoteId = responseJSON.noteId;
        spanActiveNoteId.innerHTML = activeNoteId;
        return refreshNotesList();
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });
};


const removeActiveNote = () => {
  if (typeof activeNoteId !== "number") {
    return;
  }

  fetch("/api/note/" + activeNoteId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("Note deleted");
      return response.json();
    })
    .then((responseJSON) => {
      console.log(responseJSON);
      loadNote(null);
      return refreshNotesList();
    })
    .catch((error) => {
      console.log("Saving failed: ", error);
    });
};


const init = () => {
  loadEditor(null);
  newButton.addEventListener("click", () => {
    loadNote();
    refreshNotesList();
  });
  uploadButton.addEventListener("click", saveNote);
  removeButton.addEventListener("click", removeActiveNote);
  refreshNotesList();
};

init();


