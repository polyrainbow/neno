import React from "react";
import { l } from "../lib/intl";


const AppTitle = ({ toggleAppMenu }) => {
  return <h1
    onClick={toggleAppMenu}
    id="heading"
    style={{
      cursor: toggleAppMenu ? "pointer" : "inherit",
    }}
  >{l("app.title")}</h1>;
};

export default AppTitle;
