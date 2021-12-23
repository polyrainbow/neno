import React from "react";
import AppTitle from "./AppTitle";

interface HeaderContainerProps {
  leftContent?: JSX.Element,
  rightContent?: JSX.Element,
  toggleAppMenu?: any,
}

const HeaderContainer = ({
  leftContent,
  rightContent,
  toggleAppMenu,
}:HeaderContainerProps) => {
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
