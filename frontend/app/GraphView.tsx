import React, { useEffect, useRef, useState } from "react";
import Graph from "./lib/Graph.js";
import GraphViewStatusIndicator from "./GraphViewStatusIndicator";
import {
  useLocation,
} from "react-router-dom";
import GraphViewHeader from "./GraphViewHeader";
import useConfirmDiscardingUnsavedChangesDialog
  from "./hooks/useConfirmDiscardingUnsavedChangesDialog";
import useGoToNote from "./hooks/useGoToNote";

const GraphView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  handleInvalidCredentialsError,
}) => {
  const DEFAULT_STATUS:string = "";
  const mainElement = useRef<HTMLElement | null>(null);
  const graphInstance = useRef<Graph | null>(null);
  const [status, setStatus] = useState<string>(DEFAULT_STATUS);
  const [searchValue, setSearchValue] = useState<string>("");

  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const goToNote = useGoToNote();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const focusNoteId = parseInt(searchParams.get("focusNote") || "");

  const saveGraphObject = async () => {
    if (!graphInstance.current) {
      throw new Error("Error saving graph. Graph instance undefined.");
    }
    const graphObject = graphInstance.current.getSaveData();
    try {
      await databaseProvider.saveGraph(graphObject);
      setUnsavedChanges(false);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };


  const openNoteInEditor = async (noteId) => {
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    goToNote(noteId);
  };


  const openSelectedNoteInEditor = async () => {
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

    const noteIdToBeOpened = ids[0];
    await openNoteInEditor(noteIdToBeOpened);
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


  const initializeGraphInstance = async () => {
    if (!databaseProvider) return;

    const onHighlight = (highlightDetails) => {
      setStatus(highlightDetails);
    };

    try {
      const graphObject = await databaseProvider.getGraph();

      graphInstance.current
        = new Graph({
          parent: mainElement.current,
          graphObject,
          onHighlight,
          onChange,
          initialFocusNoteId: focusNoteId,
          openNote: openNoteInEditor,
        });
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw new Error(e);
      }
    }
  };

  useEffect(() => {
    initializeGraphInstance();
  }, [databaseProvider]);

  useEffect(() => {
    if (!graphInstance.current) return;
    graphInstance.current.setSearchValue(searchValue);
  }, [searchValue]);

  return <>
    <GraphViewHeader
      unsavedChanges={unsavedChanges}
      toggleAppMenu={toggleAppMenu}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      openSelectedNoteInEditor={openSelectedNoteInEditor}
      saveGraphObject={saveGraphObject}
      graphInstance={graphInstance}
    />
    <main id="main" className="main-graph" ref={mainElement}></main>
    <GraphViewStatusIndicator status={status} />
  </>;
};

export default GraphView;