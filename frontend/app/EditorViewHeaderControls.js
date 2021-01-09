import React from "react";
import IconButton from "./IconButton.js";
import * as tokenManager from "./lib/tokenManager.js";

const EditorViewHeaderControls = ({
  openImportLinksDialog,
  openExportDatabaseDialog,
  setActiveView,
}) => {
  return <section id="header-controls">
    <IconButton
      id="button_graph"
      title="Graph view"
      icon="scatter_plot"
      onClick={() => {
        setActiveView("GRAPH");
      }}
    />
    <IconButton
      id="button_archive"
      title="Export database"
      icon="archive"
      onClick={openExportDatabaseDialog}
    />
    <IconButton
      id="button_import_links_as_notes"
      title="Import links as notes"
      icon="dynamic_feed"
      onClick={openImportLinksDialog}
    />
    <IconButton
      id="button_logout"
      title="Logout"
      icon="lock"
      onClick={() => {
        tokenManager.remove();
        setActiveView("LOGIN");
      }}
    />
  </section>;
};

export default EditorViewHeaderControls;
