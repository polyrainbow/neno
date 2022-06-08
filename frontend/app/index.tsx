/*
  This is the entry point of the React application.
*/

import {
  BrowserRouter as Router,
} from "react-router-dom";
import LocalDatabaseProvider from "./lib/LocalDatabaseProvider.js";
import { API_URL } from "./config";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

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
