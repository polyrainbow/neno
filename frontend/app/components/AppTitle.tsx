import React from "react";
import { l } from "../lib/intl";


const AppTitle = ({ toggleAppMenu }) => {
  return <img
    width="40"
    height="40"
    onClick={toggleAppMenu}
    id="heading"
    src="/assets/app-icon/logo-circle.svg"
    alt={l("app.menu-button.alt")}
    style={{
      cursor: toggleAppMenu ? "pointer" : "inherit",
    }}
  />;
};

export default AppTitle;
