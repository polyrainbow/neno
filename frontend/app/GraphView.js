import React, { useEffect, useRef, useState } from "react";
import HeaderContainer from "./HeaderContainer.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import IconButton from "./IconButton.js";
import { initGraph } from "./lib/graph.js";
import * as Config from "./lib/config.js";
import SearchInput from "./SearchInput.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import GraphViewStatusIndicator from "./GraphViewStatusIndicator.js";


const GraphView = ({
  databaseProvider,
  setActiveView,
  unsavedChanges,
  setUnsavedChanges,
  setInitialNoteId,
  toggleAppMenu,
}) => {
  const DEFAULT_STATUS = "";
  const mainElement = useRef(null);
  const graphInstance = useRef(null);
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [searchValue, setSearchValue] = useState("");

  const confirm = React.useContext(ConfirmationServiceContext);

  const saveGraphObject = async () => {
    const graphObject = graphInstance.current.getSaveData();
    try {
      await databaseProvider.saveGraph(graphObject);
      setUnsavedChanges(false);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  const onChange = () => {
    setUnsavedChanges(true);
  };


  const handleKeydown = (e) => {
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      && e.key === "s"
    ) {
      saveGraphObject();
      e.preventDefault();
    }
  };


  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);


  useEffect(() => {
    const onHighlight = (highlightDetails) => {
      setStatus(highlightDetails);
    };

    databaseProvider.getGraphObject()
      .then((graph) => {
        graphInstance.current
          = initGraph(mainElement.current, graph, onHighlight, onChange);
      });
  }, []);

  useEffect(() => {
    if (!graphInstance.current) return;
    graphInstance.current.setSearchValue(searchValue);
  }, [searchValue]);

  return <>
    <HeaderContainer
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
            onClick={async () => {
              if (!graphInstance.current) return;
              const ids = graphInstance.current.getSelectedNodeIds();
              if (ids.length === 0) {
                alert("Please select one note before opening it.");
                return;
              }
              if (ids.length > 1) {
                alert("Please select only one note to open it.");
                return;
              }

              if (unsavedChanges) {
                await confirm({
                  text: Config.texts.discardChangesConfirmation,
                  confirmText: "Discard changes",
                  cancelText: "Cancel",
                  encourageConfirmation: false,
                });
              }

              setInitialNoteId(ids[0]);
              setActiveView("EDITOR");
            }}
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
    />
    <main id="main" className="main-graph" ref={mainElement}></main>
    <GraphViewStatusIndicator status={status} />
  </>;
};

export default GraphView;
