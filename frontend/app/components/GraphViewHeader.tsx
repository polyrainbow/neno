import React from "react";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator";
import IconButton from "./IconButton";
import SearchInput from "./SearchInput";
import { l } from "../lib/intl";
import { GraphVisualizationMode } from "../types/GraphVisualization";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import FlexContainer from "./FlexContainer";
import GraphVisualizer from "../lib/GraphVisualizer";

interface GraphViewHeaderProps {
  unsavedChanges: boolean,
  searchValue: string,
  setSearchValue,
  saveGraphObject,
  graphVisualizerInstance: React.MutableRefObject<GraphVisualizer | null>,
  openSelectedNoteInEditor,
  mode,
  setMode,
}

const GraphViewHeader = ({
  unsavedChanges,
  searchValue,
  setSearchValue,
  saveGraphObject,
  graphVisualizerInstance,
  openSelectedNoteInEditor,
  mode,
  setMode,
}: GraphViewHeaderProps) => {
  return <HeaderContainerLeftRight
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
            if (!graphVisualizerInstance.current) return;
            graphVisualizerInstance.current.inflateGraph(1.1);
          }}
        />
        <IconButton
          icon="zoom_out_map"
          title={l("graph.inflate-selection-10%")}
          onClick={async () => {
            if (!graphVisualizerInstance.current) return;
            try {
              graphVisualizerInstance.current.inflateSelection(1.1);
            } catch (e) {}
          }}
        />
        <FlexContainer centerAlignedItems>
          <select
            id="graphModeSelect"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option
              value={GraphVisualizationMode.DEFAULT}
            >{l("graph.mode.default")}</option>
            <option
              value={GraphVisualizationMode.NO_LABELS}
            >{l("graph.mode.no-labels")}</option>
            <option
              value={GraphVisualizationMode.HUBS_ONLY}
            >{l("graph.mode.hubs-only")}</option>
            <option
              value={GraphVisualizationMode.VORONOY}
            >{l("graph.mode.voronoy")}</option>
            <option
              value={GraphVisualizationMode.VORONOY_HUBS}
            >{l("graph.mode.voronoy-hubs")}</option>
          </select>
        </FlexContainer>
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
