import React from "react";
import HeaderContainer from "./HeaderContainer";
import HeaderControls from "./HeaderControls";

const Header = ({
  allNotes,
  links,
  openImportLinksDialog,
  setActiveView,
}) => {
  const numberOfUnlinkedNotes = allNotes?.filter((note) => {
    return note.numberOfLinkedNotes === 0;
  }).length;

  const percentageOfUnlinkedNotes = Math.round(
    (numberOfUnlinkedNotes / allNotes?.length) * 100 * 100,
  ) / 100;

  const showStats = (allNotes !== null) && (links !== null);

  return (
    <HeaderContainer
      leftContent={
        <>
          <h1 id="heading">NeNo</h1>
          <HeaderControls
            setActiveView={setActiveView}
            openImportLinksDialog={openImportLinksDialog}
          />
        </>
      }
      rightContent={
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
    />
  );
};

export default Header;
