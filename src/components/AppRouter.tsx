import StartView from "./StartView";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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

const AppRouter = () => {
  const router = createBrowserRouter(
    [
      {
        path: "/",
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
        path: getAppPath(PathTemplate.START),
        element: <StartView />,
      },
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
          PathTemplate.FILES,
          new Map([["GRAPH_ID", ":graphId"]]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <FilesView />
        </NoteAccessProvider>,
      },
      {
        path: getAppPath(
          PathTemplate.FILE,
          new Map([
            ["GRAPH_ID", ":graphId"],
            ["FILE_SLUG", ":slug"],
          ]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <FileView />
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

  return <RouterProvider router={router} />;
};

export default AppRouter;
