import React from "react";
import HeaderContainer from "./HeaderContainer.js";
import EditorViewHeaderControls from "./EditorViewHeaderControls.js";
import AppStats from "./AppStats.js";

const EditorViewHeader = ({
  stats,
  openImportLinksDialog,
  openExportDatabaseDialog,
  showNotesWithDuplicateURLs,
  toggleAppMenu,
}) => {
  return (
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
      openExportDatabaseDialog={openExportDatabaseDialog}
      leftContent={
        <>
          <EditorViewHeaderControls
            openImportLinksDialog={openImportLinksDialog}
            showNotesWithDuplicateURLs={showNotesWithDuplicateURLs}
            toggleAppMenu={toggleAppMenu}
          />
        </>
      }
      rightContent={
        <AppStats stats={stats} />
      }
    />
  );
};

export default EditorViewHeader;
