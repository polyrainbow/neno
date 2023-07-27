import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotesProviderContext from "../contexts/NotesProviderContext";
import { PathTemplate } from "../enum/PathTemplate";
import { getAppPath } from "../lib/utils";
import { GraphSubpage } from "../types/GraphSubpage";
import BusyIndicator from "./BusyIndicator";
import FilesView from "./FilesView";
import FileView from "./FileView";
import GraphSettingsView from "./GraphSettingsView";
import ListView from "./ListView";
import NoteView from "./NoteView";
import StatsView from "./StatsView";
import VisualizationView from "./VisualView";
import {
  getNotesProvider,
  initializeNotesProviderWithExistingFolderHandle,
  isInitialized,
} from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";

interface GraphPageControllerProps {
  page: GraphSubpage,
}

const GraphPageController = ({
  page,
}: GraphPageControllerProps) => {
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    if (isInitialized()) {
      navigate(getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([
          ["GRAPH_ID", LOCAL_GRAPH_ID],
        ]),
      ));
    } else {
      try {
        await initializeNotesProviderWithExistingFolderHandle();
        navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
          ]),
        ));
      } catch (e) {
        navigate(getAppPath(PathTemplate.LOGIN));
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (!isInitialized()) {
    return <BusyIndicator height={80} alt="please wait" />;
  }


  const pageComponentsMap = new Map<GraphSubpage, any>([
    [GraphSubpage.FILE, FileView],
    [GraphSubpage.LIST, ListView],
    [GraphSubpage.NOTE, NoteView],
    [GraphSubpage.FILES, FilesView],
    [GraphSubpage.SETTINGS, GraphSettingsView],
    [GraphSubpage.STATS, StatsView],
    [GraphSubpage.VISUAL, VisualizationView],
  ]);

  const PageComponent = pageComponentsMap.get(page);

  return <NotesProviderContext.Provider
    value={getNotesProvider()}
  >
    <PageComponent />
  </NotesProviderContext.Provider>;
};


export default GraphPageController;
