import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const appContainer = document.getElementById("app") as HTMLDivElement;
const root = createRoot(appContainer);
root.render(
  <App />,
);
