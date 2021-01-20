import React from "react";
import IconButton from "./IconButton.js";

const EditorViewHeaderControls = ({
  openImportLinksDialog,
  setActiveView,
  showNotesWithDuplicateURLs,
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
      id="button_import_links_as_notes"
      title="Import links as notes"
      icon="dynamic_feed"
      onClick={openImportLinksDialog}
    />
    <IconButton
      id="button_show_notes_with_duplicate_urls"
      title="Show notes with same URLs"
      icon="search"
      onClick={showNotesWithDuplicateURLs}
    />
  </section>;
};

export default EditorViewHeaderControls;
