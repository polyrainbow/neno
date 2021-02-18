import React, { useEffect, useRef } from "react";
import NoteListItem from "./NoteListItem.js";
import * as Editor from "./lib/editor.js";
import NoteStats from "./NoteStats.js";
import isEqual from "react-fast-compare";
import NoteControls from "./NoteControls.js";

const Note = ({
  note,
  loadNote,
  displayedLinkedNotes,
  onLinkRemoval,
  setUnsavedChanges,
  databaseProvider,
  createNewNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  pinOrUnpinNote,
  openImportLinksDialog,
  duplicateNote,
}) => {
  const previousEditorData = useRef(null);
  const editorData = note?.editorData;

  useEffect(() => {
    const parent = document.getElementById("editor");
    if (!parent) return;

    if (isEqual(editorData?.blocks, previousEditorData.current?.blocks)) {
      return;
    }

    Editor.load({
      data: editorData,
      parent,
      onChange: () => setUnsavedChanges(true),
      databaseProvider,
    })
      .then(() => {
        previousEditorData.current = editorData;
      });

  // it is important that we only perform this effect when editorData changes,
  // because otherwise it is executed more often and editor loading takes some
  // time
  }, [editorData]);

  return <section id="note">
    <NoteControls
      activeNote={note}
      createNewNote={createNewNote}
      handleNoteSaveRequest={handleNoteSaveRequest}
      removeActiveNote={removeActiveNote}
      unsavedChanges={unsavedChanges}
      pinOrUnpinNote={pinOrUnpinNote}
      openImportLinksDialog={openImportLinksDialog}
      duplicateNote={duplicateNote}
    />
    <div id="note-content">
      <div id="editor"></div>
      <hr/>
      <div id="links">
        <h2>Linked notes</h2>
        {
          displayedLinkedNotes.length === 0
            ? <p className="note-meta-paragraph"
            >There are no notes linked to this one yet.</p>
            : null
        }
        <div id="links">
          {
            displayedLinkedNotes.map((displayedLinkedNote) => <NoteListItem
              note={displayedLinkedNote}
              key={"note-link-list-item-" + displayedLinkedNote.id}
              onSelect={() => loadNote(displayedLinkedNote.id)}
              isActive={false}
              isLinked={true}
              onLinkChange={() => onLinkRemoval(displayedLinkedNote.id)}
            />)
          }
        </div>
      </div>
      {
        (!note.isUnsaved)
          ? <NoteStats note={note} databaseProvider={databaseProvider} />
          : ""
      }
    </div>
  </section>;
};

export default Note;
