import React from "react";

const Header = ({
  notes,
  links,
  activeNote,
}) => {
  return (
    <header>
      <h1 id="heading">NeNo</h1>
      <div>
        <span>Nodes: </span>
        <span id="span_available-notes">
          {notes?.length || "--"}
        </span>
        <span> 🔸 </span>
        <span>Links: </span>
        <span id="span_links">
          {links?.length || "--"}
        </span>
        <span> 🔸 </span>
        <span>Active: </span>
        <span id="span_activeNoteId">
          {activeNote?.id || "--"}
        </span>
      </div>
    </header>
  );
};

export default Header;
