import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatabaseProviderContext from "../contexts/DatabaseProviderContext";
import GraphIdContext from "../contexts/GraphIdContext";
import { DatabaseMode } from "../enum/DatabaseMode";
import { PathTemplate } from "../enum/PathTemplate";
import useDatabaseControl from "../hooks/useDatabaseControl";
import { getAppPath } from "../lib/utils";
import { GraphSubpage } from "../types/GraphSubpage";
import BusyIndicator from "./BusyIndicator";
import FilesView from "./FilesView";
import FileView from "./FileView";
import GraphSettingsView from "./GraphSettingsView";
import NoteView from "./NoteView";
import StatsView from "./StatsView";
import VisualizationView from "./VisualView";

interface GraphPageControllerProps {
  page: GraphSubpage,
}

const GraphPageController = ({
  page,
}: GraphPageControllerProps) => {
  const databaseControl = useDatabaseControl();
  const navigate = useNavigate();
  const { graphId } = useParams();

  const checkAuthentication = async () => {
    try {
      await databaseControl.serverDatabaseProvider?.isAuthenticated?.();
      databaseControl.setDatabaseMode(DatabaseMode.SERVER);
      const graphIds = databaseControl.serverDatabaseProvider?.getGraphIds();
      if (!graphIds) {
        throw new Error("No graphs available from database provider");
      }

      if (
        typeof graphId !== "string"
        || !graphIds?.includes(
          graphId,
        )
      ) {
        navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          new Map([
            ["GRAPH_ID", graphIds[0]],
          ]),
        ));
      }
    } catch (e) {
      databaseControl.setDatabaseMode(DatabaseMode.NONE);
      navigate(getAppPath(PathTemplate.LOGIN));
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (
    (!databaseControl.databaseProvider) || (!graphId)
  ) {
    return <BusyIndicator height={20} alt="please wait" />;
  }


  const pageComponentsMap = new Map<GraphSubpage, any>([
    [GraphSubpage.FILE, FileView],
    [GraphSubpage.NOTE, NoteView],
    [GraphSubpage.FILES, FilesView],
    [GraphSubpage.SETTINGS, GraphSettingsView],
    [GraphSubpage.STATS, StatsView],
    [GraphSubpage.VISUAL, VisualizationView],
  ]);

  const PageComponent = pageComponentsMap.get(page);


  return <DatabaseProviderContext.Provider
    value={databaseControl.databaseProvider}
  >
    <GraphIdContext.Provider value={graphId}>
      <PageComponent />
    </GraphIdContext.Provider>
  </DatabaseProviderContext.Provider>;
};


export default GraphPageController;
