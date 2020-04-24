import * as Utils from "./utils.js";
import * as API from "./api.js";

const editorContainer = document.getElementById("editor");
const newButton = document.getElementById("button_new");
const uploadButton = document.getElementById("button_upload");
const removeButton = document.getElementById("button_remove");
const graphButton = document.getElementById("button_graph");
const archiveButton = document.getElementById("button_archive");
const listContainer = document.getElementById("list");
const linksContainer = document.getElementById("links");
const spanActiveNoteId = document.getElementById("span_activeNoteId");
const spanAvailableNotes = document.getElementById("span_available-notes");
const spanLinks = document.getElementById("span_links");

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
      image: {
        // eslint-disable-next-line no-undef
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "/api/image", // Your backend file uploader endpoint
            byUrl: "/api/image-by-url", // endpoint providing uploading by Url
          },
        },
      },
      list: {
        // eslint-disable-next-line no-undef
        class: List,
        inlineToolbar: true,
      },
    },
  });
};


const loadNote = async (noteId) => {
  if (typeof noteId !== "number") {
    activeNote = null;
    spanActiveNoteId.innerHTML = "--";
    loadEditor(null);
    renderLinks([]);
    removeButton.disabled = true;
    return;
  }

  const note = await API.getNote(noteId);
  renderNote(note);
};


const renderNote = (note) => {
  activeNote = note;
  spanActiveNoteId.innerHTML = activeNote.id;
  loadEditor(note.editorData);
  renderLinks(note.linkedNotes || []);
  removeButton.disabled = false;
  refreshNotesList();
};


const createAndAppendNoteListItem = (note, i, parent, showLinksIndicator) => {
  const isHub = note.numberOfLinkedNotes >= 5;

  const listItem = document.createElement("tr");
  isHub && listItem.classList.add("hub");

  if (activeNote && (note.id === activeNote.id)) {
    listItem.classList.add("active");
  }

  const tdId = document.createElement("td");
  tdId.innerHTML = i;
  tdId.className = "index";
  listItem.appendChild(tdId);
  tdId.style.textAlign = "right";

  const tdTitle = document.createElement("td");
  tdTitle.className = "title";
  tdTitle.innerHTML
    = note.title || (note.editorData && note.editorData.blocks[0].data.text);
  listItem.appendChild(tdTitle);

  if (showLinksIndicator) {
    const tdLinkedNotesIndicator = document.createElement("td");
    tdLinkedNotesIndicator.className = "linkedNotesIndicator";
    tdLinkedNotesIndicator.innerHTML = note.numberOfLinkedNotes > 0
      ? `<span title="${note.numberOfLinkedNotes} Links">
        ${note.numberOfLinkedNotes}
      </span>`
      : "<span title=\"Not linked\">🔴</span>";
    listItem.appendChild(tdLinkedNotesIndicator);
  }

  const tdTime = document.createElement("td");
  tdTime.className = "time";
  tdTime.innerHTML = Utils.yyyymmdd(new Date(note.time));
  listItem.appendChild(tdTime);

  parent.appendChild(listItem);
  listItem.addEventListener("click", () => {
    loadNote(note.id);
  });
};


const renderLinks = (links) => {
  linksContainer.innerHTML = "<h2>Links</h2>";
  const table = document.createElement("table");
  table.id = "links-table";
  linksContainer.appendChild(table);
  links.forEach((link, i) => {
    createAndAppendNoteListItem(link, i + 1, table, false);
  });
};


const createNotesList = (notes) => {
  spanAvailableNotes.innerHTML = notes.length;

  listContainer.innerHTML = "";
  const table = document.createElement("table");
  table.id = "list";
  listContainer.appendChild(table);
  notes.forEach((note, i) => {
    createAndAppendNoteListItem(note, i + 1, table, true);
  });
};


const refreshNotesList = async () => {
  const notes = await API.getNotes();
  createNotesList(notes);
};


const saveNote = async () => {
  const outputData = await editor.save();

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

    if (note.linkedNotes) {
      delete note.linkedNotes;
    }
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

  try {
    const noteFromServer = await API.putNote(note);
    renderNote(noteFromServer);
  } catch (e) {
    console.log("Saving failed: ", e);
  }
};


const removeActiveNote = async () => {
  if (activeNote === null) {
    return;
  }

  await API.deleteNote(activeNote.id);
  loadNote(null);
  refreshNotesList();
};


const archiveDatabase = async () => {
  const json = await API.getDatabaseAsJSON();
  const blob = new Blob([json], {
    type: "application/json",
  });
  const dateSuffix = Utils.yyyymmdd(new Date());
  // eslint-disable-next-line no-undef
  saveAs(blob, `neno-${dateSuffix}.db.json`);
  return json;
};


const init = async () => {
  const initialId = parseInt(
    Utils.getParameterByName("id", window.location.href),
  );
  if (initialId) {
    loadNote(initialId);
  } else {
    loadEditor(null);
  }
  newButton.addEventListener("click", () => {
    loadNote();
    refreshNotesList();
  });
  uploadButton.addEventListener("click", saveNote);
  removeButton.addEventListener("click", () => {
    if (confirm("Do you really want to remove this note?")) {
      removeActiveNote();
    }
  });

  refreshNotesList();

  graphButton.addEventListener("click", () => {
    window.location.href = "graph.html";
  });

  archiveButton.addEventListener("click", archiveDatabase);

  const graph = await API.getGraph();
  const links = graph.links;
  spanLinks.innerHTML = links.length;
};

init();


