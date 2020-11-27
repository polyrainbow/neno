import React, { useEffect, useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header.js";
import NoteControls from "./NoteControls.js";
import NotesList from "./NotesList.js";
import NoteListControls from "./NoteListControls.js";
import Note from "./Note.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import * as API from "./lib/api.js";
import * as Editor from "./lib/editor.js";
import ImportLinksDialog from "./ImportLinksDialog.js";

const getNewNoteObject = () => {
  const note = {
    changes: [],
    creationTime: null,
    editorData: null,
    id: null,
    isUnsaved: true,
    linkedNotes: null,
    updateTime: null,
    x: null,
    y: null,
  };

  Object.seal(note);
  return note;
};

const App = () => {
  const currentRequestId = useRef(null);
  const [displayedNotes, setDisplayedNotes] = useState([]);
  const [noteListScrollTop, setNoteListScrollTop] = useState(0);
  const [allNotes, setAllNotes] = useState(null);
  const [isBusy, setIsBusy] = useState(true);
  const [links, setLinks] = useState(null);
  const [sortBy, setSortBy] = useState("CREATION_DATE_ASCENDING");
  const [activeNote, setActiveNote] = useState(getNewNoteObject());
  const [searchValue, setSearchValue] = useState("");
  const [isImportLinksDialogOpen, setIsImportLinksDialogOpen]
    = useState(false);

  const displayedLinkedNotes = [
    ...(!activeNote.isUnsaved)
      ? activeNote.linkedNotes.filter((note) => {
        const isRemoved = activeNote.changes.some((change) => {
          return (
            change.type === "LINKED_NOTE_DELETED"
            && change.noteId === note.id
          );
        });
        return !isRemoved;
      })
      : [],
    ...activeNote.changes
      .filter((change) => {
        return change.type === "LINKED_NOTE_ADDED";
      })
      .map((change) => {
        return allNotes.find((note) => {
          return note.id === change.noteId;
        });
      }),
  ];

  const displayedNotesSorted = displayedNotes.sort((a, b) => {
    if (sortBy === "CREATION_DATE_ASCENDING") {
      return a.creationTime - b.creationTime;
    }

    if (sortBy === "CREATION_DATE_DESCENDING") {
      return b.creationTime - a.creationTime;
    }

    if (sortBy === "UPDATE_DATE_ASCENDING") {
      return a.updateTime - b.updateTime;
    }

    if (sortBy === "UPDATE_DATE_DESCENDING") {
      return b.updateTime - a.updateTime;
    }

    if (sortBy === "NUMBER_OF_LINKS_ASCENDING") {
      return a.numberOfLinkedNotes - b.numberOfLinkedNotes;
    }

    if (sortBy === "NUMBER_OF_LINKS_DESCENDING") {
      return b.numberOfLinkedNotes - a.numberOfLinkedNotes;
    }

    return a.updateTime - b.updateTime;
  });

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
  };

  const handleLinkAddition = async (note) => {
    if (activeNote.changes.some((change) => {
      return (
        change.type === "LINKED_NOTE_ADDED"
        && change.noteId === note.id
      );
    })) {
      return;
    }

    setActiveNote({
      ...activeNote,
      editorData: await Editor.save(),
      changes: [
        ...activeNote.changes.filter((change) => {
          return !(
            change.type === "LINKED_NOTE_DELETED"
            && change.noteId === note.id
          );
        }),
        {
          type: "LINKED_NOTE_ADDED",
          noteId: note.id,
        },
      ],
    });
  };


  const handleLinkRemoval = async (linkedNoteId) => {
    if (activeNote.changes.some((change) => {
      return (
        change.type === "LINKED_NOTE_DELETED"
        && change.noteId === linkedNoteId
      );
    })) {
      return;
    }

    setActiveNote({
      ...activeNote,
      editorData: await Editor.save(),
      changes: [
        ...activeNote.changes.filter((change) => {
          return !(
            change.type === "LINKED_NOTE_ADDED"
            && change.noteId === linkedNoteId
          );
        }),
        {
          type: "LINKED_NOTE_DELETED",
          noteId: linkedNoteId,
        },
      ],
    });
  };


  const loadNote = async (noteId) => {
    if (typeof noteId !== "number") {
      setActiveNote(getNewNoteObject());
      return;
    }

    const noteFromServer = await API.getNote(noteId);
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
  };

  const refreshNotesList = useCallback(
    async () => {
      setDisplayedNotes([]);

      // if searchValue is given but below MINIMUM_SEARCH_QUERY_LENGTH,
      // we don't do anything and leave the note list empty
      if (
        searchValue.length > 0
        && searchValue.length < Config.MINIMUM_SEARCH_QUERY_LENGTH
      ) {
        return;
      }

      setIsBusy(true);

      const options = {};

      if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.query = searchValue;
        options.caseSensitive = false;
      }

      const requestId = uuidv4();
      currentRequestId.current = requestId;
      const notes = await API.getNotes(options);

      // ... some time later - check if this is the current request
      if (currentRequestId.current === requestId) {
        setDisplayedNotes(notes);
        if (searchValue.length === 0) {
          setAllNotes(notes);
        }

        setIsBusy(false);
      }
    },
    [searchValue],
  );


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await API.deleteNote(activeNote.id);
    loadNote(null);
    refreshNotesList();
  };

  const createNewNote = () => {
    loadNote();
    refreshNotesList();
  };


  const saveNote = async (options) => {
    const noteToTransmit = {
      editorData: await Editor.save(),
      changes: activeNote.changes,
      id: activeNote.isUnsaved ? null : activeNote.id,
    };

    // if the note has no title yet, take the title of the link metadata
    const firstLinkBlock = noteToTransmit.editorData.blocks.find(
      (block) => block.type === "linkTool",
    );

    if (
      (noteToTransmit.editorData?.blocks?.[0]?.data?.text
        === Config.DEFAULT_NOTE_TITLE)
      && firstLinkBlock
      && typeof firstLinkBlock.data.meta.title === "string"
      && firstLinkBlock.data.meta.title.length > 0
    ) {
      noteToTransmit.editorData.blocks[0].data.text
        = firstLinkBlock.data.meta.title;
    }

    const noteFromServer = await API.putNote(noteToTransmit, options);
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
    refreshNotesList();
  };


  useEffect(() => {
    const initialId = parseInt(
      Utils.getParameterByName("id", window.location.href),
    );
    if (initialId) {
      loadNote(initialId);
    }
  }, []);


  useEffect(() => {
    refreshNotesList();

    API.getGraph()
      .then((graph) => setLinks(graph.links))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error("Could not get graph via API.");
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }, [refreshNotesList]);

  let notesListStatus = "DEFAULT";

  if (searchValue.length > 0 && searchValue.length < 3) {
    notesListStatus = "SEARCH_VALUE_TOO_SHORT";
  }

  if (isBusy) {
    notesListStatus = "BUSY";
  }

  const importLinksAsNotes = async (links) => {
    await API.importLinksAsNotes(links);
    refreshNotesList();
  };


  return <>
    {
      isImportLinksDialogOpen
        ? <ImportLinksDialog
          importLinksAsNotes={(links) => {
            importLinksAsNotes(links);
            setIsImportLinksDialogOpen(false);
          }}
          onCancel={() => setIsImportLinksDialogOpen(false)}
        />
        : null
    }
    <Header
      allNotes={allNotes}
      links={links}
      openImportLinksDialog={() => setIsImportLinksDialogOpen(true)}
    />
    <main>
      <div id="left-view">
        <NoteListControls
          onChange={handleSearchInputChange}
          value={searchValue}
          displayedNotes={displayedNotesSorted}
          allNotes={allNotes}
          sortBy={sortBy}
          setSortBy={(sortBy) => {
            setNoteListScrollTop(0);
            setSortBy(sortBy);
          }}
        />
        <NotesList
          notes={displayedNotes}
          loadNote={loadNote}
          activeNote={activeNote}
          displayedLinkedNotes={displayedLinkedNotes}
          onLinkAddition={handleLinkAddition}
          status={notesListStatus}
          searchValue
          scrollTop={noteListScrollTop}
          setScrollTop={setNoteListScrollTop}
          sortBy={sortBy}
        />
      </div>
      <div id="right-view">
        <NoteControls
          activeNote={activeNote}
          createNewNote={createNewNote}
          saveNote={saveNote}
          removeActiveNote={removeActiveNote}
        />
        <Note
          note={activeNote}
          loadNote={loadNote}
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
        />
      </div>

    </main>
  </>;
};

export default App;
