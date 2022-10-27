import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatabaseProviderContext from "../contexts/DatabaseProviderContext";
import GraphIdContext from "../contexts/GraphIdContext";
import { DatabaseMode } from "../enum/DatabaseMode";
import { PathTemplate } from "../enum/PathTemplate";
import useDatabaseControl from "../hooks/useDatabaseControl";
import { getAppPath } from "../lib/utils";
import DatabaseProvider from "../types/DatabaseProvider";
import { GraphSubpage } from "../types/GraphSubpage";
import BusyIndicator from "./BusyIndicator";
import FilesView from "./FilesView";
import FileView from "./FileView";
import GraphSettingsView from "./GraphSettingsView";
import ListView from "./ListView";
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
  // This state is only here to trigger a component re-render when necessary
  // eslint-disable-next-line
  const [_, rerender] = useState<any>();


  const checkAuthentication = async () => {
    const databaseModeRef = databaseControl.databaseModeRef;

    let databaseProvider: DatabaseProvider | null
      = databaseModeRef.current === DatabaseMode.LOCAL
        ? databaseControl.localDatabaseProvider
        : (
          databaseModeRef.current === DatabaseMode.SERVER
            ? databaseControl.serverDatabaseProvider
            : null
        );

    if (!databaseProvider) {
      try {
        await databaseControl.serverDatabaseProvider.isAuthenticated();
        databaseControl.databaseModeRef.current = DatabaseMode.SERVER;
        databaseProvider = databaseControl.serverDatabaseProvider;
        rerender(1);
      } catch (e) {
        databaseModeRef.current = DatabaseMode.NONE;
        navigate(getAppPath(PathTemplate.LOGIN));
        return;
      }
    }

    const graphIds = databaseProvider.getGraphIds();
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
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const databaseProvider: DatabaseProvider | null
    = databaseControl.databaseModeRef.current === DatabaseMode.LOCAL
      ? databaseControl.localDatabaseProvider
      : (
        databaseControl.databaseModeRef.current === DatabaseMode.SERVER
          ? databaseControl.serverDatabaseProvider
          : null
      );

  if (
    (!databaseProvider) || (!graphId)
  ) {
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

  return <DatabaseProviderContext.Provider
    value={databaseProvider}
  >
    <GraphIdContext.Provider value={graphId}>
      <PageComponent />
    </GraphIdContext.Provider>
  </DatabaseProviderContext.Provider>;
};


export default GraphPageController;