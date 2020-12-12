import React, { useEffect, useRef, useState } from "react";
import HeaderContainer from "./HeaderContainer.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import IconButton from "./IconButton.js";
import { initGraph } from "./lib/graph.js";
import * as API from "./lib/api.js";
import * as Config from "./lib/config.js";
import SearchInput from "./SearchInput.js";


const GraphView = ({
  setActiveView,
  unsavedChanges,
  setUnsavedChanges,
  setInitialNoteId,
}) => {
  const DEFAULT_STATUS = "Hold shift to draw links";
  const mainElement = useRef(null);
  const graphInstance = useRef(null);
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [searchValue, setSearchValue] = useState("");

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
      await API.saveGraph(graphObject);
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
    const onHighlight = (isOn, value) => {
      if (isOn) {
        setStatus(value);
      } else {
        setStatus(DEFAULT_STATUS);
      }
    };

    API.getGraphObject()
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
    graphInstance.current.updateGraph(searchValue);
  }, [searchValue]);

  return <>
    <HeaderContainer
      leftContent={
        <>
          <h1 id="heading">NeNo</h1>

          <IconButton
            icon="create"
            title="Editor View"
            onClick={() => {
              if (
                (!unsavedChanges)
                || confirm(Config.texts.discardGraphChangesConfirmation)
              ) {
                setActiveView("EDITOR");
              }
            }}
          />
          <IconButton
            icon="save"
            title="Save"
            onClick={saveGraphObject}
          />
          <IconButton
            icon="open_in_browser"
            title="Show note"
            onClick={() => {
              if (!graphInstance.current) return;
              const id = graphInstance.current.getSelectedNodeId();
              if (typeof id !== "number") return;

              if (
                (!unsavedChanges)
                || confirm(Config.texts.discardGraphChangesConfirmation)
              ) {
                setInitialNoteId(id);
                setActiveView("EDITOR");
              }
            }}
          />
          <p id="status">{status}</p>
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
  </>;
};

export default GraphView;
