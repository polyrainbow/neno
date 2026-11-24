/*
  This is the entry point of the React application.
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import {
  hasRequiredWebFeatures,
  isCapacitorAndroid,
} from "./lib/android/detect";
import { init as initIntl, l } from "./lib/intl";

/*
  Inside the Android app, `window.neno` is not injected by a preload but
  built here, before anything asks for it. The import is dynamic so the
  desktop and browser bundles never load the Android code.
*/
const startAndroid = async (): Promise<boolean> => {
  if (!hasRequiredWebFeatures()) {
    // Better a sentence that says what to do than a broken page.
    await initIntl();
    document.body.textContent = l("android.webview-outdated");
    document.body.style.padding = "2rem 1rem";
    return false;
  }
  const { createAndroidBridge } = await import("./lib/android/AndroidBridge");
  window.neno = createAndroidBridge();
  return true;
};

if (!isCapacitorAndroid() || await startAndroid()) {
  const root = createRoot(document.body);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
