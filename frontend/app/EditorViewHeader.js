import React from "react";
import HeaderContainer from "./HeaderContainer";
import EditorViewHeaderControls from "./EditorViewHeaderControls";
import AppStats from "./AppStats";

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
          <h1 id="heading">NeNo</h1>
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
