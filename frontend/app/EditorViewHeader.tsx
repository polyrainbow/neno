import React from "react";
import AppTitle from "./AppTitle.js";
import AppStats from "./AppStats.js";
import {
  useHistory,
} from "react-router-dom";
import EditorViewHeaderPinnedNote from "./EditorViewHeaderPinnedNote";


const EditorViewHeader = ({
  stats,
  toggleAppMenu,
  pinnedNotes,
  note,
}) => {
  const history = useHistory();

  return (
    <header>
      <AppTitle
        toggleAppMenu={toggleAppMenu}
      />
      <div
        id="pinned-notes"
        style={{
          display: "flex",
          height: "100%",
          overflow: "auto",
          justifyContent: "flex-start",
          width: "100vw",
        }}
      >
        {
          pinnedNotes.length > 0
            ? pinnedNotes.map((pinnedNote) => {
              return <EditorViewHeaderPinnedNote
                key={`pinnedNote_${pinnedNote.id}`}
                note={pinnedNote}
                onClick={() => history.push(`/editor/${pinnedNote.id}`)}
                isActive={pinnedNote.id === note.id}
              />;
            })
            : <p
              style={{
                padding: "0px 10px",
              }}
            >Your pinned notes will appear here</p>
        }
      </div>
      <AppStats stats={stats} />
    </header>
  );
};

export default EditorViewHeader;
