import React from "react";
import HeaderContainer from "./HeaderContainer";
import EditorViewHeaderControls from "./EditorViewHeaderControls";
import AppStats from "./AppStats";
import AppTitle from "./AppTitle.js";

const EditorViewHeader = ({
  databaseProvider,
  stats,
  openImportLinksDialog,
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
            databaseProvider={databaseProvider}
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
