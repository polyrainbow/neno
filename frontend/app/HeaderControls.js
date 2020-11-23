import React from "react";
import * as API from "./lib/api.js";


const HeaderControls = () => {
  return <section id="header-controls">
    <button
      className="icon-button"
      id="button_graph" alt="Graph" title="Graph"
      onClick={() => {
        window.location.href = "graph.html";
      }}
    >
      <img src="/assets/icons/account_tree-24px.svg" alt="Graph" />
    </button>
    <button
      className="icon-button"
      id="button_archive"
      alt="Download database"
      title="Download database"
      onClick={API.archiveDatabase}
    >
      <img src="/assets/icons/save_alt-24px.svg" alt="Archive database" />
    </button>
    <a
      href="/api/database-with-uploads"
      className="icon-button"
      id="button_archive-with-uploads"
      alt="Download database including uploads"
      title="Download database including uploads"
      download
    >
      <img
        src="/assets/icons/archive-24px.svg"
        alt="Archive database including uploads"
      />
    </a>
  </section>;
};

export default HeaderControls;
