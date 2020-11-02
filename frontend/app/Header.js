import React from "react";

const Header = ({
  notes,
  links,
}) => {
  const numberOfUnlinkedNotes = notes?.filter((note) => {
    return note.numberOfLinkedNotes === 0;
  }).length;

  const percentageOfUnlinkedNotes = Math.round(
    (numberOfUnlinkedNotes / notes?.length) * 100 * 100,
  ) / 100;

  const showStats = (notes !== null) && (links !== null);

  return (
    <header>
      <h1 id="heading">NeNo</h1>
      {
        showStats
          ? <div>
            <span>Nodes: </span>
            <span id="span_available-notes">
              {notes.length}
            </span>
            <span> 🔸 </span>
            <span>Links: </span>
            <span id="span_links">
              {links.length}
            </span>
            <span> 🔸 </span>
            <span>Unlinked notes: </span>
            <span id="span_unlinked-notes">
              {`${numberOfUnlinkedNotes} (${percentageOfUnlinkedNotes} %)`}
            </span>
          </div>
          : "Loading stats ..."
      }
    </header>
  );
};

export default Header;
