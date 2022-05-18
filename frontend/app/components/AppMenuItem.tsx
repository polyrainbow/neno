import React from "react";
import { getIconSrc } from "../lib/utils";


const AppMenuItem = ({
  icon,
  label,
  onClick,
  disabled = false,
}) => {
  return <div
    style={{
      display: "flex",
      padding: "15px 10px",
      alignItems: "center",
      cursor: disabled ? "default" : "pointer",
    }}
    onClick={disabled ? null : onClick}
    className={"app-menu-item" + (disabled ? " disabled" : "")}
  >
    <img
      src={getIconSrc(icon)}
      alt={label}
      width="24"
      height="24"
      className="svg-icon"
    />
    <p style={{
      margin: "0",
      marginLeft: "15px",
      color: disabled ? "#888888" : "inherit",
    }}>{label}</p>
  </div>;
};

export default AppMenuItem;
