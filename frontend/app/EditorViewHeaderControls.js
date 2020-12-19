import React from "react";
import IconButton from "./IconButton.js";
import * as tokenManager from "./lib/tokenManager.js";

const EditorViewHeaderControls = ({
  databaseProvider,
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
      title="Save database (without images and files)"
      icon="save_alt"
      onClick={async () => {
        // create a new handle

        const opts = {
          types: [{
            description: "JSON database file",
            accept: { "application/json": [".json"] },
          }],
        };
        const newHandle = await window.showSaveFilePicker(opts);
        // create a FileSystemWritableFileStream to write to
        const writableStream = await newHandle.createWritable();

        const readableStream
          = await databaseProvider.getReadableDatabaseStream(false);
        await readableStream.pipeTo(writableStream);
      }}
    />
    <IconButton
      id="button_archive-with-uploads"
      title="Save database (including images and files)"
      icon="archive"
      onClick={async () => {
        // create a new handle

        const opts = {
          types: [{
            description: "ZIP database file",
            accept: { "application/zip": [".zip"] },
          }],
        };
        const newHandle = await window.showSaveFilePicker(opts);
        // create a FileSystemWritableFileStream to write to
        const writableStream = await newHandle.createWritable();

        const readableStream
          = await databaseProvider.getReadableDatabaseStream(true);
        await readableStream.pipeTo(writableStream);
      }}
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
