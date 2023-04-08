import React from "react";
import { ASSETS_PATH } from "../config";
import { l } from "../lib/intl";


interface AppTitleProps {
  toggleAppMenu: () => void,
}


const AppTitle = ({ toggleAppMenu }: AppTitleProps) => {
  return <button
    onClick={toggleAppMenu}
    className="app-title clickable"
    title={l("app.menu-button.alt")}
  >
    <img
      width="40"
      height="40"
      src={ASSETS_PATH + "app-icon/logo-circle.svg"}
      alt={l("app.menu-button.alt")}
    />
  </button>;
};

export default AppTitle;
