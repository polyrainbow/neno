/*
  This is the entry point of the React application.
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const root = createRoot(document.body);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
