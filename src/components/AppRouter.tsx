import StartView from "./StartView";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { ROOT_PATH } from "../config";
import NoteView from "./NoteView";
import ListView from "./ListView";
import FilesView from "./FilesView";
import FileView from "./FileView";
import StatsView from "./StatsView";
import SettingsView from "./SettingsView";
import NoteAccessProvider from "./NoteAccessProvider";
import ScriptView from "./ScriptView";
import { useState } from "react";
import { ActiveRoute, initRouter } from "../lib/router";
import useRunOnce from "../hooks/useRunOnce";
import ScriptsView from "./ScriptsView";

const AppRouter = () => {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);

  useRunOnce(() => {
    initRouter({
      callback:
        (activeRoute: ActiveRoute | null) => {
          /*
            We're decoding the route params here because the router library
            is encoding-agnostic.
          */
          const activeRouteDecoded = activeRoute
            ? {
              ...activeRoute,
              params: Object.fromEntries(
                Object.entries(activeRoute.params).map(([key, value]) => [
                  key,
                  decodeURIComponent(value),
                ]),
              ),
            }
            : null;
          setActiveRoute(activeRouteDecoded);
        },
      basename: ROOT_PATH,
      routes: [
        {
          id: "root",
          path: getAppPath(PathTemplate.BASE),
        },
        {
          id: "start",
          path: getAppPath(PathTemplate.START),
        },
        {
          id: "existing-note",
          path: getAppPath(
            PathTemplate.EXISTING_NOTE,
            new Map([
              ["SLUG", ":slug"],
              ["GRAPH_ID", ":graphId"],
            ]),
            undefined,
            true,
          ),
        },
        {
          id: "unselected-note",
          path: getAppPath(
            PathTemplate.UNSELECTED_NOTE,
            new Map([["GRAPH_ID", ":graphId"]]),
            undefined,
            true,
          ),
        },
        {
          id: "files",
          path: getAppPath(
            PathTemplate.FILES,
            new Map([["GRAPH_ID", ":graphId"]]),
            undefined,
            true,
          ),
        },
        {
          id: "scripts",
          path: getAppPath(
            PathTemplate.SCRIPTING,
            new Map([["GRAPH_ID", ":graphId"]]),
            undefined,
            true,
          ),
        },
        {
          id: "file",
          path: getAppPath(
            PathTemplate.FILE,
            new Map([
              ["GRAPH_ID", ":graphId"],
              ["FILE_SLUG", ":slug"],
            ]),
            undefined,
            true,
          ),
        },
        {
          id: "list",
          path: getAppPath(
            PathTemplate.LIST,
            new Map([["GRAPH_ID", ":graphId"]]),
            undefined,
            true,
          ),
        },
        {
          id: "script",
          path: getAppPath(
            PathTemplate.SCRIPT,
            new Map([
              ["GRAPH_ID", ":graphId"],
              ["SCRIPT_SLUG", ":slug"],
            ]),
            undefined,
            true,
          ),
        },
        {
          id: "stats",
          path: getAppPath(
            PathTemplate.STATS,
            new Map([["GRAPH_ID", ":graphId"]]),
            undefined,
            true,
          ),
        },
        {
          id: "settings",
          path: getAppPath(
            PathTemplate.SETTINGS,
            undefined,
            undefined,
            true,
          ),
        },
      ],
    });
  });

  if (!activeRoute) {
    return "Error: Undefined route";
  }

  const routeId = activeRoute.routeId;

  if (routeId === "root") {
    // @ts-ignore
    navigation.navigate(
      getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", "local"]]),
        undefined,
        true,
      ),
      {
        history: "replace",
      },
    );
  } else if (routeId === "start") {
    return <StartView />;
  } else if (routeId === "existing-note") {
    return <NoteAccessProvider>
      <NoteView slug={activeRoute.params.slug} />
    </NoteAccessProvider>;
  } else if (routeId === "files") {
    return <NoteAccessProvider>
      <FilesView />
    </NoteAccessProvider>;
  } else if (routeId === "file") {
    return <NoteAccessProvider>
      <FileView slug={activeRoute.params.slug} />
    </NoteAccessProvider>;
  } else if (routeId === "unselected-note") {
    // @ts-ignore
    navigation.navigate(
      getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", "local"]]),
        undefined,
        true,
      ),
      {
        history: "replace",
      },
    );
  } else if (routeId === "list") {
    return <NoteAccessProvider>
      <ListView />
    </NoteAccessProvider>;
  } else if (routeId === "scripts") {
    return <NoteAccessProvider>
      <ScriptsView />
    </NoteAccessProvider>;
  } else if (routeId === "script") {
    return <NoteAccessProvider>
      <ScriptView slug={activeRoute.params.slug} />
    </NoteAccessProvider>;
  } else if (routeId === "stats") {
    return <NoteAccessProvider>
      <StatsView />
    </NoteAccessProvider>;
  } else if (routeId === "settings") {
    return <SettingsView />;
  } else {
    return "Routing error: Unknown route id: " + routeId;
  }

};

export default AppRouter;
