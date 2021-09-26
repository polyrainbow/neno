import React from "react";
import HeaderContainer from "./HeaderContainer";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator";
import IconButton from "./IconButton";
import SearchInput from "./SearchInput";

const GraphViewHeader = ({
  unsavedChanges,
  toggleAppMenu,
  searchValue,
  setSearchValue,
  saveGraphObject,
  graphInstance,
  openSelectedNoteInEditor,
}) => {
  return <HeaderContainer
    toggleAppMenu={toggleAppMenu}
    leftContent={
      <>
        <IconButton
          icon="save"
          title="Save"
          onClick={saveGraphObject}
        />
        <IconButton
          icon="open_in_browser"
          title="Open note in editor"
          onClick={openSelectedNoteInEditor}
        />
        <IconButton
          icon="zoom_out_map"
          title="Inflate graph by 10%"
          onClick={async () => {
            if (!graphInstance.current) return;
            graphInstance.current.inflateGraph(1.1);
          }}
        />
        <IconButton
          icon="title"
          title="Toggle text rendering"
          onClick={async () => {
            if (!graphInstance.current) return;
            graphInstance.current.toggleTextRendering();
          }}
        />
      </>
    }
    rightContent={
      <>
        <SearchInput
          placeholder="Search..."
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
        />
        <UnsavedChangesIndicator unsavedChanges={unsavedChanges} />
      </>
    }
  />;
};

export default GraphViewHeader;
