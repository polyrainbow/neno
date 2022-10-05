/*
  This is the entry point of the React application.
*/

import {
  BrowserRouter as Router,
} from "react-router-dom";
import LocalDatabaseProvider from "./lib/LocalDatabaseProvider";
import { API_URL } from "./config";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// We import App dynamically to enable Webpack code splitting.
// Otherwise webpack would complain about a bundle size being too big.
const App = (await import("./components/App")).default;

const localDatabaseProvider = new LocalDatabaseProvider();

const ServerDatabaseProvider = (await import(
  "./lib/ServerDatabaseProvider/index"
)).default;

const serverDatabaseProvider = new ServerDatabaseProvider(
  API_URL,
);

const appContainer = document.getElementById("app");
const root = createRoot(appContainer);
root.render(
  <StrictMode>
    <Router>
      <App
        serverDatabaseProvider={serverDatabaseProvider}
        localDatabaseProvider={localDatabaseProvider}
      />
    </Router>
  </StrictMode>,
);
