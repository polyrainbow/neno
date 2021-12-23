import React from "react";


const AppTitle = ({ toggleAppMenu }) => {
  return <h1
    onClick={toggleAppMenu}
    id="heading"
    style={{
      cursor: toggleAppMenu ? "pointer" : "inherit",
    }}
  >NENO</h1>;
};

export default AppTitle;
