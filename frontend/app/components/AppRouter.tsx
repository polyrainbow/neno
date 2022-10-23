import React from "react";
import LoginView from "./LoginView";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import GraphPageController from "./GraphPageController";
import { GraphSubpage } from "../types/GraphSubpage";
import { ROOT_PATH } from "../config";


const AppRouter = () => {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Navigate to={
          getAppPath(
            PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", ":graphId"]]),
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
        ),
        element: <Navigate to={
          getAppPath(
            PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", ":graphId"]]),
          )
        } replace />,
      },
      {
        path: getAppPath(
          PathTemplate.EXISTING_NOTE,
          new Map([
            ["NOTE_ID", ":noteId"],
            ["GRAPH_ID", ":graphId"],
          ]),
        ),
        element: <GraphPageController page={GraphSubpage.NOTE} />,
      },
      {
        path: getAppPath(
          PathTemplate.LIST,
          new Map([["GRAPH_ID", ":graphId"]]),
        ),
        element: <GraphPageController page={GraphSubpage.LIST} />,
      },
      {
        path: getAppPath(
          PathTemplate.GRAPH,
          new Map([["GRAPH_ID", ":graphId"]]),
        ),
        element: <GraphPageController page={GraphSubpage.VISUAL} />,
      },
      {
        path: getAppPath(
          PathTemplate.FILES,
          new Map([["GRAPH_ID", ":graphId"]]),
        ),
        element: <GraphPageController page={GraphSubpage.FILES} />,
      },
      {
        path: getAppPath(
          PathTemplate.FILE,
          new Map([
            ["GRAPH_ID", ":graphId"],
            ["FILE_ID", ":fileId"],
          ]),
        ),
        element: <GraphPageController page={GraphSubpage.FILE} />,
      },
      {
        path: getAppPath(
          PathTemplate.STATS,
          new Map([["GRAPH_ID", ":graphId"]]),
        ),
        element: <GraphPageController page={GraphSubpage.STATS} />,
      },
      {
        path: getAppPath(
          PathTemplate.SETTINGS,
          new Map([["GRAPH_ID", ":graphId"]]),
        ),
        element: <GraphPageController page={GraphSubpage.SETTINGS} />,
      },
    ],
    {
      basename: ROOT_PATH,
    },
  );


  return <RouterProvider router={router} />;
};

export default AppRouter;
