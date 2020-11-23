import React from "react";
import HeaderControls from "./HeaderControls";

const Header = ({
  allNotes,
  links,
  openImportLinksDialog,
}) => {
  const numberOfUnlinkedNotes = allNotes?.filter((note) => {
    return note.numberOfLinkedNotes === 0;
  }).length;

  const percentageOfUnlinkedNotes = Math.round(
    (numberOfUnlinkedNotes / allNotes?.length) * 100 * 100,
  ) / 100;

  const showStats = (allNotes !== null) && (links !== null);

  return (
    <header>
      <div id="header-left">
        <h1 id="heading">NeNo</h1>
        <HeaderControls
          openImportLinksDialog={openImportLinksDialog}
        />
      </div>
      {
        showStats
          ? <div id="app-stats">
            <span>Nodes: </span>
            <span id="span_available-notes">
              {allNotes.length}
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
