import React, { useEffect } from "react";
import NoteListItem from "./NoteListItem.js";
import * as Editor from "./lib/editor.js";
import NoteStats from "./NoteStats.js";

const Note = ({
  note,
  loadNote,
}) => {
  useEffect(() => {
    const data = note?.editorData;
    const parent = document.getElementById("editor");
    if (!parent) return;
    Editor.load(data, parent);
  }, [note]);


  return <section id="note">
    <div id="editor"></div>
    <div id="links">
      <h2>Links</h2>
      <table id="links-table">
        <tbody>
          {
            note?.linkedNotes?.map((link, i) => <NoteListItem
              note={link}
              index={i + 1}
              showLinksIndicator={false}
              key={"note-link-list-item-" + link.id}
              onClick={() => loadNote(link.id)}
              isActive={false}
            />)
          }
        </tbody>
      </table>
    </div>
    {
      note !== null
        ? <NoteStats note={note} />
        : ""
    }
  </section>;
};

export default Note;
