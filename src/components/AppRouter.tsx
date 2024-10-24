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

const AppRouter = () => {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
console.log("Active route", activeRoute)
  useRunOnce(() => {
    initRouter({
      callback: (activeRoute: ActiveRoute | null) => setActiveRoute(activeRoute),
      basename: ROOT_PATH,
      routes: [
        {
          id: "root",
          path: "",
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
          id: "files",
          path: getAppPath(
            PathTemplate.FILES,
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
          )
        }
      ]
    });
  })

  if (activeRoute?.routeId === "root") {
    // @ts-ignore
    navigation.navigate(getAppPath(
      PathTemplate.NEW_NOTE,
      new Map([["GRAPH_ID", "local"]]),
      undefined,
      true,
    )); // TODO: replace
  } else if (activeRoute?.routeId === "start") {
    return <StartView />;
  } else if (activeRoute?.routeId === "existing-note") {
    return <NoteAccessProvider>
      <NoteView slug={activeRoute.params.get("slug")!} />
    </NoteAccessProvider>;
  } else if (activeRoute?.routeId === "files") {
    return <NoteAccessProvider>
      <FilesView />
    </NoteAccessProvider>;
  } else if (activeRoute?.routeId === "file") {
    return <NoteAccessProvider>
      <FileView />
    </NoteAccessProvider>;
  }

  /*
      {
        path: getAppPath(
          PathTemplate.UNSELECTED_NOTE,
          new Map([["GRAPH_ID", ":graphId"]]),
          undefined,
          true,
        ),
        element: <Navigate to={
          getAppPath(
            PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", "local"]]),
            undefined,
            true,
          )
        } replace />,
      },
      {
        path: getAppPath(
          PathTemplate.EXISTING_NOTE,
          new Map([
            ["SLUG", ":slug"],
            ["GRAPH_ID", ":graphId"],
          ]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <NoteView />
        </NoteAccessProvider>,
      },
      {
        path: getAppPath(
          PathTemplate.LIST,
          new Map([["GRAPH_ID", ":graphId"]]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <ListView />
        </NoteAccessProvider>,
      },
      {
        path: getAppPath(
          PathTemplate.SCRIPT,
          new Map([
            ["GRAPH_ID", ":graphId"],
            ["SCRIPT_SLUG", ":slug"],
          ]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <ScriptView />
        </NoteAccessProvider>,
      },
      {
        path: getAppPath(
          PathTemplate.STATS,
          new Map([["GRAPH_ID", ":graphId"]]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <StatsView />
        </NoteAccessProvider>,
      },
      {
        path: getAppPath(PathTemplate.SETTINGS),
        element: <SettingsView />,
      },
    ],
    {
      basename: ROOT_PATH,
    },
  );
*/
};

export default AppRouter;
