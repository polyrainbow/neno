import React from "react";
import { ICON_PATH } from "./lib/config";


const AppMenuItem = ({
  icon,
  label,
  onClick,
}) => {
  return <div
    style={{
      display: "flex",
      padding: "15px 10px",
      alignItems: "center",
      cursor: "pointer",
    }}
    onClick={onClick}
    className="app-menu-item"
  >
    <img
      src={ICON_PATH + icon + "-24px.svg"}
      alt={label}
      width="24"
      height="24"
      className="svg-icon"
    />
    <p style={{
      margin: "0",
      marginLeft: "15px",
    }}>{label}</p>
  </div>;
};

export default AppMenuItem;
