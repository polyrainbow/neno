// this script is executed each time the popup is opened
/* global chrome */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const appContainer = document.getElementById("app");
ReactDOM.render(
  <App />,
  appContainer,
);

