import React, { useEffect, useRef } from "react";
import NoteListItem from "./NoteListItem";
import * as Editor from "./lib/editor";
import NoteStats from "./NoteStats";
import isEqual from "react-fast-compare";
import NoteControls from "./NoteControls";
import useGoToNote from "./hooks/useGoToNote";

const Note = ({
  note,
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
  openInGraphView,
}) => {
  const previousBlocks = useRef(null);
  const blocks = note?.blocks;
  const goToNote = useGoToNote();

  useEffect(() => {
    const parent = document.getElementById("editor");
    if (!parent) return;

    if (isEqual(blocks, previousBlocks.current)) {
      return;
    }

    Editor.load({
      data: blocks,
      parent,
      onChange: () => setUnsavedChanges(true),
      databaseProvider,
    })
      .then(() => {
        previousBlocks.current = blocks;
      });

  // it is important that we only perform this effect when the block content
  // changes, because otherwise it is executed more often and editor loading
  // takes some time
  }, [blocks]);

  return <>
    <NoteControls
      activeNote={note}
      createNewNote={createNewNote}
      handleNoteSaveRequest={handleNoteSaveRequest}
      removeActiveNote={removeActiveNote}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      pinOrUnpinNote={pinOrUnpinNote}
      openImportLinksDialog={openImportLinksDialog}
      duplicateNote={duplicateNote}
      openInGraphView={openInGraphView}
    />
    <section id="note">
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
                onSelect={() => goToNote(displayedLinkedNote.id)}
                isActive={false}
                isLinked={true}
                onLinkChange={() => onLinkRemoval(displayedLinkedNote.id)}
                isLinkable={true}
              />)
            }
          </div>
        </div>
        {
          (!note.isUnsaved)
            ? <NoteStats note={note} databaseProvider={databaseProvider} />
            : null
        }
      </div>
    </section>
  </>;
};

export default Note;
