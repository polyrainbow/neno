import React from "react";
import AppTitle from "./AppTitle.js";

const HeaderContainer = ({
  leftContent,
  rightContent,
  toggleAppMenu,
}) => {
  return (
    <header>
      <div id="header-left">
        <AppTitle
          toggleAppMenu={toggleAppMenu}
        />
        {leftContent}
      </div>
      <div id="header-right">
        {rightContent}
      </div>
    </header>
  );
};

export default HeaderContainer;
