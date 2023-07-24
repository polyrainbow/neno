import { useContext, useEffect, useRef, useState } from "react";
import GraphVisualizer from "../lib/GraphVisualizer";
import GraphViewStatusIndicator from "./GraphViewStatusIndicator";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import GraphViewHeader from "./GraphViewHeader";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import useGoToNote from "../hooks/useGoToNote";
import { l } from "../lib/intl";
import { HighlightDetails } from "../types/GraphVisualizerConfig";
import BackendGraphVisualization
  from "../lib/notes/interfaces/GraphVisualization";
import { GraphVisualizationMode } from "../types/GraphVisualization";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import useNotesProvider from "../hooks/useNotesProvider";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import { removeAccess } from "../lib/LocalDataStorage";


const VisualizationView = () => {
  const DEFAULT_STATUS: HighlightDetails = {
    active: false,
  };
  const mainElement = useRef<HTMLElement | null>(null);
  const graphVisualizerInstance = useRef<GraphVisualizer | null>(null);
  const startedLoadingGraphVis = useRef<boolean>(false);
  const [status, setStatus] = useState<HighlightDetails>(DEFAULT_STATUS);
  const [mode, setMode] = useState<GraphVisualizationMode>(
    GraphVisualizationMode.DEFAULT,
  );
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const databaseProvider = useNotesProvider();
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const goToNote = useGoToNote();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const focusNoteSlug = searchParams.get("focusNote") || "";

  const saveGraphObject = async () => {
    if (!graphVisualizerInstance.current) {
      throw new Error("Error saving graph. Graph instance undefined.");
    }
    const graphVisualization = graphVisualizerInstance.current.getSaveData();
    try {
      await databaseProvider?.setGraphVisualization(
        graphVisualization,
      );
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
    if (!graphVisualizerInstance.current) return;
    const ids = graphVisualizerInstance.current.getSelectedNodeIds();
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

  const handleInvalidCredentialsError = async () => {
    await removeAccess();
    navigate(getAppPath(PathTemplate.LOGIN));
  };


  const initializeGraphInstance = async () => {
    if (!databaseProvider) return;

    // Effects that should only run once can use a ref
    // https://github.com/reactwg/react-18/discussions/18
    if (startedLoadingGraphVis.current) return;
    startedLoadingGraphVis.current = true;

    try {
      const graphObject: BackendGraphVisualization
        = await databaseProvider.getGraphVisualization();

      // for performance reasons, we disable labels above a certain
      // amount of nodes
      const initialMode = graphObject.nodes.length <= 500
        ? GraphVisualizationMode.DEFAULT
        : GraphVisualizationMode.NO_LABELS;

      setMode(initialMode);

      graphVisualizerInstance.current
        = new GraphVisualizer({
          parent: mainElement.current as HTMLElement,
          graphObject,
          onHighlight: (highlightDetails) => {
            setStatus(highlightDetails);
          },
          onChange,
          initialFocusNoteSlug: focusNoteSlug,
          openNote: openNoteInEditor,
          initialMode,
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
    if (!graphVisualizerInstance.current) return;
    graphVisualizerInstance.current.setSearchValue(searchValue);
  }, [searchValue]);

  return <>
    <GraphViewHeader
      unsavedChanges={unsavedChanges}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      openSelectedNoteInEditor={openSelectedNoteInEditor}
      saveGraphObject={saveGraphObject}
      graphVisualizerInstance={graphVisualizerInstance}
      mode={mode}
      setMode={(mode: GraphVisualizationMode) => {
        graphVisualizerInstance.current?.setMode(mode);
        setMode(mode);
      }}
    />
    <main id="main" className="main-graph" ref={mainElement}></main>
    <GraphViewStatusIndicator status={status} />
  </>;
};

export default VisualizationView;
