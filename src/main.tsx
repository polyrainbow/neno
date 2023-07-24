/*
  This is the entry point of the React application.
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const appContainer = document.getElementById("app");
const root = createRoot(appContainer as HTMLDivElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);


// TODO: set noImplicitAny in tsconfig to true
