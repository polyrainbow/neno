import React from "react";
import HeaderContainer from "./HeaderContainer.js";
import EditorViewHeaderControls from "./EditorViewHeaderControls.js";
import AppStats from "./AppStats.js";
import AppTitle from "./AppTitle.js";

const EditorViewHeader = ({
  stats,
  openImportLinksDialog,
  openExportDatabaseDialog,
  setActiveView,
}) => {
  return (
    <HeaderContainer
      leftContent={
        <>
          <AppTitle />
          <EditorViewHeaderControls
            setActiveView={setActiveView}
            openImportLinksDialog={openImportLinksDialog}
            openExportDatabaseDialog={openExportDatabaseDialog}
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
