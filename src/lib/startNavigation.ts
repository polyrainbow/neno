import { LOCAL_GRAPH_ID } from "../config";
import { PathTemplate } from "../types/PathTemplate";
import { navigateTo } from "./navigation";
import { getAppPath } from "./utils";

/*
  Where the start view goes once a graph is open: back to the page that
  sent the user here, if any, else a new note.
*/
export function goToGraphFromStart(): void {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (urlSearchParams.has("redirect")) {
    navigateTo(urlSearchParams.get("redirect") ?? "/");
  } else {
    navigateTo(getAppPath(
      PathTemplate.NEW_NOTE,
      new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
    ));
  }
}
