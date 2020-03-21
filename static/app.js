const editorContainer = document.getElementById("editor");
const newButton = document.getElementById("button_new");
const uploadButton = document.getElementById("button_upload");
const removeButton = document.getElementById("button_remove");
const graphButton = document.getElementById("button_graph");
const archiveButton = document.getElementById("button_archive");
const listContainer = document.getElementById("list");
const spanActiveNoteId = document.getElementById("span_activeNoteId");
const spanAvailableNotes = document.getElementById("span_available-notes");
const spanLinked = document.getElementById("span_linked");

const DEFAULT_NOTE_TITLE = "Note title";

const placeholderNoteObject = {
  "time": 1582493003964,
  "blocks": [
    {
      "type": "header",
      "data": {
        "text": DEFAULT_NOTE_TITLE,
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
let activeNote = null;

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
    activeNote = null;
    spanActiveNoteId.innerHTML = "--";
    spanLinked.innerHTML = "--";
    loadEditor(null);
    removeButton.disabled = true;
    return;
  }

  return fetch("/api/note/" + noteId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(renderNote);
};


const renderNote = (note) => {
  activeNote = note;
  spanActiveNoteId.innerHTML = activeNote.id;
  if (Array.isArray(note.linkedNotes)) {
    spanLinked.innerHTML = note.linkedNotes.length;
  } else {
    spanLinked.innerHTML = "--";
  }
  loadEditor(note.editorData);
  removeButton.disabled = false;
  refreshNotesList();
};


const createAndAppendNoteListItem = (note, i, parent) => {
  const listItem = document.createElement("tr");

  if (activeNote && (note.id === activeNote.id)) {
    listItem.classList.add("active");
  }

  const tdId = document.createElement("td");
  tdId.innerHTML = i;
  listItem.appendChild(tdId);
  tdId.style.textAlign = "right";

  const tdTitle = document.createElement("td");
  tdTitle.innerHTML = note.title;
  listItem.appendChild(tdTitle);

  const tdLinkedNotesIndicator = document.createElement("td");
  tdLinkedNotesIndicator.innerHTML = note.numberOfLinkedNotes > 0
    ? "<span title=\"Linked\">🔵</span>"
    : "<span title=\"Not linked\">🔴</span>";
  listItem.appendChild(tdLinkedNotesIndicator);

  const tdTime = document.createElement("td");
  tdTime.innerHTML = new Date(note.time).toLocaleString();
  listItem.appendChild(tdTime);

  parent.appendChild(listItem);
  listItem.addEventListener("click", () => {
    loadNote(note.id);
  });
};


const createNotesList = (notes) => {
  spanAvailableNotes.innerHTML = notes.length;

  listContainer.innerHTML = "";
  const table = document.createElement("table");
  table.id = "list";
  listContainer.appendChild(table);
  notes.forEach((note, i) => createAndAppendNoteListItem(note, i + 1, table));
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
    let note = {
      editorData: outputData,
      time: outputData.time,
    };

    if (
      typeof activeNote === "object"
      && activeNote !== null
    ) {
      note = {
        ...activeNote,
        ...note,
      };
    }

    // if the note has no title yet, take the title of the link metadata
    const firstLinkBlock = note.editorData.blocks.find(
      (block) => block.type === "linkTool",
    );

    if (
      note.editorData.blocks[0].data.text === DEFAULT_NOTE_TITLE
      && firstLinkBlock
      && typeof firstLinkBlock.data.meta.title === "string"
      && firstLinkBlock.data.meta.title.length > 0
    ) {
      note.editorData.blocks[0].data.text = firstLinkBlock.data.meta.title;
    }

    fetch("/api/note", {
      method: "PUT",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => renderNote(response.note))
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });
};


const removeActiveNote = () => {
  if (activeNote === null) {
    return;
  }

  fetch("/api/note/" + activeNote.id, {
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


const archiveDatabase = () => {
  fetch("/api/database/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      const blob = new Blob([text], {
        type: "application/json",
      });
      // eslint-disable-next-line no-undef
      saveAs(blob, `archive-${new Date()}.json`);
      return text;
    })
    .catch((error) => {
      console.log("Archive download failed: ", error);
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

  graphButton.addEventListener("click", () => {
    window.location.href = "graph.html";
  });

  archiveButton.addEventListener("click", archiveDatabase);
};

init();


