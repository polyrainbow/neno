import React, { useEffect, useRef, useState } from "react";
import GraphVisualization from "../lib/GraphVisualization.js";
import GraphViewStatusIndicator from "./GraphViewStatusIndicator";
import {
  useLocation,
} from "react-router-dom";
import GraphViewHeader from "./GraphViewHeader";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import useGoToNote from "../hooks/useGoToNote";
import { l } from "../lib/intl.js";

const GraphView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  handleInvalidCredentialsError,
}) => {
  const DEFAULT_STATUS = "";
  const mainElement = useRef<HTMLElement | null>(null);
  const graphVisualizationInstance = useRef<GraphVisualization | null>(null);
  const startedLoadingGraphVis = useRef<boolean>(false);
  const [status, setStatus] = useState<string>(DEFAULT_STATUS);
  const [searchValue, setSearchValue] = useState<string>("");

  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const goToNote = useGoToNote();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const focusNoteId = parseInt(searchParams.get("focusNote") || "");

  const saveGraphObject = async () => {
    if (!graphVisualizationInstance.current) {
      throw new Error("Error saving graph. Graph instance undefined.");
    }
    const graphVisualization = graphVisualizationInstance.current.getSaveData();
    try {
      await databaseProvider.saveGraphVisualization(graphVisualization);
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
    if (!graphVisualizationInstance.current) return;
    const ids = graphVisualizationInstance.current.getSelectedNodeIds();
    if (ids.length === 0) {
      alert(l("graph.select-note-before-opening"));
      return;
    }
    if (ids.length > 1) {
      alert(l("graph.select-only-one-note"));
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

    // Effects that should only run once can use a ref
    // https://github.com/reactwg/react-18/discussions/18
    if (startedLoadingGraphVis.current) return;
    startedLoadingGraphVis.current = true;

    try {
      const graphObject = await databaseProvider.getGraphVisualization();

      graphVisualizationInstance.current
        = new GraphVisualization({
          parent: mainElement.current,
          graphObject,
          onHighlight: (highlightDetails) => {
            setStatus(highlightDetails);
          },
          onChange,
          initialFocusNoteId: focusNoteId,
          openNote: openNoteInEditor,
        });
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw e;
      }
    }
  };

  useEffect(() => {
    initializeGraphInstance();
  }, [databaseProvider]);

  useEffect(() => {
    if (!graphVisualizationInstance.current) return;
    graphVisualizationInstance.current.setSearchValue(searchValue);
  }, [searchValue]);

  return <>
    <GraphViewHeader
      unsavedChanges={unsavedChanges}
      toggleAppMenu={toggleAppMenu}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      openSelectedNoteInEditor={openSelectedNoteInEditor}
      saveGraphObject={saveGraphObject}
      graphVisualizationInstance={graphVisualizationInstance}
    />
    <main id="main" className="main-graph" ref={mainElement}></main>
    <GraphViewStatusIndicator status={status} />
  </>;
};

export default GraphView;
