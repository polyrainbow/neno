import React from "react";
import HeaderContainer from "./HeaderContainer";
import HeaderControls from "./HeaderControls";

const Header = ({
  stats,
  openImportLinksDialog,
  setActiveView,
}) => {
  const showStats = stats !== null;

  let percentageOfUnlinkedNotes = null;
  if (showStats) {
    percentageOfUnlinkedNotes = Math.round(
      (stats.numberOfUnlinkedNotes / stats.numberOfAllNotes) * 100 * 100,
    ) / 100;
  }

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
              {stats.numberOfAllNotes}
            </span>
            <span> 🔸 </span>
            <span>Links: </span>
            <span id="span_links">
              {stats.numberOfLinks}
            </span>
            <span> 🔸 </span>
            <span>Unlinked notes: </span>
            <span id="span_unlinked-notes">
              {
                `${stats.numberOfUnlinkedNotes} `
                + `(${percentageOfUnlinkedNotes} %)`
              }
            </span>
          </div>
          : "Loading stats ..."
      }
    />
  );
};

export default Header;
