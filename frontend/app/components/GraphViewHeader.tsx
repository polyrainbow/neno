import React from "react";
import HeaderContainer from "./HeaderContainer";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator";
import IconButton from "./IconButton";
import SearchInput from "./SearchInput";
import { l } from "../lib/intl";

const GraphViewHeader = ({
  unsavedChanges,
  toggleAppMenu,
  searchValue,
  setSearchValue,
  saveGraphObject,
  graphVisualizationInstance,
  openSelectedNoteInEditor,
}) => {
  return <HeaderContainer
    toggleAppMenu={toggleAppMenu}
    leftContent={
      <>
        <IconButton
          icon="save"
          title={l("graph.save")}
          onClick={saveGraphObject}
        />
        <IconButton
          icon="open_in_browser"
          title={l("graph.open-in-editor")}
          onClick={openSelectedNoteInEditor}
        />
        <IconButton
          icon="zoom_out_map"
          title={l("graph.inflate-10%")}
          onClick={async () => {
            if (!graphVisualizationInstance.current) return;
            graphVisualizationInstance.current.inflateGraph(1.1);
          }}
        />
        <IconButton
          icon="title"
          title={l("graph.toggle-text-rendering")}
          onClick={async () => {
            if (!graphVisualizationInstance.current) return;
            graphVisualizationInstance.current.toggleTextRendering();
          }}
        />
      </>
    }
    rightContent={
      <>
        <SearchInput
          placeholder={l("graph.search-placeholder")}
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          inputStyle={{
            marginRight: "10px",
          }}
        />
        <UnsavedChangesIndicator unsavedChanges={unsavedChanges} />
      </>
    }
  />;
};

export default GraphViewHeader;
