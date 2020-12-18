import React from "react";
import * as API from "./lib/api.js";
import IconButton from "./IconButton.js";
import * as tokenManager from "./lib/tokenManager.js";

const EditorViewHeaderControls = ({
  openImportLinksDialog,
  setActiveView,
}) => {
  return <section id="header-controls">
    <IconButton
      id="button_graph"
      title="Graph view"
      icon="account_tree"
      onClick={() => {
        setActiveView("GRAPH");
      }}
    />
    <IconButton
      id="button_archive"
      title="Download database"
      icon="save_alt"
      onClick={API.downloadDatabase}
    />
    <IconButton
      id="button_archive-with-uploads"
      title="Download database including uploads"
      icon="archive"
      onClick={API.downloadDatabaseWithUploads}
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
