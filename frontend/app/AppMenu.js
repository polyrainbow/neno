import React from "react";
import AppMenuItem from "./AppMenuItem.js";
import * as tokenManager from "./lib/tokenManager.js";


const AppMenu = ({
  setActiveView,
  openExportDatabaseDialog,
  onClose,
}) => {
  return <div
    id="app-menu"
    style={{
      "position": "fixed",
      "top": "50px",
      "left": "0px",
    }}
    onClick={
      onClose
    }
  >
    <AppMenuItem
      label="Export database"
      icon="archive"
      onClick={openExportDatabaseDialog}
    />
    {
      tokenManager.get()
        ? <AppMenuItem
          id="button_logout"
          label="Logout"
          icon="lock"
          onClick={() => {
            tokenManager.remove();
            setActiveView("LOGIN");
          }}
        />
        : ""
    }
  </div>;
};

export default AppMenu;
