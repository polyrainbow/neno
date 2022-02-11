/*
  This is the entry point of the React application.
*/

import {
  BrowserRouter as Router,
} from "react-router-dom";
import LocalDatabaseProvider from "./lib/LocalDatabaseProvider.js";
import { API_URL } from "./lib/config";

// import modules dynamically, so that webpack writes them into a separate
// bundles
const [
  React,
  ReactDOM,
  App,
] = (await Promise.all([
  import("react"),
  import("react-dom"),
  import("./components/App"),
])).map((module) => module.default);

const localDatabaseProvider = new LocalDatabaseProvider();

const ServerDatabaseProvider = (await import(
  "./lib/ServerDatabaseProvider/index"
)).default;

const serverDatabaseProvider = new ServerDatabaseProvider(
  API_URL,
);

const appContainer = document.getElementById("app");
ReactDOM.render(
  <Router>
    <App
      serverDatabaseProvider={serverDatabaseProvider}
      localDatabaseProvider={localDatabaseProvider}
    />
  </Router>,
  appContainer,
);
