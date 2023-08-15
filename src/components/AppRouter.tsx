import LoginView from "./LoginView";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { ROOT_PATH } from "../config";
import NoteView from "./NoteView";
import ListView from "./ListView";
import VisualizationView from "./VisualView";
import FilesView from "./FilesView";
import FileView from "./FileView";
import StatsView from "./StatsView";
import SettingsView from "./SettingsView";
import NoteAccessProvider from "./NoteAccessProvider";

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
        path: getAppPath(PathTemplate.LOGIN),
        element: <LoginView />,
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
          PathTemplate.VISUAL,
          new Map([["GRAPH_ID", ":graphId"]]),
          undefined,
          true,
        ),
        element: <NoteAccessProvider>
          <VisualizationView />
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
