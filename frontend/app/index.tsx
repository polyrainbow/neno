// import all modules dynamically, so that webpack writes them into a separate
// bundles

import "react-tippy/dist/tippy.css";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import LocalDatabaseProvider from "./lib/LocalDatabaseProvider.js";
import { API_URL } from "./lib/config";

const [
  React,
  ReactDOM,
  App,
] = (await Promise.all([
  import("react"),
  import("react-dom"),
  import("./App"),
])).map((module) => module.default);

const localDatabaseProvider = new LocalDatabaseProvider();
let serverDatabaseProvider = null;

// ENABLE_SERVER_DATABASE defined via webpack.DefinePlugin
// @ts-ignore
if (ENABLE_SERVER_DATABASE) {
  const ServerDatabaseProvider = (await import(
    "./lib/ServerDatabaseProvider/index.js"
  )).default;

  serverDatabaseProvider = new ServerDatabaseProvider(
    API_URL,
  );
}

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
