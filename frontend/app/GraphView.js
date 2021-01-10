import React, { useEffect, useRef, useState } from "react";
import HeaderContainer from "./HeaderContainer.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import IconButton from "./IconButton.js";
import { initGraph } from "./lib/graph.js";
import * as Config from "./lib/config.js";
import SearchInput from "./SearchInput.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import AppTitle from "./AppTitle.js";
import GraphViewStatusIndicator from "./GraphViewStatusIndicator.js";


const GraphView = ({
  databaseProvider,
  setActiveView,
  unsavedChanges,
  setUnsavedChanges,
  setInitialNoteId,
}) => {
  const DEFAULT_STATUS = "";
  const mainElement = useRef(null);
  const graphInstance = useRef(null);
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [searchValue, setSearchValue] = useState("");

  const confirm = React.useContext(ConfirmationServiceContext);

  const beforeUnload = function(e) {
    if (unsavedChanges) {
      // Cancel the event
      e.preventDefault();
      // If you prevent default behavior in Mozilla Firefox prompt will
      // always be shown
      // Chrome requires returnValue to be set
      e.returnValue = "";
    } else {
      // the absence of a returnValue property on the event will guarantee
      // the browser unload happens
      delete e.returnValue;
    }
  };

  const saveGraphObject = async () => {
    const graphObject = graphInstance.current.getSaveData();
    try {
      await databaseProvider.saveGraph(graphObject);
      setStatus("Graph saved");
      setTimeout(() => {
        setStatus(DEFAULT_STATUS);
      }, 2000);
      setUnsavedChanges(false);
    } catch (e) {
      setStatus("Error saving graph!");
      console.error(e);
    }
  };

  const onChange = () => {
    setUnsavedChanges(true);
  };


  useEffect(() => {
    const onHighlight = (highlightDetails) => {
      setStatus(highlightDetails);
    };

    databaseProvider.getGraphObject()
      .then((graph) => {
        graphInstance.current
          = initGraph(mainElement.current, graph, onHighlight, onChange);
      });

    // warn the user when leaving
    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!graphInstance.current) return;
    graphInstance.current.setSearchValue(searchValue);
  }, [searchValue]);

  return <>
    <HeaderContainer
      leftContent={
        <>
          <AppTitle />
          <IconButton
            icon="create"
            title="Editor View"
            onClick={async () => {
              if (unsavedChanges) {
                await confirm({
                  text: Config.texts.discardGraphChangesConfirmation,
                  confirmText: "Discard changes",
                  cancelText: "Cancel",
                  encourageConfirmation: false,
                });
              }

              setActiveView("EDITOR");
            }}
          />
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
              };
              if (ids.length > 1) {
                alert("Please select only one note to open it.");
                return;
              }

              if (unsavedChanges) {
                await confirm({
                  text: Config.texts.discardGraphChangesConfirmation,
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
